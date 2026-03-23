import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prime Cut Studio",
  description:
    "Site de barbearia com apresentacao institucional e base para sistema de agendamento online.",
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
