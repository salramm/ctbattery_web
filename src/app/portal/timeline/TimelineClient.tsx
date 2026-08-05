"use client";

import { useState, type ReactNode } from "react";

const PAGES = [
  "Overview",
  "Formation Timeline",
  "Development Timeline",
] as const;

export default function TimelineClient() {
  const [page, setPage] = useState(0);

  return (
    <div className="tl-doc">
      <div className="top">
        <div className="top-row">
          <div className="logo">Roadmap</div>
          <div className="top-tag">
            Formation &amp; Development · General Framework
          </div>
        </div>
        <div className="tabs">
          {PAGES.map((p, i) => (
            <button
              key={p}
              className={`tab${page === i ? " active" : ""}`}
              onClick={() => setPage(i)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {page === 0 && <Overview onGo={setPage} />}
      {page === 1 && <Formation onGo={setPage} />}
      {page === 2 && <Development />}
    </div>
  );
}

type StepProps = {
  num: string;
  title: string;
  meta?: string;
  metaVariant?: "time" | "warn" | "go" | "default";
  desc: ReactNode;
  detailLabel?: string;
  detail?: ReactNode;
  variant?: "green" | "blue" | "purple" | "amber" | "red" | "teal";
};

const VtStep = (s: StepProps) => (
  <div className={`vt-step ${s.variant ?? "green"}`}>
    <div className="vt-step-num">{s.num}</div>
    <div className="vt-step-card">
      <div className="vt-step-hdr">
        <h4 className="vt-step-title">{s.title}</h4>
        {s.meta && (
          <span
            className={`vt-step-meta${s.metaVariant ? " " + s.metaVariant : ""}`}
          >
            {s.meta}
          </span>
        )}
      </div>
      <div className="vt-step-desc">{s.desc}</div>
      {s.detail && (
        <div className="vt-step-detail">
          {s.detailLabel && (
            <div className="vt-step-detail-l">{s.detailLabel}</div>
          )}
          {s.detail}
        </div>
      )}
    </div>
  </div>
);

function Overview({ onGo }: { onGo: (i: number) => void }) {
  return (
    <>
      <h1>
        Formation &amp; <em>Development</em>
      </h1>
      <p className="sub">
        A general two-stage framework for going from idea to operating
        business. The formation timeline is fast, cheap, and largely
        legal-mechanical. The development timeline is longer, requires hustle,
        and produces the validation events that make capital real and
        operations possible.
      </p>

      <h2>
        <span className="h2s">Visual</span>Timeline <em>at a glance</em>
      </h2>
      <div className="tl-bar">
        <div className="tl-seg tl-form">Formation</div>
        <div className="tl-seg tl-cred">Credibility</div>
        <div className="tl-seg tl-cap">Capital</div>
        <div className="tl-seg tl-reg">Regulatory</div>
        <div className="tl-seg tl-ops">Operations &amp; Scale</div>
      </div>
      <div className="tl-axis">
        <span>Wk 1</span>
        <span>Wk 4</span>
        <span>Wk 12</span>
        <span>Wk 18</span>
        <span>Wk 26</span>
        <span>Mo 9+</span>
      </div>

      <div className="hero">
        <div className="metric green">
          <div className="l">Formation</div>
          <div className="v green">
            Stage <em>1</em>
          </div>
          <div className="d">
            Entity exists. Legal structure preserved. Ready to receive capital.{" "}
            <strong>1-3 weeks.</strong>
          </div>
        </div>
        <div className="metric blue">
          <div className="l">Development</div>
          <div className="v blue">
            Stage <em>2</em>
          </div>
          <div className="d">
            From entity to operating business with first revenue. Five
            sequential phases. <strong>4-9 months.</strong>
          </div>
        </div>
        <div className="metric">
          <div className="l">Total elapsed</div>
          <div className="v">~6-10 mo</div>
          <div className="d">
            Idea to first revenue, assuming each phase succeeds at its
            validation event.
          </div>
        </div>
      </div>

      <h2>
        <span className="h2s">Logic</span>Stage <em>distinction</em>
      </h2>
      <div className="grid-2">
        <div className="hl">
          <div className="hl-l">Formation = legal mechanics</div>
          Forms, filings, signatures, fees. Done in days, not months. Mostly
          templated. Outputs: a legally constituted entity, founder equity
          properly issued, tax structure preserved, banking ready, IP cleanly
          assigned. <strong>Cost: low. Risk: low. Time: short.</strong>
        </div>
        <div className="hl">
          <div className="hl-l">Development = relationships and validation</div>
          LOIs, advisors, partners, capital sources, regulatory approvals.
          Done in weeks-to-months. Mostly bespoke. Outputs: signed customer
          commitments, contractor partner, capital wires, licenses, first
          revenue.{" "}
          <strong>
            Cost: scales with progress. Risk: real. Time: most of the journey.
          </strong>
        </div>
      </div>

      <div className="cta">
        <div className="cta-text">
          <strong>Start with Formation.</strong> Three weeks of mechanical
          work to set up the entity. Click through for step-by-step.
        </div>
        <button className="cta-btn" onClick={() => onGo(1)}>
          Open Formation →
        </button>
      </div>
    </>
  );
}

function Formation({ onGo }: { onGo: (i: number) => void }) {
  return (
    <>
      <h1>
        Formation <em>Timeline</em>
      </h1>
      <p className="sub">
        Six steps to a legally constituted entity with founder equity issued,
        tax elections filed, and operational foundations in place. Roughly one
        week of active work spread across three weeks of calendar time. The
        output is an entity ready to enter the development phase.
      </p>

      <div className="hero">
        <div className="metric green">
          <div className="l">Total Time</div>
          <div className="v green">
            1-3 <em>weeks</em>
          </div>
          <div className="d">
            From founder agreement to fully operational entity
          </div>
        </div>
        <div className="metric">
          <div className="l">Active Work</div>
          <div className="v">~6-10 hrs</div>
          <div className="d">
            Mostly waiting on filings to clear; little actual founder time
          </div>
        </div>
        <div className="metric">
          <div className="l">Steps</div>
          <div className="v blue">6</div>
          <div className="d">
            Sequential — each one has a clear output that gates the next
          </div>
        </div>
      </div>

      <h2>
        <span className="h2s">Sequence</span>Six <em>steps</em>
      </h2>

      <div className="vt">
        <VtStep
          variant="green"
          num="1"
          title="Founder alignment"
          meta="Day 1-3"
          metaVariant="time"
          desc="Equity split, vesting terms, roles and responsibilities, decision-making rules, exit triggers. Documented in writing — even informally as a Google Doc — before any external action."
        />
        <VtStep
          variant="green"
          num="2"
          title="Entity formation"
          meta="Day 3-7"
          metaVariant="time"
          desc="Choose entity type (default: C-corporation for tax-favored exit treatment) and state of incorporation (default: Delaware for predictable corporate law). File via formation service. Authorize share structure."
        />
        <VtStep
          variant="green"
          num="3"
          title="Founder equity issuance"
          meta="Tax-Critical"
          metaVariant="warn"
          desc={
            <>
              Founders <strong>purchase</strong> stock at par value (not
              granted, not transferred). Vesting schedule activated per founder
              agreement. Stock certificates issued or recorded electronically.
            </>
          }
        />
        <VtStep
          variant="red"
          num="4"
          title="Section 83(b) tax elections"
          meta="30-DAY HARD DEADLINE"
          metaVariant="warn"
          desc="Each founder mails Form 83(b) to the IRS via certified mail with return receipt requested, within 30 days of stock purchase date. Without this, founders owe ordinary income tax on stock value as it vests."
        />
        <VtStep
          variant="green"
          num="5"
          title="IP & governance documentation"
          meta="Day 7-14"
          metaVariant="time"
          desc="IP Assignment Agreements transfer all pre-formation work product to the company. Confidentiality and Invention Assignment Agreements (CIIAAs) cover ongoing IP. Bylaws, board consent, stockholders agreement formalize governance."
        />
        <VtStep
          variant="green"
          num="6"
          title="Operational foundation"
          meta="Day 7-21"
          metaVariant="time"
          desc="Federal EIN application. Business bank account opened. Domain registration and business email on company domain. Cap table tracking initialized."
        />
      </div>

      <div className="note green">
        <strong>Formation complete:</strong> the entity is legally constituted,
        founder equity is properly issued and tax-elected, IP is assigned
        cleanly, and operational infrastructure is in place. Total cash
        typically $500-800. Total founder personal capital deployed (becoming
        basis): ~$1,000-2,000. Time elapsed: 1-3 weeks. Ready for the
        development phase.
      </div>

      <div className="cta">
        <div className="cta-text">
          <strong>Formation done.</strong> Now the longer journey —
          credibility, capital, regulatory, operations.
        </div>
        <button className="cta-btn" onClick={() => onGo(2)}>
          Open Development →
        </button>
      </div>
    </>
  );
}

function Development() {
  return (
    <>
      <h1>
        Development <em>Timeline</em>
      </h1>
      <p className="sub">
        From legally constituted entity to operating business with first
        revenue. Five sequential phases, each with its own validation event.
        The longer journey — most of the work happens here. Total elapsed
        time: 4-9 months depending on industry, capital strategy, and
        regulatory complexity.
      </p>

      <div className="hero">
        <div className="metric blue">
          <div className="l">Total Time</div>
          <div className="v blue">
            4-9 <em>months</em>
          </div>
          <div className="d">From entity formed to first revenue</div>
        </div>
        <div className="metric">
          <div className="l">Phases</div>
          <div className="v">5</div>
          <div className="d">
            Credibility · Capital · Regulatory · Operations · Scale
          </div>
        </div>
        <div className="metric">
          <div className="l">Validation Events</div>
          <div className="v">5</div>
          <div className="d">
            Each phase ends with a measurable output that gates the next
          </div>
        </div>
      </div>

      <div className="phase-band blue">
        <span className="phase-band-label">Phase A · Wks 4-12</span>
        <span className="phase-band-name">
          <em>Credibility</em>
        </span>
        <span className="phase-band-time">No external capital required</span>
      </div>
      <div className="vt">
        <VtStep
          variant="blue"
          num="1"
          title="Customer pipeline — LOIs from target customers"
          meta="3-8 weeks"
          metaVariant="time"
          desc="Identify and approach target customers with non-binding letters of intent. Aim for 5-10 signed LOIs from credible decision-makers (not low-authority sub-stakeholders). Quality matters more than quantity."
          detailLabel="Why this comes first"
          detail="Customer evidence is the most credible signal a startup can produce, and it costs nothing. Capital sources, regulatory bodies, and partners all want to see that someone wants what you're building. A signed LOI from a credible buyer is worth more than any pitch deck slide."
        />
        <VtStep
          variant="blue"
          num="2"
          title="Operational partnerships — vendors, contractors, suppliers"
          meta="3-6 weeks"
          metaVariant="time"
          desc="Identify and document relationships with the operational partners who will deliver your service or product. Non-binding LOIs or MOUs at this stage; binding agreements come post-capital."
          detailLabel="What this proves"
          detail="That you can actually deliver. Customer demand without delivery capability is a thesis, not a business. Identifying a vendor or contractor partner who's committed in writing demonstrates that you've thought through execution, not just market."
        />
        <VtStep
          variant="blue"
          num="3"
          title="Industry advisor with relevant experience"
          meta="3-6 weeks"
          metaVariant="time"
          desc="Recruit one credible advisor from your target industry — former operator, regulator, or buyer. Compensation: typically 0.25-0.5% advisor equity with 1-2 year vesting, no cash."
          detailLabel="What an advisor does"
          detail="Three things: (1) lends credibility — a known name on the deck or LinkedIn; (2) opens doors — warm introductions to customers, partners, capital; (3) provides judgment — pattern recognition you don't have yet. The Y Combinator FAST template makes the legal side easy."
        />
        <VtStep
          variant="blue"
          num="4"
          title="Pitch deck and one-page financial summary"
          meta="2 weeks"
          metaVariant="time"
          desc="12-15 slides covering: problem, market, business model, unit economics, deployment plan, team, funding ask, use of funds, milestones, exit thesis. One-page financial summary for warm-intro outreach."
          detailLabel="Iteration approach"
          detail="First version is rough. Show it to friendly readers, get feedback, iterate. By the time you're using it for real conversations (capital, partnerships), it's been through 5-10 revision cycles."
        />
        <VtStep
          variant="blue"
          num="5"
          title="Capital pipeline — relationships, no asks yet"
          meta="4-8 weeks"
          metaVariant="time"
          desc="Identify 20-50 potential capital sources matching your business model (debt vs equity, project finance vs operating capital, strategic vs financial). Have 1:1 conversations with 10-15. Don't ask for money — share thesis, gauge interest, nurture."
          detailLabel="Goal of this phase"
          detail="End of Phase A: 3-6 verbal capital commitments to act on in Phase B. These aren't binding, but the relationships are real and the conversations have moved past introduction. The investor or lender knows your name and the thesis."
        />
      </div>
      <div className="phase-band purple">
        <span className="phase-band-label">Phase B · Wks 10-18</span>
        <span className="phase-band-name">
          <em>Capital</em>
        </span>
        <span className="phase-band-time">Convert verbal to wired</span>
      </div>
      <div className="vt">
        <VtStep
          variant="purple"
          num="1"
          title="Capital strategy — match instrument to business model"
          meta="1-2 weeks"
          metaVariant="time"
          desc="Decide capital type before negotiating with any source. Asset-heavy businesses with contracted revenue suit debt; fast-growth software suits equity; tax-credit-rich projects suit specialized vehicles. The right answer is often a blend."
          detailLabel="Common instruments"
          detail={
            <>
              <strong>Founder/F&amp;F loans</strong> — 0% dilution, fast,
              small dollars. <strong>Project finance debt</strong> — 0-3%
              dilution via warrants. <strong>SAFE round</strong> — 5-15%
              dilution, defers valuation. <strong>Priced equity round</strong>{" "}
              — sets valuation, full investor rights.{" "}
              <strong>Tax credit pre-sale</strong> — 0% dilution.
            </>
          }
        />
        <VtStep
          variant="purple"
          num="2"
          title="Term sheet negotiation"
          meta="2-4 weeks"
          metaVariant="time"
          desc="Convert the strongest verbal commitment into a written term sheet. Use standard templates (YC SAFE, NVCA preferred, industry-standard loan agreements) wherever possible — non-standard terms slow everyone down."
          detailLabel="Watch for"
          detail="Standard mechanisms (cap, discount, MFN for SAFEs; rate, term, covenants, PG for debt) are negotiable. Investor rights provisions (board, protective provisions, anti-dilution) start to matter at priced rounds. Before signing anything, have specialist counsel review."
        />
        <VtStep
          variant="purple"
          num="3"
          title="Legal documentation"
          meta="2-3 weeks"
          metaVariant="time"
          desc="Engage securities or finance counsel for a flat-fee engagement covering all documents in this round. Subsequent rounds add incremental cost only."
          detailLabel="Documents produced"
          detail="For debt: Loan Agreement, Promissory Note, Security Agreement, UCC-1 filing, Personal Guaranty (if applicable), Warrant Agreement (if applicable). For equity: SAFE or Stock Purchase Agreement, accredited investor questionnaires, Form D filing, state Blue Sky notices, board and stockholder consents."
        />
        <VtStep
          variant="red"
          num="4"
          title="Securities compliance — federal + state"
          meta="15-day federal deadline"
          metaVariant="warn"
          desc="If raising equity: Form D filed with SEC EDGAR within 15 days of first sale. State Blue Sky notices in each state where investors reside, deadlines vary 15-90 days."
          detailLabel="Why this matters"
          detail="Federal Reg D 506(b) is the standard exemption for small offerings — but the exemption only holds if you file the notice. Missing the federal Form D deadline can disqualify the exemption, exposing the company and founders to securities liability."
        />
        <VtStep
          variant="purple"
          num="5"
          title="Capital deployment — wires received, runway begins"
          meta="1-2 weeks per investor"
          metaVariant="time"
          desc="Document each wire as it lands. Update cap table. Save signed instruments and accredited investor questionnaires. These become part of due diligence packages for future rounds and regulatory applications."
        />
      </div>
      <div className="phase-band amber">
        <span className="phase-band-label">Phase C · Wks 14-22</span>
        <span className="phase-band-name">
          <em>Regulatory</em>
        </span>
        <span className="phase-band-time">Industry-specific approvals</span>
      </div>
      <div className="vt">
        <VtStep
          variant="amber"
          num="1"
          title="Pre-application discovery"
          meta="2-4 weeks"
          metaVariant="time"
          desc="Most regulators offer free pre-application meetings. Use them. Walk in with your readiness package — entity, capital, partners, customer LOIs — and ask explicit questions about what they need to approve you."
          detailLabel="What this saves"
          detail="Months of guessing about requirements and tens of thousands of dollars in misaligned compliance work. Regulators want approvals to succeed; they'll tell you what they need if you ask. Approach as a substantive conversation, not a sales pitch."
        />
        <VtStep
          variant="amber"
          num="2"
          title="Operational licensing — entity and individual"
          meta="2-6 weeks"
          metaVariant="time"
          desc="Industry-specific licenses for the entity (e.g., contractor registration, broker license, money services license). Individual licenses for key personnel (professional engineering, electrical, financial advisory). Foreign qualification in operating states."
          detailLabel="Common pitfall"
          detail="Underestimating the time for license processing. Some take 4-12 weeks. Submit early, even if you don't have all the supporting documents — lets the clock run while you finish the package."
        />
        <VtStep
          variant="amber"
          num="3"
          title="Insurance binding"
          meta="1-2 weeks"
          metaVariant="time"
          desc="General liability, workers comp (if employees), auto (if vehicles), professional liability or E&O (if applicable), cyber (increasingly common). Use an independent broker with experience in your industry."
          detailLabel="Timing trick"
          detail="Most insurers will quote and hold for 30-60 days without binding. Bind only when you're ~30 days from needing the coverage. Premium typically billed annually or in monthly installments."
        />
        <VtStep
          variant="amber"
          num="4"
          title="Customer contract templates"
          meta="2-3 weeks"
          metaVariant="time"
          desc="The contract you'll sign with end customers. Reviewed by industry-specialist counsel for compliance with consumer protection rules, industry regulations, and your business model."
        />
        <VtStep
          variant="amber"
          num="5"
          title="Application submission and review"
          meta="4-12 weeks"
          metaVariant="time"
          desc="Compile the complete application package — all the documentation generated through Phases A-C — and submit. Respond promptly to regulator requests for additional information."
          detailLabel="Operating cadence"
          detail="Regulators typically determine completeness within 5 business days. Substantive review takes weeks to months depending on the agency. Stay responsive; failure to respond within stated windows can cause withdrawal or denial."
        />
      </div>
      <div className="phase-band red">
        <span className="phase-band-label">Phase D · Mo 6+</span>
        <span className="phase-band-name">
          <em>Operations</em>
        </span>
        <span className="phase-band-time">First revenue</span>
      </div>
      <div className="vt">
        <VtStep
          variant="red"
          num="1"
          title="First customer signed"
          meta="2-6 weeks post-approval"
          metaVariant="time"
          desc="Convert the strongest LOI from Phase A into a definitive customer agreement. Negotiate any terms specific to the first deployment. Execute."
        />
        <VtStep
          variant="red"
          num="2"
          title="Operational partnerships formalized"
          meta="2-4 weeks"
          metaVariant="time"
          desc="Convert Phase A partner LOIs into binding agreements. Master service or supply agreements with operational vendors. Insurance, warranty, performance terms locked."
        />
        <VtStep
          variant="red"
          num="3"
          title="First service delivered"
          meta="4-12 weeks"
          metaVariant="time"
          desc="Whatever the deliverable is — physical installation, software deployment, service rendered. The actual production of value for the first paying customer."
        />
        <VtStep
          variant="red"
          num="4"
          title="Revenue collection and validation"
          meta="Month 1+ post-delivery"
          metaVariant="time"
          desc="Money lands. Unit economics validated against modeled assumptions. Cash flow management becomes the real operational discipline."
        />
        <VtStep
          variant="red"
          num="5"
          title="Performance monitoring and iteration"
          meta="Ongoing"
          metaVariant="time"
          desc="Observe first customer experience. Identify friction. Refine product or process. Get to repeatable delivery before scaling."
        />
      </div>

      <div className="phase-band teal">
        <span className="phase-band-label">Phase E · Mo 12+</span>
        <span className="phase-band-name">
          <em>Scale</em>
        </span>
        <span className="phase-band-time">
          Second-wave funding · subsidiarization
        </span>
      </div>
      <div className="vt">
        <VtStep
          variant="teal"
          num="1"
          title="Second-wave funding"
          desc="With operating data and revenue trajectory, capital becomes meaningfully easier. Larger debt facility, priced equity round, or strategic partnership. Usually 2-5× the size of Phase B."
        />
        <VtStep
          variant="teal"
          num="2"
          title="Subsidiarization — drop down to OpCo"
          desc="When operations grow large enough that a customer lawsuit could meaningfully damage HoldCo (where founder equity sits), drop operational activities to a subsidiary. Section 351 contribution preserves tax structure."
        />
        <VtStep
          variant="teal"
          num="3"
          title="Project SPVs (asset-heavy businesses)"
          desc="Real estate, infrastructure, energy, equipment-finance businesses isolate individual portfolios into single-purpose entities. Permits portfolio-level debt, tax equity partnerships, and individual asset sales without touching the parent."
        />
        <VtStep
          variant="teal"
          num="4"
          title="Geographic or product expansion"
          desc="Foreign-qualify HoldCo or OpCo in new operating states. Adapt regulatory and licensing posture per state. The Phase A-C playbook repeats per market, but faster — you've done it once."
        />
      </div>
    </>
  );
}
