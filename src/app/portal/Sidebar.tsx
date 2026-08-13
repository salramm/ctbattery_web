"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

type Item = { label: string; href: string };

const OPERATIONS: Item[] = [
  { label: "Dashboard", href: "/portal" },
  { label: "Fleet map", href: "/portal/fleet" },
  { label: "ESS qualification", href: "/portal/ess" },
  { label: "Applications", href: "/portal/applications" },
  { label: "Leads", href: "/portal/leads" },
  { label: "Letters of Intent", href: "/portal/loi" },
];

export default function Sidebar({ user }: { user: string }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/portal" ? pathname === "/portal" : pathname === href || pathname.startsWith(href + "/");

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
        <nav aria-label="Operations sections">
          {OPERATIONS.map((s) => (
            <Link key={s.href} href={s.href} className={isActive(s.href) ? "active" : undefined}>
              {s.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Documentation — a single link at the bottom, opens a tabbed hub. */}
      <nav aria-label="Documentation">
        <Link href="/portal/docs/nonprofits" className={pathname.startsWith("/portal/docs") ? "active" : undefined}>
          Documentation
        </Link>
      </nav>

      <div className="user">
        <div className="who">
          Signed in as <strong>{user}</strong>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
