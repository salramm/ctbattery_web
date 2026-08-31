"use client";

/**
 * Fleet — the condition lens (03 §Fleet).
 *
 * Pipeline answers "how far along"; this answers "healthy and earning". It
 * reads the lifecycle Fleet endpoint (systems + health + alerts + events); the
 * legacy /portal/fleet demo map over MonitoringSite/Project is left untouched
 * (R7) and is superseded by this screen.
 *
 * The table is sorted worst-first by the server. Nothing here re-sorts or
 * re-counts — the lens is the server's answer, rendered.
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { isApiError, lcGet, lcPost } from "@/lib/lifecycle";

type Pin = { town: string; count: number; worst: string | null; lat: number | null; lng: number | null; color: string };

type FleetRow = {
  id: string;
  address: string | null;
  unit_label: string | null;
  property: { id: string; name: string | null; town: string | null } | null;
  tier: string | null;
  grid_edge: boolean | null;
  flags: string[];
  health: string | null;
  comms_30d: number | null;
  comms_measurable: boolean;
  hours_since_seen: number | null;
  soc: number | null;
  fw: string | null;
  last_event: { kw: number; ratio: number | null; date: string } | null;
  season_avg_kw: number | null;
  season_expected_kw: number | null;
  dispatch_verified: boolean;
  open_ticket: { id: string; state: string; severity: string | null } | null;
  kw_rated: number | null;
};

type Fleet = {
  season: { id: string; name: string; program_year: number; window: { start?: string; end?: string } | null } | null;
  strip: {
    active_systems: number;
    online_pct: number | null;
    reporting: number;
    fleet_kw: number;
    events_this_season: number;
    season_expected: number;
    open_faults: number;
  };
  pins: Pin[];
  health_counts: Record<string, number>;
  systems: FleetRow[];
  derate: {
    chain: Array<{ key: string; factor: number }>;
    model: number;
    measured: number | null;
    delta: number | null;
    events_sampled: number;
  };
};

/** Connecticut's bounding box, for projecting pin lat/lng onto the outline. */
const CT = { minLat: 40.95, maxLat: 42.06, minLng: -73.75, maxLng: -71.78 };
const VIEW = { w: 300, h: 195, pad: 34 };

function project(lat: number, lng: number) {
  const x = VIEW.pad + ((lng - CT.minLng) / (CT.maxLng - CT.minLng)) * (VIEW.w - VIEW.pad * 2);
  const y = 20 + ((CT.maxLat - lat) / (CT.maxLat - CT.minLat)) * (VIEW.h - 60);
  return { x, y };
}

const HEALTH_CLASS: Record<string, string> = { OK: "h-ok", WATCH: "h-watch", FAULT: "h-fault", SERVICE: "h-svc" };

const pct = (v: number | null) => (v == null ? "—" : `${(v * 100).toFixed(1)}%`);
const kw = (v: number | null) => (v == null ? "—" : v.toFixed(1));

export default function FleetLensClient() {
  const [fleet, setFleet] = useState<Fleet | null>(null);
  const [error, setError] = useState("");
  const [polling, setPolling] = useState(false);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      setFleet(await lcGet<Fleet>("/api/fleet"));
    } catch (e) {
      setError(isApiError(e) ? e.message : "Failed to load the fleet");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function poll() {
    setPolling(true);
    setNote("");
    try {
      const r = await lcPost<{ polled: number; verified: number; outcomes: Array<{ actions: string[] }> }>(
        "/api/fleet/poll",
        {},
      );
      const acted = r.outcomes.filter((o) => o.actions.length).length;
      setNote(`Polled ${r.polled} systems · ${acted} changed · ${r.verified} resolution${r.verified === 1 ? "" : "s"} verified.`);
      await load();
    } catch (e) {
      setNote(isApiError(e) ? e.message : "Poll failed");
    } finally {
      setPolling(false);
    }
  }

  if (error) {
    return (
      <div className="lc">
        <div className="ltoast" style={{ borderLeftColor: "var(--r)" }}>
          {error}
        </div>
      </div>
    );
  }
  if (!fleet) {
    return (
      <div className="lc">
        <div className="stamp">Loading the fleet…</div>
      </div>
    );
  }

  const { strip, derate, season } = fleet;
  const seasonWindow = season?.window;

  return (
    <div className="lc">
      <div className="shead">
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 27, fontWeight: 400, margin: 0 }}>Fleet</h1>
          <div className="sub">
            Is everything healthy and earning. The stage enum stopped at Live — health and flags run this lens.
          </div>
        </div>
        <div className="right">
          <div className="stamp">
            {season
              ? `Season · ${season.name} ${String(season.program_year).slice(2)}${
                  seasonWindow?.start ? ` · ${seasonWindow.start} – ${seasonWindow.end}` : ""
                }`
              : "No open season"}
          </div>
          <div className="principle">Progress and condition are different questions</div>
          <div style={{ marginTop: 6 }}>
            <button type="button" className="btn sm" onClick={poll} disabled={polling}>
              {polling ? "Polling…" : "Poll now"}
            </button>
          </div>
        </div>
      </div>

      {note && (
        <div className="sec ltoast" style={{ borderLeftColor: "var(--g)" }}>
          {note}
        </div>
      )}

      {/* ── season strip ─────────────────────────────── */}
      <div className="sec stripe">
        <div className="lstat">
          <div className="l">Active systems</div>
          <div className="v">{strip.active_systems}</div>
        </div>
        <div className="lstat">
          <div className="l">Online</div>
          <div className="v">{pct(strip.online_pct)}</div>
          <div className="stamp">
            {strip.reporting} of {strip.active_systems} reporting
          </div>
        </div>
        <div className="lstat">
          <div className="l">Fleet kW</div>
          <div className="v">{strip.fleet_kw}</div>
        </div>
        <div className="lstat">
          <div className="l">Events this season</div>
          <div className="v">{strip.events_this_season}</div>
        </div>
        <div className="lstat">
          <div className="l">Season expected</div>
          <div className="v" style={{ color: "var(--gd)" }}>
            ${strip.season_expected.toLocaleString("en-US")}
          </div>
        </div>
        <div className="lstat">
          <div className="l">Open FAULT</div>
          <div className="v" style={{ color: strip.open_faults ? "var(--r)" : undefined }}>
            {strip.open_faults}
          </div>
        </div>
      </div>

      {/* ── map + table ──────────────────────────────── */}
      <div className="sec grid2" style={{ gridTemplateColumns: "380px 1fr" }}>
        <div className="card pad mapwrap">
          <div className="cardlbl">Connecticut · pins by health</div>
          <svg viewBox="0 0 300 195" style={{ width: "100%", height: "auto" }}>
            <path
              d="M34 22 L268 15 L273 126 C240 137 205 134 172 142 C150 147 128 145 104 149 L100 166 L44 174 L48 150 L36 148 Z"
              fill="var(--sf2)"
              stroke="var(--bd2)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {fleet.pins
              .filter((p) => p.lat != null && p.lng != null)
              .map((p) => {
                const { x, y } = project(p.lat!, p.lng!);
                return (
                  <g className="mappin" key={p.town}>
                    <circle cx={x} cy={y} r={6.5} fill={p.color} opacity={0.92} />
                    <circle cx={x} cy={y} r={10} fill="none" stroke={p.color} opacity={0.3} />
                    <text x={x} y={y - 12} textAnchor="middle" className="maplbl">
                      {p.town.toUpperCase()} · {p.count}
                    </text>
                  </g>
                );
              })}
          </svg>
          <div className="row" style={{ gap: 14, marginTop: 6, flexWrap: "wrap" }}>
            {(["OK", "WATCH", "FAULT", "SERVICE"] as const).map((h) =>
              fleet.health_counts[h] ? (
                <span className={`hchip ${HEALTH_CLASS[h]}`} key={h}>
                  <i />
                  {h} {fleet.health_counts[h]}
                </span>
              ) : null,
            )}
            {fleet.health_counts.UNKNOWN ? (
              <span className="hchip">
                <i />— {fleet.health_counts.UNKNOWN}
              </span>
            ) : null}
          </div>
        </div>

        <div className="card tblscroll">
          <table className="lct">
            <thead>
              <tr>
                <th>System</th>
                <th>Property</th>
                <th>Tier</th>
                <th>Health</th>
                <th>Comms 30d</th>
                <th>Last event</th>
                <th>Season avg / exp kW</th>
                <th>Ticket</th>
              </tr>
            </thead>
            <tbody>
              {fleet.systems.length === 0 && (
                <tr>
                  <td colSpan={8} className="t2">
                    No systems are Live yet — the fleet lens starts at S09.
                  </td>
                </tr>
              )}
              {fleet.systems.map((s) => (
                <tr key={s.id} className="lnk">
                  <td>
                    <b>{s.address ?? s.unit_label ?? "—"}</b>
                    {s.flags.includes("TURNOVER") && (
                      <span className="stchip a" style={{ marginLeft: 5 }}>
                        TURNOVER
                      </span>
                    )}
                    {s.dispatch_verified && (
                      <span className="stchip g" style={{ marginLeft: 5 }} title="First event delivered over 0 kW">
                        DISPATCH ✓
                      </span>
                    )}
                  </td>
                  <td className="t2">{s.property?.name ?? s.property?.town ?? "—"}</td>
                  <td>
                    {s.tier && <span className={`lpill ${s.tier === "LI" ? "li" : "und"}`}>{s.tier === "UNDERSERVED" ? "UND" : s.tier}</span>}
                    {s.grid_edge && <span className="lpill ge" style={{ marginLeft: 4 }}>GE</span>}
                  </td>
                  <td>
                    <span className={`hchip ${HEALTH_CLASS[s.health ?? ""] ?? ""}`}>
                      <i />
                      {s.health ?? "—"}
                    </span>
                  </td>
                  <td
                    className="num"
                    style={{
                      color: !s.comms_measurable
                        ? "var(--t3)"
                        : (s.comms_30d ?? 1) < 0.95
                          ? "var(--r)"
                          : (s.comms_30d ?? 0) >= 0.98
                            ? "var(--gd)"
                            : undefined,
                    }}
                    title={s.comms_measurable ? undefined : "Too few samples to judge"}
                  >
                    {s.comms_measurable ? pct(s.comms_30d) : "—"}
                  </td>
                  <td className="num">
                    {s.hours_since_seen != null && s.hours_since_seen >= 24
                      ? "— offline"
                      : s.last_event
                        ? `${kw(s.last_event.kw)} kW${s.last_event.ratio != null ? ` · ${Math.round(s.last_event.ratio * 100)}%` : ""}`
                        : "—"}
                  </td>
                  <td className="num">
                    {kw(s.season_avg_kw)} / {kw(s.season_expected_kw)}
                  </td>
                  <td className="num" style={{ color: s.open_ticket?.severity === "FAULT" ? "var(--r)" : undefined }}>
                    {s.open_ticket ? s.open_ticket.state : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── derate vs actual ─────────────────────────── */}
      <div className="sec card pad derate">
        <div className="cardlbl" style={{ margin: 0 }}>
          Derate vs actual · fleet
        </div>
        <span className="dchain">
          Model <b>{derate.model.toFixed(2)}</b> — {derate.chain.map((c) => `${c.key} ${c.factor}`).join(" · ")}
        </span>
        <span className="dchain">
          {derate.measured == null ? (
            <>No season events yet — nothing to calibrate against.</>
          ) : (
            <>
              Measured season{" "}
              <b style={{ color: (derate.delta ?? 0) >= 0 ? "var(--gd)" : "var(--r)" }}>{derate.measured.toFixed(2)}</b>{" "}
              · {(derate.delta ?? 0) >= 0 ? "+" : ""}
              {derate.delta?.toFixed(2)} vs model over {derate.events_sampled} event
              {derate.events_sampled === 1 ? "" : "s"} — calibrates underwriting; the comms loop is the lever.
            </>
          )}
        </span>
      </div>

      <div className="stamp">
        <Link href="/portal/today" style={{ color: "var(--gd)" }}>
          ← Back to Today
        </Link>
      </div>
    </div>
  );
}
