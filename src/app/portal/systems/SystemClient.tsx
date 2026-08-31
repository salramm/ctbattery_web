"use client";

/**
 * System page — the canonical record (03 §System page).
 *
 * Every list in the app links here. The lens lives in the URL (D6): `?lens=op`
 * shows the operating face (health chip + term progress + last event),
 * `?lens=pipe` the delivery face (stage ribbon). The server decides which lens
 * a system *is* in; the URL only says which one you asked to see, so an
 * operating deep link renders the operating lens directly.
 *
 * Next action, the gate and its unmet list all come from the server. The
 * Checklist tab PATCHes an item and renders the 422 unmet list inline —
 * it never decides whether Advance is allowed.
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { advanceSystem, isApiError, lcGet, lcPost, stageVar, STAGE_NAME, STAGE_ORDER } from "@/lib/lifecycle";
import { Abbr, Def } from "../Abbr";
import { openLifecycleMap } from "../LifecycleMap";

type Unmet = { key: string; label: string; owner_role: string | null };

type SystemDetail = {
  id: string;
  address: string | null;
  unit_label: string | null;
  stage: string;
  stage_code: string;
  stage_label: string;
  stage_index: number;
  is_live: boolean;
  lens: "op" | "pipe";
  health: string | null;
  flags: string[];
  tier: string | null;
  grid_edge: boolean | null;
  days_in_stage: number | null;
  resident: { name: string | null; phone: string | null; email: string | null } | null;
  property: { id: string; name: string | null; town: string | null; account: { id: string; name: string; dealState: string | null } | null } | null;
  blocked: { code: string; label: string | null; note: string | null; age_days: number | null; today_after_days: number | null } | null;
  terminal: { state: string; reason: string | null; at: string | null } | null;
  next_action: { kind: string; label: string; owner_role: string | null; key: string };
  gate: { stage: string; unmet: Unmet[] };
  transition: { to: string; driver: string; fires: string } | null;
  key_dates: Record<string, string | null>;
  term_progress: { months_in: number; months_total: number } | null;
  external_ids: Array<{ key: string; label: string; value: string | null }>;
  clocks: Array<{ clock: string; level: string; days_to_due: number | null; consequence: string | null }>;
  overview: {
    snapshot: { version: number; tier: string | null; itc_profile: unknown; run_at: string } | null;
    stage_history: Array<{ from: string | null; to: string; at: string; by: string | null; via: string }>;
    last_event: { date: string; window: string | null; kw_delivered: string | null; ratio: string | null } | null;
  };
  checklist: Array<{ key: string; label: string; state: string; required: boolean; owner_role: string | null; done_at: string | null }>;
  documents: Array<{ id: string; type: string; title: string | null; status: string | null; envelope_id: string | null; signed_at: string | null }>;
  equipment: Array<{ id: string; serial: string; kind: string; sku: string | null; dom: boolean | null; status: string; replaced_by_id: string | null; rma_no: string | null }>;
  program: { enrollments: Array<{ app_no: string | null; rof_date: string | null; cof_date: string | null; status: string | null }>; locked_rates: Record<string, unknown> | null; connection_method: string | null; grid_profile: string | null; fw_version: string | null };
  service: {
    installer_of_record: Record<string, unknown> | null;
    warranty_end: string | null;
    tickets: Array<{ id: string; category: string; severity: string | null; state: string; warranty_flag: boolean }>;
    open_alerts: Array<{ id: string; rule_key: string | null; severity: string; trigger: string | null }>;
    turnovers: Array<{ id: string; opened_at: string; sla_due: string | null; closed_at: string | null }>;
  };
  money: {
    ledger: Array<{ id: string; type: string; season: string | null; expected_amt: string | null; received_amt: string | null; status: string }>;
    claim: { status: string; basis_amt: string | null; total_pct: string | null; credit_amt: string | null; in_recapture: boolean; cohort: { label: string; status: string } | null } | null;
  };
  performance: { events: Array<{ date: string; window: string | null; kw_delivered: string | null; ratio: string | null }> };
};

type Tab = "overview" | "checklist" | "documents" | "equipment" | "program" | "performance" | "service" | "money";

const TABS: Array<{ id: Tab; label: string; liveOnly?: boolean }> = [
  { id: "overview", label: "Overview" },
  { id: "checklist", label: "Checklist" },
  { id: "documents", label: "Documents" },
  { id: "equipment", label: "Equipment" },
  { id: "program", label: "Program & Utility" },
  { id: "performance", label: "Performance", liveOnly: true },
  { id: "service", label: "Service" },
  { id: "money", label: "Money" },
];

const d = (v: string | null | undefined) => (v ? new Date(v).toLocaleDateString("en-US", { timeZone: "America/New_York" }) : "—");

export default function SystemClient() {
  const [id, setId] = useState<string | null>(null);
  const [lens, setLens] = useState<"op" | "pipe">("pipe");
  const [sys, setSys] = useState<SystemDetail | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [error, setError] = useState("");
  const [unmet, setUnmet] = useState<{ gate: string; items: Unmet[] } | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  // id and lens both live in the URL (D6).
  useEffect(() => {
    const sync = () => {
      const q = new URLSearchParams(window.location.search);
      setId(q.get("id"));
      const l = q.get("lens");
      if (l === "op" || l === "pipe") setLens(l);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const load = useCallback(async () => {
    if (!id) return;
    setError("");
    try {
      const data = await lcGet<SystemDetail>(`/api/systems/${id}`);
      setSys(data);
      // No explicit lens in the URL → follow the system's own.
      if (!new URLSearchParams(window.location.search).get("lens")) setLens(data.lens);
    } catch (e) {
      setError(isApiError(e) ? e.message : "Failed to load the system");
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  function setLensUrl(next: "op" | "pipe") {
    setLens(next);
    const url = new URL(window.location.href);
    url.searchParams.set("lens", next);
    window.history.pushState({}, "", url.toString());
  }

  async function patchItem(key: string, state: "DONE" | "OPEN") {
    if (!id) return;
    setBusy(true);
    setNote("");
    setUnmet(null);
    try {
      await lcPost(`/api/systems/${id}/checklist`, { key, state });
      await load();
    } catch (e) {
      setNote(isApiError(e) ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  async function advance() {
    if (!id) return;
    setBusy(true);
    setNote("");
    setUnmet(null);
    try {
      const res = await advanceSystem(id);
      setNote(`Advanced to ${STAGE_NAME[res.system.stage] ?? res.system.stage} · via ${res.history.via} · stage_history +1`);
      await load();
    } catch (e) {
      if (isApiError(e) && e.code === "GATE_UNMET") setUnmet({ gate: String(e.gate), items: e.unmet ?? [] });
      else setNote(isApiError(e) ? e.message : "Advance failed");
    } finally {
      setBusy(false);
    }
  }

  if (!id) return <div className="lc"><div className="ltoast" style={{ borderLeftColor: "var(--r)" }}>No system selected.</div></div>;
  if (error) return <div className="lc"><div className="ltoast" style={{ borderLeftColor: "var(--r)" }}>{error}</div></div>;
  if (!sys) return <div className="lc"><div className="stamp">Loading the record…</div></div>;

  const gateClear = sys.gate.unmet.length === 0;
  const visibleTabs = TABS.filter((t) => !t.liveOnly || sys.is_live);

  return (
    <div className="lc">
      {/* ── header ───────────────────────────────── */}
      <div className="shead">
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 27, fontWeight: 400, margin: 0 }}>
            {sys.address ?? sys.unit_label ?? "System"}
          </h1>
          <div className="sub">
            {sys.resident?.name && <>Resident <b>{sys.resident.name}</b> · </>}
            {sys.property?.name && (
              <Link href={`/portal/properties?id=${sys.property.id}`} style={{ color: "var(--gd)" }}>
                {sys.property.name}
              </Link>
            )}
            {sys.property?.account && <> · <b>{sys.property.account.name}</b></>}
            {sys.property?.town && <> · {sys.property.town}</>}
            {"  "}
            {sys.tier && <Def k={sys.tier === "UNDERSERVED" ? "UND" : sys.tier} className={`lpill ${sys.tier === "LI" ? "li" : "und"}`}>{sys.tier === "UNDERSERVED" ? "UND" : sys.tier}</Def>}{" "}
            {sys.grid_edge && <Def k="GE" className="lpill ge">GE</Def>}{" "}
            {sys.flags.map((f) => <Def key={f} k={f} className="stchip a">{f}</Def>)}
          </div>
        </div>
        <div className="right">
          <div className="lens">
            <button type="button" className={`lb${lens === "pipe" ? " on" : ""}`} onClick={() => setLensUrl("pipe")}>
              <i />In delivery · {sys.stage_code}
            </button>
            <button type="button" className={`lb${lens === "op" ? " on" : ""}`} onClick={() => setLensUrl("op")}>
              <i />Operating{sys.term_progress ? ` · month ${sys.term_progress.months_in}` : ""}
            </button>
          </div>
          <div className="principle">L2 · One record — the lens follows the stage</div>
        </div>
      </div>

      <div className="sec card pad">
        {/* ── delivery lens: the stage ribbon ─────── */}
        {lens === "pipe" && (
          <div className="ribbonwrap">
            <div className="ribbon">
              {STAGE_ORDER.slice(0, 9).map((st, i) => {
                const done = i < sys.stage_index;
                const cur = i === sys.stage_index;
                return (
                  <div
                    key={st}
                    className={`rst${done ? " done" : ""}${cur ? " cur" : ""}${cur && sys.blocked ? " blkd" : ""}`}
                    style={{ ["--rc" as string]: stageVar(st) }}
                  >
                    <div className="rd" />
                    <div className="rl">{st.slice(0, 3)}</div>
                    <div className="rn">{STAGE_NAME[st]}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "right", marginTop: 6 }}>
              <button type="button" className="lifelink" onClick={openLifecycleMap}>
                What happens at each stage →
              </button>
            </div>
          </div>
        )}

        {/* ── operating lens: health + term bar ───── */}
        {lens === "op" && (
          <div className="row" style={{ gap: 22, flexWrap: "wrap", alignItems: "center" }}>
            <Def
              k={sys.health ?? ""}
              className={`hchip ${sys.health === "FAULT" ? "h-fault" : sys.health === "WATCH" ? "h-watch" : sys.health === "SERVICE" ? "h-svc" : "h-ok"}`}
            >
              <>
                <i />
                {sys.health ?? "—"}
              </>
            </Def>
            {sys.term_progress ? (
              <div style={{ flex: 1, minWidth: 220 }}>
                <div className="lgl">
                  Performance term · month {sys.term_progress.months_in} of {sys.term_progress.months_total}
                </div>
                <div className="meter" style={{ marginTop: 4 }}>
                  <i style={{ width: `${Math.min(100, (sys.term_progress.months_in / sys.term_progress.months_total) * 100)}%`, background: "var(--sop)" }} />
                </div>
              </div>
            ) : (
              <span className="stamp">Term starts at <Abbr k="COF" />.</span>
            )}
            {sys.overview.last_event && (
              <div className="lstat">
                <div className="l">Last event</div>
                <div className="v">
                  {Number(sys.overview.last_event.kw_delivered ?? 0).toFixed(1)} kW
                  {sys.overview.last_event.ratio != null && (
                    <span className="mut"> · {Math.round(Number(sys.overview.last_event.ratio) * 100)}%</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── blocked banner ──────────────────────── */}
        {sys.blocked && (
          <div className="blockbanner">
            <Def k={sys.blocked.code} className="code">{sys.blocked.code}</Def>
            <span>
              {sys.blocked.label ?? "Blocked"}
              {sys.blocked.note ? ` — ${sys.blocked.note}` : ""}
              {sys.blocked.age_days != null ? ` · ${sys.blocked.age_days}d` : ""}
            </span>
            <span className="stamp" style={{ marginLeft: "auto" }}>
              Blocked is never backward — the stage stays at {sys.stage_code}.
            </span>
          </div>
        )}
        {sys.terminal && (
          <div className="blockbanner" style={{ background: "var(--sf3)", borderColor: "var(--bd2)" }}>
            <span className="code" style={{ color: "var(--t2)" }}>{sys.terminal.state}</span>
            <span>{sys.terminal.reason ?? ""} · stage preserved at {sys.stage_code}</span>
          </div>
        )}

        {/* ── next action ─────────────────────────── */}
        <div className="nextact">
          <span className="lgl">Next action</span>
          <b>{sys.next_action.label}</b>
          {sys.next_action.owner_role && <span className="ltag">{sys.next_action.owner_role}</span>}
          {sys.days_in_stage != null && <span className="stamp" style={{ marginLeft: "auto" }}>{sys.days_in_stage}d in {sys.stage_code}</span>}
        </div>

        {/* ── key dates + external IDs ────────────── */}
        <div className="row" style={{ gap: 22, flexWrap: "wrap", marginTop: 12 }}>
          {[
            ["ROF", sys.key_dates.rof_date],
            ["ROF deadline", sys.key_dates.rof_deadline],
            ["Install", sys.key_dates.install_date],
            ["PIS", sys.key_dates.pis_date],
            ["COF", sys.key_dates.cof_date],
            ["Term end", sys.key_dates.term_end],
          ].map(([label, value]) => (
            <div className="lstat" key={label as string}>
              <div className="l">{["ROF", "COF", "PIS"].includes(label as string) ? <Abbr k={label as string} /> : label}</div>
              <div className="v" style={{ fontSize: 13 }}>{d(value as string | null)}</div>
            </div>
          ))}
        </div>

        <div className="row" style={{ gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          {sys.external_ids.map((x) => (
            <Def key={x.key} k={x.key} className="xidchip">
              <>
                <b>{x.key}</b> {x.value ?? "—"}
              </>
            </Def>
          ))}
        </div>
      </div>

      {/* ── tabs ─────────────────────────────────── */}
      <div className="sec">
        <div className="subtabs" style={{ marginBottom: 12, flexWrap: "wrap" }}>
          {visibleTabs.map((t) => (
            <button key={t.id} type="button" className={`st${tab === t.id ? " on" : ""}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {note && <div className="ltoast" style={{ marginBottom: 10 }}>{note}</div>}

        {tab === "overview" && (
          <div className="card pad">
            <div className="cardlbl">Qualification snapshot</div>
            {sys.overview.snapshot ? (
              <div className="stamp">
                v{sys.overview.snapshot.version} · tier {sys.overview.snapshot.tier} · run{" "}
                {d(sys.overview.snapshot.run_at)} · <Abbr k="ITC" /> profile{" "}
                {JSON.stringify(sys.overview.snapshot.itc_profile)}
              </div>
            ) : (
              <div className="stamp">No snapshot yet.</div>
            )}
            <div className="cardlbl" style={{ marginTop: 16 }}>Activity — stage history</div>
            <table className="lct">
              <tbody>
                {sys.overview.stage_history.map((h, i) => (
                  <tr key={i}>
                    <td className="num">{d(h.at)}</td>
                    <td>{h.from ?? "—"} → <b>{h.to}</b></td>
                    <td className="num">{h.via}</td>
                    <td className="num">{h.by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "checklist" && (
          <div className="card pad">
            <div className="cardlbl">
              <span>{sys.stage_code} checklist</span>
              <button type="button" className="btn pri sm" disabled={busy || !gateClear || Boolean(sys.blocked)} onClick={advance}>
                Advance
              </button>
            </div>

            {unmet && (
              <div className="gatepop" style={{ marginBottom: 10 }}>
                <b>GATE {unmet.gate} · ADVANCE REFUSED</b>
                {unmet.items.map((u) => u.label).join(" · ")}
              </div>
            )}

            {sys.checklist.length === 0 && <div className="stamp">No checklist at this stage.</div>}
            {sys.checklist.map((c) => (
              <div className="gline" key={c.key}>
                <input
                  type="checkbox"
                  checked={c.state === "DONE"}
                  disabled={busy || c.state === "NA"}
                  onChange={() => patchItem(c.key, c.state === "DONE" ? "OPEN" : "DONE")}
                  style={{ accentColor: "var(--gd)", width: 15, height: 15 }}
                  aria-label={c.label}
                />
                <span style={{ textDecoration: c.state === "DONE" ? "line-through" : undefined, opacity: c.state === "NA" ? 0.5 : 1 }}>
                  {c.label}
                </span>
                {c.state === "NA" && <span className="ltag">N/A</span>}
                {!c.required && <span className="ltag">optional</span>}
                {c.owner_role && <span className="ltag">{c.owner_role}</span>}
                {c.done_at && <span className="stamp" style={{ marginLeft: "auto" }}>{d(c.done_at)}</span>}
              </div>
            ))}

            {!gateClear && (
              <div className="stamp" style={{ marginTop: 10 }}>
                Gate {sys.gate.stage} — {sys.gate.unmet.length} unmet: {sys.gate.unmet.map((u) => u.label).join(" · ")}
              </div>
            )}
          </div>
        )}

        {tab === "documents" && (
          <div className="card tblscroll">
            <table className="lct">
              <thead><tr><th>Type</th><th>Title</th><th>Status</th><th>Envelope</th><th>Signed</th></tr></thead>
              <tbody>
                {sys.documents.length === 0 && <tr><td colSpan={5} className="t2">No documents.</td></tr>}
                {sys.documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="num">{doc.type}</td>
                    <td>{doc.title ?? "—"}</td>
                    <td className="num">{doc.status ?? "—"}</td>
                    <td className="num">{doc.envelope_id ?? "—"}</td>
                    <td className="num">{d(doc.signed_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "equipment" && (
          <div className="card tblscroll">
            <table className="lct">
              <thead><tr><th>Serial</th><th>Kind</th><th>SKU</th><th>DOM</th><th>Status</th><th>RMA</th></tr></thead>
              <tbody>
                {sys.equipment.length === 0 && <tr><td colSpan={6} className="t2">No equipment recorded.</td></tr>}
                {sys.equipment.map((e) => (
                  <tr key={e.id}>
                    <td className="num"><b>{e.serial}</b></td>
                    <td className="num">{e.kind}</td>
                    <td className="num">{e.sku ?? "—"}</td>
                    <td className="num">{e.dom ? <Def k="DOM">DOM</Def> : "—"}</td>
                    <td className="num">{e.status}</td>
                    <td className="num">{e.rma_no ?? (e.replaced_by_id ? "replaced" : "—")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "program" && (
          <div className="card pad">
            <div className="cardlbl">Enrolment trail</div>
            <table className="lct">
              <thead><tr><th>App #</th><th><Abbr k="ROF" /></th><th><Abbr k="COF" /></th><th>Status</th></tr></thead>
              <tbody>
                {sys.program.enrollments.map((e, i) => (
                  <tr key={i}><td className="num">{e.app_no ?? "—"}</td><td className="num">{d(e.rof_date)}</td><td className="num">{d(e.cof_date)}</td><td className="num">{e.status ?? "—"}</td></tr>
                ))}
              </tbody>
            </table>
            <div className="cardlbl" style={{ marginTop: 16 }}>Locked rates &amp; connection</div>
            <div className="stamp">
              {sys.program.locked_rates ? JSON.stringify(sys.program.locked_rates) : "Rates lock at ROF."} ·{" "}
              {sys.program.connection_method ? <Def k={sys.program.connection_method}>{sys.program.connection_method}</Def> : "—"} ·{" "}
              grid profile {sys.program.grid_profile ?? "—"} · fw {sys.program.fw_version ?? "—"}
            </div>
          </div>
        )}

        {tab === "performance" && (
          <div className="card tblscroll">
            <table className="lct">
              <thead><tr><th>Date</th><th>Window</th><th>kW nom</th><th>kW del</th><th>Ratio</th></tr></thead>
              <tbody>
                {sys.performance.events.length === 0 && <tr><td colSpan={5} className="t2">No events yet.</td></tr>}
                {sys.performance.events.map((e, i) => (
                  <tr key={i}>
                    <td className="num">{d(e.date)}</td>
                    <td className="num">{e.window ?? "—"}</td>
                    <td className="num">{e.kw_delivered != null ? Number(e.kw_delivered).toFixed(1) : "—"}</td>
                    <td className="num">{e.kw_delivered != null ? Number(e.kw_delivered).toFixed(1) : "—"}</td>
                    <td className="num">{e.ratio != null ? `${Math.round(Number(e.ratio) * 100)}%` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "service" && (
          <div className="card pad">
            <div className="cardlbl">Installer of record — always displayed</div>
            <div className="stamp">
              {sys.service.installer_of_record
                ? JSON.stringify(sys.service.installer_of_record)
                : "Not stamped yet — written at S07 check-out."}
              {sys.service.warranty_end && <> · workmanship to {d(sys.service.warranty_end)}</>}
            </div>
            <div className="cardlbl" style={{ marginTop: 16 }}>Tickets</div>
            {sys.service.tickets.length === 0 && <div className="stamp">No tickets.</div>}
            {sys.service.tickets.map((t) => (
              <div className="gline" key={t.id}>
                <i />
                {t.category} · <Def k={t.state}>{t.state}</Def>
                {t.warranty_flag && <span className="stchip a">WARRANTY</span>}
              </div>
            ))}
            {sys.service.turnovers.filter((t) => !t.closed_at).length > 0 && (
              <>
                <div className="cardlbl" style={{ marginTop: 16 }}>Open turnover</div>
                {sys.service.turnovers.filter((t) => !t.closed_at).map((t) => (
                  <div className="stamp" key={t.id}>Opened {d(t.opened_at)} · <Abbr k="SLA" /> due {d(t.sla_due)}</div>
                ))}
              </>
            )}
          </div>
        )}

        {tab === "money" && (
          <div className="card pad">
            <div className="cardlbl">Ledger</div>
            <table className="lct">
              <thead><tr><th>Type</th><th>Season</th><th>Expected</th><th>Received</th><th>Status</th></tr></thead>
              <tbody>
                {sys.money.ledger.length === 0 && <tr><td colSpan={5} className="t2">Nothing booked yet.</td></tr>}
                {sys.money.ledger.map((l) => (
                  <tr key={l.id}>
                    <td className="num">{l.type}</td>
                    <td className="num">{l.season ?? "—"}</td>
                    <td className="num">{l.expected_amt ? `$${Number(l.expected_amt).toLocaleString("en-US")}` : "—"}</td>
                    <td className="num">{l.received_amt ? `$${Number(l.received_amt).toLocaleString("en-US")}` : "—"}</td>
                    <td><Def k={l.status} className={`stchip ${l.status === "VARIANCE" ? "r" : l.status === "RECEIVED" ? "g" : ""}`}>{l.status}</Def></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cardlbl" style={{ marginTop: 16 }}><Abbr k="ITC" /> claim</div>
            {sys.money.claim ? (
              <div className="stamp">
                <Def k={sys.money.claim.status}>{sys.money.claim.status}</Def> · basis{" "}
                {sys.money.claim.basis_amt ? `$${Number(sys.money.claim.basis_amt).toLocaleString("en-US")}` : "—"} · stack{" "}
                {sys.money.claim.total_pct ?? "—"}% · credit{" "}
                {sys.money.claim.credit_amt ? `$${Number(sys.money.claim.credit_amt).toLocaleString("en-US")}` : "—"}
                {sys.money.claim.cohort && <> · cohort {sys.money.claim.cohort.label}</>}
                {sys.money.claim.in_recapture && <> · <span style={{ color: "var(--a)" }}>inside recapture</span></>}
              </div>
            ) : (
              <div className="stamp">No claim — one opens ACCRUING at S05.</div>
            )}
          </div>
        )}
      </div>

      <div className="stamp">
        <Link href="/portal/pipeline" style={{ color: "var(--gd)" }}>← Pipeline</Link>
        {sys.property && <> · <Link href={`/portal/properties?id=${sys.property.id}`} style={{ color: "var(--gd)" }}>Property</Link></>}
      </div>
    </div>
  );
}
