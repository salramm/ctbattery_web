"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { authedFetch } from "@/lib/auth";

type Kpi = { label: string; value: string; sub: string; tone?: string };
type Alert = { id: string; code: string; message: string; severity: string; customer: string; town: string; openedAt: string };
type Summary = {
  pipeline: Kpi[];
  fleet: Kpi[];
  health: Record<string, number>;
  stages: Record<string, number>;
  alerts: Alert[];
};
type Project = { id: string; customer: string; town: string; stage: string; health: string; note: string; contractor: string; monthlyRate: number };

const STAGE_ORDER = ["DESIGN", "SITE_SURVEY", "PERMITTING", "INTERCONNECTION", "SCHEDULED", "INSTALLED", "INSPECTION", "PTO", "MONITORING", "ACTIVE"];

const HEALTH: Record<string, { bg: string; fg: string; label: string }> = {
  ON_TRACK: { bg: "var(--c-green-l)", fg: "var(--c-green)", label: "On track" },
  AT_RISK: { bg: "var(--c-amber-l)", fg: "var(--c-amber)", label: "At risk" },
  BLOCKED: { bg: "var(--c-red-l)", fg: "var(--c-red)", label: "Blocked" },
};
const SEV: Record<string, string> = { CRITICAL: "var(--c-red)", WARN: "var(--c-amber)", INFO: "var(--c-teal)" };

async function opsFetch<T>(path: string): Promise<T> {
  const res = await authedFetch(path); // logs out on an expired/invalid token
  const json = await res.json();
  if (!res.ok || json?.success === false) throw new Error(json?.message || `Request failed (${res.status})`);
  return json.data as T;
}

export default function DashboardClient() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [s, p] = await Promise.all([opsFetch<Summary>("/api/ops/summary"), opsFetch<Project[]>("/api/ops/projects")]);
      setSummary(s);
      setProjects(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const maxStage = summary ? Math.max(1, ...Object.values(summary.stages)) : 1;

  return (
    <>
      <div className="page-head">
        <p className="eyebrow">Operations · TPO platform</p>
        <h1>Operations dashboard.</h1>
        <p className="lead">
          Lead-to-PTO delivery, contractor jobs, and live fleet health in one place. Figures below are
          computed from seeded sample data.
        </p>
        <span style={demoNote}>✳ Demo purposes — sample data</span>
      </div>

      {error && <p style={{ color: "var(--c-red)", fontFamily: "var(--mono)", fontSize: 13 }}>{error}</p>}
      {loading && !summary && <p style={{ color: "var(--ink-3)", fontFamily: "var(--mono)", fontSize: 13 }}>Loading…</p>}

      {summary && (
        <>
          <SectionLabel>Sales pipeline</SectionLabel>
          <div className="kpi-row">
            {summary.pipeline.map((k) => (
              <KpiCard key={k.label} k={k} />
            ))}
          </div>

          <SectionLabel>Fleet</SectionLabel>
          <div className="kpi-row">
            {summary.fleet.map((k) => (
              <KpiCard key={k.label} k={k} />
            ))}
          </div>

          <div style={grid2}>
            {/* Delivery health */}
            <div style={panel}>
              <div style={panelHead}>
                <span style={panelTitle}>Delivery health</span>
                <span style={panelMeta}>{projects.length} projects</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
                {(["ON_TRACK", "AT_RISK", "BLOCKED"] as const).map((h) => (
                  <div key={h} style={{ background: HEALTH[h].bg, borderRadius: 6, padding: "12px 14px" }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: HEALTH[h].fg, lineHeight: 1 }}>
                      {summary.health[h] ?? 0}
                    </div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: ".08em", textTransform: "uppercase", color: HEALTH[h].fg, marginTop: 6 }}>
                      {HEALTH[h].label}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8 }}>
                By stage
              </div>
              {STAGE_ORDER.filter((s) => summary.stages[s]).map((s) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-2)", width: 118, flex: "none" }}>{stageLabel(s)}</span>
                  <span style={{ flex: 1, height: 8, background: "var(--bg-soft)", borderRadius: 999, overflow: "hidden" }}>
                    <span style={{ display: "block", height: "100%", width: `${((summary.stages[s] ?? 0) / maxStage) * 100}%`, background: "var(--accent)", borderRadius: 999 }} />
                  </span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-2)", width: 20, textAlign: "right" }}>{summary.stages[s]}</span>
                </div>
              ))}
            </div>

            {/* Alerts */}
            <div style={panel}>
              <div style={panelHead}>
                <span style={panelTitle}>Open fleet alerts</span>
                <Link href="/portal/fleet" style={panelLink}>Fleet map →</Link>
              </div>
              {summary.alerts.length === 0 && <p style={{ color: "var(--ink-3)", fontSize: 13 }}>No open alerts.</p>}
              {summary.alerts.map((a) => (
                <div key={a.id} style={alertItem}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: SEV[a.severity] ?? "var(--c-teal)", flex: "none", marginTop: 6 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, color: "var(--ink)", fontWeight: 500 }}>{a.message}</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--ink-3)", marginTop: 2 }}>
                      {a.customer} · {a.town} · {a.code}
                    </div>
                  </div>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: ".06em", color: SEV[a.severity] ?? "var(--c-teal)" }}>{a.severity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Projects table */}
          <div style={{ ...panel, marginTop: 16 }}>
            <div style={panelHead}>
              <span style={panelTitle}>Projects</span>
              <span style={panelMeta}>lead → PTO delivery</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={table}>
                <thead>
                  <tr>
                    {["Customer", "Town", "Stage", "Status", "Contractor", "Rate"].map((h) => (
                      <th key={h} style={th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id} style={{ borderTop: "1px solid var(--rule-2)" }}>
                      <td style={td}>{p.customer}</td>
                      <td style={td}>{p.town}</td>
                      <td style={td}>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--ink-2)" }}>{stageLabel(p.stage)}</span>
                        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{p.note}</div>
                      </td>
                      <td style={td}><HealthPill health={p.health} /></td>
                      <td style={td}>{p.contractor}</td>
                      <td style={{ ...td, fontFamily: "var(--mono)" }}>${p.monthlyRate}/mo</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function KpiCard({ k }: { k: Kpi }) {
  const cls = k.tone === "bad" && k.value !== "0" ? "v rp" : k.tone === "ok" ? "v gp" : "v";
  return (
    <div className="kpi">
      <div className="l">{k.label}</div>
      <div className={cls}>{k.value}</div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", marginTop: 6 }}>{k.sub}</div>
    </div>
  );
}

function HealthPill({ health }: { health: string }) {
  const h = HEALTH[health] ?? HEALTH.ON_TRACK;
  return (
    <span style={{ display: "inline-block", fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: ".05em", padding: "3px 8px", borderRadius: 5, background: h.bg, color: h.fg }}>
      {h.label}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-3)", margin: "26px 0 2px" }}>
      {children}
    </div>
  );
}

function stageLabel(s: string): string {
  return ({ SITE_SURVEY: "Site survey", INTERCONNECTION: "Interconnect", NOT_STARTED: "Not started" } as Record<string, string>)[s] || s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " ");
}

const demoNote: React.CSSProperties = { display: "inline-block", marginTop: 10, fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: ".04em", color: "var(--c-amber)", background: "var(--c-amber-l)", padding: "4px 9px", borderRadius: 4 };
const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 16, marginTop: 16 };
const panel: React.CSSProperties = { background: "#fff", border: "1px solid var(--rule-2)", borderRadius: 8, padding: "16px 18px" };
const panelHead: React.CSSProperties = { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 };
const panelTitle: React.CSSProperties = { fontFamily: "var(--serif)", fontSize: 17 };
const panelMeta: React.CSSProperties = { fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" };
const panelLink: React.CSSProperties = { fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--accent-ink)", textDecoration: "none" };
const alertItem: React.CSSProperties = { display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderTop: "1px solid var(--rule-2)" };
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 13 };
const th: React.CSSProperties = { textAlign: "left", padding: "8px 12px", fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-3)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "10px 12px", verticalAlign: "top", color: "var(--ink-2)" };
