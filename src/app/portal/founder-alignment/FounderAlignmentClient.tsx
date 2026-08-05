"use client";

import { useState, type ReactNode } from "react";

type TabId =
  | "overview"
  | "equity"
  | "vesting"
  | "roles"
  | "decisions"
  | "exits"
  | "agreement";

const TABS: { id: TabId; label: string; num: string }[] = [
  { id: "overview", label: "Overview", num: "00" },
  { id: "equity", label: "Equity Split", num: "01" },
  { id: "vesting", label: "Vesting", num: "02" },
  { id: "roles", label: "Roles", num: "03" },
  { id: "decisions", label: "Decision Making", num: "04" },
  { id: "exits", label: "Exit Triggers", num: "05" },
  { id: "agreement", label: "The Agreement", num: "06" },
];

type OptKind = "std" | "alt1" | "alt2";

function Opt({
  kind,
  letter,
  name,
  badge,
  when,
  how,
  lang,
  pros,
  cons,
  langLabel = "Sample Agreement Language",
}: {
  kind: OptKind;
  letter: "OPTION A" | "OPTION B" | "OPTION C";
  name: ReactNode;
  badge: string;
  when: ReactNode;
  how: ReactNode;
  lang: ReactNode;
  pros: ReactNode[];
  cons: ReactNode[];
  langLabel?: string;
}) {
  return (
    <div className={`opt ${kind}`}>
      <div className="opt-hdr">
        <span className={`opt-letter ${kind}`}>{letter}</span>
        <h3 className="opt-name">{name}</h3>
        <span className={`opt-badge ${kind}`}>{badge}</span>
      </div>
      <div className="opt-body">
        <div>
          <div className="opt-col-l">When this works</div>
          <div className="opt-text">{when}</div>
          <div className="opt-col-l">How it works</div>
          <div className="opt-text">{how}</div>
        </div>
        <div>
          <div className="lang-l">{langLabel}</div>
          <div className="lang">{lang}</div>
        </div>
      </div>
      <div className="pc">
        <div className="pc-col">
          <div className="pc-col-l p">Pros</div>
          <ul>
            {pros.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="pc-col">
          <div className="pc-col-l c">Cons</div>
          <ul>
            {cons.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Topic({
  tag,
  q,
  ctx,
}: {
  tag: string;
  q: ReactNode;
  ctx: ReactNode;
}) {
  return (
    <div className="topic">
      <div className="topic-tag">{tag}</div>
      <h2 className="topic-q" style={{ margin: 0 }}>
        {q}
      </h2>
      <p className="topic-ctx">{ctx}</p>
    </div>
  );
}

function Cta({
  text,
  btn,
  onGo,
}: {
  text: ReactNode;
  btn: string;
  onGo: () => void;
}) {
  return (
    <div className="cta">
      <div className="cta-text">{text}</div>
      <button className="cta-btn" onClick={onGo}>
        {btn}
      </button>
    </div>
  );
}

const Fill = ({
  size = "med",
  children = "__________",
}: {
  size?: "short" | "med" | "long";
  children?: ReactNode;
}) => (
  <span className={`agr-fill${size === "short" ? " short" : size === "long" ? " long" : ""}`}>
    {children}
  </span>
);

const Pick = ({ children }: { children: ReactNode }) => (
  <span className="agr-pick">{children}</span>
);

export default function FounderAlignmentClient() {
  const [tab, setTab] = useState<TabId>("overview");

  const goTab = (id: TabId) => {
    setTab(id);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="fa-doc">
      <div className="top">
        <div className="top-row">
          <div className="logo">
            Grid<em>Shift</em>
          </div>
          <span className="top-tag">Founder Alignment</span>
          <div className="top-meta">
            <span>Two-founder decision tool</span>
            <span>·</span>
            <span>
              <strong>v2.0</strong>
            </span>
            <span>·</span>
            <span>Pre-formation</span>
          </div>
        </div>
        <div className="tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tab${tab === t.id ? " active" : ""}`}
              onClick={() => goTab(t.id)}
            >
              <span className="num">{t.num}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "overview" && <Overview goTab={goTab} />}
      {tab === "equity" && <Equity goTab={goTab} />}
      {tab === "vesting" && <Vesting goTab={goTab} />}
      {tab === "roles" && <Roles goTab={goTab} />}
      {tab === "decisions" && <Decisions goTab={goTab} />}
      {tab === "exits" && <Exits goTab={goTab} />}
      {tab === "agreement" && <Agreement goTab={goTab} />}
    </div>
  );
}

/* ───────────────────────────── OVERVIEW ───────────────────────────── */

function Overview({ goTab }: { goTab: (id: TabId) => void }) {
  return (
    <>
      <h1>
        Founder <em>Alignment</em>
      </h1>
      <p className="sub">
        A decision tool for two founders forming CT Battery Solutions, Inc. Each of the
        five pillars below contains specific questions that need to be answered
        before the Certificate of Incorporation is filed. For each question,
        three industry-standard approaches are presented with actual contract
        language. The two founders work through the document, pick one option
        per question, and the selections become the foundation for everything
        downstream.
      </p>

      <h2 style={{ marginTop: 32 }}>
        <span className="h2s">Framework</span>Five pillars, <em>eighteen</em>{" "}
        questions
      </h2>
      <p className="h2-sub">
        The pillars are universal — every founder agreement answers these. The
        specific questions inside each pillar are what most founders skip and
        later regret. Click any pillar to see the questions and the three
        industry-standard answers for each.
      </p>

      <div className="pillar-grid">
        <button className="pillar" onClick={() => goTab("equity")}>
          <div className="pillar-num">01 / EQUITY</div>
          <div className="pillar-title">
            Equity <em>Split</em>
          </div>
          <div className="pillar-count">3 questions</div>
          <div className="pillar-desc">
            Percentage split, share class structure, total authorized shares.
          </div>
        </button>
        <button className="pillar" onClick={() => goTab("vesting")}>
          <div className="pillar-num">02 / VESTING</div>
          <div className="pillar-title">
            <em>Vesting</em> Terms
          </div>
          <div className="pillar-count">4 questions</div>
          <div className="pillar-desc">
            Duration, cliff length, sweat-equity credit, acceleration triggers.
          </div>
        </button>
        <button className="pillar" onClick={() => goTab("roles")}>
          <div className="pillar-num">03 / ROLES</div>
          <div className="pillar-title">
            Roles &amp; <em>Titles</em>
          </div>
          <div className="pillar-count">3 questions</div>
          <div className="pillar-desc">
            Officer titles, domain split structure, time commitment.
          </div>
        </button>
        <button className="pillar" onClick={() => goTab("decisions")}>
          <div className="pillar-num">04 / DECISIONS</div>
          <div className="pillar-title">
            <em>Decision</em> Rules
          </div>
          <div className="pillar-count">4 questions</div>
          <div className="pillar-desc">
            Tier structure, major-matter threshold, deadlock resolution, board
            composition.
          </div>
        </button>
        <button className="pillar" onClick={() => goTab("exits")}>
          <div className="pillar-num">05 / EXITS</div>
          <div className="pillar-title">
            <em>Exit</em> Triggers
          </div>
          <div className="pillar-count">4 questions</div>
          <div className="pillar-desc">
            Departure categories, repurchase rights, transfer restrictions,
            non-compete scope.
          </div>
        </button>
      </div>

      <h2>
        <span className="h2s">How to use</span>The <em>process</em>
      </h2>

      <div className="tw">
        <table>
          <tbody>
            <tr>
              <th style={{ width: 60 }}>Step</th>
              <th>What happens</th>
              <th className="r" style={{ width: 120 }}>
                Time
              </th>
            </tr>
            <tr>
              <td className="m b">1</td>
              <td>
                <strong>Read through each pillar together.</strong> Both
                founders read the three options for each question. Reading
                time: about 60-90 minutes per pillar. Don&apos;t decide yet —
                just understand the options.
              </td>
              <td className="r m">Day 1</td>
            </tr>
            <tr>
              <td className="m b">2</td>
              <td>
                <strong>Discuss the contested ones first.</strong> Equity split
                and vesting acceleration are the most likely to produce
                disagreement. Resolve those before the easier ones.
              </td>
              <td className="r m">Day 1-2</td>
            </tr>
            <tr>
              <td className="m b">3</td>
              <td>
                <strong>Pick one option per question.</strong> Write the letter
                (A, B, or C) next to each topic. If a topic is genuinely
                unclear, default to the option marked{" "}
                <span style={{ color: "var(--g)", fontWeight: 600 }}>
                  Industry Standard
                </span>{" "}
                — it&apos;s the lowest-friction path through downstream
                attorney review and investor diligence.
              </td>
              <td className="r m">Day 2</td>
            </tr>
            <tr>
              <td className="m b">4</td>
              <td>
                <strong>Document the choices.</strong> The last tab (&quot;The
                Agreement&quot;) is a one-page Founder Agreement template that
                lists the eighteen decisions to record. Fill in selections;
                both founders sign.
              </td>
              <td className="r m">Day 2-3</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Cta
        text={
          <>
            <strong>Start with equity.</strong> The percentage split is the
            hardest conversation. Once that&apos;s resolved, the other pillars
            are relatively mechanical.
          </>
        }
        btn="Open Equity Split →"
        onGo={() => goTab("equity")}
      />
    </>
  );
}

/* ───────────────────────────── EQUITY ───────────────────────────── */

function Equity({ goTab }: { goTab: (id: TabId) => void }) {
  return (
    <>
      <h1>
        Equity <em>Split</em>
      </h1>
      <p className="sub">
        Three discussion topics: how to divide ownership between two founders,
        what share class structure to use, and how many shares to authorize at
        formation. These decisions are essentially locked once stock is issued
        — changing them later requires a recapitalization that can impair QSBS
        treatment and trigger investor disclosure requirements.
      </p>

      <Topic
        tag="Discussion 1.1"
        q={
          <>
            What percentage does each <em>founder</em> own?
          </>
        }
        ctx={
          <>
            The single most consequential decision in the entire agreement.
            Once Class A founder stock is issued, changing this ratio requires
            either (a) one founder voluntarily transferring shares (which can
            be a taxable event and impair QSBS treatment) or (b) a
            recapitalization. Both are expensive and disruptive. Decide
            honestly upfront based on time commitment, capital contribution,
            originator credit, and irreplaceability — not on
            equality-as-default.
          </>
        }
      />

      <Opt
        kind="alt1"
        letter="OPTION A"
        name={
          <>
            Equal partners · <em>50 / 50</em>
          </>
        }
        badge="Common"
        when={
          <>
            Both founders are full-time, contributing equivalent capital,
            sharing equivalent risk, with neither clearly the originator. Roles
            are complementary (commercial / operational, or strategy /
            execution) rather than ranked. Both founders are equally
            irreplaceable. Common in true co-founder dynamics where founders
            met as peers and built the idea together.
          </>
        }
        how={
          <>
            <strong>6,000,000 Class A shares</strong> to each founder. Each
            writes a personal check for $600.00 (par × shares) to purchase.
            Both founders hold equal voting power; tie-breaking is handled via
            deadlock resolution mechanisms (see Decisions tab), not equity
            weight.
          </>
        }
        lang="The Class A Common Stock shall be issued as follows: 6,000,000 shares to [Founder A] and 6,000,000 shares to [Founder B], each Founder thereby holding fifty percent (50%) of the issued equity and fifty percent (50%) of the voting power of the Corporation as of the date of issuance."
        pros={[
          "Maximum psychological alignment; \"equal partnership\" feels equal",
          "No \"junior partner\" resentment over time",
          "Forces unanimous-decision discipline from Day 1",
          "Cleanest split for founders with truly equivalent contributions",
        ]}
        cons={[
          "Genuine deadlocks require buy-sell shotgun resolution",
          "Investors sometimes prefer a clear \"CEO majority\" for accountability",
          "If contributions diverge in Years 2-3, equal equity creates friction",
          "No single founder can credibly speak for the company without checking in",
        ]}
      />

      <Opt
        kind="std"
        letter="OPTION B"
        name={
          <>
            Lead founder + key partner · <em>60 / 40</em>
          </>
        }
        badge="Industry Standard"
        when={
          <>
            One founder originated the business model, built the analytical
            foundation, leads the strategy, and is most accountable to
            investors as the public face. The other founder brings critical
            specialized expertise (regulatory, technical, operational) that is
            irreplaceable but executes within the strategic framework. Both are
            full-time. The 60/40 split reflects asymmetric leadership without
            being so lopsided that it undervalues the key partner.
          </>
        }
        how={
          <>
            <strong>7,200,000 Class A shares</strong> to the lead founder
            ($720.00 purchase), <strong>4,800,000 Class A shares</strong> to
            the key partner ($480.00 purchase). Lead founder serves as CEO and
            board chair; key partner serves as COO or equivalent C-level
            operating role.
          </>
        }
        lang="The Class A Common Stock shall be issued as follows: 7,200,000 shares to [Founder A] (representing sixty percent (60%) of issued equity and voting power) and 4,800,000 shares to [Founder B] (representing forty percent (40%) of issued equity and voting power), each Founder acquiring such shares by purchase at par value ($0.0001 per share)."
        pros={[
          "Reflects most real-world founder dynamics honestly",
          "Investors prefer a clear \"first among equals\" CEO",
          "Lead founder retains voting majority even before super-voting math",
          "Both founders fall under the $15M QSBS cap up to a $40M exit",
          "Industry default in clean energy and infrastructure startups",
        ]}
        cons={[
          "Key partner may feel under-recognized if they grow into a peer-level operational lead",
          "Above $40M exit, lead founder exceeds the $15M QSBS cap before key partner does",
          "Requires honest conversation about why one founder is \"more\"",
        ]}
      />

      <Opt
        kind="alt2"
        letter="OPTION C"
        name={
          <>
            Founder + builder · <em>70 / 30</em>
          </>
        }
        badge="Less Common"
        when={
          <>
            One founder is full-time and holds all customer, regulatory,
            capital, and strategic relationships. The other founder is
            part-time, capital-only, or stepping in as a senior specialist with
            co-founder title (rather than as a true peer). This split is
            honest about asymmetric commitment but creates real risk of
            disengagement on the 30% side if circumstances change.
          </>
        }
        how={
          <>
            <strong>8,400,000 Class A shares</strong> to the lead founder
            ($840.00 purchase), <strong>3,600,000 Class A shares</strong> to
            the builder ($360.00 purchase). Often paired with a reduced time
            commitment requirement for the 30% holder (e.g., &quot;minimum 30
            hours per week&quot; rather than full-time).
          </>
        }
        lang="The Class A Common Stock shall be issued as follows: 8,400,000 shares to [Founder A] (representing seventy percent (70%) of issued equity and voting power) and 3,600,000 shares to [Founder B] (representing thirty percent (30%) of issued equity and voting power). [Founder B]'s minimum time commitment to the Corporation shall be thirty (30) hours per week, subject to adjustment by mutual written consent."
        pros={[
          "Reflects asymmetric commitment honestly",
          "Lead founder retains supermajority even after Class B dilution",
          "Appropriate when one founder is essentially capital-only or part-time",
        ]}
        cons={[
          "30% holder may feel devalued; high disengagement risk if circumstances change",
          "\"30% co-founder\" can be perceived externally as a senior hire with a co-founder title",
          "Heavy concentration risk if lead founder departs unexpectedly",
          "Investors may push back if 30% holder is operationally critical but minimally vested",
        ]}
      />

      <Topic
        tag="Discussion 1.2"
        q={
          <>
            Single class of common, or <em>dual class</em> with super-voting
            founder shares?
          </>
        }
        ctx={
          <>
            The share class structure determines whether founders retain voting
            control after dilution. Decided at formation in the Certificate of
            Incorporation. Changing this later requires a charter amendment
            plus shareholder consent — expensive and friction-laden once any
            outside shareholders exist. Decide now, even if it feels
            overengineered for two founders Day 1.
          </>
        }
      />

      <Opt
        kind="alt1"
        letter="OPTION A"
        name={
          <>
            Single class · <em>common stock</em>
          </>
        }
        badge="Simplest"
        langLabel="Sample Charter Language"
        when="You don't anticipate raising significant outside equity (debt-first capital stack), or you're comfortable with voting power diluting proportionally with economic interest. Best for capital-light businesses or businesses that plan a fast exit before substantial dilution would occur."
        how="All shares are common stock with one vote per share. Founders dilute proportionally as Class B-equivalent shares issue to option pool, advisors, contractor partner, and investors. After a 25% dilution event, founders hold 75% of voting power; after 50% total dilution, founders hold 50%."
        lang="The Corporation shall be authorized to issue 10,000,000 shares of Common Stock, par value $0.0001 per share. Each share of Common Stock shall be entitled to one (1) vote on all matters submitted to a vote of the stockholders."
        pros={[
          "Simplest possible charter",
          "No investor objections at any stage",
          "Cheapest to administer; no Class A/B conversion mechanics",
          "Standard for very early-stage companies",
        ]}
        cons={[
          "Voting power = economic interest 1:1 — founders lose control through dilution",
          "After Series A, founders typically hold < 50% voting",
          "Adding super-voting later is expensive and requires shareholder consent",
          "Less protection against hostile acquirer or activist investor",
        ]}
      />

      <Opt
        kind="std"
        letter="OPTION B"
        name={
          <>
            Dual class · <em>Class A super-voting + Class B common</em>
          </>
        }
        badge="Industry Standard"
        langLabel="Sample Charter Language"
        when="You expect to issue Class B-equivalent shares to advisors, employees, contractor partner, and investors over time, and you want founders to retain voting control through that dilution. Standard at formation in any company expecting to raise outside capital or grant equity broadly. Costs nothing extra to authorize at formation."
        how="Class A = 10 votes per share, issued only to founders. Class B = 1 vote per share, issued to everyone else. After full Class B dilution (option pool, advisor, contractor partner, seed investors), founders typically retain ~94% of voting power despite holding only ~60% of economic interest. Class A shares automatically convert to Class B on transfer to any non-founder."
        lang="The Corporation shall be authorized to issue 20,000,000 shares of capital stock, consisting of (i) 12,000,000 shares of Class A Common Stock, par value $0.0001 per share, entitled to ten (10) votes per share, and (ii) 8,000,000 shares of Class B Common Stock, par value $0.0001 per share, entitled to one (1) vote per share. Each share of Class A Common Stock shall automatically convert into one share of Class B Common Stock upon any Transfer to a person other than a Founder or a Permitted Transferee."
        pros={[
          "Founders retain ~94% voting power after typical Series A dilution",
          "No marginal cost at formation",
          "No investor objection through Series A (standard structure)",
          "Strong protection against hostile acquisition, activist investors",
        ]}
        cons={[
          "Some institutional investors at Series B+ may push for collapse to single class",
          "Slightly more administrative complexity (tracking two classes on cap table)",
          "Adding super-voting later requires a charter amendment and shareholder consent",
        ]}
      />

      <Opt
        kind="alt2"
        letter="OPTION C"
        name={
          <>
            Class F founder stock · <em>YC standard</em>
          </>
        }
        badge="Aggressive"
        langLabel="Sample Charter Language"
        when="You want the strongest possible founder-protective structure with explicit protective provisions baked into the charter (right to fire CEO, block sale below threshold, override board on specific matters). Most common in YC-incubated companies. Uses Y Combinator's open-source Class F template."
        how="Class F stock with super-voting plus specific protective provisions in the charter itself. Founder-specific protective covenants (e.g., F holders can block any sale below a defined per-share floor; F holders elect 2 of 3 board seats irrespective of equity ownership). More elaborate than dual class."
        lang="The Corporation shall be authorized to issue Series FF Preferred Stock, designated as founder stock, with voting power, conversion rights, and protective provisions as set forth in Schedule A attached hereto. Holders of Series FF Preferred Stock shall, voting as a separate class, be entitled to elect two (2) members of the Board of Directors and shall have the right to approve, by a majority of outstanding FF shares, any sale or merger of the Corporation."
        pros={[
          "Strongest founder protection available in the market",
          "Standardized template recognized by YC alumni network",
          "Explicit charter-level guarantees of founder rights",
        ]}
        cons={[
          "Charter complexity is meaningfully higher",
          "Some institutional investors flag this as aggressive at Series A diligence",
          "Less common outside YC ecosystem",
          "Stripe Atlas does not generate this — requires custom attorney work",
        ]}
      />

      <Topic
        tag="Discussion 1.3"
        q={
          <>
            How many <em>total shares</em> to authorize?
          </>
        }
        ctx="Total authorized shares set the resolution at which future grants can be made. Doesn't affect economic ownership — only the granularity. A 0.5% advisor grant is the same value whether it's 50,000 shares of a 10M structure or 500,000 shares of a 100M structure. Pick what feels right for communication and grant-tracking psychology."
      />

      <Opt
        kind="alt1"
        letter="OPTION A"
        name={
          <>
            10,000,000 total · <em>conservative</em>
          </>
        }
        badge="Tight"
        langLabel="Sample Charter Language"
        when="Smaller cap table with few planned grants, comfortable thinking in larger percentages per grant. Each grant feels meaningful because each share represents 0.00001% of the company. Some founders prefer the simplicity of smaller numbers."
        how="6M Class A to founders, 4M Class B reserved. Smallest practical grant is around 10,000 shares (0.1%). Each 1% grant = 100,000 shares. Cap table fits on a single screen even at full dilution."
        lang="The Corporation shall be authorized to issue 10,000,000 shares of capital stock, consisting of 6,000,000 shares of Class A Common Stock and 4,000,000 shares of Class B Common Stock, each at par value $0.0001 per share."
        pros={[
          "Simple math; easy to communicate",
          "Smaller share counts feel less intimidating",
          "Adequate for most early-stage cap tables",
        ]}
        cons={[
          "Lower granularity — minimum meaningful grant is ~0.1% (10K shares)",
          "Hard to make small grants feel substantial",
          "Limited room before recapitalization at scale",
        ]}
      />

      <Opt
        kind="std"
        letter="OPTION B"
        name={
          <>
            20,000,000 total · <em>standard</em>
          </>
        }
        badge="Industry Standard"
        langLabel="Sample Charter Language"
        when="The Stripe Atlas default, and the most common authorization in venture-backed startups. Good balance between granularity (1,000 share grants are common) and simplicity (numbers stay readable on a cap table). Sufficient for typical Series A dilution paths."
        how="12M Class A to founders, 8M Class B reserved. Each 1% grant = 200,000 shares. Smallest practical grant is around 5,000 shares (0.025%). Cap table accommodates a 10-15% option pool, 0.5% advisor grant, contractor partner equity, and typical seed investor allocation without recapitalization."
        lang="The Corporation shall be authorized to issue 20,000,000 shares of capital stock, consisting of 12,000,000 shares of Class A Common Stock and 8,000,000 shares of Class B Common Stock, each at par value $0.0001 per share."
        pros={[
          "Atlas default — no friction in formation workflow",
          "Good granularity for typical grant sizes",
          "Room for expected dilution events without recapitalization",
          "Numbers stay communicable (\"100,000 shares\" reads cleanly)",
        ]}
        cons={["None material — this is the consensus default"]}
      />

      <Opt
        kind="alt2"
        letter="OPTION C"
        name={
          <>
            100,000,000 total · <em>high precision</em>
          </>
        }
        badge="Granular"
        langLabel="Sample Charter Language"
        when="You anticipate many small grants (large option pool grants in basis points, broad employee equity participation, or precise advisor allocations like 0.13%). Used in larger companies where 1,000-share grants would feel trivial. Less common at formation."
        how="60M Class A to founders, 40M Class B reserved. Each 0.01% grant = 10,000 shares. Smallest practical grant is around 1,000 shares (0.001%). Allows for very fine-grained equity allocations."
        lang="The Corporation shall be authorized to issue 100,000,000 shares of capital stock, consisting of 60,000,000 shares of Class A Common Stock and 40,000,000 shares of Class B Common Stock, each at par value $0.00001 per share."
        pros={[
          "Allows 0.01% (10,000 share) grants to feel meaningful",
          "Room for many small option pool grants over time",
          "No risk of running out of authorized shares",
        ]}
        cons={[
          "Larger numbers harder to communicate verbally",
          "Atlas requires a custom workflow rather than default",
          "Overkill for a 2-founder, debt-first startup",
        ]}
      />

      <div className="note green" style={{ marginTop: 36 }}>
        <strong>The QSBS-clean purchase mechanics.</strong> Whichever option
        you pick for split + class + total, founder stock must be{" "}
        <strong>purchased</strong>, not granted, at par value, with cash, on or
        before the date the Certificate of Incorporation is accepted by
        Delaware. Granted stock is taxed as ordinary income compensation;
        purchased stock at par establishes basis for QSBS calculation. Each
        founder writes a personal check (Class A shares × par value). Section
        83(b) elections mailed within 30 days via certified mail with return
        receipt requested. No exceptions, no fixes for missing the 30-day
        deadline.
      </div>

      <Cta
        text={
          <>
            <strong>Equity questions resolved.</strong> Next: how each founder
            actually earns the stock they purchased.
          </>
        }
        btn="Open Vesting →"
        onGo={() => goTab("vesting")}
      />
    </>
  );
}

/* ───────────────────────────── VESTING ───────────────────────────── */

function Vesting({ goTab }: { goTab: (id: TabId) => void }) {
  return (
    <>
      <h1>
        <em>Vesting</em> Terms
      </h1>
      <p className="sub">
        Four discussion topics: how long the vesting schedule runs, how long
        the initial cliff lasts, whether to credit sweat equity from
        pre-formation work, and what happens to unvested shares on a sale.
        Vesting protects the company and the remaining founder against the
        single most common cap-table disaster: a co-founder dropping out in
        Year 1 while still holding 30-50% of the company.
      </p>

      <Topic
        tag="Discussion 2.1"
        q={
          <>
            How long should the <em>vesting schedule</em> run?
          </>
        }
        ctx="The duration determines how long a founder must stay engaged before owning their full stock allocation outright. Too short and there's insufficient retention pressure; too long and it creates resentment by Year 4 when most of the work is done. Investor-backed startups overwhelmingly use 4 years — anything else triggers diligence questions."
      />

      <Opt
        kind="alt1"
        letter="OPTION A"
        name={
          <>
            3-year vesting · <em>shorter horizon</em>
          </>
        }
        badge="Aggressive"
        when="Both founders are experienced operators with prior exits, and the planned exit is also accelerated (Year 3-4 sale). Or there's a specific milestone the 3-year window is calibrated to (e.g., CGB program runway, regulatory grant period). Less common in venture-backed companies."
        how="25% vests at the 1-year cliff, then 1/36 monthly over the next 24 months. Fully vested at month 36. Aligns reasonably with a Year 5 exit — both founders fully vested two years before the QSBS sale."
        lang="Each Founder's shares shall vest over a period of thirty-six (36) months from the Vesting Commencement Date, with twenty-five percent (25%) vesting on the first anniversary of the Vesting Commencement Date and the remaining seventy-five percent (75%) vesting in equal monthly installments over the subsequent twenty-four (24) months."
        pros={[
          "Faster path to fully-vested founder ownership",
          "Aligns with accelerated exit thesis",
          "Reduces \"vesting overhang\" friction at sale",
        ]}
        cons={[
          "Investors at Series A often push for the standard 4-year",
          "Less retention pressure on founders in Years 3-4",
          "Triggers diligence questions (\"why 3 not 4?\")",
        ]}
      />

      <Opt
        kind="std"
        letter="OPTION B"
        name={
          <>
            4-year vesting · <em>industry default</em>
          </>
        }
        badge="Industry Standard"
        when="Every standard scenario. The overwhelming default in venture-backed startups, recognized by every investor, every attorney, and every acquirer. Choose this unless there's a very specific reason for a different duration. Aligns perfectly with the 5-year QSBS holding period (1-year holdback after full vest before the exit)."
        how={"25% vests at the 1-year cliff, then 1/48 (approximately 2.083%) of total shares vest monthly over the next 36 months. Fully vested at month 48. Standard \"4 with a 1-year cliff\" terminology."}
        lang="Each Founder's shares shall vest over a period of forty-eight (48) months from the Vesting Commencement Date, with twenty-five percent (25%) vesting on the first anniversary of the Vesting Commencement Date and the remaining seventy-five percent (75%) vesting in equal monthly installments over the subsequent thirty-six (36) months. Vesting shall continue only so long as the Founder remains a Service Provider to the Corporation."
        pros={[
          "Industry default — zero friction in attorney review, investor diligence, acquirer review",
          "Atlas-template-compatible",
          "Tight enough to retain talent, long enough to capture commitment",
          "Aligns with 5-year QSBS clock with 12-month buffer",
        ]}
        cons={["None material — this is the default for a reason"]}
      />

      <Opt
        kind="alt2"
        letter="OPTION C"
        name={
          <>
            5-year vesting · <em>longer horizon</em>
          </>
        }
        badge="Conservative"
        when="Capital-intensive infrastructure businesses with explicit 7-10 year exit horizons, or when founders want maximum mutual retention guarantee. Less common but sometimes appropriate for project-development companies that don't expect Series A capital."
        how="20% vests at the 1-year cliff, then 1/60 of total shares vest monthly over the next 48 months. Fully vested at month 60. Coincides exactly with the QSBS 5-year holding period — founders become fully vested the same month they qualify for the exit."
        lang="Each Founder's shares shall vest over a period of sixty (60) months from the Vesting Commencement Date, with twenty percent (20%) vesting on the first anniversary of the Vesting Commencement Date and the remaining eighty percent (80%) vesting in equal monthly installments over the subsequent forty-eight (48) months."
        pros={[
          "Maximum retention pressure",
          "Aligns precisely with the 5-year QSBS milestone",
          "Appropriate for slow-burn infrastructure plays",
        ]}
        cons={[
          "Investors and acquirers see this as non-standard",
          "Vesting overhang at Year 5 sale — last month's vest hits at the same moment as exit",
          "Can feel like \"indentured servitude\" in Years 4-5 if relationship sours",
        ]}
      />

      <Topic
        tag="Discussion 2.2"
        q={
          <>
            How long should the <em>initial cliff</em> last?
          </>
        }
        ctx="The cliff is the period during which a departing founder gets nothing — no vested shares, full repurchase right at par. Its purpose is to filter out fast-quitters who would otherwise walk away with substantial equity for minimal work. Almost universally one year; shorter or longer is a signal that something unusual is happening."
      />

      <Opt
        kind="alt1"
        letter="OPTION A"
        name={
          <>
            No cliff · <em>straight monthly</em>
          </>
        }
        badge="Founder-friendly"
        when="Founders have worked together for years before formation, have deep trust, and consider the cliff insulting. Sometimes used when one founder is bringing significant capital and wants symbolic recognition. Rare in practice."
        how="Vesting begins immediately on a straight-line monthly basis from the Vesting Commencement Date. 1/48 (approximately 2.083%) of shares vest each month with no front-loaded vesting event. Departing founder in month 6 would keep 6/48 = 12.5%."
        lang="Each Founder's shares shall vest in equal monthly installments over forty-eight (48) months from the Vesting Commencement Date, with no initial cliff or holdback. 1/48 of the Founder's total shares shall vest on the last day of each calendar month, beginning with the first full calendar month following the Vesting Commencement Date."
        pros={[
          "Signals high trust between founders",
          "No \"all or nothing\" feeling at month 11",
          "Smoother accrual pattern",
        ]}
        cons={[
          "A founder departing in month 3 still keeps 6.25% of the company",
          "Investors at Series A typically renegotiate this to add a cliff",
          "Triggers diligence questions and attorney warnings",
          "Real risk if either founder turns out to be a flight risk",
        ]}
      />

      <Opt
        kind="std"
        letter="OPTION B"
        name={
          <>
            1-year cliff · <em>standard</em>
          </>
        }
        badge="Industry Standard"
        when="Every standard scenario. The cliff filters out founders who leave inside the first year — the highest-risk departure window. After the cliff hits, vesting smooths to monthly accrual. Universally accepted by investors, attorneys, and acquirers."
        how="No shares vest for the first 12 months. On the 1-year anniversary, 25% of total shares vest in a single moment. From month 13 forward, 1/48 of total shares vest each month until full vest at month 48. A founder departing on month 11 walks away with zero shares (company repurchases all at par)."
        lang={"No shares shall vest during the first twelve (12) months following the Vesting Commencement Date (the \"Cliff Period\"). Upon the first anniversary of the Vesting Commencement Date, twenty-five percent (25%) of the Founder's shares shall vest. Thereafter, the remaining seventy-five percent (75%) of the Founder's shares shall vest in equal monthly installments over the subsequent thirty-six (36) months."}
        pros={[
          "Industry default; zero friction with investors and attorneys",
          "Atlas-template-compatible",
          "Effectively filters fast-quitters",
          "Recognized retention mechanism with established precedent",
        ]}
        cons={[
          "Creates an awkward month 11-12 dynamic if one founder is wavering",
          "\"All-or-nothing\" structure can feel harsh if departure is for legitimate reasons",
        ]}
      />

      <Opt
        kind="alt2"
        letter="OPTION C"
        name={
          <>
            6-month cliff · <em>shortened</em>
          </>
        }
        badge="Less Common"
        when="Founders have a substantial prior working relationship and want some cliff protection but feel a full year is excessive. Sometimes paired with a 25% upfront vest (sweat-equity credit). Less common but defensible if both founders have prior operating experience together."
        how="No shares vest for first 6 months. On the 6-month anniversary, 12.5% vests in a single moment. From month 7 forward, the remaining 87.5% vests monthly over 42 months. Full vest at month 48."
        lang="No shares shall vest during the first six (6) months following the Vesting Commencement Date. Upon the six-month anniversary, twelve and one-half percent (12.5%) of the Founder's shares shall vest. Thereafter, the remaining eighty-seven and one-half percent (87.5%) of the Founder's shares shall vest in equal monthly installments over the subsequent forty-two (42) months."
        pros={[
          "Some cliff protection while signaling moderate trust",
          "Smaller \"all-or-nothing\" moment than the 1-year cliff",
        ]}
        cons={[
          "Non-standard — triggers diligence questions",
          "Investors typically re-negotiate to standard 1-year at Series A",
          "Most attorneys default-draft 1-year and will flag this as unusual",
        ]}
      />

      <Topic
        tag="Discussion 2.3"
        q={
          <>
            Credit for <em>sweat equity</em> done before formation?
          </>
        }
        ctx="When one or both founders have done substantial pre-formation work (financial modeling, market analysis, partner outreach, platform development), the question is whether that work should be recognized through some upfront vesting. The answer affects what happens if that founder departs before the 1-year cliff — without sweat-equity credit, all their pre-formation work evaporates from their equity stake."
      />

      <Opt
        kind="alt1"
        letter="OPTION A"
        name={
          <>
            No credit · <em>clean slate</em>
          </>
        }
        badge="Strict"
        when="Both founders are starting roughly fresh, or neither has done substantial pre-formation work, or both want a clean 4-year cliff structure with no special accommodations. The simplest possible vesting setup — everyone starts from zero on Day 1."
        how="Standard 4-year vesting with 1-year cliff. No portion is pre-vested at issuance. Both founders carry full exposure to the cliff. A founder departing in month 11 walks away with zero shares regardless of how much pre-formation work they did."
        lang="No portion of any Founder's shares shall be deemed vested at issuance. All shares shall vest pursuant to the standard schedule set forth in Section [X] (twenty-five percent (25%) on the first anniversary, monthly thereafter over thirty-six (36) months)."
        pros={[
          "Simplest possible structure",
          "Maximum retention pressure on both founders",
          "Clean Atlas template; zero attorney customization",
          "No room for \"I worked harder than you pre-formation\" disputes",
        ]}
        cons={[
          "Founder who did substantial pre-formation work has no protection if they depart in months 1-11",
          "Can feel unfair if one founder built the business case before the other joined",
          "May discourage early heavy-lifting if a founder fears departure friction",
        ]}
      />

      <Opt
        kind="std"
        letter="OPTION B"
        name={
          <>
            25% upfront vest · <em>standard sweat credit</em>
          </>
        }
        badge="Industry Standard"
        when="One or both founders have done meaningful pre-formation work (6+ months of unpaid analysis, modeling, outreach, or development) and that work materially de-risked the business. The 25% upfront recognizes that effort while preserving 75% of the vesting curve for ongoing commitment. Most common when one founder is the originator and the other joins after the business model is mature."
        how="25% of one founder's shares (typically the originator) vest at issuance. The remaining 75% vests over 36 months from the Vesting Commencement Date with no further cliff. The other founder typically follows the standard 4-year/1-year-cliff schedule, or may also receive a partial upfront credit if appropriate."
        lang="Notwithstanding the standard vesting schedule, twenty-five percent (25%) of [Founder A]'s shares shall be deemed vested as of the Vesting Commencement Date in recognition of pre-formation contributions to the Corporation's business plan, financial model, and customer pipeline. The remaining seventy-five percent (75%) of [Founder A]'s shares shall vest in equal monthly installments over thirty-six (36) months thereafter, with no further cliff."
        pros={[
          "Industry standard for originator-with-pre-formation-work scenarios",
          "Fair recognition of unpaid pre-formation effort",
          "Reduces \"cliff anxiety\" for the founder who built the business case",
          "Recognized template; no investor friction",
        ]}
        cons={[
          "Asymmetric (25% to one founder, 0% to the other) requires explicit justification",
          "If applied to both founders symmetrically, defeats the retention purpose",
          "Should be paired with explicit documentation of the pre-formation work performed",
        ]}
      />

      <Opt
        kind="alt2"
        letter="OPTION C"
        name={
          <>
            Backdated start · <em>VCD before formation</em>
          </>
        }
        badge="Aggressive"
        when="Both founders did substantial work together over a defined pre-formation period (e.g., 9 months of joint effort) and want that period to count toward vesting. Instead of vesting starting at formation, the Vesting Commencement Date is backdated to the start of the joint effort. Less common; somewhat aggressive."
        how="The Vesting Commencement Date is set to a date before formation (e.g., 9 months prior). On Day 1 of formation, founders are already 9 months into the cliff. If the cliff is 12 months, founders cross the cliff at month 3 post-formation, vesting 25% at that point. Full vest occurs 39 months after formation rather than 48."
        lang="The Vesting Commencement Date for each Founder shall be [DATE PRIOR TO FORMATION], reflecting the period of joint pre-formation effort acknowledged by both Founders. Vesting shall proceed from such date pursuant to the standard schedule, with twenty-five percent (25%) vesting on the first anniversary of the Vesting Commencement Date."
        pros={[
          "Recognizes joint pre-formation effort symmetrically",
          "Cleaner accounting than asymmetric upfront credits",
          "Maintains the cliff structure (just shifted in time)",
        ]}
        cons={[
          "Backdating vesting can complicate 83(b) elections (deadline is 30 days from purchase, not from VCD)",
          "Investors and acquirers may flag the backdating in diligence",
          "Requires defensible documentation of the pre-formation period",
          "If the backdated period is too long, may impair QSBS treatment",
        ]}
      />

      <Topic
        tag="Discussion 2.4"
        q={
          <>
            What happens to unvested shares on <em>acquisition</em>?
          </>
        }
        ctx="When the company is sold and a founder is mid-vesting, two things can happen: either the unvested shares automatically vest at the sale (founder gets full payout), or the unvested shares survive into the acquirer's hands (founder must keep working for the acquirer to earn them out). Three common structures, with different implications for both the founder and the acquirer's price."
      />

      <Opt
        kind="alt1"
        letter="OPTION A"
        name={
          <>
            No acceleration · <em>vesting continues post-sale</em>
          </>
        }
        badge="Acquirer-friendly"
        when="You prioritize the highest possible exit price and are confident in being retained by the acquirer post-sale. The acquirer pays full price because founders are mechanically locked in to keep working. Rare in modern deals; mostly historical structure."
        how="Acquisition does not trigger any vesting acceleration. Unvested shares survive into the acquirer's structure under their original schedule. Founder must continue providing services to the acquirer to vest the remainder. If terminated post-sale, all unvested shares are forfeit."
        lang="A Change of Control shall not trigger any acceleration of vesting. Unvested shares shall continue to vest pursuant to the original schedule following any Change of Control, subject to the Founder's continued service to the Corporation or its successor."
        pros={[
          "Maximum acquirer flexibility and highest deal price",
          "Aligns founder with acquirer retention plans",
        ]}
        cons={[
          "Founder has no protection against post-acquisition firing",
          "Acquirer can \"constructively terminate\" founder to capture unvested shares",
          "Founder-hostile; rarely accepted in modern term sheets",
        ]}
      />

      <Opt
        kind="std"
        letter="OPTION B"
        name={
          <>
            Double trigger · <em>acquisition + termination</em>
          </>
        }
        badge="Industry Standard"
        when={"Every standard scenario. Founder is protected from being acquired and then fired, but the acquirer retains flexibility — if they want to keep the founder, vesting continues normally. The \"double\" refers to both events needing to occur: sale AND termination (or resignation for good reason)."}
        how={"All unvested shares accelerate and vest fully if, within 12-24 months (18 months is the common middle) following a Change of Control, the founder is terminated without cause OR resigns for \"good reason\" (material adverse change in role, compensation, or location). If founder is retained normally post-sale, vesting continues on the original schedule."}
        lang={"In the event of a Change of Control, all then-unvested shares held by a Founder shall accelerate and vest in full upon the earlier of: (a) termination of the Founder's service without Cause within eighteen (18) months following the Change of Control; or (b) the Founder's resignation for Good Reason within eighteen (18) months following the Change of Control. \"Good Reason\" shall mean: (i) a material reduction in the Founder's title, duties, or responsibilities; (ii) a material reduction in cash compensation; or (iii) a required relocation of the Founder's principal work location by more than fifty (50) miles."}
        pros={[
          "Industry standard; expected by every acquirer and investor",
          "Founder protected from post-acquisition firing",
          "Acquirer retains flexibility for retained founders",
          "Atlas-template-compatible",
          "Aligns incentives across acquisition",
        ]}
        cons={[
          "Founder doesn't get full liquidity at sale (must remain to keep vesting)",
          "\"Good Reason\" definition can be litigated post-sale",
        ]}
      />

      <Opt
        kind="alt2"
        letter="OPTION C"
        name={
          <>
            Single trigger · <em>full acceleration on sale</em>
          </>
        }
        badge="Founder-friendly"
        when="Founder is irreplaceable but expects to leave or step back at acquisition. Sometimes negotiated for highly-recruited specialists who need explicit assurance that they'll get full liquidity at sale regardless of retention. Acquirers dislike this and may reduce offer price."
        how="All unvested shares automatically vest in full at closing of any Change of Control, regardless of whether the founder is retained by the acquirer. Founder walks away fully vested from the sale."
        lang="Upon the closing of any Change of Control, all then-unvested shares held by each Founder shall automatically accelerate and vest in full, without further action required. The acceleration shall occur immediately prior to such closing such that the Founder shall participate in the Change of Control proceeds with respect to all of the Founder's shares."
        pros={[
          "Founder gets full liquidity at sale",
          "No risk of acquirer-side firing impairing payout",
          "Simpler mechanics",
        ]}
        cons={[
          "Acquirers dislike — often demand removal or modification at LOI stage",
          "May reduce offer price by 5-10% as acquirer prices in the retention risk",
          "Investors at Series A typically modify to double-trigger",
          "Less common than double-trigger in modern deals",
        ]}
      />

      <Cta
        text={
          <>
            <strong>Vesting resolved.</strong> Next: which founder owns which
            operational domain.
          </>
        }
        btn="Open Roles →"
        onGo={() => goTab("roles")}
      />
    </>
  );
}

/* ───────────────────────────── ROLES ───────────────────────────── */

function Roles({ goTab }: { goTab: (id: TabId) => void }) {
  return (
    <>
      <h1>
        Roles &amp; <em>Titles</em>
      </h1>
      <p className="sub">
        Three discussion topics: what officer titles each founder takes, how
        operational domains are split between them, and how much time each
        founder commits to the company. Role clarity at formation prevents the
        most common Year 2 friction: &quot;I thought you were doing that.&quot;
        Both founders remain general officers of the corporation and
        accountable to the board, but each owns specific operating domains and
        decisions within them.
      </p>

      <Topic
        tag="Discussion 3.1"
        q={
          <>
            What <em>officer titles</em> do the two founders take?
          </>
        }
        ctx="Officer titles signal external roles and define internal authority for corporate documents (signing contracts, opening accounts, representing the company). The titles themselves don't affect equity, but they do affect investor and acquirer perception. Three common configurations for a two-founder company."
      />

      <Opt
        kind="std"
        letter="OPTION A"
        name={
          <>
            CEO + COO · <em>standard division</em>
          </>
        }
        badge="Industry Standard"
        when="Most common two-founder configuration. CEO is the external-facing leader (customers, investors, board, strategy); COO owns internal operations (regulatory, deployment, customer success, day-to-day execution). Aligns with a 60/40 or 70/30 equity split where the CEO is the lead founder."
        how={
          <>
            <strong>CEO</strong> (Founder A) — Chief Executive Officer, Chair
            of the Board. Authority to sign contracts up to a defined limit,
            represent the company externally, and act as the public face.{" "}
            <strong>COO</strong> (Founder B) — Chief Operating Officer,
            Corporate Secretary. Owns internal operations, regulatory filings,
            day-to-day execution.
          </>
        }
        lang="The Corporation shall have the following officers, each appointed by the Board: [Founder A] shall serve as Chief Executive Officer and Chair of the Board, with primary responsibility for strategy, capital, customer relationships, and external communications. [Founder B] shall serve as Chief Operating Officer and Corporate Secretary, with primary responsibility for regulatory compliance, operations, and corporate record-keeping."
        pros={[
          "Most familiar configuration for investors, customers, and acquirers",
          "Clear authority hierarchy for external signing and representation",
          "Maps cleanly to the external/internal domain split",
          "No friction in attorney review or board resolutions",
        ]}
        cons={[
          "\"COO\" can sometimes feel like a \"deputy\" title in tech-startup culture",
          "Doesn't reflect technical-vs-commercial split if that's the actual division",
        ]}
      />

      <Opt
        kind="alt1"
        letter="OPTION B"
        name={
          <>
            CEO + President · <em>peer titles</em>
          </>
        }
        badge="Equal-Feel"
        when={"Both founders are co-leaders with substantial external relationships, and \"COO\" feels too subordinate. The President title is treated as a peer to CEO, often with explicit description of separate domains. Common in 50/50 founder configurations where neither founder wants to be \"the operator.\""}
        how={
          <>
            <strong>CEO</strong> — Chief Executive Officer, formally the chief
            officer. <strong>President</strong> — typically responsible for a
            major specific domain (operations, products, geographic region).
            Both founders share board chair responsibility or alternate.
            Authority is defined more explicitly in the bylaws since the titles
            don&apos;t imply hierarchy.
          </>
        }
        lang="The Corporation shall have the following officers: [Founder A] shall serve as Chief Executive Officer with responsibility for [defined domain]. [Founder B] shall serve as President with responsibility for [defined domain]. The Chief Executive Officer and President shall each have authority to bind the Corporation in matters within their respective domains, and shall jointly sign all matters extending across domains."
        pros={[
          "Signals peer relationship between founders",
          "Avoids \"COO as deputy\" perception",
          "Works well when both founders have external-facing roles",
        ]}
        cons={[
          "\"President\" without \"CEO\" can confuse customers and investors",
          "Authority must be explicitly defined in bylaws — more attorney work",
          "Outside North America, \"President\" sometimes implies more than COO",
        ]}
      />

      <Opt
        kind="alt2"
        letter="OPTION C"
        name={
          <>
            Co-CEOs · <em>shared top role</em>
          </>
        }
        badge="Rare"
        when="Both founders insist on equal positioning, typically with 50/50 equity, and have a long track record of joint decision-making. Sometimes used in research-driven companies or where founders have complementary external networks. Investors generally dislike this configuration."
        how="Both founders are designated Co-Chief Executive Officers. Either can sign on behalf of the company. The bylaws or shareholders' agreement defines a tie-breaking mechanism (typically requires both Co-CEOs to agree on Tier 2 and Tier 3 matters; either can act alone on Tier 1). One typically holds the board chair to provide a single point of governance authority."
        lang="The Corporation shall have two Co-Chief Executive Officers, [Founder A] and [Founder B], each with equal authority to bind the Corporation. The Co-CEOs shall act jointly on matters described in Schedule [X] of the Shareholders' Agreement. In the event of disagreement between the Co-CEOs on any matter, the matter shall be escalated to the Board for resolution."
        pros={[
          "Maximum signal of equal partnership",
          "Both founders carry equal external authority",
        ]}
        cons={[
          "Investors generally view Co-CEO structures negatively",
          "Decision-making slowness — every meaningful issue requires both",
          "External counterparties often confused about who to talk to",
          "Most major investor term sheets require collapsing to a single CEO at funding",
          "Acquirers prefer a single accountable executive",
        ]}
      />

      <Topic
        tag="Discussion 3.2"
        q={
          <>
            How are <em>operational domains</em> split between the two
            founders?
          </>
        }
        ctx="Once titles are set, the actual work needs to be divided. Three common split structures, each suited to a different founder dynamic. The choice should reflect the founders' actual skills and interests, not theoretical efficiency."
      />

      <Opt
        kind="std"
        letter="OPTION A"
        name={
          <>
            External / Internal · <em>commercial vs. operations</em>
          </>
        }
        badge="Industry Standard"
        when="One founder is naturally a relationship-builder and strategist; the other is naturally an operator and executor. Maps cleanly to CEO + COO titles. Common for clean-energy and infrastructure startups where the regulatory/operational lift is heavy and benefits from dedicated focus."
        how={
          <>
            <strong>External (CEO):</strong> strategy, business model, capital
            and finance, customer-facing relationships (housing authorities,
            LIHTC GPs, CGB leadership), investor relations, board governance,
            PR, IP and platform development. <strong>Internal (COO):</strong>{" "}
            regulatory and program enrollment, utility interconnection,
            permitting and AHJ relationships, customer operations, performance
            reporting and dispatch management, compliance documentation.
          </>
        }
        lang="[Founder A] shall serve as Chief Executive Officer with primary responsibility for: (i) strategy and business model; (ii) capital and finance; (iii) external relationships including customers, investors, and program administrators; (iv) board governance; and (v) corporate communications. [Founder B] shall serve as Chief Operating Officer with primary responsibility for: (i) regulatory compliance including CT ESS program administration; (ii) utility interconnection; (iii) permitting and authority-having-jurisdiction relationships; (iv) customer operations; and (v) performance reporting and dispatch management."
        pros={[
          "Cleanest split for clean energy / infrastructure startups",
          "Minimal overlap; clear accountability",
          "Maps to CEO + COO titles naturally",
          "Allows specialization (regulatory is a full-time job at scale)",
        ]}
        cons={[
          "\"Internal\" founder has limited external visibility — can affect post-sale retention",
          "Requires clear escalation rules when issues span domains",
        ]}
      />

      <Opt
        kind="alt1"
        letter="OPTION B"
        name={
          <>
            Functional split · <em>commercial / operational / technical</em>
          </>
        }
        badge="Functional"
        when="Founders have clearly distinct functional specialties — e.g., one is commercial and finance-oriented, the other is technical and operations-oriented. Both have substantial external presence within their functional area. Less common for two-founder companies; more often seen in three-founder structures."
        how={
          <>
            Functional domains assigned per founder&apos;s skill set:{" "}
            <strong>Founder A:</strong> all commercial functions including
            sales, finance, partnerships, strategy. <strong>Founder B:</strong>{" "}
            all technical and operational functions including engineering,
            regulatory, deployment, software platform.
          </>
        }
        lang="[Founder A] shall have primary responsibility for all commercial functions of the Corporation, including sales, finance, capital formation, partnerships, and strategy. [Founder B] shall have primary responsibility for all technical and operational functions, including platform engineering, regulatory compliance, deployment, and customer operations. Each Founder shall have authority to bind the Corporation in matters within their respective functional domain, subject to the Tier limits set forth in the Shareholders' Agreement."
        pros={[
          "Clear functional accountability",
          "Allows each founder to develop deep expertise in their domain",
          "Reduces overlap and double-coverage",
        ]}
        cons={[
          "Less clean for clean energy where regulatory is its own dedicated function",
          "\"Technical/operational\" can be too broad to manage",
          "Cross-domain issues (e.g., customer pricing) require explicit escalation",
        ]}
      />

      <Opt
        kind="alt2"
        letter="OPTION C"
        name={
          <>
            Geographic split · <em>parallel territories</em>
          </>
        }
        badge="Specialized"
        when="The company has distinct geographic or customer segments that can be operated in parallel by separate founders. Less common at formation; more often emerges later as the company scales. Sometimes used in service businesses or expansion-stage companies."
        how="Founder A owns one geographic territory or customer segment (e.g., CT and MA); Founder B owns another (e.g., NY and NJ). Both founders are full-stack within their territory — handling commercial, operational, and regulatory matters for their segment. Cross-segment matters (capital, software, brand) handled jointly."
        lang="[Founder A] shall have primary operational responsibility for the Corporation's activities in [TERRITORY 1], including all commercial, operational, and regulatory matters within such territory. [Founder B] shall have primary operational responsibility for [TERRITORY 2] on equivalent terms. Cross-territory matters including capital formation, software platform development, brand, and corporate governance shall be managed jointly."
        pros={[
          "Clear accountability for territorial P&L",
          "Allows specialization by regional regulation and customer dynamics",
          "Symmetric structure between founders",
        ]}
        cons={[
          "Inefficient at small scale — duplicate effort within each territory",
          "Cross-territory standardization becomes harder",
          "Not typically used at formation; usually emerges later",
          "Risk of founders developing competing fiefdoms",
        ]}
      />

      <Topic
        tag="Discussion 3.3"
        q={
          <>
            What <em>time commitment</em> does each founder make?
          </>
        }
        ctx={"Time commitment determines what counts as a \"good leaver\" departure versus a \"bad leaver\" or breach scenario. Decided at formation to align expectations. Standard is full-time for both founders, but some structures permit disclosed outside roles."}
      />

      <Opt
        kind="std"
        letter="OPTION A"
        name={
          <>
            Both full-time · <em>disclosed advisory roles permitted</em>
          </>
        }
        badge="Industry Standard"
        when="Standard for venture-backed and seriously capitalized startups. Both founders commit full-time, with the understanding that limited outside advisory work or board seats are permitted with disclosure and consent. The expectation is that founders' professional energy is CT Battery Solutions's, with minor exceptions."
        how="Both founders commit a minimum of 40 hours/week (effective full-time). Outside roles permitted if: (a) disclosed in writing to the other founder; (b) consented to in writing; (c) does not exceed 5 hours/week or 1 day/month; (d) does not present a competitive conflict; (e) cease immediately if requested by the board."
        lang="Each Founder shall devote substantially all of their professional time and effort to the affairs of the Corporation. Each Founder may, with the prior written consent of the other Founder and the Board, accept outside advisory roles or board positions, provided that: (i) such roles do not present a conflict of interest with the Corporation; (ii) such roles do not require more than five (5) hours per week of the Founder's time; and (iii) the Founder shall cease such activities upon request by the Board."
        pros={[
          "Industry standard for venture-backed companies",
          "Allows founders to maintain industry presence (board seats, advisor roles)",
          "Disclosure + consent prevents secret outside commitments",
          "Flexibility for occasional speaking engagements, advisory boards",
        ]}
        cons={[
          "Requires active management of outside commitments",
          "Risk that \"advisory roles\" expand beyond intent",
        ]}
      />

      <Opt
        kind="alt1"
        letter="OPTION B"
        name={
          <>
            Both full-time · <em>strict, no outside roles</em>
          </>
        }
        badge="Strict"
        when="Both founders agree that CT Battery Solutions is their sole professional commitment. No outside advisory roles, board seats, or consulting work permitted. Often used when founders are fully transitioning from prior careers and want a clean break."
        how="Both founders commit full-time and exclusively. No outside roles permitted regardless of consent. Any outside role requires either departure from CT Battery Solutions or formal modification of the founder agreement by both parties."
        lang="Each Founder shall devote their full professional time and effort exclusively to the affairs of the Corporation. No Founder shall accept outside employment, advisory roles, board positions, or consulting engagements during the term of this Agreement, except as expressly approved by amendment to this Agreement requiring the written consent of both Founders."
        pros={[
          "Maximum focus and commitment signal",
          "No risk of distraction from outside work",
          "Simplest enforcement",
        ]}
        cons={[
          "Inflexible — even reasonable advisory roles require formal amendment",
          "Can feel oppressive when one founder is approached for legitimate opportunities",
          "Less common in early-stage startups where founder networks matter",
        ]}
      />

      <Opt
        kind="alt2"
        letter="OPTION C"
        name={
          <>
            Asymmetric · <em>full-time + part-time</em>
          </>
        }
        badge="Asymmetric"
        when="One founder is full-time; the other has a defined part-time commitment (e.g., 20-30 hours/week) and an explicit outside role. Equity split should reflect the asymmetric commitment (typically 70/30 or 75/25). Most appropriate when the part-time founder is bringing critical expertise but maintains another professional role."
        how="Founder A commits full-time per Option A or B. Founder B commits a defined minimum (typically 20-30 hours/week, often 60% time) and may retain a specified outside role. Outside role is disclosed in the founder agreement and not subject to ongoing consent (it's pre-agreed). Equity split must explicitly reflect this asymmetry."
        lang="[Founder A] shall devote their full professional time and effort to the affairs of the Corporation. [Founder B] shall devote a minimum of twenty-five (25) hours per week to the affairs of the Corporation. [Founder B]'s continued service in [DISCLOSED OUTSIDE ROLE] is acknowledged by [Founder A] and the Corporation and shall not constitute a breach of this Agreement."
        pros={[
          "Honest about asymmetric commitment",
          "Allows founder with critical outside role to participate as a true co-founder",
          "Prevents fiction that everyone is \"full-time\"",
        ]}
        cons={[
          "Investors view asymmetric commitments as a risk factor",
          "Equity split must reflect commitment — typically requires 70/30 or larger gap",
          "Part-time founder has limited bandwidth as company scales",
          "Acquirers may discount founder retention value",
        ]}
      />

      <Cta
        text={
          <>
            <strong>Roles defined.</strong> Next: who actually decides what —
            and the threshold rules for each tier.
          </>
        }
        btn="Open Decision Making →"
        onGo={() => goTab("decisions")}
      />
    </>
  );
}

/* ───────────────────────────── DECISIONS ───────────────────────────── */

function Decisions({ goTab }: { goTab: (id: TabId) => void }) {
  return (
    <>
      <h1>
        Decision <em>Making</em>
      </h1>
      <p className="sub">
        Four discussion topics: how to tier decisions by significance, what
        threshold applies to major matters, how to resolve deadlocks when
        founders disagree, and what board composition looks like at each
        stage. The structure protects against two failure modes — decision
        paralysis where every minor choice requires both founders, and
        unilateral major decisions that bind the company without the other
        founder&apos;s consent.
      </p>

      <Topic
        tag="Discussion 4.1"
        q={
          <>
            How many <em>decision tiers</em>?
          </>
        }
        ctx="Decision tiers determine which decisions can be made unilaterally by one founder, which require both founders' agreement, and which require formal board action. Too few tiers create either paralysis (everything requires both) or unilateralism (nothing is reserved). Too many tiers create confusion."
      />

      <Opt
        kind="alt1"
        letter="OPTION A"
        name={
          <>
            Single threshold · <em>simple majority on everything</em>
          </>
        }
        badge="Simple"
        when="Founders prefer minimal process and trust each other to handle their domains without explicit approval rules. Every decision is technically a board matter requiring majority vote. Works only with 50/50 boards (where every decision requires both founders) or with super-voting structures that give one founder effective majority."
        how="All decisions are formally board decisions, requiring a majority of the two-person board. No domain-level autonomy; everything documented."
        lang="All decisions affecting the Corporation shall be made by the Board of Directors acting by majority vote. In the event of a deadlocked vote, the matter shall be escalated pursuant to the Deadlock Resolution provisions of this Agreement."
        pros={[
          "Simplest possible structure",
          "Every decision documented via board action",
          "No domain-level disputes about authority",
        ]}
        cons={[
          "Massive operational friction — every small decision is \"board business\"",
          "Slows everything down to founder-pairs speed",
          "Generates excessive paperwork at small scale",
          "Functions poorly in two-person boards where deadlock is common",
        ]}
      />

      <Opt
        kind="alt2"
        letter="OPTION B"
        name={
          <>
            Two tiers · <em>operational vs. major</em>
          </>
        }
        badge="Common"
        when={"Founders want operational autonomy within their domains but require both founders to agree on anything that affects the company materially. Simpler than three tiers but provides less nuance for \"in-between\" decisions that are operational in nature but have meaningful cost or strategic implications."}
        how={
          <>
            <strong>Tier 1 (operational):</strong> Either founder may act alone
            within their domain on routine matters, defined by a dollar
            threshold or domain scope. <strong>Tier 2 (major):</strong> Both
            founders must unanimously approve, with formal board consent for
            the largest matters.
          </>
        }
        lang="Decisions of the Corporation shall be allocated as follows: (i) Tier 1 — Operational Decisions: each Founder may act unilaterally within their domain on matters not exceeding $10,000 in cost and not affecting the strategic direction of the Corporation; (ii) Tier 2 — Major Decisions: matters exceeding $10,000 in cost, affecting strategy, or listed in Schedule [X] shall require the unanimous consent of both Founders and formal Board approval."
        pros={[
          "Cleaner than three tiers",
          "Clear binary: routine or not",
          "Less administrative overhead",
        ]}
        cons={[
          "\"Major\" tier catches too many medium decisions, slowing them",
          "Operational decisions with significant cost get treated the same as $10M company sale",
          "Some decisions are operational but warrant the other founder's input — no middle ground",
        ]}
      />

      <Opt
        kind="std"
        letter="OPTION C"
        name={
          <>
            Three tiers · <em>operational / strategic-op / major</em>
          </>
        }
        badge="Industry Standard"
        when="Most balanced structure. Allows speed on daily operations (Tier 1), structured consultation on significant operational matters (Tier 2), and formal board action on company-changing decisions (Tier 3). Adopted by most venture-backed startups with explicit governance structures."
        how={
          <>
            <strong>Tier 1 (operational):</strong> Each founder acts alone
            within their domain on routine matters up to $5,000 spend.{" "}
            <strong>Tier 2 (strategic-operational):</strong> Both founders must
            concur in writing on spending between $5,000 and $50,000, hires
            above $80,000/year, and material operational decisions affecting
            both domains. <strong>Tier 3 (major):</strong> Unanimous founder +
            formal board consent required for sale, new equity, debt above
            $250,000, pivot, budget, dissolution, officer comp.
          </>
        }
        lang="Decisions shall be allocated across three tiers: (i) Tier 1 — Operational: each Founder may act unilaterally within their respective domain on routine matters not exceeding $5,000 in cost; (ii) Tier 2 — Strategic-Operational: matters between $5,000 and $50,000, hires above $80,000 annual compensation, and material operational decisions shall require written concurrence of both Founders; (iii) Tier 3 — Major Matters: matters listed in Schedule [X] including any sale of the Corporation, issuance of new equity, debt exceeding $250,000, business-purpose changes, charter or bylaw amendments, annual budgets, officer compensation, and entry into subsidiaries shall require unanimous Founder consent and formal Board approval."
        pros={[
          "Industry standard for two-founder companies",
          "Daily operations move at single-founder speed",
          "Strategic-operational consultation prevents domain mistakes",
          "Major matters get formal board treatment they deserve",
          "Recognized framework — investors and attorneys understand it immediately",
        ]}
        cons={[
          "Requires explicit thresholds (which need to be reviewed as company grows)",
          "Slight administrative complexity",
        ]}
      />

      <Topic
        tag="Discussion 4.2"
        q={
          <>
            What threshold applies to <em>major matters</em>?
          </>
        }
        ctx="For the most consequential decisions — sale of the company, issuance of equity, taking on substantial debt, pivot, dissolution — what level of agreement is required? Three approaches, with progressively more founder-protective thresholds."
      />

      <Opt
        kind="alt1"
        letter="OPTION A"
        name={
          <>
            Simple majority · <em>51% of voting</em>
          </>
        }
        badge="Permissive"
        when="Lead founder has comfortable majority (60% or more) and wants to retain unilateral authority on major matters even against the other founder's objection. Less common in cooperative founder structures; more common when one founder is functionally CEO and the other is a senior specialist."
        how="All major matters require approval by holders of a simple majority of the voting power. With Class A super-voting + 60/40 founder split, the lead founder alone holds 60% of voting power — sufficient to pass any major matter without the other founder's consent. Functionally one-founder rule."
        lang="All matters described as Major Matters in Schedule [X] shall require the approval of holders of a majority of the outstanding voting power of the Corporation. Each share shall be entitled to one vote, except as otherwise provided in the Certificate of Incorporation regarding super-voting Class A Common Stock."
        pros={[
          "Lead founder retains decision authority even on major matters",
          "Avoids deadlock by definition",
          "Simple to administer",
        ]}
        cons={[
          "Other founder has no veto on company sale, new equity, debt",
          "Creates real risk that lead founder commits to a deal the other founder strongly opposes",
          "Investors may view as too one-sided",
          "Doesn't match typical \"co-founder\" expectations",
        ]}
      />

      <Opt
        kind="alt2"
        letter="OPTION B"
        name={
          <>
            Supermajority · <em>75% of voting</em>
          </>
        }
        badge="Protective"
        when={"Lead founder cannot pass major matters alone (even at 60% voting). Both founders must agree, but the structure is technically a \"supermajority\" rather than \"unanimous founders\" — useful when investors come in and dilute founder voting below 100%. Common at Series A+ when investor consent is added."}
        how="All major matters require 75% of outstanding voting power. Pre-investor, this requires both founders to agree (60% + 40% = 100% > 75%, but 60% alone < 75%, so unilateral founder action is blocked). Post-investor, the 75% threshold typically requires founders + lead investor consent."
        lang="All matters described as Major Matters in Schedule [X] shall require the approval of holders of seventy-five percent (75%) of the outstanding voting power of the Corporation, voting as a single class. Following the issuance of any Preferred Stock, such approval shall additionally require the consent of holders of a majority of the outstanding Preferred Stock, voting as a separate class."
        pros={[
          "Both founders must agree on major matters pre-investor",
          "Scales to investor consent rights post-funding",
          "Common in mid-stage company governance",
        ]}
        cons={[
          "Slightly less protective than full unanimous founder consent",
          "Mechanics are more complex than simple majority or unanimous",
        ]}
      />

      <Opt
        kind="std"
        letter="OPTION C"
        name={
          <>
            Unanimous founders · <em>both must approve</em>
          </>
        }
        badge="Industry Standard"
        when="The default for two-founder companies. Both founders must agree on every major matter. Recognizes that founders are partners with mutual veto rights on company-changing decisions, regardless of equity split. Standard for cooperative founder structures."
        how="All matters in the Major Matters schedule require unanimous written consent of both founders, in addition to any required board approval. Neither founder can unilaterally bind the company on these matters regardless of equity or voting majority. Effectively gives each founder veto over the listed items."
        lang="Notwithstanding any other voting threshold in the Corporation's organizational documents, all matters described as Major Matters in Schedule [X] of this Agreement shall require the unanimous written consent of both Founders for so long as both Founders hold any shares of Class A Common Stock. This requirement is in addition to any approval required by the Board of Directors or by any other class of stock."
        pros={[
          "Industry standard for two-founder companies",
          "Both founders have mutual veto on company-changing decisions",
          "Matches typical \"co-founder\" expectation",
          "Forces alignment on truly material decisions",
        ]}
        cons={[
          "Creates deadlock risk on every major matter",
          "Requires explicit deadlock resolution mechanism (see Topic 4.3)",
          "One founder can block the other indefinitely without process",
        ]}
      />

      <Topic
        tag="Discussion 4.3"
        q={
          <>
            How do founders <em>resolve deadlock</em>?
          </>
        }
        ctx="When founders disagree on a major matter and neither will yield, the company stalls. The deadlock resolution mechanism determines what happens next. The escalation path is designed to maximize chance of resolution before the most severe option (typically buy-sell shotgun) becomes available."
      />

      <Opt
        kind="alt1"
        letter="OPTION A"
        name={
          <>
            Mediation only · <em>non-binding</em>
          </>
        }
        badge="Mild"
        when="Founders have strong relationship and want a soft mechanism that preserves the partnership. No binding resolution; the assumption is that founders will eventually agree. Risk: indefinite stalemate is possible. Sometimes used in family businesses or long-standing partnerships."
        how="After 30 days of declared deadlock, founders engage a mutually-selected independent business mediator for a single non-binding session. The mediator issues a written recommendation. If founders still cannot agree, the deadlock persists and no further mechanism applies. Company effectively cannot make the decision."
        lang="In the event of a deadlock between the Founders on any matter requiring their joint approval, the Founders shall, after a thirty (30) day cool-down period, engage an independent business mediator selected by mutual agreement to conduct a single mediation session. The mediator shall issue a non-binding written recommendation. If the Founders remain unable to agree following such recommendation, the matter shall remain unresolved until the Founders reach mutual agreement."
        pros={[
          "Preserves founder relationship",
          "No risk of forced buyout",
          "Soft approach suited to strong personal trust",
        ]}
        cons={[
          "No forcing function — deadlock can persist indefinitely",
          "Company stalls on the unresolved matter",
          "Investors view as risk factor",
          "Doesn't scale — works in early days, fails at later stages",
        ]}
      />

      <Opt
        kind="alt2"
        letter="OPTION B"
        name={
          <>
            Independent director tie-breaker · <em>third voice</em>
          </>
        }
        badge="Balanced"
        when="Founders trust each other but want a binding mechanism short of buy-sell. An independent director (typically a respected industry figure) serves as tie-breaker on board votes. Requires adding a third director, which founders may resist if they want a 2-person board. Useful at the formation stage if both founders agree on a specific advisor or industry figure."
        how="Board structure includes a jointly-appointed independent director. After cool-down + mediation, the deadlocked matter is presented to the independent director for binding tie-breaking vote. The director must be removable only by unanimous founder consent (preventing one founder from removing them mid-dispute)."
        lang="The Board of Directors shall include one (1) Independent Director jointly appointed by both Founders. In the event of a deadlock between the Founders following the mediation procedures set forth in Section [X], the deadlocked matter shall be presented to the Independent Director, whose vote shall be binding on the Corporation. The Independent Director may be removed only upon the unanimous written consent of both Founders."
        pros={[
          "Binding resolution without forcing buyout",
          "Brings outside perspective to founder disputes",
          "Allows company to keep moving",
          "Recognized governance structure",
        ]}
        cons={[
          "Requires finding a trusted independent director at formation",
          "Director must be compensated (equity or cash)",
          "Adds governance complexity earlier than necessary",
          "If director becomes unavailable, mechanism breaks",
        ]}
      />

      <Opt
        kind="std"
        letter="OPTION C"
        name={
          <>
            Buy-sell shotgun · <em>forced fair pricing</em>
          </>
        }
        badge="Industry Standard"
        when={"Both founders agree that intractable deadlock should trigger a forcing mechanism that ends the partnership cleanly. The \"shotgun\" is intentionally severe — it incentivizes both founders to resolve disputes at earlier stages because the alternative is one of them being bought out. Standard for two-founder structures with unanimous decision rules."}
        how={
          <>
            After cool-down (30 days) and mediation, either founder may serve a
            written <strong>Notice of Offer</strong> stating a per-share price.
            The recipient has 30 days to either (a) <strong>SELL</strong> all
            their shares to the offeror at that price, or (b){" "}
            <strong>BUY</strong> all the offeror&apos;s shares at that price.
            The mechanism produces fair pricing because the offeror cannot
            inflate or deflate the offer.
          </>
        }
        lang={"If a deadlock between the Founders persists for more than thirty (30) days following non-binding mediation, either Founder (the \"Offeror\") may serve upon the other (the \"Recipient\") a written Notice of Offer specifying a price per share. Within thirty (30) days of receiving the Notice of Offer, the Recipient shall elect to either: (a) sell all of the Recipient's shares to the Offeror at the specified price; or (b) purchase all of the Offeror's shares at the specified price. Failure of the Recipient to elect within such period shall constitute an election to sell. Closing of the resulting transaction shall occur within sixty (60) days, in cash or by promissory note acceptable to both parties."}
        pros={[
          "Industry standard for two-founder companies with unanimous voting",
          "Forces fair pricing — offeror cannot game the system",
          "Resolves deadlock definitively",
          "Strong incentive to resolve disputes at earlier mediation stages",
        ]}
        cons={[
          "Outcome is permanent — one founder must leave",
          "Founder with more cash has an advantage (can fund either side)",
          "Can be triggered prematurely if founders fail to invest in earlier resolution",
          "Once triggered, partnership ends regardless of who buys whom",
        ]}
      />

      <Topic
        tag="Discussion 4.4"
        q={
          <>
            What does the <em>board</em> look like at formation?
          </>
        }
        ctx="Board composition affects governance, decision-making speed, and the ability to bring in outside perspectives. The choice at formation is mostly about whether to add an independent director from Day 1 or keep the board to founders only until investors come in."
      />

      <Opt
        kind="std"
        letter="OPTION A"
        name={
          <>
            Two-person board · <em>founders only</em>
          </>
        }
        badge="Industry Standard at Formation"
        when="Standard at formation. Both founders sit on the board. No independent directors, no investor seats. Decisions are made by the two founders directly. Simplest and most common structure pre-investment. Independent voices come in as advisors (non-voting) or when investors first invest."
        how={
          <>
            Two directors, both founders. Lead founder typically serves as
            Chair. Each has one board vote. Quarterly formal board meetings;
            weekly or biweekly founder sync separately. Optionally one industry
            advisor serves as <strong>non-voting observer</strong> to provide
            outside perspective without formal vote.
          </>
        }
        lang="The Board of Directors of the Corporation shall consist of two (2) directors, each appointed by the Founders. [Founder A] shall serve as Chair of the Board. The Founders may, by unanimous written consent, invite one (1) industry advisor to attend Board meetings as a non-voting observer, with no rights to vote on Board matters but with full access to Board materials."
        pros={[
          "Industry standard at formation",
          "Simplest governance",
          "No outside compensation required",
          "Faster decision-making",
          "Atlas-template-compatible",
        ]}
        cons={[
          "No tie-breaker if founders deadlock",
          "No outside perspective beyond founders",
          "Must be modified when investors come in",
        ]}
      />

      <Opt
        kind="alt1"
        letter="OPTION B"
        name={
          <>
            Three-person board · <em>founders + independent</em>
          </>
        }
        badge="Pre-Investment Plus"
        when="Founders want an independent voice with formal vote at formation, especially if using independent-director tie-breaker for deadlock resolution. Less common at pre-investment stage; sometimes adopted when there's a specific respected industry figure available and willing to serve. Requires compensation (typically 0.25-0.5% equity)."
        how="Three directors: both founders and one jointly-appointed independent director. Decisions by majority vote (2 of 3). Independent director provides outside perspective and tie-breaking authority. Compensation: typically 0.25-0.5% equity vesting over 1-2 years, no cash."
        lang="The Board of Directors shall consist of three (3) directors: (i) one director appointed by [Founder A]; (ii) one director appointed by [Founder B]; and (iii) one Independent Director jointly appointed by both Founders. The Independent Director shall be compensated with a grant of 50,000 to 100,000 shares of Class B Common Stock vesting over twenty-four (24) months and shall serve at the pleasure of the Founders acting jointly."
        pros={[
          "Provides tie-breaker for deadlock resolution",
          "Brings industry perspective from Day 1",
          "Sometimes signals seriousness to investors",
          "Allows formal governance structure to emerge early",
        ]}
        cons={[
          "Requires finding a willing, qualified, neutral independent director at formation",
          "Equity compensation required (0.25-0.5%)",
          "Adds complexity earlier than necessary for most companies",
          "Independent director adds friction to fast founder-only decisions",
        ]}
      />

      <Opt
        kind="alt2"
        letter="OPTION C"
        name={
          <>
            Founders only · <em>with advisor (non-voting)</em>
          </>
        }
        badge="Hybrid"
        when="Compromise between Options A and B. Founders keep formal board control (no third vote), but a single industry advisor sits in on board meetings as a non-voting observer. Provides outside perspective without governance complexity. Common structure for companies that have an active advisor but aren't ready for an independent director."
        how="Board has two directors (both founders). One industry advisor attends all board meetings as a non-voting observer, with access to materials but no vote. Advisor typically compensated with FAST template equity grant (0.25-0.5%) vesting over 1-2 years."
        lang="The Board of Directors shall consist of two (2) directors, both Founders. The Corporation shall additionally engage one industry advisor pursuant to a Y Combinator FAST Advisor Agreement, with such advisor entitled to attend Board meetings as a non-voting observer and to receive all Board materials. The advisor shall not have voting rights on Board matters and may be removed by majority vote of the Board."
        pros={[
          "Founders retain full board control",
          "Outside perspective without governance complexity",
          "FAST template makes advisor onboarding cheap and fast",
          "Advisor easily removed if not working out",
        ]}
        cons={[
          "No tie-breaker on founder deadlock",
          "Advisor opinion non-binding",
          "Requires finding a willing advisor (more achievable than independent director)",
        ]}
      />

      <Cta
        text={
          <>
            <strong>Decisions framework set.</strong> Final pillar: what
            happens on departure, and the protections that govern transfers.
          </>
        }
        btn="Open Exit Triggers →"
        onGo={() => goTab("exits")}
      />
    </>
  );
}

/* ───────────────────────────── EXITS ───────────────────────────── */

function Exits({ goTab }: { goTab: (id: TabId) => void }) {
  return (
    <>
      <h1>
        Exit <em>Triggers</em>
      </h1>
      <p className="sub">
        Four discussion topics: how to categorize founder departures, what
        repurchase rights apply on departure, what restrictions govern share
        transfers, and what non-compete obligations survive departure. These
        provisions address two distinct risks — losing a founder mid-build,
        and a departing founder using their shares or knowledge to harm the
        company.
      </p>

      <Topic
        tag="Discussion 5.1"
        q={
          <>
            How do you <em>categorize</em> founder departures?
          </>
        }
        ctx="A departing founder's treatment depends on why they're leaving. Vesting alone determines what shares they've earned, but additional provisions can adjust outcomes based on the manner of departure. Three common categorization frameworks."
      />

      <Opt
        kind="alt1"
        letter="OPTION A"
        name={
          <>
            Vesting only · <em>no leaver provisions</em>
          </>
        }
        badge="Minimal"
        when="Founders trust each other and want minimal departure mechanics. Whatever has vested is the departing founder's; whatever hasn't is the company's at par. No special clawback or repurchase mechanics. Simplest possible structure but offers no protection against bad-faith departures."
        how="On any departure, the departing founder keeps all vested shares. Unvested shares are subject to standard repurchase at par. No distinction between resignation, termination for cause, or any other circumstance. Bad-faith departures get the same treatment as legitimate exits."
        lang="Upon any cessation of service by a Founder, vested shares shall remain the property of the Founder. Unvested shares shall be subject to repurchase by the Corporation at the original purchase price ($0.0001 per share) within ninety (90) days of cessation of service."
        pros={[
          "Simplest possible structure",
          "No litigation risk over \"cause\" or \"good reason\" definitions",
          "Clear and predictable",
        ]}
        cons={[
          "No protection against founder leaving to start a competitor",
          "Founder fired for cause walks away with same equity as good-leaver",
          "Investors typically require leaver provisions at Series A",
          "Limited tools to discipline bad-faith departures",
        ]}
      />

      <Opt
        kind="alt2"
        letter="OPTION B"
        name={
          <>
            Two categories · <em>good leaver / bad leaver</em>
          </>
        }
        badge="Binary"
        when="Founders want clawback authority for bad-faith departures (termination for cause, breach of non-compete, etc.) but don't need a middle category. Cleaner than three categories. Common but slightly less nuanced than the three-category framework."
        how={
          <>
            <strong>Good leaver</strong> (death, disability, termination
            without cause, mutual separation, material adverse change): keeps
            all vested shares; unvested repurchased at par.{" "}
            <strong>Bad leaver</strong> (resignation before cliff, termination
            for cause, breach of non-compete, competing business): company may
            repurchase ALL shares (vested + unvested) at the lower of par or
            current FMV.
          </>
        }
        lang={"Departing Founders shall be categorized as follows: (a) a \"Good Leaver\" upon death, permanent disability, termination by the Corporation without Cause, mutual separation, or resignation following a material adverse change in role, compensation, or location; or (b) a \"Bad Leaver\" upon resignation prior to the one-year anniversary, termination for Cause, material breach of the non-compete or non-solicitation covenants, conviction of a felony, or founding or joining a competing business during employment. Good Leavers shall retain vested shares; the Corporation may repurchase unvested shares at par. For Bad Leavers, the Corporation may repurchase all shares (vested and unvested) at the lower of par value or current fair market value."}
        pros={[
          "Clean binary categorization",
          "Strong clawback for bad-faith departures",
          "Less complex than three-category structure",
        ]}
        cons={[
          "Voluntary departures between months 12-24 (the common neutral case) get treated as good-leaver, which may overcompensate",
          "Less nuance for \"intermediate\" departures",
        ]}
      />

      <Opt
        kind="std"
        letter="OPTION C"
        name={
          <>
            Three categories · <em>good / neutral / bad leaver</em>
          </>
        }
        badge="Industry Standard"
        when="Most balanced structure. Recognizes that voluntary departures between months 12-24 are common and shouldn't be treated as good-leaver (death, disability) or bad-leaver (for cause). Three categories provide nuance for the realistic range of departure circumstances."
        how={
          <>
            <strong>Good leaver</strong> (death, disability, no-cause
            termination, mutual, post-month-24 voluntary): keeps all vested,
            unvested at par. <strong>Neutral leaver</strong> (voluntary
            departure months 12-24): keeps vested, unvested at par, subject to
            non-compete and non-solicit. <strong>Bad leaver</strong> (pre-cliff
            resignation, termination for cause, breach, competing business):
            company may repurchase all shares (vested + unvested) at lower of
            par or FMV.
          </>
        }
        lang={"Departing Founders shall be categorized as: (a) \"Good Leaver\" — death, permanent disability, termination without Cause, mutual separation, material adverse change in role or compensation, or voluntary departure after the twenty-fourth (24th) month with ninety (90) day written notice; (b) \"Neutral Leaver\" — voluntary departure between the twelfth (12th) and twenty-fourth (24th) months with proper notice and absent any breach of covenant; or (c) \"Bad Leaver\" — voluntary resignation before the one-year anniversary, termination for Cause, material breach of the non-competition or non-solicitation covenants, conviction of a felony, or founding or joining a competing business during employment. Good and Neutral Leavers shall retain all vested shares; the Corporation may repurchase unvested shares at par. Bad Leavers shall be subject to repurchase by the Corporation of all shares (vested and unvested) at the lower of par value or current fair market value."}
        pros={[
          "Industry standard for founder agreements",
          "Recognizes realistic departure scenarios",
          "Neutral category handles the most common departure timing cleanly",
          "Clear clawback rights for genuine bad-faith",
          "Predictable treatment reduces post-departure disputes",
        ]}
        cons={[
          "Slightly more complex than binary categorization",
          "Requires defining each category precisely",
        ]}
      />

      <Topic
        tag="Discussion 5.2"
        q={
          <>
            What <em>repurchase rights</em> apply on departure?
          </>
        }
        ctx="Repurchase rights determine what authority the company has to buy back a departing founder's shares. This is separate from vesting (which determines what's earned) — it's about what the company can claw back even from vested shares. Three common approaches."
      />

      <Opt
        kind="alt1"
        letter="OPTION A"
        name={
          <>
            Unvested only · <em>at par</em>
          </>
        }
        badge="Minimal Clawback"
        when="Strict interpretation of vesting: what's vested is the founder's permanently, regardless of departure circumstance. Company can only repurchase unvested shares (which were already subject to vesting risk). No clawback authority over vested shares even on bad-leaver departures."
        how="Company may repurchase only the unvested portion of a departing founder's shares, at the original purchase price ($0.0001/share). Vested shares remain the founder's property regardless of the manner of departure. 90-day exercise window from departure date."
        lang="Upon cessation of a Founder's service, the Corporation shall have the right (but not the obligation) to repurchase, at the original purchase price ($0.0001 per share), all of the Founder's unvested shares. Such repurchase right must be exercised within ninety (90) days of cessation of service or shall lapse. The Corporation shall have no right to repurchase any vested shares."
        pros={[
          "Simplest and most predictable",
          "Vested = permanent; no surprises",
          "Lowest litigation exposure",
        ]}
        cons={[
          "No deterrent for bad-faith departures",
          "Founder fired for cause keeps all vested equity",
          "Investors at Series A typically require clawback for bad-leaver",
        ]}
      />

      <Opt
        kind="std"
        letter="OPTION B"
        name={
          <>
            Unvested at par + bad-leaver clawback · <em>tiered by category</em>
          </>
        }
        badge="Industry Standard"
        when="Standard structure for founder agreements. Vested shares are normally permanent, but bad-faith departures trigger a clawback right. Provides both predictability for good-faith departures and deterrence for bad-faith ones. Pairs naturally with the three-category leaver framework."
        how={
          <>
            <strong>Good or Neutral Leaver:</strong> Company may repurchase
            only unvested shares at par ($0.0001). Vested shares remain the
            founder&apos;s property. <strong>Bad Leaver:</strong> Company may
            repurchase ALL shares (vested + unvested) at the LOWER of par or
            current fair market value. Effectively a clawback for bad-faith
            departures. 90-day exercise window.
          </>
        }
        lang="Upon cessation of a Founder's service: (i) if the Founder is a Good Leaver or Neutral Leaver, the Corporation may repurchase only the Founder's unvested shares at the original purchase price; or (ii) if the Founder is a Bad Leaver, the Corporation may repurchase all of the Founder's shares (both vested and unvested) at the lower of (a) the original purchase price or (b) the current fair market value as determined by the Board in good faith. Any such repurchase right must be exercised within ninety (90) days of cessation of service."
        pros={[
          "Industry standard for founder agreements",
          "Predictable for good-faith departures",
          "Strong deterrent for bad-faith departures",
          "Pairs cleanly with three-category leaver framework",
          "Acceptable to investors and acquirers",
        ]}
        cons={[
          "\"Bad leaver\" definition must be carefully drafted to avoid disputes",
          "FMV determination by board can be contested by departing founder",
          "Slight risk of company using clawback as retaliation tool",
        ]}
      />

      <Opt
        kind="alt2"
        letter="OPTION C"
        name={
          <>
            All shares at FMV · <em>company option on any departure</em>
          </>
        }
        badge="Aggressive"
        when="Company wants maximum control over share circulation post-departure. On any departure (good, neutral, or bad), the company has the option to repurchase all shares at fair market value. Departing founder receives a fair price but cannot retain ownership in the company. Less common; more aggressive than industry standard."
        how="Company has option (not obligation) to repurchase all of a departing founder's shares — vested and unvested — at FMV (for good/neutral leavers) or at the lower of par or FMV (for bad leavers). Founder cannot remain a shareholder post-departure unless company declines to exercise."
        lang="Upon cessation of any Founder's service, the Corporation shall have the option to repurchase all of the Founder's shares (vested and unvested), at the following prices: (i) for Good Leavers and Neutral Leavers, the current fair market value as determined by the Board in good faith; (ii) for Bad Leavers, the lower of (a) the original purchase price or (b) current fair market value. Such option must be exercised within ninety (90) days of cessation of service."
        pros={[
          "Maximum company control over share circulation",
          "Cleaner cap table post-departure",
          "Prevents former founder from voting against current direction",
        ]}
        cons={[
          "Forces departing good-faith founder to liquidate at potentially unfavorable timing",
          "FMV determination creates dispute risk",
          "Cash requirement to fund repurchase can strain company finances",
          "Aggressive — most founders push back at negotiation",
        ]}
      />

      <Topic
        tag="Discussion 5.3"
        q={
          <>
            What <em>transfer restrictions</em> apply to founder shares?
          </>
        }
        ctx="Transfer restrictions govern what a founder can do with their shares while still actively involved with the company. Three common packages, from minimal (ROFR only) to comprehensive (full transfer restriction package). The right of first refusal is universal; tag-along and drag-along are layered on top."
      />

      <Opt
        kind="alt1"
        letter="OPTION A"
        name={
          <>
            ROFR only · <em>right of first refusal</em>
          </>
        }
        badge="Minimal"
        when="Founders want minimum transfer restrictions. Either founder can sell their shares to a third party, but must first offer them to the company and to the other founder at the same price. Doesn't include tag-along (one founder selling without the other participating) or drag-along (forcing minority holders into a sale)."
        how="Before any founder sells shares to a third party, they must offer the same terms to: (1) the Corporation; (2) the other founder; (3) other Class A holders if any. If those parties decline within 30 days, the founder may complete the sale to the third party on the same terms."
        lang="No Founder may transfer any shares to any person other than a Permitted Transferee without first offering such shares for purchase at the same price and on the same terms to: (a) the Corporation; (b) the other Founder; and (c) any other Class A shareholder, in that order of priority. Each party shall have thirty (30) days to elect to purchase the offered shares. Following expiration of all such election periods without exercise, the transferring Founder may complete the proposed transfer to the third party on the same terms."
        pros={[
          "Minimum administrative complexity",
          "Prevents undesirable third-party transfers",
          "Founders retain flexibility to sell",
        ]}
        cons={[
          "No tag-along protection — one founder can sell without other participating",
          "No drag-along — minority holders can block exits",
          "Investors typically require fuller transfer restriction package at Series A",
        ]}
      />

      <Opt
        kind="std"
        letter="OPTION B"
        name={
          <>
            ROFR + tag-along + drag-along · <em>full standard package</em>
          </>
        }
        badge="Industry Standard"
        when="Standard transfer restriction package for venture-backed startups. ROFR prevents unwanted third-party transfers. Tag-along protects each founder from the other selling alone. Drag-along enables the founders to compel minority holders (option holders, advisor, contractor partner) into a sale."
        how={
          <>
            <strong>ROFR:</strong> Same mechanics as Option A.{" "}
            <strong>Tag-along:</strong> If either founder transfers more than
            10% of their holdings, the other founder has the right to
            participate pro-rata at the same price. <strong>Drag-along:</strong>{" "}
            If holders of 75%+ of voting shares approve a sale of the company,
            all other shareholders must sell on the same terms.
          </>
        }
        lang="(a) Right of First Refusal: No Founder may transfer shares to a third party without first offering them to the Corporation, then to the other Founder, at the same price and terms. (b) Tag-Along: If a Founder proposes to transfer more than ten percent (10%) of their shares in a single transaction, the other Founder shall have the right to participate in such transfer on a pro-rata basis at the same price and terms. (c) Drag-Along: If holders of at least seventy-five percent (75%) of the outstanding voting power approve a Change of Control of the Corporation, all other shareholders shall be required to participate in such transaction on the same terms."
        pros={[
          "Industry standard for venture-backed companies",
          "ROFR prevents bad third-party transfers",
          "Tag-along ensures founder symmetry on partial sales",
          "Drag-along enables clean exits over minority holdouts",
          "Recognized by every investor and acquirer",
        ]}
        cons={[
          "Slightly more administrative complexity",
          "Drag-along can feel coercive to minority holders",
          "Tag-along thresholds need careful calibration",
        ]}
      />

      <Opt
        kind="alt2"
        letter="OPTION C"
        name={
          <>
            Hard lockup · <em>no transfers until liquidity event</em>
          </>
        }
        badge="Restrictive"
        when="Founders want maximum mutual commitment and zero risk of either selling early. No transfers permitted at all until a defined liquidity event (acquisition, IPO, or specified date). Most restrictive option; unusual in practice but sometimes used in deeply committed founder pairs."
        how="No transfers of any founder shares permitted (except to Permitted Transferees like spouse/family trust for estate planning) until the earlier of: (i) a Change of Control; (ii) an IPO; or (iii) a specified anniversary (e.g., 5 years from formation). Lockup overrides ROFR by precluding transfers entirely during the lockup period."
        lang="No Founder shall transfer, sell, encumber, or otherwise dispose of any Class A shares until the earlier of: (a) the closing of a Change of Control; (b) the closing of an initial public offering of the Corporation; or (c) the fifth (5th) anniversary of the Vesting Commencement Date. Transfers to Permitted Transferees (spouse, immediate family, family trust for estate planning purposes) shall be permitted, provided that the transferee agrees in writing to be bound by all terms of this Agreement."
        pros={[
          "Maximum mutual commitment signal",
          "No risk of partial sales or early liquidity events",
          "Cleanest cap table during build phase",
        ]}
        cons={[
          "Most restrictive option; rare in modern startups",
          "Founder cannot access any liquidity before exit (even for legitimate needs)",
          "Investors view as unusual; may push to modify",
          "Permitted Transferee carve-outs must be carefully defined",
        ]}
      />

      <Topic
        tag="Discussion 5.4"
        q={
          <>
            What <em>non-compete</em> obligations survive departure?
          </>
        }
        ctx="Post-departure restrictions prevent a former founder from immediately competing with the company. The scope (duration, geography, product market) and enforceability vary by state and circumstance. Three common levels of restriction."
      />

      <Opt
        kind="alt1"
        letter="OPTION A"
        name={
          <>
            No non-compete · <em>non-solicit only</em>
          </>
        }
        badge="Permissive"
        when="Founders are comfortable with the possibility of post-departure competition, or operate in jurisdictions where non-competes are unenforceable (e.g., California). Non-solicit (against employees, customers, partners) remains, but no general non-compete."
        how="Departing founder may compete with the company immediately. Non-solicit applies for 1 year against: (a) CT Battery Solutions employees; (b) CT Battery Solutions customers; (c) CT Battery Solutions partners and lenders. Confidentiality obligations survive indefinitely."
        lang="For a period of one (1) year following cessation of service, no former Founder shall, directly or indirectly: (i) solicit, hire, or attempt to hire any employee of the Corporation; (ii) solicit any customer, supplier, partner, or lender of the Corporation for any competing business purpose. The Corporation shall not impose any general restriction on the former Founder's right to engage in competitive business activity."
        pros={[
          "Enforceable in all jurisdictions including non-compete-hostile states",
          "Lowest risk of post-departure litigation",
          "Allows former founder to pursue legitimate opportunities",
        ]}
        cons={[
          "No protection against direct competition",
          "Former founder can start a competing TPO immediately",
          "Investors at Series A typically require some non-compete",
        ]}
      />

      <Opt
        kind="alt2"
        letter="OPTION B"
        name={
          <>
            1-year narrow non-compete · <em>state + product market</em>
          </>
        }
        badge="Light"
        when="Founders want some non-compete protection but want it narrowly scoped to maximize enforceability. Limited to one year, the specific state where CT Battery Solutions operates (CT), and the specific product market (third-party-owned battery storage). Doesn't restrict other clean-energy activities or other geographies."
        how="For one year post-departure, former founder may not: (a) directly compete with CT Battery Solutions in Connecticut, in the third-party-owned battery storage market; (b) work for any direct competitor in this defined scope. Non-solicit (1 year) and confidentiality (indefinite) layered on top."
        lang="For a period of one (1) year following cessation of service, no former Founder shall, directly or indirectly, in the State of Connecticut: (i) own, manage, operate, or be employed by any business engaged in the third-party-owned battery energy storage market for residential or multifamily customers; or (ii) provide consulting or advisory services to any such business. This restriction is reasonable in duration, geographic scope, and competitive scope, and is necessary to protect the Corporation's legitimate business interests."
        pros={[
          "Narrow scope maximizes enforceability",
          "Provides protection in the core competitive market",
          "Doesn't unduly restrict former founder's career",
          "Likely enforceable in most jurisdictions",
        ]}
        cons={[
          "Limited geographic protection — former founder could operate in MA, NY",
          "Product-market definition can be litigated",
          "One year may not be long enough for sensitive scenarios",
        ]}
      />

      <Opt
        kind="std"
        letter="OPTION C"
        name={
          <>
            2-year regional non-compete · <em>broader scope</em>
          </>
        }
        badge="Industry Standard"
        when="Standard scope for venture-backed startups with substantial customer and partner relationships at risk. Two-year duration covers a full cycle of customer renewals and program iterations. Regional scope (CT, MA, NY — the three-state CT ESS/ConnectedSolutions/NY-VDER region) protects against the most likely competitive moves."
        how="For two years post-departure, former founder may not: (a) directly compete with CT Battery Solutions in CT, MA, or NY in third-party-owned battery storage; (b) work for any direct competitor in this defined scope; (c) solicit CT Battery Solutions customers, employees, or partners. Confidentiality indefinitely. Includes injunctive relief language and liquidated damages provision."
        lang="For a period of two (2) years following cessation of service, no former Founder shall, directly or indirectly, within the States of Connecticut, Massachusetts, or New York: (i) own, manage, operate, finance, or be employed by any business engaged in the third-party-owned battery energy storage market for residential or multifamily customers; (ii) solicit any customer, employee, supplier, partner, or lender of the Corporation; or (iii) use or disclose any confidential information of the Corporation. The Founder acknowledges that these restrictions are reasonable in duration, geographic scope, and competitive scope, and are necessary to protect the Corporation's legitimate business interests. In the event of breach, the Corporation shall be entitled to injunctive relief in addition to all other remedies available at law or in equity."
        pros={[
          "Industry standard for venture-backed startups",
          "Comprehensive regional protection",
          "Two-year duration covers full competitive cycle",
          "Recognized by attorneys and investors",
          "Generally enforceable in CT, MA, NY, TX",
        ]}
        cons={[
          "Two-year duration is at the upper bound of enforceability in some states",
          "Former founder career restriction is meaningful",
          "Litigation cost if dispute arises over scope",
          "Some jurisdictions (CA) won't enforce",
        ]}
      />

      <Cta
        text={
          <>
            <strong>All eighteen questions resolved.</strong> Time to capture
            the decisions in the signed Founder Agreement.
          </>
        }
        btn="Open The Agreement →"
        onGo={() => goTab("agreement")}
      />
    </>
  );
}

/* ───────────────────────────── AGREEMENT ───────────────────────────── */

function Agreement({ goTab }: { goTab: (id: TabId) => void }) {
  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <>
      <h1>
        The <em>Agreement</em>
      </h1>
      <p className="sub">
        The actual deliverable. A one-page Founder Agreement that captures the
        selected option for each of the eighteen discussion topics. The formal
        mechanics get encoded into the Stock Purchase Agreements, Bylaws, and
        Shareholders&apos; Agreement that Stripe Atlas generates from this
        foundation, but this is the document both founders sign before any
        external action.
      </p>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button className="print-btn" onClick={handlePrint}>
          Print or save as PDF
        </button>
        <span
          style={{
            fontSize: 11,
            color: "var(--t3)",
            fontFamily: "var(--mono)",
          }}
        >
          Use browser print dialog · &quot;Save as PDF&quot; works in Chrome,
          Safari, Edge
        </span>
      </div>

      <div className="agreement">
        <div className="agreement-hdr">
          <h2 style={{ marginTop: 0 }}>Founder Agreement</h2>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: 18,
              fontStyle: "italic",
              color: "var(--bl)",
              marginTop: 4,
            }}
          >
            CT Battery Solutions, Inc. (Delaware C-Corporation, to be formed)
          </div>
          <div className="meta">
            EFFECTIVE: <Fill size="short">__________</Fill> &nbsp;·&nbsp;
            VERSION 1.0 &nbsp;·&nbsp; PRE-FORMATION
          </div>
        </div>

        <div className="agr-sec">
          <div className="agr-sec-title">1 · Parties</div>
          <div className="agr-body">
            This Founder Agreement (the &quot;Agreement&quot;) is between{" "}
            <Fill size="long">_______________________________</Fill> (&quot;
            <strong>Founder A</strong>&quot;) and{" "}
            <Fill size="long">_______________________________</Fill> (&quot;
            <strong>Founder B</strong>&quot;), the prospective co-founders of
            CT Battery Solutions, Inc., a Delaware C-Corporation to be formed (the
            &quot;<strong>Company</strong>&quot;). The Company shall ratify
            and adopt this Agreement at its first board meeting.
          </div>
        </div>

        <div className="agr-sec">
          <div className="agr-sec-title">
            2 · Equity Split <Pick>Topic 1.1 · Option ___</Pick>
          </div>
          <div className="agr-body">
            The Class A Common Stock shall be issued as follows:
            <ul>
              <li>
                <strong>Founder A:</strong>{" "}
                <Fill size="short">_________</Fill> shares (
                <Fill size="short">____</Fill>%) — purchase price $
                <Fill size="short">_______</Fill>
              </li>
              <li>
                <strong>Founder B:</strong>{" "}
                <Fill size="short">_________</Fill> shares (
                <Fill size="short">____</Fill>%) — purchase price $
                <Fill size="short">_______</Fill>
              </li>
            </ul>
            Each Founder shall pay the purchase price by personal check or
            wire prior to the Certificate of Incorporation being filed. Each
            Founder shall file a Section 83(b) election with the Internal
            Revenue Service via certified mail, return receipt requested,{" "}
            <strong>within 30 days</strong> of the stock purchase date.
          </div>
        </div>

        <div className="agr-sec">
          <div className="agr-sec-title">
            3 · Share Class Structure <Pick>Topic 1.2 · Option ___</Pick>
          </div>
          <div className="agr-body">
            The Company shall authorize{" "}
            <Fill size="short">__________</Fill> total shares{" "}
            <Pick>Topic 1.3 · Option ___</Pick>, comprising{" "}
            <Fill size="short">__________</Fill> shares of Class A Common
            Stock (super-voting, ten (10) votes per share) and{" "}
            <Fill size="short">__________</Fill> shares of Class B Common
            Stock (one (1) vote per share). Class B shares shall remain
            authorized but unissued at formation, reserved for: future advisor
            grant, option pool, contractor partner, and future investors.
          </div>
        </div>

        <div className="agr-sec">
          <div className="agr-sec-title">
            4 · Vesting <Pick>Topic 2.1 · Option ___</Pick>{" "}
            <Pick>Topic 2.2 · Option ___</Pick>{" "}
            <Pick>Topic 2.3 · Option ___</Pick>
          </div>
          <div className="agr-body">
            Each Founder&apos;s stock shall vest over{" "}
            <Fill size="short">______</Fill> months from the Vesting
            Commencement Date, with a <Fill size="short">______</Fill>-month
            cliff after which <Fill size="short">______</Fill>% shall vest;
            the remaining shall vest in equal monthly installments thereafter.{" "}
            <Fill size="short">______</Fill>% of{" "}
            <Fill size="short">_____________</Fill>&apos;s shares{" "}
            <Fill size="short">[may be / shall not be]</Fill> vested at
            issuance in recognition of pre-formation contributions. The Company
            shall hold a right of repurchase over all unvested shares at the
            original purchase price.
            <br />
            <br />
            <strong>
              Acceleration <Pick>Topic 2.4 · Option ___</Pick>:
            </strong>{" "}
            <Fill size="long">
              ________________________________________________________
            </Fill>{" "}
            (specify: no acceleration / double-trigger 18 months / single
            trigger).
          </div>
        </div>

        <div className="agr-sec">
          <div className="agr-sec-title">
            5 · Roles and Responsibilities <Pick>Topic 3.1 · Option ___</Pick>{" "}
            <Pick>Topic 3.2 · Option ___</Pick>
          </div>
          <div className="agr-body">
            Founder A shall serve as{" "}
            <Fill size="short">______________</Fill> with primary
            responsibility for:{" "}
            <Fill size="long">
              ___________________________________________________
            </Fill>
            .
            <br />
            <br />
            Founder B shall serve as{" "}
            <Fill size="short">______________</Fill> with primary
            responsibility for:{" "}
            <Fill size="long">
              ___________________________________________________
            </Fill>
            .
            <br />
            <br />
            <strong>
              Time commitment <Pick>Topic 3.3 · Option ___</Pick>:
            </strong>{" "}
            <Fill size="long">
              ________________________________________________________
            </Fill>
            .
          </div>
        </div>

        <div className="agr-sec">
          <div className="agr-sec-title">
            6 · Decision Making <Pick>Topic 4.1 · Option ___</Pick>{" "}
            <Pick>Topic 4.2 · Option ___</Pick>
          </div>
          <div className="agr-body">
            Decisions shall be allocated across{" "}
            <Fill size="short">______</Fill> tier(s) as set forth in Schedule
            A. Major Matters shall require{" "}
            <Fill size="short">________________</Fill> (simple majority /
            supermajority 75% / unanimous founders) approval, in addition to
            any required Board action.
          </div>
        </div>

        <div className="agr-sec">
          <div className="agr-sec-title">
            7 · Deadlock Resolution <Pick>Topic 4.3 · Option ___</Pick>
          </div>
          <div className="agr-body">
            Deadlocks on matters requiring joint Founder approval shall be
            resolved through:{" "}
            <Fill size="long">
              ________________________________________________________
            </Fill>{" "}
            (mediation only / mediation + independent director tie-breaker /
            mediation + buy-sell shotgun).
          </div>
        </div>

        <div className="agr-sec">
          <div className="agr-sec-title">
            8 · Board of Directors <Pick>Topic 4.4 · Option ___</Pick>
          </div>
          <div className="agr-body">
            The Board of Directors shall consist of{" "}
            <Fill size="short">______</Fill> director(s):{" "}
            <Fill size="long">
              ________________________________________________________
            </Fill>
            . <Fill size="short">_____________</Fill> shall serve as Chair of
            the Board.
          </div>
        </div>

        <div className="agr-sec">
          <div className="agr-sec-title">
            9 · Departure &amp; Repurchase <Pick>Topic 5.1 · Option ___</Pick>{" "}
            <Pick>Topic 5.2 · Option ___</Pick>
          </div>
          <div className="agr-body">
            Departing Founders shall be categorized as{" "}
            <Fill size="short">______________</Fill> (vesting only / good-bad
            leaver / good-neutral-bad leaver), with repurchase rights as
            follows:{" "}
            <Fill size="long">
              ________________________________________________________
            </Fill>{" "}
            (unvested only at par / unvested at par + bad-leaver clawback /
            all shares at FMV on any departure).
          </div>
        </div>

        <div className="agr-sec">
          <div className="agr-sec-title">
            10 · Transfer Restrictions <Pick>Topic 5.3 · Option ___</Pick>
          </div>
          <div className="agr-body">
            Founder shares shall be subject to:{" "}
            <Fill size="long">
              ________________________________________________________
            </Fill>{" "}
            (ROFR only / ROFR + tag-along + drag-along / hard lockup until
            liquidity event). Permitted Transferees (spouse, immediate family,
            family trust for estate planning) shall be exempt, provided that
            the transferee agrees in writing to be bound by all terms of this
            Agreement.
          </div>
        </div>

        <div className="agr-sec">
          <div className="agr-sec-title">
            11 · Confidentiality &amp; Non-Compete{" "}
            <Pick>Topic 5.4 · Option ___</Pick>
          </div>
          <div className="agr-body">
            All work product, code, financial models, customer lists, partner
            relationships, and analytical tools created on or after the
            formation date are the property of the Company. Pre-formation work
            used by the Company shall be assigned via the IP Assignment
            Agreement executed at formation. Confidentiality survives
            departure indefinitely.
            <br />
            <br />
            <strong>Post-departure restrictions:</strong>{" "}
            <Fill size="long">
              ________________________________________________________
            </Fill>{" "}
            (none / 1-year narrow / 2-year regional CT-MA-NY);{" "}
            <strong>non-solicit:</strong> <Fill size="short">______</Fill>{" "}
            year(s) against Company employees, customers, partners, and
            lenders.
          </div>
        </div>

        <div className="agr-sec">
          <div className="agr-sec-title">12 · Year 5 Exit Intent</div>
          <div className="agr-body">
            The Founders intend to pursue a stock sale of the Company on or
            after the fifth anniversary of formation to satisfy the QSBS
            holding period under Section 1202 of the Internal Revenue Code.
            Both Founders shall maintain Texas residency through the Year 5
            anniversary to preserve $0 state capital gains treatment.
          </div>
        </div>

        <div className="agr-sec">
          <div className="agr-sec-title">
            13 · Governing Law &amp; Formalization
          </div>
          <div className="agr-body">
            This Agreement is governed by the laws of the State of Delaware.
            The terms herein shall be formalized into the Company&apos;s
            Bylaws, Stock Purchase Agreements, and Shareholders&apos;
            Agreement at formation. In the event of conflict between this
            Agreement and the formal corporate documents, the formal corporate
            documents shall control to the extent they materially implement
            this Agreement&apos;s principles. Any provision unenforceable in
            part shall be reformed to the maximum permissible scope.
          </div>
        </div>

        <div className="agr-sigs">
          <div className="agr-sig">
            <div className="agr-sig-l">Founder A</div>
            <div className="agr-sig-name">_______________________________</div>
            <div className="agr-sig-l" style={{ marginTop: 10 }}>
              Name &amp; Date
            </div>
          </div>
          <div className="agr-sig">
            <div className="agr-sig-l">Founder B</div>
            <div className="agr-sig-name">_______________________________</div>
            <div className="agr-sig-l" style={{ marginTop: 10 }}>
              Name &amp; Date
            </div>
          </div>
        </div>
      </div>

      <h2>
        <span className="h2s">After signing</span>The <em>seven</em>{" "}
        downstream documents
      </h2>
      <p className="h2-sub">
        This one-page agreement is the input. Below are the formal corporate
        documents it generates — most produced automatically by Stripe Atlas
        during the formation workflow.
      </p>

      <div className="tw">
        <table>
          <tbody>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>Document</th>
              <th>Source</th>
              <th>When</th>
            </tr>
            <tr>
              <td className="m b">1</td>
              <td className="b">Certificate of Incorporation (DE)</td>
              <td className="desc">
                Atlas filed with DE Secretary of State. Authorizes share
                structure from Topic 1.2 + 1.3.
              </td>
              <td className="m">Day 1</td>
            </tr>
            <tr>
              <td className="m b">2</td>
              <td className="b">Bylaws</td>
              <td className="desc">
                Atlas template. Encodes officer titles from Topic 3.1, board
                structure from Topic 4.4.
              </td>
              <td className="m">Day 1</td>
            </tr>
            <tr>
              <td className="m b">3</td>
              <td className="b">Stock Purchase Agreements (×2)</td>
              <td className="desc">
                Atlas template. Encodes share counts from Topic 1.1, vesting
                schedule from Topics 2.1-2.3, repurchase right.
              </td>
              <td className="m">Day 1</td>
            </tr>
            <tr>
              <td className="m b">4</td>
              <td className="b">Section 83(b) Elections (×2)</td>
              <td className="desc">
                Atlas template. Each founder mails their own to IRS via
                certified mail.
              </td>
              <td className="m">Within 30 days</td>
            </tr>
            <tr>
              <td className="m b">5</td>
              <td className="b">IP Assignment Agreements (×2)</td>
              <td className="desc">
                Atlas template. Each founder assigns pre-formation work product
                to the Company.
              </td>
              <td className="m">Day 1</td>
            </tr>
            <tr>
              <td className="m b">6</td>
              <td className="b">Board &amp; Shareholder Consents</td>
              <td className="desc">
                Atlas template. Initial board ratifies bylaws, stock issuance,
                officer appointments, EIN.
              </td>
              <td className="m">Day 1</td>
            </tr>
            <tr>
              <td className="m b">7</td>
              <td className="b">Shareholders&apos; Agreement</td>
              <td className="desc">
                Light attorney work. Encodes decision tiers (Topic 4.1),
                threshold (4.2), deadlock (4.3), leaver categories (5.1),
                repurchase (5.2), transfer restrictions (5.3), non-compete
                (5.4).
              </td>
              <td className="m">Week 2-4</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="note green">
        <strong>What this resolves.</strong> Once both founders sign this
        Agreement and Atlas executes the seven downstream documents, the
        founder layer of the company is fully built. The QSBS clock has
        started. The voting structure is locked. The vesting schedule is in
        motion. The roles are clear. The decision rules are in place. The exit
        triggers are pre-negotiated. From here, the work shifts external —
        building credibility for CGB approval, signing the first LOIs,
        contracting with NuWatt, recruiting the CT-licensed install partner,
        and pursuing the first 25-unit pilot.
      </div>

      <Cta
        text={
          <>
            <strong>Ready to formalize.</strong> Print the agreement, both
            founders sign, then run Stripe Atlas formation. The QSBS clock
            starts at Certificate of Incorporation acceptance.
          </>
        }
        btn="Back to Overview →"
        onGo={() => goTab("overview")}
      />
    </>
  );
}
