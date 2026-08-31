"use client";

/**
 * Pipeline — the delivery board (03 §Pipeline, 05-UI-DELTA D1/D2/D5).
 *
 * The board never decides whether a card may move. A drop onto the next column
 * POSTs /api/systems/:id/advance and renders whatever comes back — success,
 * 409 blocked, or the 422 unmet list. The only local refusals are the ones that
 * aren't gate decisions at all (backward, skipping a stage, dropping onto the
 * momentary S09 column): there is no such transition to ask the server about.
 * Demo shims from the mock — client-side gate verdicts and the "fresh stage"
 * re-lock hack — are deliberately not ported (05-UI-DELTA §4).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  advanceSystem,
  isApiError,
  lcGet,
  stageVar,
  STAGE_NAME,
  type Board,
  type BoardCard,
  type BoardFilterOptions,
  type Deal,
  type ItcThread,
} from "@/lib/lifecycle";

type Tab = "delivery" | "deals";

type Filters = {
  property_id: string;
  tier: string;
  town: string;
  installer: string;
  blocked_only: boolean;
};

const EMPTY: Filters = { property_id: "", tier: "", town: "", installer: "", blocked_only: false };

/** Claim-state copy for the D5 strip, locked by the mock. */
const STAGE_COPY: Record<string, string> = {
  ACCRUING: "S05 · CLAIM OPENS — ACCRUING",
  BASIS_LOCKED: "COF → BASIS LOCKED",
  EVIDENCE_COMPLETE: "EVIDENCE COMPLETE",
  IN_COHORT: "IN COHORT",
  TRANSFERRED: "TRANSFERRED",
};
const STAGE_ORDER_ITC = ["ACCRUING", "BASIS_LOCKED", "EVIDENCE_COMPLETE", "IN_COHORT", "TRANSFERRED"];

/** Toast copy is locked by the mock (05-UI-DELTA D2) — lifted verbatim. */
function skipCopy(from: number, to: number) {
  return `<b>ONE STAGE AT A TIME</b> — S0${from} → S0${to} would skip S0${from + 1}`;
}

export default function PipelineClient() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("delivery");
  const [board, setBoard] = useState<Board | null>(null);
  const [options, setOptions] = useState<BoardFilterOptions | null>(null);
  const [deals, setDeals] = useState<Deal[] | null>(null);
  const [thread, setThread] = useState<ItcThread | null>(null);
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [groupByProperty, setGroupByProperty] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // drag state
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{ stage: string; ok: boolean } | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((html: string) => {
    setToast(html);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3600);
  }, []);

  const flash = useCallback((id: string) => {
    setFlashId(id);
    setTimeout(() => setFlashId((cur) => (cur === id ? null : cur)), 900);
  }, []);

  // Tab lives in the URL (D6) — back/forward walks it natively.
  useEffect(() => {
    const sync = () => {
      const t = new URLSearchParams(window.location.search).get("tab");
      setTab(t === "deals" ? "deals" : "delivery");
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const loadBoard = useCallback(async () => {
    setError("");
    const qs = new URLSearchParams();
    if (filters.property_id) qs.set("property_id", filters.property_id);
    if (filters.tier) qs.set("tier", filters.tier);
    if (filters.town) qs.set("town", filters.town);
    if (filters.installer) qs.set("installer", filters.installer);
    if (filters.blocked_only) qs.set("blocked_only", "true");
    try {
      setBoard(await lcGet<Board>(`/api/pipeline/board?${qs.toString()}`));
    } catch (e) {
      setError(isApiError(e) ? e.message : "Failed to load the board");
    }
  }, [filters]);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  useEffect(() => {
    lcGet<BoardFilterOptions>("/api/pipeline/filters").then(setOptions).catch(() => {});
    // D5 — the strip renders live claim-state aggregates, not the mock's
    // static counts (§4 shim #5).
    lcGet<ItcThread>("/api/itc/thread").then(setThread).catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === "deals" && !deals) {
      lcGet<Deal[]>("/api/pipeline/deals")
        .then(setDeals)
        .catch((e) => setError(isApiError(e) ? e.message : "Failed to load deals"));
    }
  }, [tab, deals]);

  function goTab(next: Tab) {
    setTab(next);
    router.push(next === "deals" ? "/portal/pipeline?tab=deals" : "/portal/pipeline");
  }

  const columns = board?.columns ?? [];
  const stageIndexOf = (stage: string) => columns.findIndex((c) => c.stage === stage);
  const cardById = (id: string): { card: BoardCard; colIdx: number } | null => {
    for (let i = 0; i < columns.length; i++) {
      const card = columns[i].cards.find((c) => c.id === id);
      if (card) return { card, colIdx: i };
    }
    return null;
  };

  /**
   * A drop. Structural refusals answer locally (no such transition exists);
   * a legal stage+1 drop always asks the server and renders its answer.
   */
  async function onDrop(toStage: string) {
    const id = dragId;
    setDragId(null);
    setDropTarget(null);
    if (!id) return;

    const found = cardById(id);
    if (!found) return;
    const { card, colIdx } = found;
    const toIdx = stageIndexOf(toStage);
    const f = colIdx + 1;
    const t = toIdx + 1;
    const name = card.address_line ?? card.unit_label ?? "This system";

    if (t === f) return;
    if (t < f) {
      showToast("<b>BLOCKED, NEVER BACKWARD</b> — stages don&rsquo;t reverse (L3)");
      flash(id);
      return;
    }
    if (t > f + 1) {
      showToast(skipCopy(f, t));
      flash(id);
      return;
    }
    if (columns[toIdx]?.momentary) {
      showToast("<b>S08 → S09 IS AUTOMATIC ON COF</b> — finish the four proofs; the server chains it");
      flash(id);
      return;
    }

    setBusy(true);
    try {
      const res = await advanceSystem(id);
      const to = res.system.stage;
      showToast(
        `<b>${name} → ${to.startsWith("S0") ? to.slice(0, 3) : "OP"} ${STAGE_NAME[to]?.toUpperCase() ?? to}</b> · via ${res.history.via} · stage_history +1`,
      );
      await loadBoard();
    } catch (e) {
      if (isApiError(e) && e.code === "GATE_UNMET") {
        const items = (e.unmet ?? []).map((u) => u.label).join(", ");
        showToast(`<b>GATE ${e.gate} · ADVANCE REFUSED</b> — unmet: ${items}`);
      } else if (isApiError(e) && e.code === "BLOCKED") {
        showToast(`<b>REFUSED</b> — ${card.blocked_code} must clear before ${name} can advance`);
      } else {
        showToast(`<b>REFUSED</b> — ${isApiError(e) ? e.message : "advance failed"}`);
      }
      flash(id);
    } finally {
      setBusy(false);
    }
  }

  function renderCard(card: BoardCard, colIdx: number) {
    const blocked = Boolean(card.blocked_code);
    const age = card.days_in_stage;
    return (
      <div
        key={card.id}
        className={`kcard${blocked ? " blk" : ""}${dragId === card.id ? " dragging" : ""}${flashId === card.id ? " flash" : ""}`}
        draggable
        onDragStart={(e) => {
          setDragId(card.id);
          e.dataTransfer.effectAllowed = "move";
          // Touch/pointer shim: the mock is mouse-only.
          e.dataTransfer.setData("text/plain", card.id);
        }}
        onDragEnd={() => {
          setDragId(null);
          setDropTarget(null);
        }}
        role="button"
        tabIndex={0}
        aria-label={`${card.address_line ?? card.unit_label ?? "system"} — ${columns[colIdx]?.code}`}
      >
        <b>{card.address_line ?? card.unit_label ?? "—"}</b>
        <div className="kp">
          {[card.property?.town, card.property?.name ?? card.source].filter(Boolean).join(" · ") || "—"}
        </div>

        {card.s08_dots && (
          <div className="dots4">
            {card.s08_dots.map((d) => (
              <i key={d.key} className={d.done ? "f" : ""} title={`${d.label}${d.done ? " ✓" : ""}`} />
            ))}
            <span className="dl">{card.s08_dots.map((d) => d.label).join(" · ")}</span>
          </div>
        )}

        <div className="kfoot">
          {card.pills.map((p) => (
            <span key={p} className={`lpill ${p.toLowerCase()}`}>
              {p}
            </span>
          ))}
          {blocked && <span className="blockedtag">{card.blocked_code}</span>}
          {age != null && <span className={`age${age >= 5 ? " hot" : ""}`}>{age}d</span>}
        </div>

        {blocked && card.blocked_note && <div className="gatepop">{card.blocked_note}</div>}
      </div>
    );
  }

  function renderBoard(cardsFor: (stage: string) => BoardCard[], counts?: (stage: string) => number) {
    return (
      <div className="board">
        {columns.map((col, idx) => {
          const dt = dropTarget?.stage === col.stage ? (dropTarget.ok ? " dt-ok" : " dt-no") : "";
          const cards = cardsFor(col.stage);
          return (
            <div
              key={col.stage}
              className={`kcol${dt}`}
              onDragOver={(e) => {
                if (!dragId) return;
                e.preventDefault();
                const from = cardById(dragId)?.colIdx ?? -1;
                if (from === idx) return setDropTarget(null);
                setDropTarget({ stage: col.stage, ok: idx === from + 1 && !col.momentary });
              }}
              onDragLeave={() => setDropTarget((d) => (d?.stage === col.stage ? null : d))}
              onDrop={(e) => {
                e.preventDefault();
                onDrop(col.stage);
              }}
            >
              <div className="khead" style={{ ["--kc" as string]: stageVar(col.stage) }}>
                <span>
                  <span className="kc">{col.code}</span> <span className="kn">{STAGE_NAME[col.stage]}</span>
                </span>
                <span className="kct">{counts ? counts(col.stage) : col.count}</span>
              </div>

              {col.momentary ? (
                <div className="kexplain">
                  Momentary — COF write chains straight to Operating. Live systems appear in{" "}
                  <Link href="/portal/fleet" style={{ color: "var(--gd)", textDecoration: "underline" }}>
                    Fleet
                  </Link>
                  .
                </div>
              ) : (
                cards.map((c) => renderCard(c, idx))
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Group-by-property lanes (03 §Pipeline — default once portfolios land).
  function renderLanes() {
    const lanes = new Map<string, { label: string; cards: BoardCard[] }>();
    for (const col of columns) {
      for (const card of col.cards) {
        const key = card.property?.id ?? "unassigned";
        const label = card.property?.name ?? card.property?.town ?? "Unassigned";
        const lane = lanes.get(key) ?? { label, cards: [] };
        lane.cards.push(card);
        lanes.set(key, lane);
      }
    }
    if (lanes.size === 0) return <div className="stamp">No systems match these filters.</div>;
    return [...lanes.entries()].map(([id, lane]) => {
      const inLane = new Set(lane.cards.map((c) => c.id));
      return (
        <div className="lane" key={id}>
          <div className="lanehead">
            <b>{lane.label}</b> · {lane.cards.length} unit{lane.cards.length === 1 ? "" : "s"}
            {id !== "unassigned" && (
              <>
                {" · "}
                <Link href={`/portal/properties?id=${id}`} style={{ color: "var(--gd)" }}>
                  open property →
                </Link>
              </>
            )}
          </div>
          {renderBoard(
            (stage) => (columns.find((c) => c.stage === stage)?.cards ?? []).filter((c) => inLane.has(c.id)),
            (stage) => (columns.find((c) => c.stage === stage)?.cards ?? []).filter((c) => inLane.has(c.id)).length,
          )}
        </div>
      );
    });
  }

  return (
    <div className="lc">
      <div className="shead">
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 27, fontWeight: 400, margin: 0 }}>Pipeline</h1>
          <div className="sub">
            How far along is everything pre-COF. Drag validates through the server — a card never moves past an unmet
            gate.
          </div>
        </div>
        <div className="right">
          <div className="stamp">
            {board ? `${board.totals.systems} systems in delivery · ${board.totals.blocked} blocked` : "loading…"}
          </div>
          <div className="principle">Blocked, never backward</div>
        </div>
      </div>

      <div className="sec row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div className="subtabs">
          <button type="button" className={`st${tab === "delivery" ? " on" : ""}`} onClick={() => goTab("delivery")}>
            Delivery board
          </button>
          <button type="button" className={`st${tab === "deals" ? " on" : ""}`} onClick={() => goTab("deals")}>
            Deals
          </button>
        </div>

        {tab === "delivery" && (
          <div className="filters">
            <select
              className="fsel"
              value={filters.property_id}
              onChange={(e) => setFilters({ ...filters, property_id: e.target.value })}
              aria-label="Filter by property"
            >
              <option value="">Property · All</option>
              {options?.properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <select
              className="fsel"
              value={filters.tier}
              onChange={(e) => setFilters({ ...filters, tier: e.target.value })}
              aria-label="Filter by tier"
            >
              <option value="">Tier</option>
              {options?.tiers.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              className="fsel"
              value={filters.installer}
              onChange={(e) => setFilters({ ...filters, installer: e.target.value })}
              aria-label="Filter by installer"
            >
              <option value="">Installer</option>
              {options?.installers.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <select
              className="fsel"
              value={filters.town}
              onChange={(e) => setFilters({ ...filters, town: e.target.value })}
              aria-label="Filter by town"
            >
              <option value="">Town</option>
              {options?.towns.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <label className="fsel" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                style={{ accentColor: "var(--gd)" }}
                checked={filters.blocked_only}
                onChange={(e) => setFilters({ ...filters, blocked_only: e.target.checked })}
              />
              Blocked only
            </label>
            <label className="fsel" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                style={{ accentColor: "var(--gd)" }}
                checked={groupByProperty}
                onChange={(e) => setGroupByProperty(e.target.checked)}
              />
              Group by property
            </label>
          </div>
        )}
      </div>

      {error && (
        <div className="sec ltoast" style={{ borderLeftColor: "var(--r)" }}>
          {error}
        </div>
      )}

      {tab === "delivery" && (
        <div className="sec">
          <div className="boardscroll" aria-busy={busy}>
            {!board ? (
              <div className="stamp">Loading board…</div>
            ) : groupByProperty ? (
              renderLanes()
            ) : (
              renderBoard((stage) => columns.find((c) => c.stage === stage)?.cards ?? [])
            )}
          </div>

          {/* ITC credit thread strip (D5) — live claim-state aggregates. */}
          <div className="card pad" style={{ marginTop: 6 }}>
            <div className="cardlbl">
              <span>
                ITC credit thread — runs alongside delivery
                {thread ? ` · ${thread.total_claims} claim${thread.total_claims === 1 ? "" : "s"}` : ""}
              </span>
              <span className="lpill">§48E · transferred via §6418</span>
            </div>
            <div className="row" style={{ gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <div className="cpipe">
                {thread
                  ? thread.stages.map((st) => (
                      <i
                        key={st.status}
                        className={st.current ? "cur" : st.count > 0 ? "f" : ""}
                        title={st.credit ? `$${Math.round(st.credit).toLocaleString("en-US")} of credit` : undefined}
                      >
                        {STAGE_COPY[st.status] ?? st.status} · {st.count}
                      </i>
                    ))
                  : STAGE_ORDER_ITC.map((k) => (
                      <i key={k}>{STAGE_COPY[k]}</i>
                    ))}
              </div>
              <span className="lclk">
                {thread?.allocation
                  ? `48E(h) ${thread.allocation.category} ${thread.allocation.program_year} · ${thread.allocation.kw_remaining} of ${thread.allocation.kw_awarded} kW left — apply before LI units reach PIS`
                  : "48E(h) LI allocation · apply before LI units reach PIS"}
              </span>
              <Link href="/portal/money?desk=itc" className="lifelink">
                Open the ITC desk →
              </Link>
            </div>
            <div className="stamp" style={{ marginTop: 9 }}>
              Drag any card one column right — the gate answers. Blocked and unmet cards tell you why. Backward moves
              and stage-skips refuse on principle.
            </div>
          </div>
        </div>
      )}

      {tab === "deals" && (
        <div className="sec">
          <div className="card">
            <table className="lct">
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Type</th>
                  <th>Deal state</th>
                  <th>Units</th>
                  <th>Release</th>
                  <th>Next step</th>
                </tr>
              </thead>
              <tbody>
                {!deals && (
                  <tr>
                    <td colSpan={6} className="t2">
                      Loading deals…
                    </td>
                  </tr>
                )}
                {deals?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="t2">
                      No accounts yet — portfolio accounts arrive with the demo property.
                    </td>
                  </tr>
                )}
                {deals?.map((d) => {
                  const first = d.properties[0];
                  return (
                    <tr
                      key={d.id}
                      className={first ? "lnk" : undefined}
                      onClick={() => first && router.push(`/portal/properties?id=${first.id}`)}
                    >
                      <td>
                        <b>{d.name}</b>
                      </td>
                      <td className="num">{d.type}</td>
                      <td>
                        <span className={`stchip ${dealTone(d.deal_state)}`}>{dealLabel(d.deal_state)}</span>
                      </td>
                      <td className="num">{d.units}</td>
                      <td className="num">{d.units ? `${d.release.esas_signed} of ${d.units} ESAs` : "—"}</td>
                      <td className="t2">{d.notes ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="stamp" style={{ marginTop: 8 }}>
            Deals are relationship work at the account level. A deal releases units into the delivery board — the two
            pipelines merge at S03 Committed.
          </div>
        </div>
      )}

      {toast && <div className="lc-dragtoast show" dangerouslySetInnerHTML={{ __html: toast }} />}
    </div>
  );
}

function dealLabel(state: string | null): string {
  if (!state) return "—";
  const [d, ...rest] = state.split("_");
  return `${d} · ${rest.join(" ")}`;
}

function dealTone(state: string | null): string {
  if (!state) return "";
  const n = Number(state.slice(1, 2));
  if (n >= 6) return "g";
  if (n >= 4) return "b";
  return "";
}
