"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

type Item = { label: string; href: string };

const OPERATIONS: Item[] = [
  { label: "Dashboard", href: "/portal" },
  { label: "Fleet map", href: "/portal/fleet" },
  { label: "Applications", href: "/portal/applications" },
  { label: "Leads", href: "/portal/leads" },
  { label: "Letters of Intent", href: "/portal/loi" },
];

const DOCUMENTATION: Item[] = [
  { label: "Non-profits", href: "/portal/nonprofits" },
  { label: "Battery systems", href: "/portal/equipment" },
  { label: "Calculator", href: "/portal/calculator" },
  { label: "Incentives", href: "/portal/incentives" },
  { label: "Timeline", href: "/portal/timeline" },
  { label: "Founder alignment", href: "/portal/founder-alignment" },
  { label: "Roles & assignments", href: "/portal/roles" },
];

export default function Sidebar({ user }: { user: string }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/portal" ? pathname === "/portal" : pathname === href || pathname.startsWith(href + "/");

  // Collapsed by default; open automatically only if you're on a doc page.
  const [docsOpen, setDocsOpen] = useState(() => DOCUMENTATION.some((i) => isActive(i.href)));

  const link = (s: Item) => (
    <Link key={s.href} href={s.href} className={isActive(s.href) ? "active" : undefined}>
      {s.label}
    </Link>
  );

  return (
    <aside className="sidebar">
      <Link className="brand" href="/portal">
        <span className="mark" aria-hidden="true" />
        <div>
          <div className="name">CT Battery Solutions</div>
          <div className="role">Management portal</div>
        </div>
      </Link>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <div className="nav-section">Operations</div>
        <nav aria-label="Operations sections">{OPERATIONS.map(link)}</nav>

        <button
          type="button"
          className="nav-section"
          onClick={() => setDocsOpen((o) => !o)}
          aria-expanded={docsOpen}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <span>Documentation</span>
          <span aria-hidden="true" style={{ transition: "transform .15s", transform: docsOpen ? "rotate(90deg)" : "none", fontSize: 9 }}>▶</span>
        </button>
        {docsOpen && <nav aria-label="Documentation sections">{DOCUMENTATION.map(link)}</nav>}
      </div>

      <div className="user">
        <div className="who">
          Signed in as <strong>{user}</strong>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
