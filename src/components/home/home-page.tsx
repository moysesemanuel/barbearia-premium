"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import styles from "@/app/page.module.css";
import {
  getClientSiteConfigSnapshot,
  getBusinessAddress,
  getDisplayStats,
  getServerSiteConfigSnapshot,
  SITE_CONFIG_STORAGE_KEY,
  SITE_CONFIG_UPDATED_EVENT,
  type SiteConfig,
} from "@/components/shared/site-config";
import { DaBiTechSignature } from "@/components/shared/dabi-tech-signature";
import { buildWhatsappUrl } from "@/components/shared/whatsapp";
import { SectionHeading } from "./section-heading";

function formatSelectedDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date(`${date}T12:00:00`));
}

type NextAvailableSlot = {
  date: string;
  time: string;
  barberName: string;
} | null;

type AvailabilityResponse = {
  slots: string[];
  closedReason: string | null;
  nextAvailable: NextAvailableSlot;
};

type BookingSuccessState = {
  customerName: string;
  serviceName: string;
  barberName: string;
  date: string;
  time: string;
};

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatNextAvailable(slot: NextAvailableSlot) {
  if (!slot) {
    return "Agenda temporariamente indisponivel";
  }

  const today = getTodayDateString();
  const tomorrowDate = new Date(`${today}T12:00:00`);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().slice(0, 10);
  const label =
    slot.date === today
      ? "Hoje"
      : slot.date === tomorrow
        ? "Amanha"
        : new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          }).format(new Date(`${slot.date}T12:00:00`));

  return `${label} as ${slot.time} com ${slot.barberName}`;
}

function buildCustomerWhatsappMessage(params: BookingSuccessState) {
  return [
    `Olá, meu nome é ${params.customerName}.`,
    "",
    "Acabei de fazer um agendamento pelo site da Prime Cut Studio.",
    `${params.serviceName} com ${params.barberName}`,
    `${formatSelectedDate(params.date)} às ${params.time}`,
    "",
    "Se precisarem confirmar algum detalhe, fico à disposição.",
  ].join("\n");
}

function Header({ config }: { config: SiteConfig }) {
  return (
    <header className={styles.header}>
      <div>
        <span className={styles.brand}>{config.businessName}</span>
        <p className={styles.brandTag}>{config.businessTag}</p>
      </div>
      <nav className={styles.nav}>
        <a href="#studio">O studio</a>
        <a href="#clube">Clube</a>
        <a href="#servicos">Serviços</a>
        <a href="#agendamento">Agendamento</a>
        <a href="#contato">Contato</a>
      </nav>
      <a className={styles.headerCta} href="#contato">
        Agende
      </a>
    </header>
  );
}

function HeroSection({
  config,
  nextAvailable,
}: {
  config: SiteConfig;
  nextAvailable: NextAvailableSlot;
}) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <p className={styles.kicker}>Seu estilo tratado com padrão de studio</p>
        <h1>{config.headline}</h1>
        <p className={styles.description}>{config.heroDescription}</p>
        <div className={styles.ctas}>
          <a className={styles.primary} href="#agendamento">
            Agendar agora
          </a>
          <a className={styles.secondary} href="#servicos">
            Ver serviços
          </a>
        </div>
      </div>

      <div className={styles.heroPanel}>
        <span className={styles.panelTag}>Atendimento com hora marcada</span>
        <h2>Agende em poucos passos. Atendimento no horário, sem espera.</h2>
        <p>
          Escolha o serviço, selecione o profissional e confirme seu horário em
          poucos passos.
        </p>
        <div className={styles.panelHighlights}>
          <div>
            <strong>Próximo horário livre:</strong>
            <span>{formatNextAvailable(nextAvailable)}</span>
          </div>
          <div>
            <strong>Confirmação imediata:</strong>
            <span>Resumo do agendamento e lembrete no WhatsApp</span>
          </div>
        </div>
        <div className={styles.panelInfo}>
          <strong>Seg a Sex: 9h às 20h</strong>
          <strong>Sáb: 8h às 18h</strong>
        </div>
      </div>
    </section>
  );
}

function ShowcaseSection({ config }: { config: SiteConfig }) {
  const variantClassName = {
    tall: styles.showcaseTall,
    wide: styles.showcaseWide,
    square: styles.showcaseSquare,
  } as const;

  return (
    <section className={styles.heroGallery}>
      {config.showcaseImages.map((item) => (
        <article
          className={`${styles.showcaseCard} ${variantClassName[item.variant]}`}
          key={item.src}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.showcaseImage} src={item.src} alt={item.alt} />
          <div className={styles.showcaseOverlay}>
            <span>{item.label}</span>
            <strong>{item.title}</strong>
          </div>
        </article>
      ))}
    </section>
  );
}

function AboutSection({ config }: { config: SiteConfig }) {
  const businessAddress = useMemo(() => getBusinessAddress(config), [config]);
  const businessLocationLabel = useMemo(
    () =>
      [config.city, config.neighborhood].filter(Boolean).join(" - ") ||
      "Localização da barbearia",
    [config.city, config.neighborhood],
  );

  return (
    <section className={styles.aboutSection} id="studio">
      <SectionHeading
        eyebrow="Nosso negócio é o seu estilo"
        title="Mais que agenda cheia: padrão de atendimento e resultado."
      />
      <div className={styles.aboutGrid}>
        <article className={styles.aboutCardLarge}>
          <p>
            Atendimento para quem busca presença, autoestima e consistência no
            visual.
          </p>
        </article>
        <article className={styles.aboutCardSmall}>
          <span>Localização</span>
          <strong>{businessLocationLabel}</strong>
          <p>{businessAddress || "Fácil acesso, atendimento com reserva e operação enxuta."}</p>
        </article>
      </div>
    </section>
  );
}

function PlansSection({ config }: { config: SiteConfig }) {
  return (
    <section className={styles.section} id="clube">
      <SectionHeading
        eyebrow="Clube Prime"
        title="Planos pensados para fidelização e recorrência."
      />
      <div className={styles.planGrid}>
        {config.plans.map((plan) => (
          <article className={styles.planCard} key={plan.name}>
            <h3>{plan.name}</h3>
            <p>{plan.summary}</p>
            <strong>{plan.price}</strong>
            <a href="#contato">Saiba mais</a>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServicesSection({ config }: { config: SiteConfig }) {
  return (
    <section className={styles.section} id="servicos">
      <SectionHeading
        eyebrow="Serviços"
        title="Catálogo claro, preços objetivos e atendimento com tempo definido."
      />
      <div className={styles.serviceGrid}>
        {config.services.map((service) => (
          <article className={styles.serviceCard} key={service.name}>
            <div className={styles.serviceVisual}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.serviceImage}
                src={service.image}
                alt={`Imagem do serviço ${service.name}`}
              />
            </div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <div className={styles.serviceMeta}>
              <strong>{service.price}</strong>
              <span>{service.membership}</span>
              <span>{service.duration}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BookingSection({
  config,
  onNextAvailableChange,
}: {
  config: SiteConfig;
  onNextAvailableChange: (slot: NextAvailableSlot) => void;
}) {
  const [selectedService, setSelectedService] = useState<string>(
    config.services[2]?.name ?? config.services[0]?.name ?? "",
  );
  const [selectedBarber, setSelectedBarber] = useState<string>(
    config.barbers[0]?.name ?? "",
  );
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [availabilityMessage, setAvailabilityMessage] = useState<string>("");
  const [bookingFeedback, setBookingFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [bookingSuccessState, setBookingSuccessState] = useState<BookingSuccessState | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [refreshToken, setRefreshToken] = useState<number>(0);

  useEffect(() => {
    const fallbackService = config.services[2]?.name ?? config.services[0]?.name ?? "";
    setSelectedService((current) =>
      config.services.some((service) => service.name === current) ? current : fallbackService,
    );
  }, [config.services]);

  useEffect(() => {
    const fallbackBarber = config.barbers[0]?.name ?? "";
    setSelectedBarber((current) =>
      config.barbers.some((barber) => barber.name === current) ? current : fallbackBarber,
    );
  }, [config.barbers]);

  const selectedServiceData = useMemo(
    () =>
      config.services.find((service) => service.name === selectedService) ??
      config.services[0],
    [config.services, selectedService],
  );

  const formattedDate = useMemo(() => formatSelectedDate(selectedDate), [selectedDate]);
  const businessAddress = useMemo(() => getBusinessAddress(config), [config]);

  useEffect(() => {
    let active = true;

    async function loadAvailability() {
      setLoadingAvailability(true);
      setAvailabilityMessage("");

      try {
        const params = new URLSearchParams({
          service: selectedService,
          barber: selectedBarber,
          date: selectedDate,
        });
        const response = await fetch(`/api/availability?${params.toString()}`, {
          cache: "no-store",
        });
        const payload = (await response.json()) as AvailabilityResponse & { error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? "Nao foi possivel consultar os horarios.");
        }

        if (!active) {
          return;
        }

        onNextAvailableChange(payload.nextAvailable);
        setAvailableTimes(payload.slots);
        setAvailabilityMessage(
          payload.closedReason ??
            (payload.slots.length === 0 ? "Nenhum horario livre para esta selecao." : ""),
        );
        setSelectedTime((currentTime) =>
          payload.slots.includes(currentTime) ? currentTime : payload.slots[0] ?? "",
        );
      } catch (error) {
        if (!active) {
          return;
        }

        onNextAvailableChange(null);
        setAvailableTimes([]);
        setSelectedTime("");
        setAvailabilityMessage(
          error instanceof Error
            ? error.message
            : "Nao foi possivel consultar os horarios.",
        );
      } finally {
        if (active) {
          setLoadingAvailability(false);
        }
      }
    }

    void loadAvailability();

    return () => {
      active = false;
    };
  }, [onNextAvailableChange, refreshToken, selectedBarber, selectedDate, selectedService]);

  async function handleSubmit() {
    setBookingFeedback(null);

    if (!selectedTime) {
      setBookingFeedback({
        type: "error",
        message: "Selecione um horario disponivel antes de confirmar.",
      });
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setBookingFeedback({
        type: "error",
        message: "Preencha nome completo e WhatsApp para concluir o agendamento.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceName: selectedService,
          barberName: selectedBarber,
          date: selectedDate,
          time: selectedTime,
          customerName,
          customerPhone,
          notes,
        }),
      });
      const payload = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Nao foi possivel concluir o agendamento.");
      }

      setBookingFeedback({
        type: "success",
        message: payload.message ?? "Agendamento confirmado com sucesso.",
      });
      setBookingSuccessState({
        customerName: customerName.trim(),
        serviceName: selectedService,
        barberName: selectedBarber,
        date: selectedDate,
        time: selectedTime,
      });
      setNotes("");
      setRefreshToken((current) => current + 1);
    } catch (error) {
      setBookingSuccessState(null);
      setBookingFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Nao foi possivel concluir o agendamento.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.section} id="agendamento">
      <SectionHeading
        eyebrow="Agendamento online"
        title="Agende seu horário em poucos passos."
      />
      <div className={styles.bookingLayout}>
        <form className={styles.bookingForm}>
          <label className={styles.field}>
            <span>Serviço</span>
            <select value={selectedService} onChange={(event) => setSelectedService(event.target.value)}>
              {config.services.map((service) => (
                <option key={service.name} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Profissional</span>
            <select value={selectedBarber} onChange={(event) => setSelectedBarber(event.target.value)}>
              {config.barbers.map((barber) => (
                <option key={barber.name} value={barber.name}>
                  {barber.name}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Data</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Nome completo</span>
            <input
              type="text"
              placeholder="Seu nome"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>WhatsApp</span>
            <input
              type="tel"
              placeholder="(11) 99999-9999"
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Observações</span>
            <textarea
              rows={4}
              placeholder="Ex.: preferência por acabamento na navalha"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>
        </form>

        <aside className={styles.bookingPanel}>
          <div className={styles.bookingIntro}>
            <span className={styles.panelTag}>Horários disponíveis</span>
            <h3>{formattedDate}</h3>
            <p>Selecione o horário ideal e confirme em minutos.</p>
          </div>

          <div className={styles.timeGrid}>
            {loadingAvailability ? (
              <p className={styles.bookingStatus}>Carregando horarios...</p>
            ) : availableTimes.length > 0 ? (
              availableTimes.map((time) => (
                <button
                  className={`${styles.timeSlot} ${
                    selectedTime === time ? styles.timeSlotActive : ""
                  }`}
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))
            ) : (
              <p className={`${styles.bookingStatus} ${styles.bookingStatusError}`}>
                {availabilityMessage}
              </p>
            )}
          </div>

          <div className={styles.bookingSummary}>
            <strong>Resumo da reserva</strong>
            <p>
              {selectedServiceData.name} com {selectedBarber}
            </p>
            <p>
              {formattedDate} {selectedTime ? `as ${selectedTime}` : ""}
            </p>
            <p>Duração estimada: {selectedServiceData.duration}</p>
            <p>{businessAddress}</p>
          </div>

          {bookingFeedback ? (
            <div
              className={`${styles.bookingStatus} ${
                bookingFeedback.type === "success"
                  ? styles.bookingStatusSuccess
                  : styles.bookingStatusError
              }`}
            >
              <p>{bookingFeedback.message}</p>
              {bookingFeedback.type === "success" && bookingSuccessState ? (
                <a
                  className={styles.secondary}
                  href={buildWhatsappUrl(
                    config.whatsapp,
                    buildCustomerWhatsappMessage(bookingSuccessState),
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enviar no WhatsApp
                </a>
              ) : null}
            </div>
          ) : null}

          <button
            className={styles.primary}
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isSubmitting || loadingAvailability || !selectedTime}
          >
            {isSubmitting ? "Confirmando..." : "Confirmar agendamento"}
          </button>
        </aside>
      </div>
    </section>
  );
}

function StatsSection({ config }: { config: SiteConfig }) {
  const displayStats = getDisplayStats(config);

  return (
    <section className={styles.statsSection}>
      <div className={styles.statsGrid}>
        {displayStats.map((item) => (
          <article className={styles.statCard} key={item.label}>
            <strong>{item.value}</strong>
            <p>{item.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TestimonialsSection({ config }: { config: SiteConfig }) {
  return (
    <section className={styles.section}>
      <SectionHeading
        eyebrow="Depoimentos"
        title="Atendimento consistente que gera confiança."
      />
      <div className={styles.testimonialGrid}>
        {config.testimonials.map((testimonial) => (
          <article className={styles.testimonialCard} key={testimonial.name}>
            <p>&quot;{testimonial.quote}&quot;</p>
            <strong>{testimonial.name}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactSection({ config }: { config: SiteConfig }) {
  const businessAddress = useMemo(() => getBusinessAddress(config), [config]);

  return (
    <section className={styles.contactSection} id="contato">
      <div className={styles.contactIntro}>
        <p className={styles.sectionEyebrow}>Contato</p>
        <h2>Garanta seu horário agora.</h2>
        <p className={styles.contactText}>
          Atendimento com reserva, confirmação rápida e acompanhamento pensado
          para transformar visita em recorrência.
        </p>
      </div>

      <div className={styles.contactCard}>
        <div>
          <span className={styles.contactLabel}>Endereço</span>
          <p>{businessAddress}</p>
        </div>
        <div>
          <span className={styles.contactLabel}>Horários</span>
          <p>Seg a sex, 9h às 20h | Sáb, 8h às 18h</p>
        </div>
        <div>
          <span className={styles.contactLabel}>WhatsApp</span>
          <p>{config.whatsapp}</p>
        </div>
        <a className={styles.primary} href={`https://wa.me/55${config.whatsapp.replace(/\D/g, "")}`}>
          Agendar pelo WhatsApp
        </a>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className={styles.footer}>
      <DaBiTechSignature
        containerClassName={styles.footerInner}
        labelClassName={styles.footerLabel}
        logoClassName={styles.footerLogo}
        linkClassName={styles.footerLink}
      />
    </footer>
  );
}

function subscribeToSiteConfig(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  function handleStorage(event: StorageEvent) {
    if (!event.key || event.key === SITE_CONFIG_STORAGE_KEY) {
      onStoreChange();
    }
  }

  function handleLocalUpdate() {
    onStoreChange();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(SITE_CONFIG_UPDATED_EVENT, handleLocalUpdate);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(SITE_CONFIG_UPDATED_EVENT, handleLocalUpdate);
  };
}

export function HomePage() {
  const config = useSyncExternalStore(
    subscribeToSiteConfig,
    getClientSiteConfigSnapshot,
    getServerSiteConfigSnapshot,
  );
  const [nextAvailable, setNextAvailable] = useState<NextAvailableSlot>(null);

  return (
    <div className={styles.page}>
      <section className={styles.heroShell}>
        <Header config={config} />
        <main className={styles.main}>
          <HeroSection config={config} nextAvailable={nextAvailable} />
          <ShowcaseSection config={config} />
        </main>
      </section>

      <section className={styles.contentSurface}>
        <div className={styles.contentInner}>
          <AboutSection config={config} />
          <PlansSection config={config} />
          <ServicesSection config={config} />
          <BookingSection
            config={config}
            onNextAvailableChange={setNextAvailable}
          />
          <StatsSection config={config} />
          <TestimonialsSection config={config} />
          <ContactSection config={config} />
          <FooterSection />
        </div>
      </section>
    </div>
  );
}
