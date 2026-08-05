"use client";

import { useState } from "react";

const TABS = [
  "Overview",
  "Federal ITC",
  "CT ESS",
  "Maps",
  "Costs",
  "Requirements",
] as const;

export default function IceClient() {
  const [tab, setTab] = useState(0);
  return (
    <div className="ice-v3">
      <div className="top">
        <div className="logo">
          Grid<em>Shift</em>
        </div>
        <div className="logo-tag">ICE v3</div>
        <div className="top-r">
          <div className="pulse" />
          <div className="top-s">Incentives Classification Engine · Internal</div>
        </div>
      </div>

      <div className="nav">
        {TABS.map((t, i) => (
          <button
            key={t}
            type="button"
            className={`nb${tab === i ? " on" : ""}`}
            onClick={() => setTab(i)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="main">
        {tab === 0 && <SecOverview onGo={setTab} />}
        {tab === 1 && <SecITC />}
        {tab === 2 && <SecESS />}
        {tab === 3 && <SecMaps />}
        {tab === 4 && <SecCosts />}
        {tab === 5 && <SecRequirements />}
      </div>
    </div>
  );
}

function SecOverview({ onGo }: { onGo: (i: number) => void }) {
  return (
    <>
      <div className="sh">
        Incentives Classification <em>Engine</em> v3
      </div>
      <div className="ss">
        Three independent incentive layers stack on every deployment. Clean
        financial model: NOI = Revenue – Direct OpEx only. Corporate G&amp;A
        reported separately below NOI.
      </div>
      <div className="sg">
        <div className="st">
          <div className="sv" style={{ color: "var(--g)" }}>
            30–70%
          </div>
          <div className="sl">Federal ITC</div>
        </div>
        <div className="st">
          <div className="sv" style={{ color: "var(--a)" }}>
            $30–$130
          </div>
          <div className="sl">Enrollment $/kWh</div>
        </div>
        <div className="st">
          <div className="sv" style={{ color: "var(--bl)" }}>
            $300–$550
          </div>
          <div className="sl">Performance $/kW/yr</div>
        </div>
        <div className="st">
          <div className="sv" style={{ color: "var(--p)" }}>
            10 yrs
          </div>
          <div className="sl">Duration</div>
        </div>
        <div className="st">
          <div className="sv" style={{ color: "var(--c)" }}>
            2033
          </div>
          <div className="sl">ITC Through</div>
        </div>
        <div className="st">
          <div className="sv" style={{ color: "var(--text)" }}>
            $100
          </div>
          <div className="sl">Direct OpEx/sys/yr</div>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <div
          className="c cg"
          style={{ cursor: "pointer" }}
          onClick={() => onGo(1)}
        >
          <div className="h3" style={{ color: "var(--g)" }}>
            Layer 1 · Federal
          </div>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: 18,
              marginBottom: 4,
            }}
          >
            IRC §48E ITC
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--t2)",
              lineHeight: 1.5,
            }}
          >
            One-time credit. Base 30% + up to 40% adders. Full credit through
            2033 for storage. Transferable at ~92¢/$.
          </div>
        </div>
        <div
          className="c ca"
          style={{ cursor: "pointer" }}
          onClick={() => onGo(2)}
        >
          <div className="h3" style={{ color: "var(--a)" }}>
            Layer 2 · CT State
          </div>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: 18,
              marginBottom: 4,
            }}
          >
            Enrollment Incentive
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--t2)",
              lineHeight: 1.5,
            }}
          >
            One-time at commissioning. Grid Edge $130/kWh, Non-GE $30/kWh. TPO
            receives as system owner.
          </div>
        </div>
        <div
          className="c cb"
          style={{ cursor: "pointer" }}
          onClick={() => onGo(2)}
        >
          <div className="h3" style={{ color: "var(--bl)" }}>
            Layer 3 · CT State
          </div>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: 18,
              marginBottom: 4,
            }}
          >
            Performance Incentive
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--t2)",
              lineHeight: 1.5,
            }}
          >
            $/kW/yr for 10 years. $300 Standard, ~$425 Underserved, $525 LI.
            Primary revenue driver.
          </div>
        </div>
      </div>
    </>
  );
}

function SecITC() {
  return (
    <>
      <div className="sh">
        Federal Investment <em>Tax Credit</em>
      </div>
      <div className="ss">
        IRC §48E. Base 30% + up to 40% bonus. Full credit through 2033 for
        standalone storage. No July 2026 deadline. Phaseout: 75% in 2034, 50% in
        2035, 0% in 2036.
      </div>
      <div className="tg">
        <div className="t">
          <div
            className="tb"
            style={{ color: "var(--g)", background: "var(--gl)" }}
          >
            Base
          </div>
          <div className="tn">Base ITC</div>
          <div className="tr" style={{ color: "var(--g)" }}>
            30%
          </div>
          <div className="tu">automatic · systems &lt; 1 MW</div>
          <div className="td">
            FEOC-compliant. Placed in service after Jan 1, 2025. Enphase 10C
            DOM:{" "}
            <span
              className="tag"
              style={{ color: "var(--g)", background: "var(--gl)" }}
            >
              Qualified
            </span>
          </div>
        </div>
        <div className="t">
          <div
            className="tb"
            style={{ color: "var(--g)", background: "var(--gl)" }}
          >
            Adder
          </div>
          <div className="tn">Domestic Content</div>
          <div className="tr" style={{ color: "var(--g)" }}>
            +10%
          </div>
          <div className="tu">DOM SKU only · B05-C01-US00-1-3-DOM</div>
          <div className="td">
            Net benefit $390–640/unit vs standard. <strong>Always order DOM.</strong>
          </div>
        </div>
        <div className="t">
          <div
            className="tb"
            style={{ color: "var(--bl)", background: "var(--bll)" }}
          >
            Adder
          </div>
          <div className="tn">Energy Community</div>
          <div className="tr" style={{ color: "var(--bl)" }}>
            +10%
          </div>
          <div className="tu">location-based · no application</div>
          <div className="td">
            Bridgeport-Stamford-Norwalk MSA and New Haven-Milford MSA confirmed.
          </div>
        </div>
        <div className="t">
          <div
            className="tb"
            style={{ color: "var(--p)", background: "var(--pl)" }}
          >
            Adder
          </div>
          <div className="tn">Low-Income Bonus</div>
          <div className="tr" style={{ color: "var(--p)" }}>
            +10% or +20%
          </div>
          <div className="tu">MUTUALLY EXCLUSIVE · Cat 1 OR Cat 3</div>
          <div className="td">
            Cat 1 (+10%): LI census tract. Cat 3 (+20%): LIHTC/public housing.
            Cannot stack. Max +20%.
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Config</th>
            <th>Cost</th>
            <th>30% Base</th>
            <th>40%</th>
            <th>50%</th>
            <th>60%</th>
            <th>70% Max</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1× 10C DOM</td>
            <td className="m">$7,900</td>
            <td className="m gr">$2,370</td>
            <td className="m gr">$3,160</td>
            <td className="m bu">$3,950</td>
            <td className="m pu">$4,740</td>
            <td className="m pu">$5,530</td>
          </tr>
          <tr>
            <td>2× 10C DOM</td>
            <td className="m">$13,500</td>
            <td className="m gr">$4,050</td>
            <td className="m gr">$5,400</td>
            <td className="m bu">$6,750</td>
            <td className="m pu">$8,100</td>
            <td className="m pu">$9,450</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function SecESS() {
  return (
    <>
      <div className="sh">
        CT ESS <em>Incentives</em>
      </div>
      <div className="ss">
        April 2026 framework. Enrollment (one-time, paid by CGB) + Performance
        (10 years, paid by EDC).
      </div>
      <div className="h2">Enrollment Incentive</div>
      <div className="tg">
        <div className="t">
          <div className="tb" style={{ color: "var(--g)", background: "var(--gl)" }}>
            Resi
          </div>
          <div className="tn">Grid Edge</div>
          <div className="tr" style={{ color: "var(--a)" }}>
            $130<span style={{ fontSize: 14 }}>/kWh</span>
          </div>
          <div className="td">Top 10% outage circuits. 2×10C = $2,600.</div>
        </div>
        <div className="t">
          <div className="tb" style={{ color: "var(--g)", background: "var(--gl)" }}>
            Resi
          </div>
          <div className="tn">Non-Grid Edge</div>
          <div className="tr" style={{ color: "var(--a)" }}>
            $30<span style={{ fontSize: 14 }}>/kWh</span>
          </div>
          <div className="td">All other residential. 2×10C = $600.</div>
        </div>
        <div className="t">
          <div className="tb" style={{ color: "var(--c)", background: "var(--cl)" }}>
            C&amp;I
          </div>
          <div className="tn">Priority C&amp;I</div>
          <div className="tr" style={{ color: "var(--a)" }}>
            $10<span style={{ fontSize: 14 }}>/kWh</span>
          </div>
          <div className="td">Minimal value.</div>
        </div>
      </div>
      <div className="h2">Performance Incentive — 10 Years</div>
      <div className="tg">
        <div className="t">
          <div
            className="tb"
            style={{ color: "var(--text)", background: "rgba(0,0,0,0.05)" }}
          >
            Standard
          </div>
          <div className="tn">Standard Residential</div>
          <div className="tr" style={{ color: "var(--bl)" }}>
            $300<span style={{ fontSize: 14 }}>/kW/yr</span>
          </div>
          <div className="td">Any Eversource/UI residential. No income/location req.</div>
        </div>
        <div className="t">
          <div className="tb" style={{ color: "var(--a)", background: "var(--al)" }}>
            Underserved
          </div>
          <div className="tn">Underserved Community</div>
          <div className="tr" style={{ color: "var(--bl)" }}>
            ~$425<span style={{ fontSize: 14 }}>/kW/yr</span>
          </div>
          <div className="td">DECD distressed municipality OR EJ census block.</div>
        </div>
        <div className="t">
          <div className="tb" style={{ color: "var(--p)", background: "var(--pl)" }}>
            Low-Income
          </div>
          <div className="tn">Low-Income Household</div>
          <div className="tr" style={{ color: "var(--bl)" }}>
            $525<span style={{ fontSize: 14 }}>/kW/yr</span>
          </div>
          <div className="td">≤60% SMI. MFAH qualifies. Supersedes Underserved.</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Config</th>
            <th>Avg kW</th>
            <th>Standard</th>
            <th>Underserved</th>
            <th>Low-Income</th>
            <th>SM C&amp;I</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1× 10C (10-yr total)</td>
            <td className="m">2.45</td>
            <td className="m">$7,350</td>
            <td className="m am">$10,413</td>
            <td className="m pu">$12,863</td>
            <td className="m cy">$8,269</td>
          </tr>
          <tr>
            <td>2× 10C (10-yr total)</td>
            <td className="m">4.89</td>
            <td className="m">$14,670</td>
            <td className="m am">$20,783</td>
            <td className="m pu">$25,673</td>
            <td className="m cy">$16,503</td>
          </tr>
        </tbody>
      </table>
      <div className="nt nbl">
        <strong>Residential &gt;&gt; C&amp;I:</strong> LI residential $5,250/kW
        over 10 yr. SM C&amp;I $3,375/kW. Individually metered affordable
        housing = 56% more revenue than C&amp;I.
      </div>
    </>
  );
}

function SecMaps() {
  return (
    <>
      <div className="sh">
        Eligibility <em>Maps</em>
      </div>
      <div className="ss">
        Two map sets — Federal ITC adders (location + equipment) and CT ESS
        tiers (income + circuit + municipality).
      </div>
      <div className="h2">Federal ITC</div>
      <div className="mg">
        <a
          className="mc"
          href="https://arcgis.netl.doe.gov/portal/apps/experiencebuilder/experience/?id=a2ce47d4721a477a8701bd0e08495e1d"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="mp">🗺️</div>
          <div className="mi">
            <div className="mt">Energy Communities (DOE/NETL)</div>
            <div className="md">+10% ITC. Bridgeport + New Haven MSAs confirmed.</div>
          </div>
        </a>
        <a
          className="mc"
          href="https://cimsprodprep.cdfifund.gov/CIMS4/apps/pn-nmtc/index.aspx"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="mp">📍</div>
          <div className="mi">
            <div className="mt">CDFI NMTC Low-Income Tracts</div>
            <div className="md">+10% Cat 1 or +20% Cat 3 (mutually exclusive).</div>
          </div>
        </a>
      </div>
      <div className="h2" style={{ marginTop: 24 }}>
        CT ESS Tiers
      </div>
      <div className="mg">
        <a
          className="mc"
          href="https://eversource.maps.arcgis.com/apps/webappviewer/index.html?id=2f0c365e197f4ce0b9ddf4c988d2ea57"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="mp">⚡</div>
          <div className="mi">
            <div className="mt">Grid Edge Circuits — Eversource</div>
            <div className="md">$130 vs $30/kWh enrollment. Highest dollar impact.</div>
          </div>
        </a>
        <a
          className="mc"
          href="https://portal.ct.gov/decd/services/business-development/distressed-municipalities"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="mp">🏘️</div>
          <div className="mi">
            <div className="mt">DECD Distressed Municipalities</div>
            <div className="md">25-town list → Underserved tier. Simple name match.</div>
          </div>
        </a>
        <a
          className="mc"
          href="https://ctdeep.maps.arcgis.com/apps/webappviewer/index.html?id=03b2bc2b60c945918ccab5a9f6bc43ea"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="mp">🌍</div>
          <div className="mi">
            <div className="mt">EJ Communities — DEEP</div>
            <div className="md">Census blocks → Underserved via §22a-20a.</div>
          </div>
        </a>
      </div>
    </>
  );
}

function SecCosts() {
  return (
    <>
      <div className="sh">
        Costs &amp; <em>Hardware</em>
      </div>
      <div className="ss">
        Enphase IQ Battery 10C DOM. Direct operating expenses = $100/system/year.
        Corporate G&amp;A reported separately.
      </div>
      <div className="h2">Hardware</div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>10C DOM ✓</th>
            <th>5P</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Capacity</td>
            <td className="m gr">10 kWh</td>
            <td className="m">5 kWh</td>
          </tr>
          <tr>
            <td>Max Output</td>
            <td className="m gr">7.08 kW</td>
            <td className="m">3.84 kW</td>
          </tr>
          <tr>
            <td>Warranty</td>
            <td className="m gr">15 yr</td>
            <td className="m">15 yr</td>
          </tr>
          <tr>
            <td>Domestic Content</td>
            <td className="m gr">✓ +10% ITC</td>
            <td className="m re">✗</td>
          </tr>
        </tbody>
      </table>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <div className="t">
          <div className="tn">1× 10C</div>
          <div className="tr" style={{ color: "var(--text)" }}>
            $7,900
          </div>
          <div className="tu">all-in installed (fleet 50+)</div>
        </div>
        <div className="t">
          <div className="tb" style={{ color: "var(--g)", background: "var(--gl)" }}>
            Recommended
          </div>
          <div className="tn">2× 10C</div>
          <div className="tr" style={{ color: "var(--text)" }}>
            $13,500
          </div>
          <div className="tu">17% lower $/kWh</div>
        </div>
      </div>

      <div className="h2">Direct Operating Expenses (per system, per year)</div>
      <div className="nt ng">
        <strong>These are property-level costs</strong> — they scale with each
        system added. Like insurance and maintenance reserves on a rental
        property. Corporate G&amp;A (salaries, office, software) sits below the
        NOI line.
      </div>
      <div className="c cg">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th className="r">$/yr</th>
              <th>Basis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Equipment insurance (inland marine floater)</td>
              <td className="m r">$80</td>
              <td>Fleet policy. ~1% of $8K equipment replacement value.</td>
            </tr>
            <tr>
              <td>Warranty / repair reserve</td>
              <td className="m r">$20</td>
              <td>
                Enphase 15-yr warranty covers defects. Reserve for non-warranty
                items (lightning, pests, connectivity). 2% of systems × $300
                each.
              </td>
            </tr>
            <tr>
              <td>Charging electricity</td>
              <td className="m r gr">$0</td>
              <td>Customer pays via their Eversource meter. ~$9/mo on ~1,000 kWh/yr.</td>
            </tr>
            <tr>
              <td>Monitoring / DERMS platform</td>
              <td className="m r gr">$0</td>
              <td>Enphase Enlighten = free. EnergyHub DERMS = utility-paid.</td>
            </tr>
            <tr>
              <td>Maintenance labor</td>
              <td className="m r gr">$0</td>
              <td>Field tech salary is corporate G&amp;A, not per-system OpEx.</td>
            </tr>
            <tr style={{ background: "var(--gl)", fontWeight: 700 }}>
              <td>
                <strong>Total direct OpEx</strong>
              </td>
              <td className="m r gr" style={{ fontSize: 16 }}>
                <strong>$100</strong>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="h2">Corporate G&amp;A (CT Battery Solutions owner-level costs)</div>
      <div className="nt na">
        <strong>These are NOT operating expenses.</strong> They&apos;re the
        cost of running CT Battery Solutions as a business — like a property management
        company&apos;s overhead. Reported below NOI.
      </div>
      <div className="c ca">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th className="r">Annual</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Operations manager</td>
              <td className="m r">$90,000</td>
              <td>Monitoring, enrollment, compliance. Founder initially.</td>
            </tr>
            <tr>
              <td>Field technician</td>
              <td className="m r">$65,000</td>
              <td>Site visits, install support. 1 tech / 500 units.</td>
            </tr>
            <tr>
              <td>Admin / legal / accounting</td>
              <td className="m r">$35,000</td>
              <td>Bookkeeper, tax, legal, CGB reporting.</td>
            </tr>
            <tr>
              <td>GL insurance ($1M required)</td>
              <td className="m r">$12,000</td>
              <td>Program-required policy. CGB as cert holder.</td>
            </tr>
            <tr>
              <td>Software / CRM</td>
              <td className="m r">$10,000</td>
              <td>Fleet analytics, accounting. CGB Salesforce = free.</td>
            </tr>
            <tr>
              <td>Vehicle</td>
              <td className="m r">$15,000</td>
              <td>Lease + fuel.</td>
            </tr>
            <tr>
              <td>Office</td>
              <td className="m r">$6,000</td>
              <td>$500/mo.</td>
            </tr>
            <tr style={{ background: "var(--al)", fontWeight: 700 }}>
              <td>
                <strong>Total G&amp;A</strong>
              </td>
              <td className="m r am" style={{ fontSize: 16 }}>
                <strong>$233,000</strong>
              </td>
              <td>At 500 units: $466/system</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="h2">Derating Model</div>
      <div className="c">
        <table>
          <thead>
            <tr>
              <th>Factor</th>
              <th className="r">Value</th>
              <th>What It Captures</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Communications</td>
              <td className="m r">97%</td>
              <td>Gateway offline during dispatch</td>
            </tr>
            <tr>
              <td>Temperature</td>
              <td className="m r">97%</td>
              <td>Summer heat output reduction</td>
            </tr>
            <tr>
              <td>SoC at event start</td>
              <td className="m r">95%</td>
              <td>Not fully charged when event called</td>
            </tr>
            <tr>
              <td>10-yr avg degradation</td>
              <td className="m r">92%</td>
              <td>LFP capacity loss over fleet life</td>
            </tr>
            <tr>
              <td>Partial performance</td>
              <td className="m r">97%</td>
              <td>Occasional underperformance</td>
            </tr>
            <tr style={{ background: "var(--gl)", fontWeight: 700 }}>
              <td>
                <strong>Combined</strong>
              </td>
              <td className="m r gr" style={{ fontSize: 14 }}>
                <strong>0.78</strong>
              </td>
              <td>1×10C → 2.45 kW · 2×10C → 4.89 kW</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function SecRequirements() {
  return (
    <>
      <div className="sh">
        Program <em>Requirements</em>
      </div>
      <div className="ss">
        From the ESS Program Manual (Jan 2025). TPO + Contractor application
        requirements and the operational structure with exact manual references.
      </div>

      <div className="h2">Why TPO Registration Is Required</div>
      <div className="nt nr">
        <strong>If CT Battery Solutions owns the battery, CT Battery Solutions IS a TPO.</strong> The
        manual defines TPO as &quot;a company responsible for owning and
        operating a BESS with a customer through a lease or power-purchase
        agreement&quot; (Sec. 4.3.2). The ESA is a lease. CT Battery Solutions must own
        equipment to claim 48E ITC. No path around it.
      </div>

      <div className="h2">How the Structure Works — With Exact References</div>
      <div className="c cg">
        <div
          style={{
            fontSize: 12.5,
            lineHeight: 1.7,
            color: "var(--t2)",
          }}
        >
          {[
            {
              t: "1. Register as Eligible Contractor + Eligible TPO",
              q: "Companies may apply as both an Eligible Contractor and TPO if they intend to sell, install, own, and operate BESS to customers.",
              ref: "→ Program Manual Sec. 4.3.2, paragraph 2",
            },
            {
              t: "2. Construction partner installs as subcontractor",
              q: "Coordinate installation of grid-tied BESS through direct employees or subcontractors.",
              extra:
                'Grid interconnection electrician can be "Subcontractor or Employee" with E-1 license.',
              ref: "→ Sec. 4.3.5 Item 11 · Sec. 4.3.1 Table 3",
            },
            {
              t: "3. Enroll customers via Enrollment Platform",
              q: "Customers seeking participation in Energy Storage Solutions must be first deemed eligible. The Contractor or TPO must register their respective Customers using the Customer Enrollment Platform.",
              ref: "→ Sec. 3.2.2 · Platform: ctgreenbank.my.site.com",
            },
            {
              t: "4. Customer designates CT Battery Solutions as direct payee",
              q: "Customers can designate a direct payment payee at the time of enrollment, and EDCs will assign upfront and/or performance incentive payments in part or in full to a TPO or financial institution, as specified by the Customer.",
              extra: "Both parties sign acknowledgment on the Application.",
              ref: '→ Sec. 6.4.3 — "Direct Payments"',
            },
            {
              t: "5. CT Battery Solutions owns equipment, claims ITC",
              q: "If the BESS is owned by a TPO, the equipment title shall remain with the TPO.",
              extra: "As commercial owner, CT Battery Solutions claims 48E ITC, transfers via §6418.",
              ref: '→ Sec. 4.1.1 — "Ownership"',
            },
            {
              t: "6. Enphase handles dispatch (no aggregator needed)",
              q: "OEM/Operator must provide: customer enrollment into an approved DERMS platform... charge and dispatch control of individual systems... ability to send dispatch commands and receive inverter and critical operating data in real time.",
              extra:
                "Enphase does this natively via EnergyHub integration. Vendor fee: $0.",
              ref: "→ Sec. 4.2.1 — Technical Requirements",
            },
          ].map((s, i, arr) => (
            <div
              key={s.t}
              style={{
                marginBottom: i < arr.length - 1 ? 14 : 0,
                paddingBottom: i < arr.length - 1 ? 14 : 0,
                borderBottom:
                  i < arr.length - 1 ? "1px solid var(--border)" : undefined,
              }}
            >
              <strong style={{ color: "var(--text)" }}>{s.t}</strong>
              <br />
              <em>&ldquo;{s.q}&rdquo;</em>
              {s.extra && <> {s.extra}</>}
              <br />
              <span
                className="m"
                style={{ fontSize: 10, color: "var(--t3)" }}
              >
                {s.ref}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h2">TPO Application Requirements</div>
      <div className="c cr">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Document</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="m">1</td>
              <td>
                <strong>Application + Company Summary</strong>
              </td>
              <td>Experience with BESS</td>
            </tr>
            <tr>
              <td className="m">2</td>
              <td>
                <strong>2 Years Audited Financials</strong>
              </td>
              <td>
                Key blocker. PAs have discretion for &quot;additional supporting
                information.&quot; Present: capitalization + construction
                partner guarantee + experienced hire.
              </td>
            </tr>
            <tr>
              <td className="m">3</td>
              <td>
                <strong>Eligible Contractor Agreement</strong>
              </td>
              <td>Formal sub agreement with construction partner.</td>
            </tr>
            <tr>
              <td className="m">4</td>
              <td>
                <strong>Sample Lease/PPA (ESA)</strong>
              </td>
              <td>The ESA template. Needs legal review.</td>
            </tr>
            <tr>
              <td className="m">5</td>
              <td>
                <strong>$1M GL + WC + Auto Insurance</strong>
              </td>
              <td>CGB as Certificate Holder.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="h2">Contractor Application Requirements</div>
      <div className="c ca">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Document</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="m">1</td>
              <td>
                <strong>Bank Reference Letter</strong>
              </td>
              <td>Good standing, relationship length.</td>
            </tr>
            <tr>
              <td className="m">2</td>
              <td>
                <strong>E-1 + HIC Licenses</strong>
              </td>
              <td>E-1 via subcontractor. HIC for residential sales.</td>
            </tr>
            <tr>
              <td className="m">3</td>
              <td>
                <strong>Sales Contract Sample</strong>
              </td>
              <td>Specs, warranty, cost, estimated incentive.</td>
            </tr>
            <tr>
              <td className="m">4</td>
              <td>
                <strong>10-Year Workmanship Warranty</strong>
              </td>
              <td>Separate from manufacturer warranty.</td>
            </tr>
            <tr>
              <td className="m">5</td>
              <td>
                <strong>$1M GL Insurance</strong>
              </td>
              <td>CGB as Certificate Holder.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
