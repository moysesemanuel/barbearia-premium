import { NextRequest, NextResponse } from "next/server";
import {
  createAppointment,
  ensureBookingSeedData,
  getBarberByName,
  getServiceByName,
} from "@/lib/booking";
import { prisma } from "@/lib/prisma";

type CreateAppointmentBody = {
  serviceName?: string;
  barberName?: string;
  date?: string;
  time?: string;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
};

export async function GET(request: NextRequest) {
  try {
    await ensureBookingSeedData();

    const date = request.nextUrl.searchParams.get("date");
    const where = date
      ? {
          startsAt: {
            gte: new Date(`${date}T00:00:00`),
            lte: new Date(`${date}T23:59:59`),
          },
        }
      : {};

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        barber: true,
        service: true,
      },
      orderBy: {
        startsAt: "asc",
      },
    });

    return NextResponse.json({
      appointments: appointments.map((appointment) => ({
        id: appointment.id,
        customerName: appointment.customerName,
        customerPhone: appointment.customerPhone,
        notes: appointment.notes,
        status: appointment.status,
        startsAt: appointment.startsAt,
        endsAt: appointment.endsAt,
        barberName: appointment.barber.name,
        serviceName: appointment.service.name,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nao foi possivel carregar os agendamentos.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureBookingSeedData();

    const body = (await request.json()) as CreateAppointmentBody;
    const requiredFields = [
      body.serviceName,
      body.barberName,
      body.date,
      body.time,
      body.customerName,
      body.customerPhone,
    ];

    if (requiredFields.some((value) => !value?.trim())) {
      return NextResponse.json(
        { error: "Preencha os campos obrigatorios para concluir o agendamento." },
        { status: 400 },
      );
    }

    const [service, barber] = await Promise.all([
      getServiceByName(body.serviceName!.trim()),
      getBarberByName(body.barberName!.trim()),
    ]);

    if (!service || !barber) {
      return NextResponse.json(
        { error: "Servico ou profissional nao encontrado na agenda." },
        { status: 400 },
      );
    }

    const appointment = await createAppointment({
      service,
      barber,
      date: body.date!.trim(),
      time: body.time!.trim(),
      customerName: body.customerName!.trim(),
      customerPhone: body.customerPhone!.trim(),
      notes: body.notes,
    });

    return NextResponse.json({
      id: appointment.id,
      message: "Agendamento confirmado com sucesso.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nao foi possivel concluir o agendamento.",
      },
      { status: 400 },
    );
  }
}
