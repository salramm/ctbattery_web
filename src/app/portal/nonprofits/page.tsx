import type { Metadata } from "next";
import "./cbo.css";

export const metadata: Metadata = {
  title: "CBO Partnership Directory — CT Battery Solutions Portal",
  robots: { index: false, follow: false },
};

export default function NonprofitsPage() {
  return (
    <div className="cbo-dir">
      <nav className="inner-nav">
        <div className="nav-brand">
          Grid<em>Shift</em> · CBO Directory
        </div>
        <div className="nav-links">
          <a href="#sequence" className="nav-link">
            Sequence
          </a>
          <a href="#caa" className="nav-link">
            CAAs
          </a>
          <a href="#energy" className="nav-link">
            Energy
          </a>
          <a href="#fqhc" className="nav-link">
            FQHCs
          </a>
          <a href="#food" className="nav-link">
            Food
          </a>
          <a href="#faith" className="nav-link">
            Faith
          </a>
          <a href="#senior" className="nav-link">
            Senior
          </a>
          <a href="#disability" className="nav-link">
            Disability
          </a>
        </div>
      </nav>

      <div className="hdr">
        <div className="eyebrow">
          Grid<strong>Shift</strong> · Customer Acquisition Strategy · April
          2026
        </div>
        <h1>
          Connecticut CBO &amp; nonprofit{" "}
          <em>partnership directory</em>
        </h1>
        <p className="lede">
          Ranked directory of community-based organizations, nonprofits, and
          institutional partners for residential single-family LI customer
          acquisition. Each entry includes coverage area, contact information,
          partnership angle, and recommended structure for verified-LI customer
          flow.
        </p>

        <div className="summary">
          <div className="summary-l">Strategic summary</div>
          <p>
            The single highest-ROI partnership in this entire directory is{" "}
            <strong>Generation Power CT</strong> (formerly Operation Fuel).
            Their endorsement credentials CT Battery Solutions across the entire CT
            energy-equity ecosystem.
          </p>
          <p>
            The four highest-priority CAA partnerships (CRT, CAANH, ACE, NOI)
            cover 80%+ of your Hartford / Bridgeport / New Haven / Waterbury
            target market. Each CAA processes thousands of LIHEAP applications
            annually for income-verified households.
          </p>
          <p>
            Tier A partnerships produce verified-LI customer flow within 3-6
            months. Tier B (FQHCs, food) layer in 3-6 months later. Tier C
            (faith, senior, disability) compound over 12+ months but become
            durable acquisition channels.
          </p>
        </div>
      </div>

      {/* Sequence */}
      <section id="sequence" className="tier-section first">
        <div className="tier-header">
          <span className="tier-badge roadmap">Roadmap</span>
          <h2 className="tier-title">Recommended sequencing</h2>
        </div>
        <p className="tier-sub">
          Twelve-month rollout sequence prioritized by lead-flow speed and
          partnership build time. Each phase builds on the credentialing
          established in the prior phase.
        </p>
        <div className="sequence">
          <div className="sequence-grid">
            <div className="seq-block b1">
              <div className="seq-time">Months 0–3</div>
              <div className="seq-orgs">
                <ul>
                  <li>Generation Power CT</li>
                  <li>CRT (Hartford)</li>
                  <li>CAANH (New Haven)</li>
                  <li>ACE (Bridgeport)</li>
                  <li>NOI (Waterbury)</li>
                  <li>CHC, Inc. (multi-city FQHC)</li>
                  <li>211 / United Way listing</li>
                  <li>Connecticut Foodshare</li>
                </ul>
              </div>
            </div>
            <div className="seq-block b2">
              <div className="seq-time">Months 3–6</div>
              <div className="seq-orgs">
                <ul>
                  <li>Charter Oak Health Center</li>
                  <li>Optimus Health Care</li>
                  <li>Cornell Scott-Hill Health</li>
                  <li>StayWell Health Center</li>
                  <li>Catholic Charities of CT</li>
                  <li>HRA-NB (New Britain)</li>
                  <li>TEAM, Inc. (Derby/Ansonia)</li>
                </ul>
              </div>
            </div>
            <div className="seq-block b3">
              <div className="seq-time">Months 6–12</div>
              <div className="seq-orgs">
                <ul>
                  <li>Black Ministerial Alliance</li>
                  <li>CONECT</li>
                  <li>Hispanic Federation</li>
                  <li>Area Agencies on Aging</li>
                  <li>The Arc of Connecticut</li>
                  <li>CT Energy Efficiency Board</li>
                </ul>
              </div>
            </div>
            <div className="seq-block b4">
              <div className="seq-time">Year 2+</div>
              <div className="seq-orgs">
                <ul>
                  <li>CT Dept of Aging &amp; Disability</li>
                  <li>CT Council on Dev Disabilities</li>
                  <li>State institutional partners</li>
                  <li>Multi-state expansion (NY, MA)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="note success">
          <strong>The strategic logic:</strong> Tier A energy-network
          partnerships produce verified-LI lead flow immediately. Tier B FQHC
          and food partnerships layer in 2-3 months later as your operational
          capacity grows. Tier C faith/senior/disability networks build over a
          year+ but compound — once a pastor in Hartford or a CHW at Cornell
          Scott-Hill has referred 3-5 customers and seen good outcomes, they
          refer continuously without further effort.
        </div>
      </section>

      {/* Tier A · CAA */}
      <section id="caa" className="tier-section">
        <div className="tier-header">
          <span className="tier-badge a">Tier A</span>
          <h2 className="tier-title">Energy assistance navigators</h2>
        </div>
        <p className="tier-sub">
          Connecticut&apos;s nine Community Action Agencies (CAAs) are the
          LIHEAP intake and processing infrastructure for the entire state.
          Each CAA conducts income verification on every applicant. A CAA
          referral arrives with the income verification documentation already
          in hand. The single highest-leverage Tier A category — start here.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: "28%" }}>Organization</th>
                <th style={{ width: "18%" }}>Coverage</th>
                <th style={{ width: "14%" }}>Phone</th>
                <th>Why it matters for CT Battery Solutions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="priority">
                <td>
                  <span className="org-name">Community Renewal Team (CRT)</span>
                  <span className="org-meta">
                    555 Windsor St, Hartford, CT 06120
                    <br />
                    crtct.org
                  </span>
                </td>
                <td>
                  <span className="org-coverage">
                    Greater Hartford &amp; Middletown
                  </span>
                </td>
                <td>
                  <span className="org-phone">860-560-5800</span>
                </td>
                <td>
                  <span className="org-note">
                    Largest CAA in CT. Processes 30K+ LIHEAP applications/year.
                    Covers your #1 target city.{" "}
                    <strong>Lead with CRT first</strong> — credibility cascade
                    to all other CT social services.
                  </span>
                </td>
              </tr>
              <tr className="priority">
                <td>
                  <span className="org-name">
                    Community Action Agency of New Haven (CAANH)
                  </span>
                  <span className="org-meta">
                    419 Whalley Ave, New Haven, CT 06511
                    <br />
                    caanh.net
                  </span>
                </td>
                <td>
                  <span className="org-coverage">New Haven</span>
                </td>
                <td>
                  <span className="org-phone">203-387-7700</span>
                </td>
                <td>
                  <span className="org-note">
                    Heavy LIHEAP intake volume in target city. Strong tenant
                    rights and energy navigation programs. Critical for New
                    Haven coverage.
                  </span>
                </td>
              </tr>
              <tr className="priority">
                <td>
                  <span className="org-name">
                    Alliance for Community Empowerment (ACE)
                  </span>
                  <span className="org-meta">
                    1070 Park Ave, Bridgeport, CT 06604
                  </span>
                </td>
                <td>
                  <span className="org-coverage">Bridgeport &amp; Norwalk</span>
                </td>
                <td>
                  <span className="org-phone">203-324-6904</span>
                </td>
                <td>
                  <span className="org-note">
                    Bridgeport&apos;s primary LIHEAP processor. Covers the #2
                    distressed-municipality target. Formerly known as ABCD.
                  </span>
                </td>
              </tr>
              <tr className="priority">
                <td>
                  <span className="org-name">New Opportunities, Inc. (NOI)</span>
                  <span className="org-meta">
                    232 N Elm St, Waterbury, CT 06702
                    <br />
                    newopportunitiesinc.org
                  </span>
                </td>
                <td>
                  <span className="org-coverage">
                    Waterbury, Meriden, Torrington
                  </span>
                </td>
                <td>
                  <span className="org-phone">203-756-8151</span>
                </td>
                <td>
                  <span className="org-note">
                    Covers Waterbury (#3 target), Meriden, and Torrington in
                    one partnership. Highest geographic efficiency per
                    relationship.
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="org-name">
                    Human Resources Agency of New Britain (HRA-NB)
                  </span>
                  <span className="org-meta">
                    180 Clinton St, New Britain, CT 06053
                  </span>
                </td>
                <td>
                  <span className="org-coverage">New Britain &amp; Bristol</span>
                </td>
                <td>
                  <span className="org-phone">860-225-8601</span>
                </td>
                <td>
                  <span className="org-note">
                    New Britain is on the DECD distressed-municipality list.
                    Worth targeting for Underserved-tier expansion.
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="org-name">TEAM, Inc.</span>
                  <span className="org-meta">
                    30 Elizabeth St, Derby, CT 06418
                    <br />
                    teamcaa.org
                  </span>
                </td>
                <td>
                  <span className="org-coverage">Derby &amp; Ansonia</span>
                </td>
                <td>
                  <span className="org-phone">203-736-5420</span>
                </td>
                <td>
                  <span className="org-note">
                    Smaller CAA but covers Ansonia and Derby — both DECD
                    distressed municipalities. Modest volume but qualified
                    target population.
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="org-name">
                    Community Action Agency of Western CT (CAAWC)
                  </span>
                  <span className="org-meta">
                    2 Terrace Pl, Danbury, CT 06810
                    <br />
                    caawc.org
                  </span>
                </td>
                <td>
                  <span className="org-coverage">Danbury &amp; Stamford</span>
                </td>
                <td>
                  <span className="org-phone">203-744-4700</span>
                </td>
                <td>
                  <span className="org-note">
                    Western CT — useful for expansion but lower priority.
                    Stamford and Danbury are not target distressed
                    municipalities.
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="org-name">ACCESS Community Action Agency</span>
                  <span className="org-meta">
                    1315 Main St, Willimantic, CT 06226
                    <br />
                    accessagency.org
                  </span>
                </td>
                <td>
                  <span className="org-coverage">Willimantic &amp; NE CT</span>
                </td>
                <td>
                  <span className="org-phone">860-450-7400</span>
                </td>
                <td>
                  <span className="org-note">
                    Eastern CT outside main target zone. Defer until
                    geographic expansion phase.
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="org-name">
                    Thames Valley Council for Community Action (TVCCA)
                  </span>
                  <span className="org-meta">
                    Norwich, CT
                    <br />
                    tvcca.org
                  </span>
                </td>
                <td>
                  <span className="org-coverage">Norwich-New London</span>
                </td>
                <td>
                  <span className="org-phone">860-425-6681</span>
                </td>
                <td>
                  <span className="org-note">
                    Norwich is distressed-municipality designated but distant
                    from Eversource fleet zone. Defer.
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="partnership-card green">
          <div className="partnership-h">Partnership structure — CAAs</div>
          <div className="partnership-grid">
            <div className="partnership-block">
              <h4>The relationship structure</h4>
              <ul>
                <li>
                  Approved-vendor or referral-partner status formalized via MOU
                  with the CAA executive director
                </li>
                <li>
                  CAA case workers refer LIHEAP-completed customers to CT Battery Solutions
                  as part of their benefits navigation packet
                </li>
                <li>
                  The customer&apos;s LIHEAP award letter functions as your CT
                  ESS LI tier income verification documentation
                </li>
                <li>
                  Quarterly check-ins with CAA Executive Director or program
                  director to track referral volume and conversion outcomes
                </li>
                <li>
                  Annual financial reporting back to the CAA on customers served
                  (anonymized aggregate data)
                </li>
              </ul>
            </div>
            <div className="partnership-block">
              <h4>The pitch framing</h4>
              <ul>
                <li>
                  Mission-aligned, NOT transactional. Lead with &quot;free
                  battery resilience for the same households you&apos;re already
                  helping with heating costs&quot;
                </li>
                <li>
                  Justice40 alignment — CT ESS is part of the state&apos;s
                  Justice40 commitment; you&apos;re an operational arm of that
                  mission
                </li>
                <li>
                  Direct customer benefit: backup power during outages, $0 cost
                  to the household, performance payments to CT Battery Solutions create no
                  customer obligation
                </li>
                <li>
                  Optional: small annual unrestricted donation to the CAA as
                  good-faith partnership investment
                </li>
                <li>
                  Anti-pitch: never frame as &quot;I need access to your
                  customer list&quot; — frame as &quot;I&apos;m a service
                  offering you can route your customers to&quot;
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tier A · Energy */}
      <section id="energy" className="tier-section">
        <div className="tier-header">
          <span className="tier-badge a">Tier A</span>
          <h2 className="tier-title">
            Energy nonprofits &amp; state intermediaries
          </h2>
        </div>
        <p className="tier-sub">
          A small number of energy-focused organizations operate as the
          connective tissue between utilities, government, and customers. These
          are existential to the LMI energy ecosystem in CT and credential
          everything downstream of them.
        </p>

        <div className="card-grid">
          <div className="org-card priority">
            <div className="org-card-h">Generation Power CT (GPCT)</div>
            <div className="org-card-meta">
              Formerly Operation Fuel · Statewide
              <br />
              gpct.org · Hartford-based
            </div>
            <div className="org-card-d">
              Statewide energy &amp; utility assistance for households at or
              below 75% State Median Income. Now also water assistance via
              Aquarion, CT Water, MDC. Most respected name in CT energy equity
              (30+ years under Operation Fuel brand, rebranded 2025).
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              The single most important partnership in this entire directory.
              Co-promotion in their newsletters, presence at their resource
              fairs, possibly their referral list. Lead with mission-alignment
              framing: &quot;free battery resilience for the same population you
              serve.&quot; This partnership credentials CT Battery Solutions across every
              other org on this list.
            </div>
          </div>

          <div className="org-card priority">
            <div className="org-card-h">CT Green Bank — LMI programs team</div>
            <div className="org-card-meta">
              75 Charter Oak Ave, Hartford
              <br />
              ctgreenbank.com
            </div>
            <div className="org-card-d">
              Administers CT ESS, Smart-E Loan, Solar for All, Multifamily
              energy programs. You&apos;re already engaging CGB as your TPO
              regulator — extend the relationship to their LMI programs team.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Beyond TPO approval, request inclusion in Justice40-aligned
              outreach materials. CGB runs underserved-community awareness
              campaigns; CT Battery Solutions fits naturally as an LI tier delivery
              partner.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">211 / United Way of Connecticut</div>
            <div className="org-card-meta">
              Statewide social services hotline
              <br />
              211ct.org
            </div>
            <div className="org-card-d">
              Every CT resident calling 2-1-1 with an energy or housing problem
              gets a referral list. Free, high-volume passive lead source once
              established.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Get CT Battery Solutions listed under &quot;energy assistance&quot; and
              &quot;home modifications&quot; categories in 211&apos;s resource
              database. Low-effort, ongoing passive flow.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">CT Energy Efficiency Board (EEB)</div>
            <div className="org-card-meta">
              Joint utility/state oversight body
              <br />
              energizect.com
            </div>
            <div className="org-card-d">
              Oversight body for ratepayer-funded EE programs (HES, HES-IE,
              etc.). Long-arc institutional player in the CT energy ecosystem.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Worth positioning as a stakeholder. Attend EEB meetings, give
              public comment, propose HES-IE program improvements. Builds
              regulatory presence.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">Eversource Customer Care &amp; Outreach</div>
            <div className="org-card-meta">
              Statewide utility customer programs
            </div>
            <div className="org-card-d">
              Utility-side outreach to vulnerable customers. As an approved CT
              ESS contractor and TPO, you can be added to their materials sent
              to LMI customers.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Once you&apos;re approved as a TPO, ask to be included in
              Eversource&apos;s LMI customer mailings about CT ESS. Direct
              utility endorsement of CT Battery Solutions in customer-facing materials is
              enormous credibility leverage.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">
              CT Dept of Energy &amp; Environmental Protection (DEEP)
            </div>
            <div className="org-card-meta">
              79 Elm St, Hartford
              <br />
              portal.ct.gov/DEEP
            </div>
            <div className="org-card-d">
              Manages Environmental Justice Communities designation list,
              climate equity programs, and broader energy policy.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Engage with DEEP&apos;s Office of Climate Change as your model
              scales. Position CT Battery Solutions as an EJ-community delivery model.
            </div>
          </div>
        </div>

        <div className="partnership-card green">
          <div className="partnership-h">
            Partnership structure — Energy nonprofits
          </div>
          <div className="partnership-grid">
            <div className="partnership-block">
              <h4>The relationship structure</h4>
              <ul>
                <li>
                  Mission-alignment first. These organizations exist to serve
                  LMI customers; you must be values-aligned to be welcome
                </li>
                <li>
                  Co-marketing in newsletters and resource lists (rather than
                  direct customer data exchange)
                </li>
                <li>
                  Joint resilience-focused messaging that emphasizes household
                  benefit, not commercial transaction
                </li>
                <li>
                  Quarterly stakeholder updates on customer outcomes (anonymized)
                </li>
                <li>
                  Speaking opportunities at their conferences, resource fairs,
                  board meetings
                </li>
              </ul>
            </div>
            <div className="partnership-block">
              <h4>The pitch framing</h4>
              <ul>
                <li>
                  &quot;CT Battery Solutions makes the same households you serve more
                  resilient at zero cost to them&quot;
                </li>
                <li>
                  Reference Justice40 commitment, EJ communities, energy equity
                  language — not battery storage industry language
                </li>
                <li>
                  Be patient with relationship building — these organizations
                  have seen too many transactional partners and will test for
                  sincerity
                </li>
                <li>
                  Bring real data: number of customers enrolled in distressed
                  cities, dollar value of free battery to LMI households
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tier B · FQHC */}
      <section id="fqhc" className="tier-section">
        <div className="tier-header">
          <span className="tier-badge b">Tier B</span>
          <h2 className="tier-title">
            Federally Qualified Health Centers (FQHCs)
          </h2>
        </div>
        <p className="tier-sub">
          FQHC patients are 75-80% income-qualifying by federal definition.
          Community Health Workers (CHWs) at FQHCs do home visits as part of
          social-determinants-of-health work. Battery resilience is a
          legitimate medical necessity for chronic-condition and elderly
          patients dependent on continuous power.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: "28%" }}>Organization</th>
                <th style={{ width: "24%" }}>Coverage</th>
                <th>Why it matters for CT Battery Solutions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="priority">
                <td>
                  <span className="org-name">
                    Community Health Center, Inc. (CHC, Inc.)
                  </span>
                  <span className="org-meta">
                    Headquartered Middletown
                    <br />
                    chc1.com
                  </span>
                </td>
                <td>
                  <span className="org-coverage">
                    Middletown, Meriden, New Britain, Bristol, Waterbury,
                    Danbury, Norwalk, Stamford, Enfield
                  </span>
                </td>
                <td>
                  <span className="org-note">
                    The largest FQHC network in CT. Multi-city footprint covers
                    nearly your entire target geography.{" "}
                    <strong>Single partnership = statewide referral access.</strong>
                  </span>
                </td>
              </tr>
              <tr className="priority">
                <td>
                  <span className="org-name">Charter Oak Health Center</span>
                  <span className="org-meta">
                    21 Grand St, Hartford
                    <br />
                    charteroakhealthcenter.com
                  </span>
                </td>
                <td>
                  <span className="org-coverage">Hartford</span>
                </td>
                <td>
                  <span className="org-note">
                    Largest FQHC in Hartford. Serves ~30K patients/year. Strong
                    CHW program. Critical for #1 target city.
                  </span>
                </td>
              </tr>
              <tr className="priority">
                <td>
                  <span className="org-name">Optimus Health Care</span>
                  <span className="org-meta">
                    982 East Main St, Bridgeport
                    <br />
                    optimushealthcare.org
                  </span>
                </td>
                <td>
                  <span className="org-coverage">
                    Bridgeport, Stamford, Stratford
                  </span>
                </td>
                <td>
                  <span className="org-note">
                    Primary FQHC for Bridgeport. Strong Latino community
                    connections. Critical for #2 target city.
                  </span>
                </td>
              </tr>
              <tr className="priority">
                <td>
                  <span className="org-name">Cornell Scott-Hill Health Center</span>
                  <span className="org-meta">
                    428 Columbus Ave, New Haven
                    <br />
                    cornellscott.org
                  </span>
                </td>
                <td>
                  <span className="org-coverage">
                    New Haven, Ansonia, Derby, West Haven
                  </span>
                </td>
                <td>
                  <span className="org-note">
                    Primary FQHC for New Haven. Strong community presence.
                    Multi-city footprint efficient for partnership economics.
                  </span>
                </td>
              </tr>
              <tr className="priority">
                <td>
                  <span className="org-name">StayWell Health Center</span>
                  <span className="org-meta">
                    80 Phoenix Ave, Waterbury
                    <br />
                    staywellhealth.org
                  </span>
                </td>
                <td>
                  <span className="org-coverage">Waterbury, Naugatuck</span>
                </td>
                <td>
                  <span className="org-note">
                    Primary FQHC for Waterbury. Critical for #4 target city
                    coverage.
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="org-name">Fair Haven Community Health Care</span>
                  <span className="org-meta">
                    374 Grand Ave, New Haven
                    <br />
                    fhchc.org
                  </span>
                </td>
                <td>
                  <span className="org-coverage">
                    New Haven (Fair Haven neighborhood)
                  </span>
                </td>
                <td>
                  <span className="org-note">
                    Smaller but deeply embedded in Fair Haven (heavily LMI).
                    Strong Latino community trust.
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="org-name">Community Health Services (CHS)</span>
                  <span className="org-meta">
                    500 Albany Ave, Hartford
                    <br />
                    chshartford.org
                  </span>
                </td>
                <td>
                  <span className="org-coverage">Hartford, Windsor</span>
                </td>
                <td>
                  <span className="org-note">
                    Large Hartford footprint. Active in social-determinants
                    work. Pair with Charter Oak for full Hartford coverage.
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="org-name">Southwest Community Health Center</span>
                  <span className="org-meta">
                    510 Clinton Ave, Bridgeport
                    <br />
                    swchc.org
                  </span>
                </td>
                <td>
                  <span className="org-coverage">Bridgeport</span>
                </td>
                <td>
                  <span className="org-note">
                    Secondary Bridgeport FQHC. Worth pairing with Optimus for
                    full Bridgeport coverage.
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="org-name">Wheeler Clinic</span>
                  <span className="org-meta">
                    91 Northwest Dr, Plainville
                    <br />
                    wheelerclinic.org
                  </span>
                </td>
                <td>
                  <span className="org-coverage">Bristol, Plainville</span>
                </td>
                <td>
                  <span className="org-note">
                    Newer FQHC designation, smaller footprint. Useful for
                    Bristol coverage.
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="org-name">Generations Family Health Center</span>
                  <span className="org-meta">
                    Willimantic, Norwich, Putnam
                    <br />
                    generationshealth.org
                  </span>
                </td>
                <td>
                  <span className="org-coverage">Eastern CT</span>
                </td>
                <td>
                  <span className="org-note">
                    Eastern CT — outside main target zone. Defer until
                    geographic expansion.
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="partnership-card blue">
          <div className="partnership-h">Partnership structure — FQHCs</div>
          <div className="partnership-grid">
            <div className="partnership-block">
              <h4>The relationship structure</h4>
              <ul>
                <li>
                  Community Health Worker (CHW) partnership — CHWs visit
                  medically vulnerable patients at home as part of
                  social-determinants-of-health work
                </li>
                <li>
                  CHWs carry CT Battery Solutions information packets and discuss the
                  offering with patients in the context of medical resilience
                </li>
                <li>
                  Patient consent + warm referral — patient self-selects
                  interest; FQHC makes warm referral; CT Battery Solutions contacts patient
                </li>
                <li>
                  HIPAA-compliant data flow — no patient health information
                  exchanged with CT Battery Solutions; only contact info with patient
                  consent
                </li>
                <li>
                  Referral fee or community benefit donation arrangement (varies
                  by FQHC policy)
                </li>
              </ul>
            </div>
            <div className="partnership-block">
              <h4>The pitch framing</h4>
              <ul>
                <li>
                  Medical resilience, not battery sales. Frame: &quot;Patient
                  with chronic condition X depends on continuous power; battery
                  storage prevents medical equipment failure during
                  outages&quot;
                </li>
                <li>
                  Specific patient profiles: diabetes (insulin refrigeration),
                  COPD/sleep apnea (CPAP), dialysis, oxygen concentrators,
                  electric mobility, post-discharge cardiac
                </li>
                <li>
                  Hospital community-benefit alignment — under the ACA,
                  nonprofit hospitals (and FQHCs by extension) must invest in
                  addressing social determinants of health
                </li>
                <li>
                  Conversion rates on FQHC-warm referrals are extraordinarily
                  high because the value proposition is medical, not financial
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tier B · Food */}
      <section id="food" className="tier-section">
        <div className="tier-header">
          <span className="tier-badge b">Tier B</span>
          <h2 className="tier-title">Food security &amp; community navigation</h2>
        </div>
        <p className="tier-sub">
          Food pantry visits are the highest-frequency touchpoint with LMI
          households in CT. SNAP/EBT eligibility correlates very tightly with
          HES-IE/LIHEAP eligibility. Food pantry distributions happen monthly,
          in-person, in your target neighborhoods.
        </p>

        <div className="card-grid">
          <div className="org-card priority">
            <div className="org-card-h">Connecticut Foodshare</div>
            <div className="org-card-meta">
              Wallingford HQ · Statewide
              <br />
              ctfoodshare.org
            </div>
            <div className="org-card-d">
              Sole statewide food bank (merged 2021 from CT Food Bank +
              Foodshare). Distributes through ~600 partner agencies, serves
              ~380K residents annually. CEO: Jason Jakubowski.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              THE food infrastructure in CT. One master partnership at the
              food-bank level cascades through hundreds of local pantries.
              Highest leverage in the food vertical.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">End Hunger Connecticut!</div>
            <div className="org-card-meta">
              Statewide anti-hunger advocacy
              <br />
              endhungerct.org
            </div>
            <div className="org-card-d">
              Statewide anti-hunger advocacy and benefits enrollment. Runs SNAP
              enrollment campaigns and benefits-navigation events.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Co-host benefits navigation events combining SNAP enrollment +
              CT Battery Solutions battery offering. Their existing volunteer
              infrastructure is well-suited to multi-program intake.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">Catholic Charities of CT</div>
            <div className="org-card-meta">
              Multi-archdiocesan
              <br />
              ccaoh.org · ccfsct.org
            </div>
            <div className="org-card-d">
              Multi-service nonprofit including food pantries, housing,
              financial assistance, and LIHEAP intake at some locations.
              Operates in all four target cities.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Multi-service partnership covering food + LIHEAP intake +
              financial assistance. One relationship at the archdiocesan level
              opens multiple touchpoints.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">Salvation Army CT Division</div>
            <div className="org-card-meta">
              Hartford HQ · Statewide
              <br />
              salvationarmyct.org
            </div>
            <div className="org-card-d">
              Food, housing, financial assistance. Strong Hartford and
              Bridgeport presence. Operates LIHEAP intake at some locations.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Information distribution at their corps centers in Hartford and
              Bridgeport. Strong overlap with target population during winter
              heating-assistance season.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">Foodshare Mobile Pantry Sites</div>
            <div className="org-card-meta">
              Sub-network of CT Foodshare
              <br />
              ~50 locations across CT
            </div>
            <div className="org-card-d">
              Sub-network of Connecticut Foodshare&apos;s mobile pantry program.
              Specifically targets food deserts and hard-to-reach LMI
              populations.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Set up CT Battery Solutions information table at major mobile pantry events
              in target zip codes. Highest density of qualified-customer foot
              traffic per hour of any acquisition channel.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">Food Rescue US — CT chapter</div>
            <div className="org-card-meta">
              Statewide app-based food rescue
              <br />
              foodrescue.us
            </div>
            <div className="org-card-d">
              Surplus food distribution platform. Smaller and
              innovation-friendly. Lower-friction first partner if Foodshare is
              slow to engage.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Innovation-friendly potential partner for piloting joint outreach
              experiments. Lower institutional weight than Foodshare but easier
              to engage quickly.
            </div>
          </div>
        </div>

        <div className="partnership-card blue">
          <div className="partnership-h">
            Partnership structure — Food security
          </div>
          <div className="partnership-grid">
            <div className="partnership-block">
              <h4>The relationship structure</h4>
              <ul>
                <li>
                  Information distribution at major mobile pantry events in
                  target zip codes (1-2 events per month per city)
                </li>
                <li>
                  Co-branded &quot;energy resilience for food-insecure
                  households&quot; materials — emphasis on how battery prevents
                  food spoilage during outages
                </li>
                <li>
                  Joint events combining food distribution + free home energy
                  assessment sign-ups
                </li>
                <li>
                  Volunteer crew at food pantry distributions — CT Battery Solutions team
                  members serve at pantries to build presence and trust
                </li>
              </ul>
            </div>
            <div className="partnership-block">
              <h4>The pitch framing</h4>
              <ul>
                <li>
                  Food security framing — battery storage prevents
                  refrigerator/freezer food loss during outages
                </li>
                <li>
                  &quot;Free battery prevents you from losing $300 of food next
                  time the power goes out for 2 days&quot; is concrete and
                  immediately resonant
                </li>
                <li>
                  Pair with EBT/SNAP retention — outages and food spoilage are
                  major drivers of food insecurity
                </li>
                <li>
                  Volunteer-first relationship building — show up at pantry
                  distributions before asking for anything
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tier C · Faith */}
      <section id="faith" className="tier-section">
        <div className="tier-header">
          <span className="tier-badge c">Tier C</span>
          <h2 className="tier-title">Faith-based community networks</h2>
        </div>
        <p className="tier-sub">
          Black and Latino communities in CT&apos;s distressed cities maintain
          extraordinarily high-trust church networks. A pulpit endorsement
          from a respected pastor reaches more LMI customers in 30 minutes than
          weeks of door-to-door canvassing.
        </p>

        <div className="card-grid">
          <div className="org-card">
            <div className="org-card-h">Black Ministerial Alliance of Greater Hartford</div>
            <div className="org-card-meta">Hartford</div>
            <div className="org-card-d">
              Coordinated body of Black churches in Greater Hartford. Single
              partnership = simultaneous access to 20+ churches across the
              metro area.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Single relationship with Alliance leadership opens 20+
              congregations. Speaker slots at quarterly Alliance meetings.
              Co-branded resilience materials emphasizing climate justice.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">CONECT</div>
            <div className="org-card-meta">
              Congregations Organized for a New Connecticut
              <br />
              Hartford, Bridgeport, New Haven · conect-ct.org
            </div>
            <div className="org-card-d">
              Multi-faith, multi-racial community organizing alliance. Active
              on energy justice issues. Aligned with CT Battery Solutions&apos;s mission
              framing.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              The most mission-aligned faith-based partner in CT. Their
              congregations are already engaged on energy equity. Approach as
              social justice partnership, not commercial outreach.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">AME Zion Church Network — CT</div>
            <div className="org-card-meta">
              Statewide, concentration in Hartford &amp; Bridgeport
            </div>
            <div className="org-card-d">
              Nationally aligned with energy justice. Recurring annual
              conferences where partnership announcements travel fast. Strong
              civil rights legacy.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Engage at the regional/conference level rather than individual
              churches. National denomination has formal energy-justice
              positions that align with CT Battery Solutions framing.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">Catholic Archdiocese of Hartford</div>
            <div className="org-card-meta">
              Hartford, Waterbury, Litchfield County
              <br />
              archdioceseofhartford.org
            </div>
            <div className="org-card-d">
              Largest single faith network in target geography. Catholic
              Charities is the social services arm; the parishes are the trust
              network.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Pair with the Catholic Charities social services partnership.
              Frame as continuity of mission — battery resilience is logical
              extension of their economic justice work.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">Hispanic Federation — CT</div>
            <div className="org-card-meta">
              Statewide, concentrated in Hartford, Bridgeport, New Haven,
              Waterbury
              <br />
              hispanicfederation.org
            </div>
            <div className="org-card-d">
              Coordinates Latino-serving nonprofits. Bilingual outreach
              materials and trusted in immigrant communities.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Critical for Latino household acquisition (significant share of
              distressed-municipality households). Bilingual co-branded
              materials. Trusted intermediary for first-generation immigrant
              customers.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">CT Council of Churches</div>
            <div className="org-card-meta">
              Statewide ecumenical body
              <br />
              ctchurches.org
            </div>
            <div className="org-card-d">
              Statewide ecumenical organization. Useful for statewide
              credentialing and access to mainline Protestant congregations
              beyond Black church networks.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Lower priority but useful for breadth. Mainline Protestant
              congregations in suburban areas can refer their service-economy
              lower-income members.
            </div>
          </div>
        </div>

        <div className="partnership-card amber">
          <div className="partnership-h">Partnership structure — Faith-based</div>
          <div className="partnership-grid">
            <div className="partnership-block">
              <h4>The relationship structure</h4>
              <ul>
                <li>
                  Speaker slots at quarterly congregational or alliance meetings
                  — not commercial pitches but values-framed presentations
                </li>
                <li>
                  Co-branded materials at congregational events, distributed
                  through trusted clergy
                </li>
                <li>
                  Optional: pastor endorsement letters for community circulation
                </li>
                <li>
                  Volunteer crew presence at congregational service events
                </li>
                <li>
                  Long-term relationship building — first 6 months may not
                  produce direct customer flow but establishes credibility for
                  years of compounding referrals
                </li>
              </ul>
            </div>
            <div className="partnership-block">
              <h4>The pitch framing</h4>
              <ul>
                <li>
                  Justice and dignity framing — &quot;free battery storage
                  protecting your congregation&apos;s most vulnerable members
                  during outages&quot;
                </li>
                <li>
                  Climate justice — communities of color disproportionately
                  affected by storms and outages; battery resilience is climate
                  equity in action
                </li>
                <li>
                  Stewardship — environmental responsibility woven into
                  theological framing where appropriate
                </li>
                <li>
                  NEVER make it transactional. Pastors and faith leaders detect
                  commercial motivation immediately and disengage
                </li>
                <li>
                  Bring real customer stories from prior congregants you&apos;ve
                  served — testimonials from within the community are the only
                  currency that matters
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tier C · Senior */}
      <section id="senior" className="tier-section">
        <div className="tier-header">
          <span className="tier-badge c">Tier C</span>
          <h2 className="tier-title">Senior services</h2>
        </div>
        <p className="tier-sub">
          Fixed-income elderly customers are heavily HES-IE-eligible, often in
          distressed-municipality housing, and have disproportionate
          medical-vulnerability needs that batteries address.
        </p>

        <div className="card-grid">
          <div className="org-card">
            <div className="org-card-h">Area Agencies on Aging (AAAs) — 5 in CT</div>
            <div className="org-card-meta">
              Regional senior services coordination
              <br />
              portal.ct.gov/AgingServices
            </div>
            <div className="org-card-d">
              Five regional AAAs cover all of CT. Each AAA coordinates senior
              services in their region — equivalent of CAAs but for elderly.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Target the North Central AAA (Hartford), South Central AAA (New
              Haven), and Southwestern AAA (Bridgeport). Each AAA case manager
              could refer 3-10 medically vulnerable seniors per month.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">CT Department of Aging &amp; Disability Services (ADS)</div>
            <div className="org-card-meta">
              State agency
              <br />
              portal.ct.gov/AgingandDisability
            </div>
            <div className="org-card-d">
              State agency overseeing aging and disability services. Long
              timeline but high credibility once established.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Long-arc institutional partnership. Worth establishing for
              state-level credibility but unlikely to drive near-term customer
              flow.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">CT Community Care, Inc. (CCCI)</div>
            <div className="org-card-meta">
              Statewide care management
              <br />
              ctcommunitycare.org
            </div>
            <div className="org-card-d">
              Care management for elderly, Medicaid waiver navigation. Direct
              access to medically vulnerable elderly receiving Medicaid HCBS.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Care managers visit medically vulnerable seniors in their homes
              regularly. They are exactly the trusted intermediary needed for
              elderly customer acquisition.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">
              Senior Centers — Hartford / Bridgeport / NH / Waterbury
            </div>
            <div className="org-card-meta">Municipal-operated senior centers</div>
            <div className="org-card-d">
              Hub of senior community life in each target city. Information
              distribution at senior centers reaches thousands of fixed-income
              elderly.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Information sessions at senior centers — host monthly &quot;free
              home energy resilience&quot; sessions. Combine with HES-IE/LIHEAP
              enrollment assistance.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">AARP Connecticut</div>
            <div className="org-card-meta">
              Statewide member organization
              <br />
              states.aarp.org/connecticut
            </div>
            <div className="org-card-d">
              Statewide advocacy and member-facing organization. Less
              operational but useful for credentialing and statewide visibility.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Lower priority but useful for credentialing. Pitch story for AARP
              CT bulletin or member newsletter. State-level visibility.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">CHOICES Program / Senior Health Insurance Counseling</div>
            <div className="org-card-meta">
              Volunteer-staffed Medicare counseling
              <br />
              portal.ct.gov/AgingServices
            </div>
            <div className="org-card-d">
              Volunteer counselors who help seniors navigate Medicare,
              Medicaid, energy assistance. Located at senior centers, AAAs, and
              CAAs.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Train CHOICES volunteers on CT Battery Solutions offering as part of
              &quot;energy assistance&quot; navigation. Adding a &quot;free
              battery resilience&quot; referral fits naturally.
            </div>
          </div>
        </div>

        <div className="partnership-card amber">
          <div className="partnership-h">
            Partnership structure — Senior services
          </div>
          <div className="partnership-grid">
            <div className="partnership-block">
              <h4>The relationship structure</h4>
              <ul>
                <li>
                  AAA case manager training — present at AAA staff meetings,
                  provide one-page reference cards, follow up monthly
                </li>
                <li>
                  Senior center info sessions — monthly &quot;Free home energy
                  resilience&quot; presentations at municipal senior centers
                </li>
                <li>
                  Care manager partnership with CCCI — train care managers on
                  the offering for medically vulnerable HCBS waiver clients
                </li>
                <li>
                  CHOICES counselor referral training — slot CT Battery Solutions into
                  their existing benefits navigation workflow
                </li>
                <li>
                  Print materials specifically designed for elderly readers
                  (large fonts, simple language, no QR codes)
                </li>
              </ul>
            </div>
            <div className="partnership-block">
              <h4>The pitch framing</h4>
              <ul>
                <li>
                  Medical resilience emphasis — backup power for oxygen
                  concentrators, CPAP machines, electric wheelchairs,
                  refrigerated medications
                </li>
                <li>
                  &quot;Don&apos;t let the next storm leave you without power
                  for your medical equipment&quot; is concrete and resonant
                </li>
                <li>
                  Free / no cost / no commitment — elderly customers are highly
                  skeptical of &quot;free&quot; offerings due to scam exposure
                </li>
                <li>
                  Trusted intermediary — the AAA case manager, CHOICES
                  counselor, or care manager IS the trust transfer
                </li>
                <li>
                  Print and phone-based, NOT digital — elderly customers
                  don&apos;t fill out web forms
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tier C · Disability */}
      <section id="disability" className="tier-section">
        <div className="tier-header">
          <span className="tier-badge c">Tier C</span>
          <h2 className="tier-title">Disability advocacy</h2>
        </div>
        <p className="tier-sub">
          Households with disabled members have disproportionate
          medical-equipment dependence on grid power (oxygen, dialysis, mobility
          devices, ventilators). They are heavily LMI-overlapping due to lower
          workforce participation.
        </p>

        <div className="card-grid">
          <div className="org-card">
            <div className="org-card-h">The Arc of Connecticut</div>
            <div className="org-card-meta">
              Statewide advocacy
              <br />
              thearcct.org
            </div>
            <div className="org-card-d">
              Statewide advocacy for intellectual and developmental
              disabilities. Member rosters of LMI families with high medical
              vulnerability.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Newsletter inclusion, presence at family advocacy events,
              co-branded outreach to families of children/adults with I/DD.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">Independence Northwest</div>
            <div className="org-card-meta">
              Center for Independent Living, NW CT
              <br />
              independencenorthwest.org
            </div>
            <div className="org-card-d">
              Center for Independent Living model — peer-to-peer disability
              advocacy. Trusted referral source for adults with disabilities
              living independently.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              CIL peer counselors are trusted by community members in ways that
              traditional service providers are not. Train CIL staff on the
              CT Battery Solutions offering.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">Disability Rights Connecticut</div>
            <div className="org-card-meta">
              Federally designated P&amp;A organization
              <br />
              disrightsct.org
            </div>
            <div className="org-card-d">
              Federally designated Protection &amp; Advocacy organization.
              Statewide reach. More systemic-advocacy focused than direct
              service.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Useful for systemic positioning and policy alignment. Less direct
              customer flow but strong credentialing for the broader disability
              community.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">CT Council on Developmental Disabilities</div>
            <div className="org-card-meta">
              State coordination body
              <br />
              portal.ct.gov/CTCDD
            </div>
            <div className="org-card-d">
              State coordination body for developmental disability services.
              Long-arc credentialing partner.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Long-arc partnership. Engage through public hearings and
              stakeholder events. Builds state credibility for the broader
              disability-services ecosystem.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">The Kennedy Collective</div>
            <div className="org-card-meta">
              Bridgeport-based
              <br />
              kennedycollective.org
            </div>
            <div className="org-card-d">
              Bridgeport-based disability services organization. Strong
              Bridgeport employer of disabled adults.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Local Bridgeport partnership. Their employee base and family
              network are directly addressable.
            </div>
          </div>

          <div className="org-card">
            <div className="org-card-h">CT Veterans Affairs / Veterans Service Organizations</div>
            <div className="org-card-meta">
              Statewide veterans services
              <br />
              portal.ct.gov/DVA
            </div>
            <div className="org-card-d">
              Disabled veterans in CT often face overlapping LMI status, medical
              vulnerability, and PTSD-related home stability needs.
            </div>
            <div className="org-card-angle">
              <strong>Partnership angle</strong>
              Adjacent to disability advocacy. Disabled veterans often qualify
              on multiple LI dimensions. VA caseworkers can refer.
            </div>
          </div>
        </div>

        <div className="partnership-card amber">
          <div className="partnership-h">
            Partnership structure — Disability advocacy
          </div>
          <div className="partnership-grid">
            <div className="partnership-block">
              <h4>The relationship structure</h4>
              <ul>
                <li>
                  Co-branded outreach to families with disabled members through
                  advocacy org newsletters and events
                </li>
                <li>
                  Coordination with home health agencies serving the same
                  households
                </li>
                <li>
                  Community Health Worker / care manager training similar to
                  FQHC partnership model
                </li>
                <li>
                  Speaker slots at family advocacy events
                </li>
                <li>
                  Optional: medical equipment dependency questionnaire that
                  helps families self-identify vulnerability
                </li>
              </ul>
            </div>
            <div className="partnership-block">
              <h4>The pitch framing</h4>
              <ul>
                <li>
                  Medical equipment dependence — oxygen concentrators,
                  CPAP/BiPAP, electric wheelchairs, hospital beds, dialysis,
                  ventilators
                </li>
                <li>
                  &quot;Battery storage prevents medical equipment failure
                  during outages&quot; is the entire pitch
                </li>
                <li>
                  Family-caregiver framing — many disabled adults live with
                  family caregivers who manage their care; the family is the
                  decision-making unit
                </li>
                <li>
                  Independent-living alignment — battery resilience supports
                  continued community-based living
                </li>
                <li>
                  The disability community is highly mobilized and influences
                  policy
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="footer">
        <strong>CT Battery Solutions CBO Partnership Directory</strong> · Compiled April
        2026 · Connecticut customer acquisition strategy
        <br />
        Sources: CT Association for Community Action (cafca.org) · CT LIHEAP
        Clearinghouse · CT Foodshare (ctfoodshare.org) · CT FQHC list via
        CHC/ACT (chcact.org) · Generation Power CT (gpct.org) · CT Department
        of Aging &amp; Disability Services · 211 CT directory
        <br />
        This directory should be updated quarterly as organizational leadership
        and program scope changes.
      </div>
    </div>
  );
}
