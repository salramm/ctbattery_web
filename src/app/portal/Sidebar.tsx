"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import InventoryRail from "./InventoryRail";
import { openLifecycleMap } from "./LifecycleMap";

type Item = { label: string; href: string };

const OPERATIONS: Item[] = [
  { label: "Today", href: "/portal/today" },
  { label: "Dashboard", href: "/portal" },
  { label: "Pipeline", href: "/portal/pipeline" },
  { label: "Fleet", href: "/portal/fleet-lens" },
  { label: "Money", href: "/portal/money" },
  { label: "Fleet map (legacy)", href: "/portal/fleet" },
  { label: "ESS qualification", href: "/portal/ess" },
  { label: "ESS contractors", href: "/portal/ess-contractors" },
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
      <Link className="brand" href="/portal" style={{ flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-3.png" alt="CT Battery Solutions" style={{ height: 30, width: "auto", maxWidth: "100%", display: "block" }} />
        <div className="role">Management portal</div>
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
        {/* Lifecycle map (D3) — the persistent rail entry point. */}
        <button
          type="button"
          className="lifecycle-rail-link"
          onClick={openLifecycleMap}
        >
          Lifecycle map
        </button>

        {/* Inventory rail (D4) — persistent across portal screens. */}
        <InventoryRail />
      </div>

      {/* Documentation — last link, pinned at the bottom right above the Signed-in divider. */}
      <nav aria-label="Documentation" style={{ borderTop: "1px solid var(--rule)", paddingTop: 6 }}>
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
