"use client";

/**
 * Lifecycle map overlay (05-UI-DELTA D3).
 *
 * Every piece of stage content — gate items with their AUTO badges, block-code
 * chips, clock chips, and the trigger written on each connector — is rendered
 * from GET /api/lifecycle/map, which projects checklist_templates,
 * blocked_codes, clocks and the TRANSITIONS constant. Nothing about a stage is
 * written into this file; the mock's hardcoded stage content is §4 shim #4 and
 * is not ported. Change a seed row and this overlay changes with it.
 *
 * Open state lives in the URL (`?life=1`), so all three entry points are the
 * same link, the back button closes it, and it can be deep-linked.
 */

import { useCallback, useEffect, useState } from "react";
import { lcGet } from "@/lib/lifecycle";
import { Def } from "./Abbr";

type GateItem = {
  key: string;
  label: string;
  required: boolean;
  conditional: string | null;
  auto_only: boolean;
  owner_role: string | null;
};

type Clock = {
  key: string;
  starts_on: string;
  length_months: number | null;
  length_days: number | null;
  warn_at: string | null;
  consequence: string | null;
};

type MapStage = {
  stage: string;
  code: string;
  label: string;
  meaning: string;
  era: string | null;
  clocks: Clock[];
  gate: GateItem[];
  block_codes: Array<{ code: string; label: string; today_after_days: number }>;
  transition: { to: string; driver: string; fires: string } | null;
};

type LifecycleMap = {
  eras: Array<{ key: string; label: string; note: string; color: string; flex: number }>;
  stages: MapStage[];
  transitions: Array<{ from: string; to: string; driver: string; fires: string }>;
  clocks: Clock[];
};

/** Which external identity a gate item captures — an X-id ref on the line. */
const X_REF: Record<string, string> = {
  name_match_verified: "X2",
  ix_app_submitted: "X2",
  cgb_app_submitted: "X1",
  permit_approved: "X5",
  enlighten_activated: "X3",
  serials_scanned: "X3",
  derms_visible: "X4",
};

function clockLabel(c: Clock): string {
  const length = c.length_months != null ? `${c.length_months} mo` : c.length_days != null ? `${c.length_days} d` : "—";
  return `${c.key.replace(/_/g, " ")} · ${length}${c.warn_at ? ` · warn ${c.warn_at}` : ""}`;
}

export default function LifecycleMap() {
  const [open, setOpen] = useState(false);
  const [map, setMap] = useState<LifecycleMap | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["S05_ENTITLED"]));
  const [error, setError] = useState("");

  // Open state is a URL param, so the rail item, the Pipeline button and the
  // System ribbon link are all just links, and back closes the overlay.
  useEffect(() => {
    const sync = () => setOpen(new URLSearchParams(window.location.search).get("life") === "1");
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("lifecycle-map", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("lifecycle-map", sync);
    };
  }, []);

  useEffect(() => {
    if (open && !map) {
      lcGet<LifecycleMap>("/api/lifecycle/map")
        .then(setMap)
        .catch(() => setError("Could not load the lifecycle map."));
    }
  }, [open, map]);

  const close = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("life");
    window.history.pushState({}, "", url.toString());
    window.dispatchEvent(new Event("lifecycle-map"));
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  const toggle = (stage: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(stage)) next.delete(stage);
      else next.add(stage);
      return next;
    });

  const allOpen = map ? expanded.size >= map.stages.length : false;

  return (
    <div className="lc lmovl" onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="lmap" role="dialog" aria-modal="true" aria-label="The lifecycle">
        <div className="lmhead">
          <div>
            <h2>The lifecycle</h2>
            <div className="sub">
              One record per unit, forever. It only moves forward through nine stages, then earns for 120 months. A
              block is a red overlay on the current stage — never a step backward.
            </div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button
              type="button"
              className="btn sm"
              onClick={() => setExpanded(allOpen ? new Set() : new Set((map?.stages ?? []).map((s) => s.stage)))}
            >
              {allOpen ? "Collapse all" : "Expand all"}
            </button>
            <button type="button" className="xbtn" onClick={close} aria-label="Close">
              ✕
            </button>
          </div>
        </div>

        {error && <div className="ltoast" style={{ borderLeftColor: "var(--r)" }}>{error}</div>}
        {!map && !error && <div className="stamp">Loading the map…</div>}

        {map && (
          <>
            <div className="eraband">
              {map.eras.map((e) => (
                <div className="eraseg" key={e.key} style={{ ["--f" as string]: e.flex, ["--ec" as string]: e.color }}>
                  <b>{e.label}</b>
                  <span>{e.note}</span>
                </div>
              ))}
            </div>

            <div className="lrows">
              {map.stages.map((s, i) => {
                const isOpen = expanded.has(s.stage);
                const stageNo = i + 1;
                return (
                  <div key={s.stage}>
                    <div className={`lrow${isOpen ? " open" : ""}`}>
                      <div
                        className="lhead"
                        role="button"
                        tabIndex={0}
                        aria-expanded={isOpen}
                        onClick={() => toggle(s.stage)}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), toggle(s.stage))}
                      >
                        <span
                          className="ldot"
                          style={{ ["--sc" as string]: s.stage === "OPERATING" ? "var(--sop)" : `var(--s${stageNo})` }}
                        />
                        <span className="lcode">{s.code}</span>
                        <b>{s.label}</b>
                        <span className="lmean">{s.meaning}</span>
                        {s.era && <span className="ltag">{s.era[0] + s.era.slice(1).toLowerCase()}</span>}
                        <span className="caret">▾</span>
                      </div>

                      {isOpen && (
                        <div className="lbody">
                          {s.gate.length > 0 && (
                            <div className="lgrp">
                              <div className="lgl">Exit gate — checklist</div>
                              {s.gate.map((g) => (
                                <div className="gline" key={g.key}>
                                  <i />
                                  {g.label}
                                  {g.auto_only && <span className="auto">AUTO</span>}
                                  {!g.required && <span className="ltag">optional</span>}
                                  {g.conditional && <span className="ltag">if {g.conditional.replace(/_/g, " ")}</span>}
                                  {X_REF[g.key] && (
                                    <Def k={X_REF[g.key]} className="xref">
                                      {X_REF[g.key]}
                                    </Def>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {s.block_codes.length > 0 && (
                            <div className="lgrp">
                              <div className="lgl">Can block</div>
                              <div className="lchips">
                                {s.block_codes.map((b) => (
                                  <Def key={b.code} k={b.code} def={`${b.label} — Today after ${b.today_after_days}d`} className="blockedtag">
                                    {b.code}
                                  </Def>
                                ))}
                              </div>
                            </div>
                          )}

                          {s.clocks.length > 0 && (
                            <div className="lgrp">
                              <div className="lgl">Clocks</div>
                              <div className="lchips">
                                {s.clocks.map((c) => (
                                  <span className="lclk" key={c.key} title={c.consequence ?? undefined}>
                                    {clockLabel(c)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {s.gate.length === 0 && s.block_codes.length === 0 && (
                            <div className="lgrp">
                              <div style={{ fontSize: 11.5 }} className="t2">
                                No checklist at this stage — {s.meaning}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {s.transition && (
                      <div className="lcon">
                        <span className="cline" />
                        <span className="ctrig">
                          <b className={s.transition.driver === "MANUAL" ? "man" : undefined}>{s.transition.driver}</b> ·{" "}
                          {s.transition.fires}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="lrules">
              <div className="lrule">
                <b>Blocked is never backward</b>
                <span>
                  A block is an overlay on the current stage with a code from that stage. Stage never reverses.
                </span>
              </div>
              <div className="lrule">
                <b>Terminal exits preserve the stage</b>
                <span>
                  Disqualified, withdrawn, expired, removed and term-complete are a separate column. The stage the
                  system reached is still on the record.
                </span>
              </div>
              <div className="lrule">
                <b>Gates live on the server</b>
                <span>
                  Every advance is validated server-side and written to stage_history. The board renders the verdict; it
                  never computes one.
                </span>
              </div>
            </div>

            <div className="stamp" style={{ marginTop: 10 }}>
              Rendered from {map.stages.length} stages · {map.stages.reduce((n, s) => n + s.gate.length, 0)} gate items ·{" "}
              {map.stages.reduce((n, s) => n + s.block_codes.length, 0)} block codes · {map.clocks.length} clocks — all
              read from the seed tables.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Open the overlay from anywhere — the three entry points all call this. */
export function openLifecycleMap() {
  const url = new URL(window.location.href);
  url.searchParams.set("life", "1");
  window.history.pushState({}, "", url.toString());
  window.dispatchEvent(new Event("lifecycle-map"));
}
