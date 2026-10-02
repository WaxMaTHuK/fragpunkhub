import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ФрагПанк Хаб — русская база знаний",
  description:
    "Русская база знаний по ФрагПанк: лансеры, оружие, фрагмент карты, гайды и обновления.",
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
