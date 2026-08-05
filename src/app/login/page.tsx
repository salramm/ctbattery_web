"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DM_Serif_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./login.css";
import LoginForm from "./LoginForm";
import { getSessionUser } from "@/lib/auth";

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

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (getSessionUser()) router.replace("/portal");
  }, [router]);

  return (
    <div
      className={`gsa ${dmSerif.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <div className="center-wrap">
        <div className="card">
          <div className="brand-row">
            <span className="mark" aria-hidden="true" />
            <span className="name">CT Battery Solutions · Management portal</span>
          </div>
          <h1>System login.</h1>
          <p className="sub">Sign in to access the management portal.</p>
          <LoginForm />
          <p className="back-link">
            <a href="/ct">← Back to site</a>
          </p>
        </div>
      </div>
    </div>
  );
}
