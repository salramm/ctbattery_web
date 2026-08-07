"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

type Item = { label: string; href: string };
const GROUPS: { label: string; items: Item[] }[] = [
  {
    label: "Operations",
    items: [
      { label: "Dashboard", href: "/portal" },
      { label: "Fleet map", href: "/portal/fleet" },
      { label: "Applications", href: "/portal/applications" },
      { label: "Leads", href: "/portal/leads" },
      { label: "Letters of Intent", href: "/portal/loi" },
    ],
  },
  {
    label: "Documentation",
    items: [
      { label: "Non-profits", href: "/portal/nonprofits" },
      { label: "Battery systems", href: "/portal/equipment" },
      { label: "Calculator", href: "/portal/calculator" },
      { label: "Incentives", href: "/portal/incentives" },
      { label: "Timeline", href: "/portal/timeline" },
      { label: "Founder alignment", href: "/portal/founder-alignment" },
      { label: "Roles & assignments", href: "/portal/roles" },
    ],
  },
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
        {GROUPS.map((g) => (
          <div key={g.label}>
            <div className="nav-section">{g.label}</div>
            <nav aria-label={`${g.label} sections`}>
              {g.items.map((s) => (
                <Link key={s.href} href={s.href} className={isActive(s.href) ? "active" : undefined}>
                  {s.label}
                </Link>
              ))}
            </nav>
          </div>
        ))}
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
