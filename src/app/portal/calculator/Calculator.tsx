"use client";

import { useMemo, useState } from "react";

type Cost = "retail" | "fleet";
type LIBonus = "none" | "cat1" | "cat3";
type CType = "resi" | "ci";
type Tier = "standard" | "underserved" | "li";

const fmt = (v: number) => "$" + Math.round(v).toLocaleString();

export default function Calculator() {
  // Hardware constants per Enphase IQ Battery 10C DOM
  const KWH_PER_UNIT = 10.08;
  const KW_CONT_PER_UNIT = 3.84;
  const DOD = 0.8;
  const USABLE_PER_UNIT = KWH_PER_UNIT * DOD;
  const DERATING = 0.78;

  const [bat, setBat] = useState(2);
  const [eventHr, setEventHr] = useState(2.55);
  const [cost, setCost] = useState<Cost>("retail");
  const [dc, setDc] = useState(true);
  const [ec, setEc] = useState(true);
  const [li, setLi] = useState<LIBonus>("none");
  const [ctype, setCtype] = useState<CType>("resi");
  const [tier, setTier] = useState<Tier>("li");
  const [ge, setGe] = useState(false);

  const m = useMemo(() => {
    const sysNameplateKwh = bat * KWH_PER_UNIT;
    const sysContinuousKw = bat * KW_CONT_PER_UNIT;
    const sysUsableKwh = bat * USABLE_PER_UNIT;

    const energyLimitedPerUnit = USABLE_PER_UNIT / eventHr;
    const powerLimitedPerUnit = KW_CONT_PER_UNIT;
    const sustainedPerUnit = Math.min(energyLimitedPerUnit, powerLimitedPerUnit);
    const binding: "energy" | "power" =
      energyLimitedPerUnit < powerLimitedPerUnit ? "energy" : "power";
    const sustainedKw = sustainedPerUnit * bat;
    const deratedKw = sustainedKw * DERATING;
    const crossoverHr = USABLE_PER_UNIT / KW_CONT_PER_UNIT;

    let battery: number, otherHw: number, install: number;
    if (cost === "retail") {
      battery = bat * 7900;
      otherHw = 2000;
      install = 2500;
    } else {
      battery = bat * 6700;
      otherHw = 1700;
      install = 500 + 200 * bat;
    }
    const permits = 100;
    const totalCost = battery + otherHw + install + permits;

    let itcPct = 30;
    if (dc) itcPct += 10;
    if (ec) itcPct += 10;
    if (li === "cat1") itcPct += 10;
    if (li === "cat3") itcPct += 20;
    const itcCredit = (totalCost * itcPct) / 100;
    const itcCash = itcCredit * 0.92;

    const enrollRate = ctype === "ci" ? 10 : ge ? 130 : 30;
    const enrollAmt = enrollRate * sysNameplateKwh;

    let perfRate = 300;
    let tierLabel = "Standard";
    let perfAnnual: number;
    let perf10yr: number;
    if (ctype === "ci") {
      tierLabel = "SM C&I (step-down)";
      perfAnnual = deratedKw * 325;
      perf10yr = deratedKw * (325 * 5 + 175 * 5);
    } else {
      if (tier === "standard") {
        perfRate = 300;
        tierLabel = "Standard";
      } else if (tier === "underserved") {
        perfRate = 425;
        tierLabel = "Underserved";
      } else {
        perfRate = 525;
        tierLabel = "Low-Income";
      }
      perfAnnual = deratedKw * perfRate;
      perf10yr = perfAnnual * 10;
    }

    const directOpex = 100;
    const annualNOI = perfAnnual - directOpex;
    const grossInflows = itcCash + enrollAmt + perf10yr;
    const netProfit10yr = grossInflows - (totalCost + directOpex * 10);
    const netCapital = totalCost - itcCash - enrollAmt;
    const payback =
      netCapital > 0 && annualNOI > 0 ? netCapital / annualNOI : 0;
    const coc =
      netCapital > 0 && annualNOI > 0 ? (annualNOI / netCapital) * 100 : 0;
    const roi10yr = totalCost > 0 ? (netProfit10yr / totalCost) * 100 : 0;

    return {
      sysNameplateKwh,
      sysContinuousKw,
      sysUsableKwh,
      energyLimitedPerUnit,
      powerLimitedPerUnit,
      sustainedPerUnit,
      binding,
      sustainedKw,
      deratedKw,
      crossoverHr,
      battery,
      otherHw,
      install,
      permits,
      totalCost,
      itcPct,
      itcCredit,
      itcCash,
      enrollRate,
      enrollAmt,
      perfRate,
      tierLabel,
      perfAnnual,
      perf10yr,
      directOpex,
      annualNOI,
      grossInflows,
      netProfit10yr,
      netCapital,
      payback,
      coc,
      roi10yr,
    };
  }, [bat, eventHr, cost, dc, ec, li, ctype, tier, ge]);

  return (
    <div className="calc-v9">
      <div className="hdr">
        <div className="brand">
          Grid<strong>Shift</strong> — Project Calculator v9 · April 2026
          framework
        </div>
        <h1>
          Single-site project profitability <em>and cost</em>
        </h1>
        <p className="sub">
          Configure hardware, ITC adders, CT ESS criteria, and dispatch event
          duration to model one residential site. The kW used for performance
          revenue auto-calculates from the binding constraint (power-limited or
          energy-limited) at the chosen event duration. All numbers update
          live.
        </p>
      </div>

      <div className="sec-l">
        1 · <span>Configure project</span>
      </div>
      <div className="grid-3">
        <div className="card">
          <div className="card-title">System</div>
          <div className="row">
            <div className="row-l">Number of IQ Battery 10C units</div>
            <div className="pills">
              {[1, 2, 3, 4, 6, 8].map((n) => (
                <div
                  key={n}
                  className={`pill${bat === n ? " on" : ""}`}
                  onClick={() => setBat(n)}
                >
                  {n}×
                </div>
              ))}
            </div>
          </div>
          <div className="row">
            <div className="row-l">Avg dispatch event duration</div>
            <div className="pills">
              {[1.5, 2.0, 2.55, 3.0].map((h) => (
                <div
                  key={h}
                  className={`pill${eventHr === h ? " on" : ""}`}
                  onClick={() => setEventHr(h)}
                >
                  {h} hr
                </div>
              ))}
            </div>
          </div>
          <div className="row">
            <div className="row-l">Cost basis</div>
            <div className="pills">
              <div
                className={`pill${cost === "retail" ? " on" : ""}`}
                onClick={() => setCost("retail")}
              >
                Retail (1–25)
              </div>
              <div
                className={`pill${cost === "fleet" ? " on" : ""}`}
                onClick={() => setCost("fleet")}
              >
                Fleet (50+)
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Federal ITC adders</div>
          <div className="row">
            <div className="row-l">Domestic Content (DOM SKU)</div>
            <div className="pills">
              <div
                className={`pill${dc ? " on" : ""}`}
                onClick={() => setDc(true)}
              >
                Yes +10%
              </div>
              <div
                className={`pill${!dc ? " on" : ""}`}
                onClick={() => setDc(false)}
              >
                No
              </div>
            </div>
          </div>
          <div className="row">
            <div className="row-l">Energy Community MSA</div>
            <div className="pills">
              <div
                className={`pill${ec ? " on" : ""}`}
                onClick={() => setEc(true)}
              >
                Yes +10%
              </div>
              <div
                className={`pill${!ec ? " on" : ""}`}
                onClick={() => setEc(false)}
              >
                No
              </div>
            </div>
          </div>
          <div className="row">
            <div className="row-l">Low-Income bonus (one only)</div>
            <div className="pills">
              <div
                className={`pill${li === "none" ? " on" : ""}`}
                onClick={() => setLi("none")}
              >
                None
              </div>
              <div
                className={`pill${li === "cat1" ? " on" : ""}`}
                onClick={() => setLi("cat1")}
              >
                Cat 1 +10%
              </div>
              <div
                className={`pill${li === "cat3" ? " on" : ""}`}
                onClick={() => setLi("cat3")}
              >
                Cat 3 +20%
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">CT ESS criteria</div>
          <div className="row">
            <div className="row-l">Customer type</div>
            <div className="pills">
              <div
                className={`pill${ctype === "resi" ? " on" : ""}`}
                onClick={() => setCtype("resi")}
              >
                Residential
              </div>
              <div
                className={`pill${ctype === "ci" ? " on" : ""}`}
                onClick={() => setCtype("ci")}
              >
                C&amp;I
              </div>
            </div>
          </div>
          {ctype === "resi" && (
            <div className="row">
              <div className="row-l">Performance tier (residential)</div>
              <div className="pills">
                <div
                  className={`pill${tier === "standard" ? " on" : ""}`}
                  onClick={() => setTier("standard")}
                >
                  Standard
                </div>
                <div
                  className={`pill${tier === "underserved" ? " on" : ""}`}
                  onClick={() => setTier("underserved")}
                >
                  Underserved
                </div>
                <div
                  className={`pill${tier === "li" ? " on" : ""}`}
                  onClick={() => setTier("li")}
                >
                  Low-Income
                </div>
              </div>
            </div>
          )}
          <div className="row">
            <div className="row-l">Grid Edge circuit</div>
            <div className="pills">
              <div
                className={`pill${ge ? " on" : ""}`}
                onClick={() => setGe(true)}
              >
                Yes
              </div>
              <div
                className={`pill${!ge ? " on" : ""}`}
                onClick={() => setGe(false)}
              >
                No
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi">
          <div className="l">System cost</div>
          <div className="v">{fmt(m.totalCost)}</div>
        </div>
        <div className="kpi">
          <div className="l">Net capital at risk</div>
          <div className={`v ${m.netCapital > 0 ? "" : "gp"}`}>
            {fmt(Math.max(0, m.netCapital))}
          </div>
        </div>
        <div className="kpi">
          <div className="l">10-year net profit</div>
          <div className={`v ${m.netProfit10yr >= 0 ? "gp" : "rp"}`}>
            {fmt(m.netProfit10yr)}
          </div>
        </div>
        <div className="kpi">
          <div className="l">Cash-on-cash return</div>
          <div className="v gp">
            {m.coc > 0 ? `${m.coc.toFixed(0)}%` : "∞"}
          </div>
        </div>
      </div>

      <div className="sec-l">
        2 · <span>Hardware capacity &amp; dispatch math</span>
      </div>
      <div className="card">
        <div className="card-title">
          Dispatch capacity at {eventHr} hr event duration{" "}
          <span className={`tag ${m.binding === "energy" ? "ap" : "bp"}`}>
            {m.binding === "energy" ? "Energy-limited" : "Power-limited"}
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          <div>
            <table>
              <tbody>
                <tr>
                  <th colSpan={2}>Per-battery hardware</th>
                </tr>
                <tr>
                  <td>Nominal capacity</td>
                  <td className="r m">{KWH_PER_UNIT.toFixed(2)} kWh</td>
                </tr>
                <tr>
                  <td>Continuous power rating</td>
                  <td className="r m">{KW_CONT_PER_UNIT.toFixed(2)} kW</td>
                </tr>
                <tr>
                  <td>Usable at {(DOD * 100).toFixed(0)}% DoD</td>
                  <td className="r m">{USABLE_PER_UNIT.toFixed(2)} kWh</td>
                </tr>
                <tr className="sub-row">
                  <td colSpan={2}>Per-battery limits @ {eventHr} hr</td>
                </tr>
                <tr>
                  <td>Energy-limited kW</td>
                  <td className="r m">
                    {m.energyLimitedPerUnit.toFixed(2)} kW
                  </td>
                </tr>
                <tr>
                  <td>Power-limited kW</td>
                  <td className="r m">
                    {m.powerLimitedPerUnit.toFixed(2)} kW
                  </td>
                </tr>
                <tr className="tot">
                  <td>Sustained kW per battery</td>
                  <td className="r m bold">
                    {m.sustainedPerUnit.toFixed(2)} kW
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table>
              <tbody>
                <tr>
                  <th colSpan={2}>{bat}-battery system totals</th>
                </tr>
                <tr>
                  <td>Total nameplate</td>
                  <td className="r m">{m.sysNameplateKwh.toFixed(2)} kWh</td>
                </tr>
                <tr>
                  <td>Total continuous power</td>
                  <td className="r m">{m.sysContinuousKw.toFixed(2)} kW</td>
                </tr>
                <tr>
                  <td>Total usable (80% DoD)</td>
                  <td className="r m">{m.sysUsableKwh.toFixed(2)} kWh</td>
                </tr>
                <tr className="sub-row">
                  <td colSpan={2}>Sustained → derated → revenue</td>
                </tr>
                <tr>
                  <td>System sustained kW</td>
                  <td className="r m">{m.sustainedKw.toFixed(2)} kW</td>
                </tr>
                <tr>
                  <td>× Derating factor 0.78</td>
                  <td className="r m">×0.78</td>
                </tr>
                <tr className="tot">
                  <td>Realistic dispatched kW</td>
                  <td className="r m bold gp">
                    {m.deratedKw.toFixed(2)} kW
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={`constraint-banner ${m.binding}`}>
          {m.binding === "energy"
            ? `Energy-limited: at ${eventHr} hr events, the battery runs out of stored kWh before hitting its ${KW_CONT_PER_UNIT.toFixed(2)} kW per-unit power ceiling. Crossover at ${m.crossoverHr.toFixed(2)} hr — events shorter than that are power-limited.`
            : `Power-limited: at ${eventHr} hr events, the battery hits its ${KW_CONT_PER_UNIT.toFixed(2)} kW per-unit continuous rating before depleting to 80% DoD. Crossover at ${m.crossoverHr.toFixed(2)} hr — events longer than that become energy-limited.`}
        </div>
      </div>

      <div className="sec-l">
        3 · <span>Cost &amp; federal ITC</span>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            System cost{" "}
            <span className={`tag ${cost === "retail" ? "ap" : "gp"}`}>
              {cost === "retail" ? "Retail" : "Fleet/self-perform"}
            </span>
          </div>
          <table>
            <tbody>
              <tr>
                <td>Enphase IQ Battery 10C × {bat}</td>
                <td className="r m">{fmt(m.battery)}</td>
              </tr>
              <tr>
                <td>IQ Combiner 6C + Meter Collar</td>
                <td className="r m">{fmt(m.otherHw)}</td>
              </tr>
              <tr>
                <td>Installation labor</td>
                <td className="r m">{fmt(m.install)}</td>
              </tr>
              <tr>
                <td>Permits + interconnection fee</td>
                <td className="r m">{fmt(m.permits)}</td>
              </tr>
              <tr className="tot">
                <td>Total install cost</td>
                <td className="r m">{fmt(m.totalCost)}</td>
              </tr>
            </tbody>
          </table>
          <div className="note">
            Per kWh nameplate: {fmt(m.totalCost / m.sysNameplateKwh)}/kWh ·
            per kW continuous: {fmt(m.totalCost / m.sysContinuousKw)}/kW.
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            Federal ITC stack <span className="tag bp">{m.itcPct}%</span>
          </div>
          <table>
            <tbody>
              <tr>
                <td>
                  30% base ITC <span className="tag gp">PWA</span>
                </td>
                <td className="r m">{fmt(m.totalCost * 0.3)}</td>
              </tr>
              {dc && (
                <tr>
                  <td>+10% Domestic Content</td>
                  <td className="r m gp">{fmt(m.totalCost * 0.1)}</td>
                </tr>
              )}
              {ec && (
                <tr>
                  <td>+10% Energy Community</td>
                  <td className="r m gp">{fmt(m.totalCost * 0.1)}</td>
                </tr>
              )}
              {li === "cat1" && (
                <tr>
                  <td>+10% Low-Income (Cat 1)</td>
                  <td className="r m pp">{fmt(m.totalCost * 0.1)}</td>
                </tr>
              )}
              {li === "cat3" && (
                <tr>
                  <td>+20% Low-Income (Cat 3)</td>
                  <td className="r m pp">{fmt(m.totalCost * 0.2)}</td>
                </tr>
              )}
              <tr className="tot">
                <td>Gross ITC credit</td>
                <td className="r m">{fmt(m.itcCredit)}</td>
              </tr>
              <tr>
                <td>Transfer to buyer @ 92¢/$1</td>
                <td className="r m gp bold">{fmt(m.itcCash)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="sec-l">
        4 · <span>CT ESS revenue &amp; 10-year economics</span>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            Revenue stack{" "}
            <span className="tag pp">
              {m.tierLabel}
              {ge && ctype === "resi" ? " · Grid Edge" : ""}
            </span>
          </div>
          <table>
            <tbody>
              <tr className="sub-row">
                <td colSpan={2}>Recovered upfront (one-time)</td>
              </tr>
              <tr>
                <td>ITC transfer cash @ 92¢</td>
                <td className="r m bp">{fmt(m.itcCash)}</td>
              </tr>
              <tr>
                <td>
                  CT ESS enrollment (${m.enrollRate}/kWh ×{" "}
                  {m.sysNameplateKwh.toFixed(0)} kWh)
                </td>
                <td className="r m bp">{fmt(m.enrollAmt)}</td>
              </tr>
              <tr className="sub-row">
                <td colSpan={2}>
                  Performance (10-yr, {m.deratedKw.toFixed(2)} kW dispatched
                  @ {eventHr} hr events)
                </td>
              </tr>
              {ctype === "ci" ? (
                <>
                  <tr>
                    <td>
                      Yrs 1-5 ($325/kW × {m.deratedKw.toFixed(2)} × 5)
                    </td>
                    <td className="r m pp">{fmt(m.deratedKw * 325 * 5)}</td>
                  </tr>
                  <tr>
                    <td>
                      Yrs 6-10 ($175/kW × {m.deratedKw.toFixed(2)} × 5)
                    </td>
                    <td className="r m pp">{fmt(m.deratedKw * 175 * 5)}</td>
                  </tr>
                </>
              ) : (
                <>
                  <tr>
                    <td>
                      Year 1 perf (${m.perfRate}/kW × {m.deratedKw.toFixed(2)} kW)
                    </td>
                    <td className="r m">{fmt(m.perfAnnual)}</td>
                  </tr>
                  <tr>
                    <td>10-yr total (flat × 10)</td>
                    <td className="r m pp">{fmt(m.perf10yr)}</td>
                  </tr>
                </>
              )}
              <tr className="tot">
                <td>Total 10-yr inflows</td>
                <td className="r m gp">{fmt(m.grossInflows)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title">10-year economics</div>
          <table>
            <tbody>
              <tr>
                <td>Gross 10-yr inflows</td>
                <td className="r m gp">{fmt(m.grossInflows)}</td>
              </tr>
              <tr>
                <td>Less system cost</td>
                <td className="r m">−{fmt(m.totalCost)}</td>
              </tr>
              <tr>
                <td>Less direct OpEx (10 × $100)</td>
                <td className="r m">−{fmt(m.directOpex * 10)}</td>
              </tr>
              <tr className="tot">
                <td>10-year net profit</td>
                <td
                  className={`r m bold ${m.netProfit10yr >= 0 ? "gp" : "rp"}`}
                >
                  {fmt(m.netProfit10yr)}
                </td>
              </tr>
              <tr className="sub-row">
                <td colSpan={2}>Capital efficiency</td>
              </tr>
              <tr>
                <td>Net capital at risk</td>
                <td className="r m bold">
                  {fmt(Math.max(0, m.netCapital))}
                </td>
              </tr>
              <tr>
                <td>Annual NOI (perf − OpEx)</td>
                <td className="r m">{fmt(m.annualNOI)}</td>
              </tr>
              <tr>
                <td>Cash-on-cash return</td>
                <td className="r m gp bold">
                  {m.coc > 0 ? `${m.coc.toFixed(1)}%` : "∞"}
                </td>
              </tr>
              <tr>
                <td>Payback period</td>
                <td className="r m">
                  {m.payback > 0 && m.payback < 50
                    ? `${m.payback.toFixed(1)} yrs`
                    : m.netCapital <= 0
                      ? "Day 1"
                      : "—"}
                </td>
              </tr>
              <tr>
                <td>10-yr ROI on gross cost</td>
                <td className="r m">{m.roi10yr.toFixed(0)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="sec-l">
        5 · <span>Reference</span>
      </div>
      <div className="card">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 28,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-3)",
                marginBottom: 10,
                fontWeight: 500,
              }}
            >
              Hardware — IQ Battery 10C DOM
            </div>
            <table>
              <tbody>
                <tr>
                  <td>Nominal capacity</td>
                  <td className="r m">10.08 kWh</td>
                </tr>
                <tr>
                  <td>Continuous power</td>
                  <td className="r m">3.84 kW</td>
                </tr>
                <tr>
                  <td>Usable @ 80% DoD</td>
                  <td className="r m">8.06 kWh</td>
                </tr>
                <tr>
                  <td>SKU</td>
                  <td className="r m" style={{ fontSize: 10 }}>
                    B05-C01-US00-1-3-DOM
                  </td>
                </tr>
                <tr>
                  <td>Crossover (power↔energy)</td>
                  <td className="r m">2.10 hr</td>
                </tr>
                <tr>
                  <td>Battery — Retail</td>
                  <td className="r m">$7,900</td>
                </tr>
                <tr>
                  <td>Battery — Fleet (50+)</td>
                  <td className="r m gp">$6,700</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-3)",
                marginBottom: 10,
                fontWeight: 500,
              }}
            >
              Derating factor — 0.78
            </div>
            <table>
              <tbody>
                <tr>
                  <td>Communications reliability</td>
                  <td className="r m">0.97</td>
                </tr>
                <tr>
                  <td>Temperature impact</td>
                  <td className="r m">0.97</td>
                </tr>
                <tr>
                  <td>State of charge at event</td>
                  <td className="r m">0.95</td>
                </tr>
                <tr>
                  <td>10-yr LFP degradation</td>
                  <td className="r m">0.92</td>
                </tr>
                <tr>
                  <td>Partial perf / opt-outs</td>
                  <td className="r m">0.97</td>
                </tr>
                <tr className="tot">
                  <td>Combined</td>
                  <td className="r m">0.78</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="note">
          <strong>Performance rates (April 2026, residential, flat 10-yr):</strong>{" "}
          Standard $300/kW/yr · Underserved ~$425/kW/yr · Low-Income $525/kW/yr.
          C&amp;I SM steps from $325 (Yrs 1-5) to $175 (Yrs 6-10).
          <br />
          <strong>Enrollment incentive (one-time, paid by CGB at COF):</strong>{" "}
          Resi Grid Edge $130/kWh · Resi non-Grid Edge $30/kWh · C&amp;I $10/kWh.
          <br />
          <strong>ITC stacking (max 70%):</strong> 30% base + 10% Domestic
          Content + 10% Energy Community + 10% LI Cat 1 OR 20% LI Cat 3.
          <br />
          <strong>Sources:</strong> CT ESS Program Manual Jan 2025 · Docket
          25-08-05 · IRC §48E and §6418 · NREL SAM derating methodology.
        </div>
      </div>
    </div>
  );
}
