"use client";

import { useCallback, useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";

type Kpi = { label: string; value: string; sub: string; tone?: string };
type System = {
  projectId: string;
  customer: string;
  town: string;
  lat: number | null;
  lng: number | null;
  hw: string;
  provider: string;
  soc: number | null;
  mode: string;
  status: string;
  state: "ONLINE" | "OFFLINE" | "FAULT";
};
type Fleet = { stats: Kpi[]; systems: System[] };

// ── CT map projection ───────────────────────────────────────────────
const LNG_MIN = -73.75, LNG_RANGE = 2.0, LAT_MAX = 42.1, LAT_RANGE = 1.15;
const VW = 680, VH = 520;
const px = (lng: number) => ((lng - LNG_MIN) / LNG_RANGE) * VW;
const py = (lat: number) => ((LAT_MAX - lat) / LAT_RANGE) * VH;
// Approximate Connecticut outline (clockwise from the NW corner).
const CT_OUTLINE: [number, number][] = [
  [-73.487, 42.05], [-71.799, 42.03], [-71.797, 41.727], [-71.789, 41.416], [-71.86, 41.335],
  [-72.09, 41.30], [-72.34, 41.263], [-72.47, 41.27], [-72.62, 41.26], [-72.9, 41.246],
  [-73.1, 41.16], [-73.28, 41.12], [-73.44, 41.045], [-73.657, 41.001], [-73.63, 41.1],
  [-73.55, 41.22], [-73.51, 41.3], [-73.487, 42.05],
];
const CT_PATH = CT_OUTLINE.map(([lng, lat], i) => `${i ? "L" : "M"}${px(lng).toFixed(1)},${py(lat).toFixed(1)}`).join(" ") + " Z";

const STATE_COLOR: Record<string, string> = { ONLINE: "var(--c-green)", FAULT: "var(--c-red)", OFFLINE: "var(--c-amber)" };
const STATE_BG: Record<string, string> = { ONLINE: "var(--c-green-l)", FAULT: "var(--c-red-l)", OFFLINE: "var(--c-amber-l)" };

function socColor(soc: number | null): string {
  if (soc == null) return "var(--ink-5)";
  if (soc >= 70) return "var(--c-green)";
  if (soc >= 40) return "var(--c-teal)";
  return "var(--c-red)";
}

async function opsFetch<T>(path: string): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE}${path}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  const json = await res.json();
  if (!res.ok || json?.success === false) throw new Error(json?.message || `Request failed (${res.status})`);
  return json.data as T;
}

export default function FleetClient() {
  const [fleet, setFleet] = useState<Fleet | null>(null);
  const [error, setError] = useState("");
  const [hover, setHover] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError("");
    try {
      setFleet(await opsFetch<Fleet>("/api/ops/fleet"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load fleet");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <div className="page-head">
        <p className="eyebrow">Assets · Fleet</p>
        <h1>Fleet monitoring.</h1>
        <p className="lead">
          Live status of every commissioned system across Connecticut — state of charge, operating mode, and
          open faults. Click a marker to highlight its row.
        </p>
        <span style={demoNote}>✳ Demo purposes — sample telemetry &amp; schematic map</span>
      </div>

      {error && <p style={{ color: "var(--c-red)", fontFamily: "var(--mono)", fontSize: 13 }}>{error}</p>}
      {!fleet && !error && <p style={{ color: "var(--ink-3)", fontFamily: "var(--mono)", fontSize: 13 }}>Loading…</p>}

      {fleet && (
        <>
          <div className="kpi-row">
            {fleet.stats.map((k) => (
              <div className="kpi" key={k.label}>
                <div className="l">{k.label}</div>
                <div className={k.tone === "bad" && k.value !== "0" ? "v rp" : "v"}>{k.value}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", marginTop: 6 }}>{k.sub}</div>
              </div>
            ))}
          </div>

          <div style={mapWrap}>
            {/* Map */}
            <div style={panel}>
              <div style={panelHead}>
                <span style={panelTitle}>Fleet map — Connecticut</span>
                <div style={{ display: "flex", gap: 14 }}>
                  {(["ONLINE", "OFFLINE", "FAULT"] as const).map((s) => (
                    <span key={s} style={legendItem}>
                      <span style={{ width: 9, height: 9, borderRadius: 999, background: STATE_COLOR[s] }} />
                      {s[0] + s.slice(1).toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
              <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Connecticut fleet map">
                <path d={CT_PATH} fill="var(--bg-soft)" stroke="var(--ink-4)" strokeWidth={1.5} strokeLinejoin="round" />
                {fleet.systems.map((s) => {
                  if (s.lat == null || s.lng == null) return null;
                  const cx = px(s.lng), cy = py(s.lat);
                  const on = hover === s.projectId;
                  return (
                    <g key={s.projectId} onMouseEnter={() => setHover(s.projectId)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
                      {on && <circle cx={cx} cy={cy} r={13} fill={STATE_COLOR[s.state]} opacity={0.18} />}
                      <circle cx={cx} cy={cy} r={on ? 7 : 5.5} fill={STATE_COLOR[s.state]} stroke="#fff" strokeWidth={1.5} />
                      <title>{`${s.customer} · ${s.town} · ${s.status}${s.soc != null ? ` · ${s.soc}%` : ""}`}</title>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Status rollup */}
            <div style={panel}>
              <div style={panelHead}>
                <span style={panelTitle}>Status</span>
              </div>
              {(["ONLINE", "OFFLINE", "FAULT"] as const).map((st) => {
                const n = fleet.systems.filter((s) => s.state === st).length;
                return (
                  <div key={st} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--rule-2)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <span style={{ width: 9, height: 9, borderRadius: 999, background: STATE_COLOR[st] }} />
                      <span style={{ fontSize: 13.5, color: "var(--ink-2)" }}>{st[0] + st.slice(1).toLowerCase()}</span>
                    </span>
                    <span style={{ fontFamily: "var(--serif)", fontSize: 22, color: STATE_COLOR[st] }}>{n}</span>
                  </div>
                );
              })}
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", marginTop: 14, lineHeight: 1.6 }}>
                Markers plotted by service-address coordinates. Offline = no telemetry in 24h.
              </div>
            </div>
          </div>

          {/* Fleet table */}
          <div style={{ ...panel, marginTop: 16 }}>
            <div style={panelHead}>
              <span style={panelTitle}>Systems</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" }}>{fleet.systems.length} monitored</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={table}>
                <thead>
                  <tr>{["Customer", "Town", "Hardware", "State of charge", "Mode", "Status"].map((h) => <th key={h} style={th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {fleet.systems.map((s) => (
                    <tr
                      key={s.projectId}
                      onMouseEnter={() => setHover(s.projectId)}
                      onMouseLeave={() => setHover(null)}
                      style={{ borderTop: "1px solid var(--rule-2)", background: hover === s.projectId ? "var(--bg-soft)" : "transparent" }}
                    >
                      <td style={td}>{s.customer}</td>
                      <td style={td}>{s.town}</td>
                      <td style={{ ...td, fontFamily: "var(--mono)", fontSize: 12 }}>{s.hw}</td>
                      <td style={{ ...td, minWidth: 150 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ flex: 1, height: 7, background: "var(--bg-soft)", borderRadius: 999, overflow: "hidden", maxWidth: 90 }}>
                            <span style={{ display: "block", height: "100%", width: `${s.soc ?? 0}%`, background: socColor(s.soc), borderRadius: 999 }} />
                          </span>
                          <span style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--ink-2)", width: 34 }}>{s.soc == null ? "—" : `${s.soc}%`}</span>
                        </div>
                      </td>
                      <td style={{ ...td, fontFamily: "var(--mono)", fontSize: 11 }}>{s.mode === "SELF_CONSUMPTION" ? "SELF-CONSUME" : s.mode}</td>
                      <td style={td}>
                        <span style={{ display: "inline-block", fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: ".04em", padding: "3px 8px", borderRadius: 5, background: STATE_BG[s.state], color: STATE_COLOR[s.state] }}>
                          {s.status}
                        </span>
                      </td>
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

const demoNote: React.CSSProperties = { display: "inline-block", marginTop: 10, fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: ".04em", color: "var(--c-amber)", background: "var(--c-amber-l)", padding: "4px 9px", borderRadius: 4 };
const mapWrap: React.CSSProperties = { display: "grid", gridTemplateColumns: "minmax(0,2.4fr) minmax(200px,1fr)", gap: 16, marginTop: 20, alignItems: "start" };
const panel: React.CSSProperties = { background: "#fff", border: "1px solid var(--rule-2)", borderRadius: 8, padding: "16px 18px" };
const panelHead: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 12, flexWrap: "wrap" };
const panelTitle: React.CSSProperties = { fontFamily: "var(--serif)", fontSize: 17 };
const legendItem: React.CSSProperties = { display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" };
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 13 };
const th: React.CSSProperties = { textAlign: "left", padding: "8px 12px", fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-3)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "10px 12px", verticalAlign: "middle", color: "var(--ink-2)" };
