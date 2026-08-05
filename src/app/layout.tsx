import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CT Battery Solutions | C&I Battery Storage Intelligence",
  description:
    "Address-to-savings analysis engine for commercial & industrial battery storage. Instant utility detection, rate tariff analysis, and 8-stream revenue modeling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=JetBrains+Mono:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
