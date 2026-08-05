"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DM_Serif_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./portal.css";
import Sidebar from "./Sidebar";
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

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const u = getSessionUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
    setChecked(true);
  }, [router]);

  if (!checked || !user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          color: "#888",
          fontSize: 14,
          background: "#FAFAF8",
        }}
      >
        Loading…
      </div>
    );
  }

  return (
    <div
      className={`gsa shell ${dmSerif.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <Sidebar user={user} />
      <main className="main">{children}</main>
    </div>
  );
}
