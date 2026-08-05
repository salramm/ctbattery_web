"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

const SECTIONS: { label: string; href: string }[] = [
  { label: "Overview", href: "/portal" },
  { label: "Applications", href: "/portal/applications" },
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

  return (
    <aside className="sidebar">
      <Link className="brand" href="/portal">
        <span className="mark" aria-hidden="true" />
        <div>
          <div className="name">CT Battery Solutions</div>
          <div className="role">Management portal</div>
        </div>
      </Link>

      <div className="nav-section">Sections</div>
      <nav aria-label="Portal sections">
        {SECTIONS.map((s) => {
          const isActive =
            s.href === "/portal"
              ? pathname === "/portal"
              : pathname === s.href || pathname.startsWith(s.href + "/");
          return (
            <Link
              key={s.href}
              href={s.href}
              className={isActive ? "active" : undefined}
            >
              {s.label}
            </Link>
          );
        })}
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
