import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prime Cut Studio",
  description:
    "Barbearia premium com atendimento por agendamento, serviços de corte e barba e presença digital profissional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
