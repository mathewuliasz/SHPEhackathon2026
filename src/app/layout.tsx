import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SHPE Health Care",
  description: "Online healthcare landing page for SHPE Health Care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
