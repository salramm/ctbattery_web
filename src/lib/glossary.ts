// Glossary (05-UI-DELTA D7). GLOSS and ELDEFS are lifted VERBATIM from
// docs/lifecycle/mockup.html — this file is the port, so the two stay in step.
//
// The mock reached these definitions with a DOM TreeWalker that rewrote text
// nodes. That is §4 shim #2 and is deliberately not ported: nothing here
// inspects or rewrites the DOM. Terms are marked up explicitly with <Abbr>, and
// pills/chips take their definition from ELDEFS through a `def` prop.

/** Inline abbreviations — the terms that appear in running text. */
export const GLOSS: Record<string, string> = {
"ROF":"Reservation of Funds — CGB approval; locks rates and starts the 24-month build window",
"COF":"Certificate of Funds — completion approved; starts the 10-year performance term",
"ESA":"Energy Services Agreement — the resident contract",
"T&C":"CT ESS program Terms & Conditions signature",
"PTO":"Permission to Operate — utility sign-off to energize",
"PIS":"Placed in Service — tax milestone; starts the 60-month recapture window",
"ITC":"Investment Tax Credit — federal \u00A748E credit on system basis",
"DERMS":"Distributed Energy Resource Management System — the EnergyHub dispatch platform",
"EDC":"Electric Distribution Company — Eversource or United Illuminating",
"CGB":"Connecticut Green Bank — administers CT ESS",
"CT ESS":"Connecticut Energy Storage Solutions — the 10-year battery incentive program",
"AHJ":"Authority Having Jurisdiction — the town building department",
"IX":"Interconnection — utility application to connect the system",
"INSP":"AHJ inspection passed",
"PKG":"CGB completion package accepted",
"DOM":"Domestic-content SKU — protects the ITC base and the +10% adder",
"WO":"Work order",
"RMA":"Return merchandise authorization — warranty hardware swap",
"SoC":"State of charge",
"NOI":"Net operating income",
"OpEx":"Operating expenses",
"MTD":"Month to date",
"SLA":"Service-level agreement",
"PO":"Purchase order",
"HA":"Housing authority",
"TPO":"Third-party ownership — GridShift owns the hardware",
"M1":"Connection method 1 — supply-side collar at the revenue meter",
"\u00A748E":"Clean Electricity Investment Tax Credit",
"\u00A76418":"Credit transferability — sell the ITC for cash",
"48E(h)":"Low-income bonus allocation — +10% or +20% by category",
"CAT1":"Category 1 — located in a low-income community (+10%)",
"CAT 1":"Category 1 — located in a low-income community (+10%)",
"ACCRUING":"ITC basis still accumulating from cost documents",
"BASIS_LOCKED":"COF freezes the ITC basis",
"LI":"Low-income — CT ESS top tier / federal adder context"};

/** Element definitions — what a pill, chip, code or status badge means. */
export const ELDEFS: Record<string, string> = {
"LI":"Low Income tier — $550/kW-yr performance rate","UND":"Underserved tier — $450/kW-yr performance rate",
"GE":"Grid Edge circuit — $130/kWh enrollment incentive","EC":"Energy Community — +10% federal ITC adder",
"X1":"CGB application # (ESS-#)","X2":"EDC account # + interconnection app #","X3":"Enlighten site ID + gateway serial",
"X4":"EnergyHub DERMS enrollment ID","X5":"AHJ permit #",
"B-PERMIT-REV":"Blocked: permit under review at the AHJ","B-CGB-DEFIC":"Blocked: CGB deficiency — 5-business-day response clock",
"B-DERMS":"Blocked: not yet visible in EnergyHub (7-day escalation)","B-NAME-MATCH":"Blocked: EDC account name does not match the resident",
"B-SIG":"Blocked: signature outstanding","B-MASTER-AGMT":"Blocked: master property agreement not verified",
"AWAIT-TPO":"Holding: GridShift TPO / Eligible Contractor registration pending at CGB",
"B-IX-QUEUE":"Blocked: interconnection application in utility queue","B-IX-STUDY":"Blocked: interconnection requires study",
"B-EQUIP":"Blocked: equipment not available to allocate","B-M4-UPGRADE":"Blocked: panel upgrade required (method M4)",
"B-ACCESS":"Blocked: resident access not confirmed","B-METER-APPT":"Blocked: EDC meter appointment pending",
"B-CREW":"Blocked: no crew capacity","B-SITE-COND":"Blocked: site condition found at install",
"B-COMMS":"Blocked: no telemetry after install","B-INSPECT-FAIL":"Blocked: failed AHJ inspection",
"B-PTO":"Blocked: awaiting PTO (14-day escalation)","B-CGB-PKG":"Blocked: completion package deficiency",
"B-CONTACT":"Blocked: cannot reach resident",
"RECEIVED":"Cash matched to the expected row","EXPECTED":"Ledger row written; awaiting cash",
"VARIANCE":"Received does not equal expected — needs review","IN COHORT":"Claim assigned to a \u00A76418 transfer cohort",
"BASIS LOCKED":"COF freezes the ITC basis","EVIDENCE":"Diligence evidence complete","ACCRUING":"ITC basis still accumulating",
"ONLINE":"Reported during the event","FIELD NEEDED":"Remote steps exhausted — truck roll required",
"TRIAGED":"Remote diagnostics attempted","VERIFIED":"Closure machine-verified by clean telemetry",
"TURNOVER":"Resident change case open — 30-day clock","OPEN":"Season in progress — reconciles at close",
"ASSEMBLING":"Claims being packaged","LISTED":"On the transfer marketplace","TERM SHEET":"Buyer terms agreed",
"DILIGENCE":"Buyer diligence underway","EXECUTED":"Transfer agreement signed","CASH":"Cash received"};

/**
 * Definition for a token, checking element definitions first (a "LI" pill means
 * the tier, not the federal adder context) and falling back to the inline
 * glossary. Lookup is case-insensitive on the second pass so "Variance" and
 * "VARIANCE" both resolve.
 */
export function defineTerm(key: string): string | undefined {
  if (key in ELDEFS) return ELDEFS[key];
  if (key in GLOSS) return GLOSS[key];
  const upper = key.toUpperCase();
  if (upper in ELDEFS) return ELDEFS[upper];
  if (upper in GLOSS) return GLOSS[upper];
  // Status enums arrive as SCREAMING_SNAKE; the mock writes them with spaces.
  const spaced = upper.replace(/_/g, ' ');
  return ELDEFS[spaced] ?? GLOSS[spaced];
}
