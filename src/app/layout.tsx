import type { Metadata } from "next";
import "./globals.css";
import { getLanguage } from "@/lib/language";
import { LanguageProvider } from "@/lib/LanguageContext";

export const metadata: Metadata = {
  title: "SHPE Health Care",
  description: "Online healthcare landing page for SHPE Health Care.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLanguage();

  return (
    <html lang={lang}>
      <body>
        <LanguageProvider initialLang={lang}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
