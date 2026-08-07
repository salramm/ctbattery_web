"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const TABS: { label: string; href: string }[] = [
  { label: "Non-profits", href: "/portal/docs/nonprofits" },
  { label: "Battery systems", href: "/portal/docs/equipment" },
  { label: "Calculator", href: "/portal/docs/calculator" },
  { label: "Incentives", href: "/portal/docs/incentives" },
  { label: "Timeline", href: "/portal/docs/timeline" },
  { label: "Founder alignment", href: "/portal/docs/founder-alignment" },
  { label: "Roles & assignments", href: "/portal/docs/roles" },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      <div style={{ marginBottom: 4, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-3)" }}>
        Documentation
      </div>
      <div style={tabBar}>
        {TABS.map((t) => {
          const active = pathname === t.href || pathname.startsWith(t.href + "/");
          return (
            <Link
              key={t.href}
              href={t.href}
              style={{
                ...tab,
                color: active ? "var(--accent-ink)" : "var(--ink-3)",
                borderBottomColor: active ? "var(--accent)" : "transparent",
                fontWeight: active ? 600 : 500,
              }}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      <div>{children}</div>
    </div>
  );
}

const tabBar: React.CSSProperties = {
  display: "flex",
  gap: 4,
  borderBottom: "1px solid var(--rule)",
  marginBottom: 24,
  overflowX: "auto",
  paddingBottom: 0,
};
const tab: React.CSSProperties = {
  flex: "none",
  padding: "10px 14px",
  fontFamily: "var(--mono)",
  fontSize: 11.5,
  letterSpacing: ".02em",
  textDecoration: "none",
  borderBottom: "2px solid transparent",
  whiteSpace: "nowrap",
};
