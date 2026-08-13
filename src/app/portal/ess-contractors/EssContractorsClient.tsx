"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/lib/api";

type Contractor = {
  id: number;
  name: string;
  city: string | null;
  state: string | null;
  zip: string | null;
  phone: string | null;
  awardWinner: boolean;
  propertyTypes: string[];
  services: string[];
  batteryTechnologies: string[];
};

type SortKey = "name" | "city" | "state" | "zip" | "award" | "services" | "battery";
const COLUMNS: { key: SortKey; label: string; num?: boolean }[] = [
  { key: "name", label: "Contractor" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "zip", label: "ZIP" },
  { key: "award", label: "Award", num: true },
  { key: "services", label: "Services", num: true },
  { key: "battery", label: "Battery techs", num: true },
];

function value(c: Contractor, key: SortKey): string | number {
  switch (key) {
    case "services": return c.services.length;
    case "battery": return c.batteryTechnologies.length;
    case "award": return c.awardWinner ? 1 : 0;
    default: return (c[key] ?? "") as string;
  }
}

export default function EssContractorsClient() {
  const [rows, setRows] = useState<Contractor[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "name", dir: "asc" });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/ess/contractors`);
      const json = await res.json();
      if (!res.ok || json?.success === false) throw new Error(json?.message || `Request failed (${res.status})`);
      setRows(json.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load contractors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const view = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = needle
      ? rows.filter((c) => [c.name, c.city, c.state, ...c.services, ...c.batteryTechnologies].join(" ").toLowerCase().includes(needle))
      : rows;
    const sorted = [...filtered].sort((a, b) => {
      const x = value(a, sort.key);
      const y = value(b, sort.key);
      const r = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
      return sort.dir === "asc" ? r : -r;
    });
    return sorted;
  }, [rows, q, sort]);

  function toggleSort(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "name" || key === "city" || key === "state" || key === "zip" ? "asc" : "desc" }));
  }

  return (
    <>
      <div className="page-head">
        <p className="eyebrow">Operations · Network</p>
        <h1>ESS program contractors.</h1>
        <p className="lead">Connecticut Energy Storage Solutions listed contractors. Sort by any column; click a row for the full profile.</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "14px 0", flexWrap: "wrap" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, city, service, battery…"
          style={{ flex: "1 1 260px", fontFamily: "var(--sans)", fontSize: 14, padding: "10px 12px", border: "1px solid var(--rule)", borderRadius: 6, outline: "none", background: "#fff" }}
        />
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)" }}>
          {loading ? "Loading…" : `${view.length} of ${rows.length}`}
        </span>
      </div>

      {error && <p style={{ color: "var(--c-red)", fontFamily: "var(--mono)", fontSize: 13 }}>{error}</p>}

      <div style={{ overflowX: "auto", border: "1px solid var(--rule-2)", borderRadius: 8 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--bg-soft)" }}>
              {COLUMNS.map((col) => (
                <th key={col.key} style={{ ...th, textAlign: col.num ? "center" : "left" }}>
                  <button onClick={() => toggleSort(col.key)} style={sortBtn}>
                    {col.label}
                    <span style={{ opacity: sort.key === col.key ? 1 : 0.25 }}>{sort.key === col.key ? (sort.dir === "asc" ? " ▲" : " ▼") : " ⇅"}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.map((c) => (
              <tr key={c.id} style={{ borderTop: "1px solid var(--rule-2)" }}>
                <td style={td}>
                  <Link href={`/portal/ess-contractors/profile/?id=${c.id}`} style={{ color: "var(--accent-ink)", fontWeight: 500, textDecoration: "none" }}>
                    {c.name || "(unnamed)"}
                  </Link>
                  {c.awardWinner && <span style={awardTag}>★ Award</span>}
                </td>
                <td style={td}>{c.city ?? "—"}</td>
                <td style={td}>{c.state ?? "—"}</td>
                <td style={{ ...td, fontFamily: "var(--mono)" }}>{c.zip ?? "—"}</td>
                <td style={{ ...td, textAlign: "center" }}>{c.awardWinner ? "★" : "—"}</td>
                <td style={{ ...td, textAlign: "center" }}>{c.services.length}</td>
                <td style={{ ...td, textAlign: "center" }}>{c.batteryTechnologies.length}</td>
              </tr>
            ))}
            {view.length === 0 && !loading && (
              <tr>
                <td style={{ ...td, color: "var(--ink-3)" }} colSpan={COLUMNS.length}>No contractors match.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

const th: React.CSSProperties = { padding: "8px 12px", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "10px 12px", verticalAlign: "middle", color: "var(--ink-2)" };
const sortBtn: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-3)", padding: 0 };
const awardTag: React.CSSProperties = { marginLeft: 8, fontFamily: "var(--mono)", fontSize: 9.5, color: "var(--c-amber)", background: "var(--c-amber-l)", padding: "2px 6px", borderRadius: 4 };
