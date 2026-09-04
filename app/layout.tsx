import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FragPunk Hub — русская база знаний",
  description:
    "Русская база знаний по FragPunk: лансеры, оружие, карты осколков, гайды и обновления.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}
