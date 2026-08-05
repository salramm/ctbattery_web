import { DM_Serif_Display, DM_Sans, JetBrains_Mono } from "next/font/google";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

export default function CtLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${dmSerif.variable} ${dmSans.variable} ${dmMono.variable}`}>
      {children}
    </div>
  );
}
