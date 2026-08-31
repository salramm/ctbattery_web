"use client";

/**
 * Money — three desks (03 §Money).
 *
 *   Incentives — the enrollment and seasonal ledger, expected vs received,
 *                with the season close and the two CSV imports.
 *   ITC        — claims, allocations, cohorts, recapture watch, diligence pack.
 *   P&L        — per-system NOI rolled to property and fleet, plus the export.
 *
 * "A ledger, not accounting software": every figure on this screen is a row in
 * `ledger_entries` or a claim record, never a projection. Expected and received
 * are always shown apart — the moment they merge, a forecast starts reading as
 * revenue.
 *
 * The desk lives in the URL (D6) so a link can land on the ITC desk directly.
 */

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";
import { isApiError, lcGet, lcPost } from "@/lib/lifecycle";

type Desk = "incentives" | "itc" | "pnl";

type Bucket = { enroll_inc: number; perf_pay: number; itc_cash: number; opex: number; service_cost: number; noi: number };

type Incentives = {
  seasons: Array<{ id: string; name: string; program_year: number; window: { start?: string; end?: string } | null; status: string }>;
  rows: Array<{
    id: string;
    system_id: string;
    address: string | null;
    property: string | null;
    type: string;
    season: string | null;
    expected_amt: number | null;
    expected_date: string | null;
    received_amt: number | null;
    received_date: string | null;
    variance_pct: number | null;
    status: string;
  }>;
  totals: { expected: number; received: number; variances: number };
};

type Claims = {
  claims: Array<{
    id: string;
    system_id: string;
    address: string | null;
    tier: string | null;
    status: string;
    basis_amt: number | null;
    total_pct: number | null;
    credit_amt: number | null;
    in_recapture: boolean;
    recapture_days_left: number | null;
    evidence_complete: boolean;
    basis_lines: Array<{ source: string; amount: number; sourced: boolean }>;
    cohort: { id: string; label: string; status: string } | null;
  }>;
  counts: Record<string, number>;
  totals: { basis: number; credit: number; in_recapture: number };
};

type Allocation = {
  id: string;
  program_year: number;
  category: string;
  kw_applied: number | null;
  kw_awarded: number;
  kw_consumed: number;
  kw_remaining: number;
  current_year: boolean;
};

type Cohort = {
  id: string;
  label: string;
  status: string;
  nominal_amt: number | null;
  price_cents: number | null;
  buyer: string | null;
  claim_count: number;
  nominal_from_claims: number;
};

type Recapture = Array<{
  claim_id: string;
  system_id: string;
  address: string | null;
  credit_amt: number | null;
  recapture_end: string | null;
  days_left: number | null;
  clawback_if_removed_now: number | null;
}>;

type Pnl = {
  systems: Array<{
    system_id: string;
    address: string | null;
    property: string | null;
    tier: string | null;
    kw_rated: number | null;
    expected: Bucket;
    received: Bucket;
    outstanding: number;
  }>;
  properties: Array<{ property_id: string; property: string | null; systems: number; expected: Bucket; received: Bucket }>;
  fleet: { systems: number; expected: Bucket; received: Bucket; outstanding: number };
};

const usd = (v: number | null | undefined) =>
  v == null ? "—" : v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const COHORT_FLOW = ["ASSEMBLING", "LISTED", "TERM_SHEET", "DILIGENCE", "EXECUTED", "CASH_RECEIVED"];
const CLAIM_FLOW = ["ACCRUING", "BASIS_LOCKED", "EVIDENCE_COMPLETE", "IN_COHORT", "TRANSFERRED"];

export default function MoneyClient() {
  const router = useRouter();
  const [desk, setDesk] = useState<Desk>("incentives");
  const [incentives, setIncentives] = useState<Incentives | null>(null);
  const [claims, setClaims] = useState<Claims | null>(null);
  const [allocations, setAllocations] = useState<Allocation[] | null>(null);
  const [cohorts, setCohorts] = useState<Cohort[] | null>(null);
  const [recapture, setRecapture] = useState<Recapture | null>(null);
  const [pnl, setPnl] = useState<Pnl | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  // Desk lives in the URL (D6).
  useEffect(() => {
    const sync = () => {
      const d = new URLSearchParams(window.location.search).get("desk");
      setDesk(d === "itc" ? "itc" : d === "pnl" ? "pnl" : "incentives");
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const loadIncentives = useCallback(async () => {
    try {
      setIncentives(await lcGet<Incentives>("/api/money/incentives"));
    } catch (e) {
      setNote(isApiError(e) ? e.message : "Failed to load the ledger");
    }
  }, []);

  const loadItc = useCallback(async () => {
    try {
      const [c, a, co, r] = await Promise.all([
        lcGet<Claims>("/api/itc/claims"),
        lcGet<Allocation[]>("/api/itc/allocations"),
        lcGet<Cohort[]>("/api/itc/cohorts"),
        lcGet<Recapture>("/api/itc/recapture"),
      ]);
      setClaims(c);
      setAllocations(a);
      setCohorts(co);
      setRecapture(r);
    } catch (e) {
      setNote(isApiError(e) ? e.message : "Failed to load the ITC desk");
    }
  }, []);

  useEffect(() => {
    if (desk === "incentives" && !incentives) loadIncentives();
    if (desk === "itc" && !claims) loadItc();
    if (desk === "pnl" && !pnl) lcGet<Pnl>("/api/money/pnl").then(setPnl).catch(() => setNote("Failed to load the P&L"));
  }, [desk, incentives, claims, pnl, loadIncentives, loadItc]);

  function goDesk(next: Desk) {
    setDesk(next);
    router.push(next === "incentives" ? "/portal/money" : `/portal/money?desk=${next}`);
  }

  async function closeSeason(id: string) {
    setBusy(true);
    setNote("");
    try {
      const r = await lcPost<{ written: number; updated: number; total_expected: number; skipped: number }>(
        `/api/money/seasons/${id}/close`,
        { force: true },
      );
      setNote(
        `Season closed — ${r.written} written, ${r.updated} updated, ${r.skipped} skipped · ${usd(r.total_expected)} expected.`,
      );
      setIncentives(null);
      await loadIncentives();
    } catch (e) {
      setNote(isApiError(e) ? e.message : "Close failed");
    } finally {
      setBusy(false);
    }
  }

  async function upload(path: string, file: File, seasonId?: string) {
    setBusy(true);
    setNote("");
    const form = new FormData();
    form.append("file", file);
    if (seasonId) form.append("season_id", seasonId);
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getAuthToken() ?? ""}` },
        body: form,
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) throw new Error(json?.message ?? `Request failed (${res.status})`);
      const d = json.data;
      setNote(
        d.imported != null
          ? `Imported ${d.imported} · updated ${d.updated} · skipped ${d.skipped}.`
          : `Reconciled ${d.reconciled} · ${d.variances} variance${d.variances === 1 ? "" : "s"} · skipped ${d.skipped}.`,
      );
      setIncentives(null);
      await loadIncentives();
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  /** The pack is a binary download, so it goes through fetch → blob directly. */
  async function downloadPack(cohortId: string, label: string) {
    setBusy(true);
    setNote("");
    try {
      const res = await fetch(`${API_BASE}/api/itc/cohorts/${cohortId}/diligence`, {
        headers: { Authorization: `Bearer ${getAuthToken() ?? ""}` },
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message ?? `Request failed (${res.status})`);
      }
      const gaps = res.headers.get("X-Diligence-Gaps");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `diligence-${label}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setNote(gaps && gaps !== "0" ? `Pack downloaded with ${gaps} gap${gaps === "1" ? "" : "s"} — see README.txt.` : "Pack downloaded — no gaps.");
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Pack failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="lc">
      <div className="shead">
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 27, fontWeight: 400, margin: 0 }}>Money</h1>
          <div className="sub">
            What has been earned, what has been paid, and what the credits are worth. Expected and received never merge.
          </div>
        </div>
        <div className="right">
          <div className="principle">A ledger, not accounting software</div>
        </div>
      </div>

      <div className="sec">
        <div className="subtabs">
          {(["incentives", "itc", "pnl"] as Desk[]).map((d) => (
            <button key={d} type="button" className={`st${desk === d ? " on" : ""}`} onClick={() => goDesk(d)}>
              {d === "incentives" ? "Incentives" : d === "itc" ? "ITC desk" : "P&L"}
            </button>
          ))}
        </div>
      </div>

      {note && (
        <div className="sec ltoast" style={{ borderLeftColor: "var(--g)" }}>
          {note}
        </div>
      )}

      {/* ── Incentives ─────────────────────────────── */}
      {desk === "incentives" && (
        <>
          <div className="sec stripe">
            <div className="lstat">
              <div className="l">Expected</div>
              <div className="v">{usd(incentives?.totals.expected)}</div>
            </div>
            <div className="lstat">
              <div className="l">Received</div>
              <div className="v" style={{ color: "var(--gd)" }}>
                {usd(incentives?.totals.received)}
              </div>
            </div>
            <div className="lstat">
              <div className="l">Variances</div>
              <div className="v" style={{ color: incentives?.totals.variances ? "var(--r)" : undefined }}>
                {incentives?.totals.variances ?? 0}
              </div>
            </div>
          </div>

          <div className="sec card pad">
            <div className="cardlbl">Seasons</div>
            <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
              {incentives?.seasons.map((s) => (
                <span key={s.id} className="row" style={{ gap: 6 }}>
                  <span className={`stchip ${s.status === "RECONCILED" ? "g" : s.status === "CLOSED" ? "b" : ""}`}>
                    {s.name} {s.program_year} · {s.status}
                  </span>
                  {s.status !== "RECONCILED" && (
                    <button type="button" className="btn sm" disabled={busy} onClick={() => closeSeason(s.id)}>
                      Close season
                    </button>
                  )}
                </span>
              ))}
              {incentives?.seasons.length === 0 && <span className="stamp">No seasons defined.</span>}
            </div>

            <div className="row" style={{ gap: 18, marginTop: 14, flexWrap: "wrap" }}>
              <label className="btn sm" style={{ cursor: "pointer" }}>
                Import dispatch CSV
                <input
                  type="file"
                  accept=".csv,text/csv"
                  style={{ display: "none" }}
                  onChange={(e) => e.target.files?.[0] && upload("/api/money/events/import", e.target.files[0])}
                />
              </label>
              <label className="btn sm" style={{ cursor: "pointer" }}>
                Import statement CSV
                <input
                  type="file"
                  accept=".csv,text/csv"
                  style={{ display: "none" }}
                  onChange={(e) => e.target.files?.[0] && upload("/api/money/statements/import", e.target.files[0])}
                />
              </label>
              <span className="stamp">
                Dispatch rows land in <code>events</code>; the statement reconciles onto the same PERF_PAY rows.
              </span>
            </div>
          </div>

          <div className="sec card tblscroll">
            <table className="lct">
              <thead>
                <tr>
                  <th>System</th>
                  <th>Type</th>
                  <th>Season</th>
                  <th>Expected</th>
                  <th>Received</th>
                  <th>Variance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {!incentives && (
                  <tr>
                    <td colSpan={7} className="t2">
                      Loading…
                    </td>
                  </tr>
                )}
                {incentives?.rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="t2">
                      No ledger rows yet — enrollment books at COF, performance at season close.
                    </td>
                  </tr>
                )}
                {incentives?.rows.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <b>{r.address ?? r.system_id}</b>
                    </td>
                    <td className="num">{r.type}</td>
                    <td className="num">{r.season ?? "—"}</td>
                    <td className="num">{usd(r.expected_amt)}</td>
                    <td className="num">{usd(r.received_amt)}</td>
                    <td className="num" style={{ color: r.status === "VARIANCE" ? "var(--r)" : undefined }}>
                      {r.variance_pct == null ? "—" : `${r.variance_pct > 0 ? "+" : ""}${r.variance_pct}%`}
                    </td>
                    <td>
                      <span className={`stchip ${r.status === "VARIANCE" ? "r" : r.status === "RECEIVED" ? "g" : ""}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── ITC desk ───────────────────────────────── */}
      {desk === "itc" && (
        <>
          <div className="sec stripe">
            <div className="lstat">
              <div className="l">Claims</div>
              <div className="v">{claims?.claims.length ?? 0}</div>
            </div>
            <div className="lstat">
              <div className="l">Basis</div>
              <div className="v">{usd(claims?.totals.basis)}</div>
            </div>
            <div className="lstat">
              <div className="l">Credit</div>
              <div className="v" style={{ color: "var(--gd)" }}>
                {usd(claims?.totals.credit)}
              </div>
            </div>
            <div className="lstat">
              <div className="l">In recapture</div>
              <div className="v">{claims?.totals.in_recapture ?? 0}</div>
            </div>
          </div>

          <div className="sec card pad">
            <div className="cardlbl">Claim states</div>
            <div className="cpipe">
              {CLAIM_FLOW.map((s) => (
                <i key={s} className={(claims?.counts[s] ?? 0) > 0 ? "f" : ""}>
                  {s} · {claims?.counts[s] ?? 0}
                </i>
              ))}
            </div>
          </div>

          <div className="sec card tblscroll">
            <table className="lct">
              <thead>
                <tr>
                  <th>System</th>
                  <th>Tier</th>
                  <th>Status</th>
                  <th>Basis</th>
                  <th>Stack</th>
                  <th>Credit</th>
                  <th>Evidence</th>
                  <th>Cohort</th>
                </tr>
              </thead>
              <tbody>
                {claims?.claims.length === 0 && (
                  <tr>
                    <td colSpan={8} className="t2">
                      No claims yet — a claim opens ACCRUING at S05.
                    </td>
                  </tr>
                )}
                {claims?.claims.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <b>{c.address ?? c.system_id}</b>
                      {c.in_recapture && (
                        <span className="stchip a" style={{ marginLeft: 5 }} title={`${c.recapture_days_left} days left`}>
                          RECAPTURE
                        </span>
                      )}
                    </td>
                    <td className="num">{c.tier ?? "—"}</td>
                    <td>
                      <span className="stchip">{c.status}</span>
                    </td>
                    <td className="num">{usd(c.basis_amt)}</td>
                    <td className="num">{c.total_pct == null ? "—" : `${c.total_pct}%`}</td>
                    <td className="num">{usd(c.credit_amt)}</td>
                    <td className="num" style={{ color: c.evidence_complete ? "var(--gd)" : "var(--a)" }}>
                      {c.evidence_complete ? "complete" : "owed"}
                    </td>
                    <td className="num">{c.cohort?.label ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sec grid2" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="card pad">
              <div className="cardlbl">48E(h) allocations</div>
              <table className="lct">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Cat</th>
                    <th>Applied</th>
                    <th>Awarded</th>
                    <th>Consumed</th>
                    <th>Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations?.length === 0 && (
                    <tr>
                      <td colSpan={6} className="t2">
                        No allocations on file.
                      </td>
                    </tr>
                  )}
                  {allocations?.map((a) => (
                    <tr key={a.id}>
                      <td className="num">{a.program_year}</td>
                      <td className="num">{a.category}</td>
                      <td className="num">{a.kw_applied ?? "—"}</td>
                      <td className="num">{a.kw_awarded}</td>
                      <td className="num">{a.kw_consumed}</td>
                      <td className="num" style={{ color: a.kw_remaining <= 0 ? "var(--r)" : "var(--gd)" }}>
                        {a.kw_remaining} kW
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="stamp" style={{ marginTop: 8 }}>
                A claim cannot carry the LI adder without remaining kW; linking consumes it.
              </div>
            </div>

            <div className="card pad">
              <div className="cardlbl">Cohorts</div>
              {cohorts?.length === 0 && <div className="stamp">No cohorts assembled.</div>}
              {cohorts?.map((c) => (
                <div key={c.id} style={{ marginBottom: 12 }}>
                  <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <span>
                      <b>{c.label}</b>{" "}
                      <span className="stamp">
                        {c.claim_count} claim{c.claim_count === 1 ? "" : "s"} · {usd(c.nominal_from_claims)} nominal
                        {c.buyer ? ` · ${c.buyer}` : ""}
                      </span>
                    </span>
                    <button type="button" className="btn sm" disabled={busy || c.claim_count === 0} onClick={() => downloadPack(c.id, c.label)}>
                      Assemble diligence ZIP
                    </button>
                  </div>
                  <div className="cpipe" style={{ marginTop: 6 }}>
                    {COHORT_FLOW.map((s) => (
                      <i key={s} className={s === c.status ? "cur" : COHORT_FLOW.indexOf(s) < COHORT_FLOW.indexOf(c.status) ? "f" : ""}>
                        {s.replace("_", " ")}
                      </i>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sec card pad">
            <div className="cardlbl">Recapture watch</div>
            {recapture?.length === 0 && <div className="stamp">No systems inside the 60-month recapture window.</div>}
            {recapture && recapture.length > 0 && (
              <table className="lct">
                <thead>
                  <tr>
                    <th>System</th>
                    <th>Credit</th>
                    <th>Recapture ends</th>
                    <th>Days left</th>
                    <th>Clawback if removed now</th>
                  </tr>
                </thead>
                <tbody>
                  {recapture.map((r) => (
                    <tr key={r.claim_id}>
                      <td>
                        <b>{r.address ?? r.system_id}</b>
                      </td>
                      <td className="num">{usd(r.credit_amt)}</td>
                      <td className="num">{r.recapture_end ? new Date(r.recapture_end).toLocaleDateString() : "—"}</td>
                      <td className="num">{r.days_left ?? "—"}</td>
                      <td className="num" style={{ color: "var(--r)" }}>
                        {usd(r.clawback_if_removed_now)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* ── P&L ────────────────────────────────────── */}
      {desk === "pnl" && (
        <>
          <div className="sec stripe">
            <div className="lstat">
              <div className="l">Systems</div>
              <div className="v">{pnl?.fleet.systems ?? 0}</div>
            </div>
            <div className="lstat">
              <div className="l">NOI expected</div>
              <div className="v">{usd(pnl?.fleet.expected.noi)}</div>
            </div>
            <div className="lstat">
              <div className="l">NOI received</div>
              <div className="v" style={{ color: "var(--gd)" }}>
                {usd(pnl?.fleet.received.noi)}
              </div>
            </div>
            <div className="lstat">
              <div className="l">Outstanding</div>
              <div className="v" style={{ color: pnl?.fleet.outstanding ? "var(--a)" : undefined }}>
                {usd(pnl?.fleet.outstanding)}
              </div>
            </div>
          </div>

          <div className="sec row" style={{ justifyContent: "flex-end" }}>
            <a className="btn sm" href={`${API_BASE}/api/money/pnl.csv`} onClick={(e) => {
              // The export needs the bearer token, so fetch it rather than
              // navigating (a plain link would arrive unauthenticated).
              e.preventDefault();
              fetch(`${API_BASE}/api/money/pnl.csv`, { headers: { Authorization: `Bearer ${getAuthToken() ?? ""}` } })
                .then((r) => r.blob())
                .then((b) => {
                  const url = URL.createObjectURL(b);
                  const a2 = document.createElement("a");
                  a2.href = url;
                  a2.download = "pnl.csv";
                  a2.click();
                  URL.revokeObjectURL(url);
                })
                .catch(() => setNote("Export failed"));
            }}>
              Export CSV
            </a>
          </div>

          <div className="sec card tblscroll">
            <table className="lct">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Systems</th>
                  <th>Enroll</th>
                  <th>Performance</th>
                  <th>ITC cash</th>
                  <th>NOI received</th>
                </tr>
              </thead>
              <tbody>
                {pnl?.properties.length === 0 && (
                  <tr>
                    <td colSpan={6} className="t2">
                      Nothing booked yet.
                    </td>
                  </tr>
                )}
                {pnl?.properties.map((p) => (
                  <tr key={p.property_id}>
                    <td>
                      <b>{p.property ?? "Unassigned"}</b>
                    </td>
                    <td className="num">{p.systems}</td>
                    <td className="num">{usd(p.received.enroll_inc)}</td>
                    <td className="num">{usd(p.received.perf_pay)}</td>
                    <td className="num">{usd(p.received.itc_cash)}</td>
                    <td className="num" style={{ color: "var(--gd)" }}>
                      {usd(p.received.noi)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
