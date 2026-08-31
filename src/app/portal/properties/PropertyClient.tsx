"use client";

/**
 * Property page — the batch surface (03 §Property page).
 *
 * The unit is the atom; this screen is where you act on many of them at once.
 * Batch buttons carry their own precondition count and, after running, print
 * the server's per-unit result list verbatim — "5 submitted · 1 skipped: 3B —
 * missing T&C". No action decides anything client-side.
 *
 * Static export means no runtime dynamic segments, so the property id rides in
 * the query string (?id=…), matching the existing /portal/ess-contractors/profile
 * convention.
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Def } from "../Abbr";
import {
  isApiError,
  lcGet,
  lcPost,
  stageVar,
  STAGE_NAME,
  type BatchAction,
  type BatchRun,
  type PropertyDetail,
  type PropertyUnit,
} from "@/lib/lifecycle";

type Tab = "units" | "documents" | "contacts" | "activity";

type Doc = {
  id: string;
  type: string;
  title: string | null;
  status: string | null;
  envelope_id: string | null;
  signed_at: string | null;
  system_id: string | null;
  created_at: string;
};

type Activity = {
  id: string;
  system_id: string;
  action: string;
  actor: string | null;
  at: string;
  meta: unknown;
};

const BATCH_LABEL: Array<{ action: BatchAction; label: string; primary?: boolean }> = [
  { action: "qualify_all", label: "Qualify all" },
  { action: "generate_esas", label: "Generate ESAs" },
  { action: "submit_cgb_apps", label: "Submit CGB apps", primary: true },
  { action: "build_install_week", label: "Build install week" },
  { action: "submit_completion_pkgs", label: "Submit completion pkgs" },
];

/** Which stage each action acts on, for the button's caption. */
const BATCH_AT: Record<BatchAction, string> = {
  qualify_all: "S01",
  generate_esas: "S02",
  submit_cgb_apps: "S03/S04",
  build_install_week: "S06",
  submit_completion_pkgs: "S08",
};

export default function PropertyClient() {
  const [id, setId] = useState<string | null>(null);
  const [detail, setDetail] = useState<PropertyDetail | null>(null);
  const [tab, setTab] = useState<Tab>("units");
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [activity, setActivity] = useState<Activity[] | null>(null);
  const [run, setRun] = useState<BatchRun | null>(null);
  const [running, setRunning] = useState<BatchAction | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("id");
    if (!q) {
      setError("No property selected.");
      return;
    }
    setId(q);
  }, []);

  const load = useCallback(async () => {
    if (!id) return;
    setError("");
    try {
      setDetail(await lcGet<PropertyDetail>(`/api/properties/${id}`));
    } catch (e) {
      setError(isApiError(e) ? e.message : "Failed to load the property");
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!id) return;
    if (tab === "documents" && !docs) lcGet<Doc[]>(`/api/properties/${id}/documents`).then(setDocs).catch(() => setDocs([]));
    if (tab === "activity" && !activity)
      lcGet<Activity[]>(`/api/properties/${id}/activity`).then(setActivity).catch(() => setActivity([]));
  }, [tab, id, docs, activity]);

  async function runBatch(action: BatchAction) {
    if (!id) return;
    setRunning(action);
    setRun(null);
    try {
      const result = await lcPost<BatchRun>(`/api/properties/${id}/batch`, { action });
      setRun(result);
      await load(); // stages moved — refresh the meter and grid
    } catch (e) {
      setError(isApiError(e) ? e.message : "Batch failed");
    } finally {
      setRunning(null);
    }
  }

  if (error && !detail) {
    return (
      <div className="lc">
        <div className="ltoast" style={{ borderLeftColor: "var(--r)" }}>
          {error}
        </div>
      </div>
    );
  }
  if (!detail) {
    return (
      <div className="lc">
        <div className="stamp">Loading property…</div>
      </div>
    );
  }

  const { property, release_meter: meter, units, contacts, batch_counts: counts } = detail;
  const activeUnits = meter.active || 1;

  return (
    <div className="lc">
      <div className="shead">
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 27, fontWeight: 400, margin: 0 }}>
            {property.name ?? property.address}
          </h1>
          <div className="sub">
            {property.address}
            {property.town ? `, ${property.town}` : ""}
            {property.account && (
              <>
                {" · "}
                <b>{property.account.name}</b>{" "}
                {property.master_agreement && <span className="stchip g">MASTER AGREEMENT ✓</span>}{" "}
                {property.account.deal_state && (
                  <span className="stchip g">{property.account.deal_state.replace("_", " · ")}</span>
                )}
              </>
            )}
          </div>
        </div>
        <div className="right">
          <div className="stamp">
            {meter.units} unit{meter.units === 1 ? "" : "s"}
            {meter.terminal > 0 ? ` · ${meter.terminal} terminal` : ""}
          </div>
          <div className="principle">The unit is the atom · the property is the working surface</div>
        </div>
      </div>

      {/* ── Release meter ───────────────────────────── */}
      <div className="sec card pad">
        <div className="cardlbl">Release meter</div>
        <div className="row" style={{ gap: 26, flexWrap: "wrap", marginBottom: 12 }}>
          <div className="lstat">
            <div className="l">ESAs signed</div>
            <div className="v">
              {meter.esas_signed}
              <span className="mut"> / {meter.active}</span>
            </div>
          </div>
          <div className="lstat">
            <div className="l">Applied</div>
            <div className="v">{meter.applied}</div>
          </div>
          <div className="lstat">
            <div className="l">ROF</div>
            <div className="v">{meter.rof}</div>
          </div>
          <div className="lstat">
            <div className="l">Installed</div>
            <div className="v">{meter.installed}</div>
          </div>
          <div className="lstat">
            <div className="l">Live</div>
            <div className="v" style={{ color: "var(--gd)" }}>
              {meter.live}
            </div>
          </div>
          <div className="lstat">
            <div className="l">Blocked</div>
            <div className="v" style={{ color: "var(--r)" }}>
              {meter.blocked}
            </div>
          </div>
        </div>

        <div className="meter">
          {[...meter.by_stage]
            .filter((s) => s.count > 0)
            .reverse()
            .map((s) => (
              <i
                key={s.stage}
                style={{ width: `${(s.count / activeUnits) * 100}%`, background: stageVar(s.stage) }}
                title={`${s.code} — ${s.count}`}
              />
            ))}
          {meter.terminal > 0 && (
            <i style={{ width: `${(meter.terminal / activeUnits) * 100}%`, background: "var(--bd)" }} title="Terminal" />
          )}
        </div>
        <div className="mlegend">
          {[...meter.by_stage]
            .filter((s) => s.count > 0)
            .reverse()
            .map((s) => (
              <div className="m" key={s.stage}>
                <i style={{ background: stageVar(s.stage) }} />
                {s.code} <b>{s.count}</b>
              </div>
            ))}
          {meter.terminal > 0 && (
            <div className="m">
              <i style={{ background: "var(--bd)" }} />
              Terminal <b>{meter.terminal}</b>
            </div>
          )}
        </div>
      </div>

      {/* ── Batch actions ───────────────────────────── */}
      <div className="sec">
        <div className="seclbl">Batch actions</div>
        <div className="batchbar">
          {BATCH_LABEL.map((b) => (
            <button
              key={b.action}
              type="button"
              className={`btn${b.primary ? " pri" : ""}`}
              disabled={running !== null || counts[b.action] === 0}
              onClick={() => runBatch(b.action)}
            >
              {running === b.action ? "Running…" : b.label}
              <small>
                acts on {counts[b.action]} at {BATCH_AT[b.action]}
              </small>
            </button>
          ))}
        </div>

        {run && (
          <div className="ltoast" style={{ marginTop: 12 }}>
            <b>{BATCH_LABEL.find((b) => b.action === run.action)?.label}</b> — ran{" "}
            {new Date(run.ran_at).toLocaleString("en-US", { timeZone: "America/New_York" })} ·{" "}
            <span className="ok">{run.applied} applied</span>
            {run.skipped > 0 && (
              <>
                {" · "}
                <span className="no">
                  {run.skipped} skipped:{" "}
                  {run.results
                    .filter((r) => r.result === "skipped")
                    .map((r) => `${r.unit_label ?? r.address_line} — ${r.detail}`)
                    .join(" · ")}
                </span>
              </>
            )}{" "}
            <span className="mut">
              · each action operates only on units that satisfy its precondition and reports per-unit results
            </span>
          </div>
        )}
        {error && detail && (
          <div className="ltoast" style={{ marginTop: 12, borderLeftColor: "var(--r)" }}>
            {error}
          </div>
        )}
      </div>

      {/* ── Tabs ────────────────────────────────────── */}
      <div className="sec">
        <div className="subtabs" style={{ marginBottom: 12 }}>
          {(["units", "documents", "contacts", "activity"] as Tab[]).map((t) => (
            <button key={t} type="button" className={`st${tab === t ? " on" : ""}`} onClick={() => setTab(t)}>
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "units" && (
          <>
            <div className="seclbl">
              Units <span className="n">{units.length}</span>
            </div>
            <div className="ugrid">
              {units.map((u) => (
                <UnitTile key={u.id} unit={u} />
              ))}
            </div>
          </>
        )}

        {tab === "documents" && (
          <div className="card">
            <table className="lct">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Envelope</th>
                  <th>Signed</th>
                </tr>
              </thead>
              <tbody>
                {!docs && (
                  <tr>
                    <td colSpan={5} className="t2">
                      Loading…
                    </td>
                  </tr>
                )}
                {docs?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="t2">
                      No documents on file.
                    </td>
                  </tr>
                )}
                {docs?.map((d) => (
                  <tr key={d.id}>
                    <td className="num">{d.type}</td>
                    <td>{d.title ?? "—"}</td>
                    <td className="num">{d.status ?? "—"}</td>
                    <td className="num">{d.envelope_id ?? "—"}</td>
                    <td className="num">{d.signed_at ? new Date(d.signed_at).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "contacts" && (
          <div className="card">
            <table className="lct">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="t2">
                      No contacts on the account.
                    </td>
                  </tr>
                )}
                {contacts.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <b>{c.name ?? "—"}</b>
                    </td>
                    <td className="num">{c.role ?? "—"}</td>
                    <td className="num">{c.phone ?? "—"}</td>
                    <td className="num">{c.email ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "activity" && (
          <div className="card">
            <table className="lct">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Action</th>
                  <th>Actor</th>
                </tr>
              </thead>
              <tbody>
                {!activity && (
                  <tr>
                    <td colSpan={3} className="t2">
                      Loading…
                    </td>
                  </tr>
                )}
                {activity?.length === 0 && (
                  <tr>
                    <td colSpan={3} className="t2">
                      No activity yet.
                    </td>
                  </tr>
                )}
                {activity?.map((a) => (
                  <tr key={a.id}>
                    <td className="num">
                      {new Date(a.at).toLocaleString("en-US", { timeZone: "America/New_York" })}
                    </td>
                    <td>{a.action}</td>
                    <td className="num">{a.actor ?? "system"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="stamp">
        <Link href="/portal/pipeline" style={{ color: "var(--gd)" }}>
          ← Back to the pipeline board
        </Link>
      </div>
    </div>
  );
}

/** One unit: stage-colored dot, blocked highlighted, terminal greyed. */
function UnitTile({ unit }: { unit: PropertyUnit }) {
  const cls = ["utile", unit.blocked_code ? "blk" : "", unit.terminal_state ? "term" : ""].filter(Boolean).join(" ");
  const color = unit.terminal_state ? "var(--bd2)" : stageVar(unit.stage);
  const label = unit.terminal_state
    ? `${unit.terminal_state} @ ${unit.stage_code}`
    : unit.stage === "OPERATING"
      ? "OPERATING"
      : unit.stage_code;

  return (
    <a
      className={cls}
      style={{ ["--sc" as string]: color }}
      title={STAGE_NAME[unit.stage] ?? unit.stage}
      href={`/portal/systems?id=${unit.id}${unit.stage === "OPERATING" || unit.stage === "S09_LIVE" ? "&lens=op" : ""}`}
    >
      {unit.health === "FAULT" && <span className="hdot" title="FAULT" />}
      {unit.blocked_code && (
        <Def k={unit.blocked_code} className="bcode">
          {unit.blocked_code}
        </Def>
      )}
      <div className="ul">{unit.unit_label ?? "—"}</div>
      <div className="us">
        <i />
        <span>{label}</span>
      </div>
    </a>
  );
}
