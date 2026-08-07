"use client";

import { useMemo, useRef, useState } from "react";

type Owner = "R" | "A" | "T" | "U";
type Cadence = "once" | "maint" | "recurring";

type Role = {
  name: string;
  defaultOwner: Owner;
  desc: string;
  primary: boolean;
  cad: Cadence;
};

type Category = { name: string; desc: string; roles: Role[] };
type TopicId = "gov" | "ops" | "proj" | "tech" | "new";
type Topic = { id: TopicId; title: string; sub: string; cats: Category[] };

type TabId = "overview" | TopicId;

const NAMES: Record<Owner, string> = {
  R: "Ramil",
  A: "Andrew",
  T: "Together",
  U: "—",
};
const FULL: Record<Owner, string> = {
  R: "Ramil",
  A: "Andrew",
  T: "Together",
  U: "Unassigned",
};
const CAD_LABEL: Record<Cadence, string> = {
  once: "One-time",
  maint: "Maintenance",
  recurring: "Recurring",
};

const OWNER_CODE: Record<string, Owner> = {
  Ramil: "R",
  Andrew: "A",
  Together: "T",
  Unassigned: "U",
};

const r = (
  name: string,
  defaultOwner: Owner,
  desc: string,
  primary: boolean,
  cad: Cadence,
): Role => ({ name, defaultOwner, desc, primary, cad });

const TOPICS: Topic[] = [
  {
    id: "gov",
    title: "Governance",
    sub: "Corporate & legal stewardship.",
    cats: [
      {
        name: "Corporate formation & records",
        desc: "The legal existence of the company — charter, bylaws, and Delaware standing that everything else rests on.",
        roles: [
          r(
            "Maintain certificate of incorporation",
            "R",
            "Keep the Delaware charter current and on file, filing any amendments (e.g., authorized-share changes) with the state.",
            false,
            "maint",
          ),
          r(
            "Maintain bylaws",
            "R",
            "Hold and update the internal rulebook governing how the corporation operates and how decisions are made.",
            false,
            "maint",
          ),
          r(
            "Establish & maintain registered agent, business address, records, and Delaware good standing",
            "R",
            "Keep a Delaware registered agent, a business address, and annual franchise-tax and report filings current so the entity stays in good standing.",
            false,
            "maint",
          ),
        ],
      },
      {
        name: "Board governance",
        desc: "How the board is formed and run, and how its decisions get recorded.",
        roles: [
          r(
            "Establish board composition",
            "T",
            "Decide who sits on the board and how seats are allocated as the company and its investors grow.",
            false,
            "once",
          ),
          r(
            "Schedule & conduct board meetings (minutes, timing)",
            "A",
            "Set the meeting calendar, run the sessions, and capture accurate minutes.",
            false,
            "maint",
          ),
          r(
            "Track board resolutions",
            "U",
            "Log every formal board decision and keep an organized, retrievable record of resolutions.",
            false,
            "maint",
          ),
          r(
            "Maintain records",
            "A",
            "Keep the official corporate book — minutes, consents, and governance documents — organized.",
            false,
            "maint",
          ),
        ],
      },
      {
        name: "Shareholder governance",
        desc: "Who owns the company and the records that prove it — equity, vesting, and the cap table.",
        roles: [
          r(
            "Maintain cap table",
            "R",
            "Keep an accurate, current record of who owns what — shares, options, and percentages.",
            true,
            "maint",
          ),
          r(
            "Issue founder stock & approve stock issuances (certificates, records)",
            "T",
            "Authorize and document stock issuances, obtain certificates, and keep the issuance records.",
            false,
            "once",
          ),
          r(
            "Track vesting schedule",
            "R",
            "Monitor founder and employee vesting milestones and cliffs over time.",
            false,
            "maint",
          ),
          r(
            "Manage option / equity plans",
            "R",
            "Administer the equity incentive plan — pool size, grants, and plan documents.",
            false,
            "maint",
          ),
        ],
      },
      {
        name: "Authority & approvals",
        desc: "Who is empowered to commit the company, and the joint sign-offs on money and direction.",
        roles: [
          r(
            "Define signing authority",
            "U",
            "Set who can legally bind the company and at what dollar or contract thresholds.",
            false,
            "once",
          ),
          r(
            "Approve contracts",
            "T",
            "Review and authorize binding agreements before they are executed.",
            false,
            "recurring",
          ),
          r(
            "Approve banking authority",
            "T",
            "Decide who can open accounts, move money, and sign on company banking.",
            false,
            "once",
          ),
          r(
            "Approve debt obligations",
            "T",
            "Authorize loans, credit lines, and other debt the company takes on.",
            false,
            "recurring",
          ),
          r(
            "Approve spending & major strategy",
            "T",
            "Jointly sign off on significant expenditures and direction-setting decisions.",
            false,
            "recurring",
          ),
        ],
      },
      {
        name: "Fiduciary oversight",
        desc: "The duty-of-care functions — tax ID, budgets, books, statements, and required records.",
        roles: [
          r(
            "Manage conflicts of interest",
            "T",
            "Identify and document situations where a founder’s interests could diverge from the company’s, and manage them.",
            false,
            "maint",
          ),
          r(
            "Obtain & manage EIN",
            "R",
            "Secure the federal tax ID and keep IRS account details current.",
            false,
            "once",
          ),
          r(
            "Approve budgets",
            "T",
            "Review and authorize operating and capital budgets.",
            false,
            "maint",
          ),
          r(
            "Maintain accounting records",
            "U",
            "Keep the books — ledgers, transactions, and supporting documentation.",
            true,
            "recurring",
          ),
          r(
            "Approve financial statements",
            "R",
            "Review and sign off on periodic financial statements before they go out.",
            false,
            "maint",
          ),
          r(
            "File federal & state taxes",
            "U",
            "Prepare and submit corporate income and franchise-tax filings on time.",
            true,
            "maint",
          ),
          r(
            "Retain other required records",
            "A",
            "Hold any additional records the law or lenders require for the retention period.",
            false,
            "maint",
          ),
        ],
      },
      {
        name: "Securities & fundraising governance",
        desc: "Doing each capital raise by the book — approvals, exemptions, and investor documentation.",
        roles: [
          r(
            "Approve fundraising rounds",
            "T",
            "Authorize the terms, timing, and size of each capital raise.",
            true,
            "recurring",
          ),
          r(
            "Approve securities issuances",
            "T",
            "Approve issuance of new equity or convertible instruments to investors.",
            false,
            "recurring",
          ),
          r(
            "Maintain securities compliance records",
            "U",
            "Keep records showing each issuance complied with its securities exemption (e.g., Reg D).",
            false,
            "maint",
          ),
          r(
            "Execute subscription documents",
            "U",
            "Sign and collect investor subscription and accreditation paperwork for each raise.",
            false,
            "recurring",
          ),
          r(
            "Investor communication",
            "A",
            "Own ongoing updates, reporting, and relationship management with investors.",
            true,
            "recurring",
          ),
          r(
            "83(b) tracking",
            "U",
            "Ensure founders and employees file 83(b) elections within the 30-day window and retain proof.",
            false,
            "once",
          ),
        ],
      },
      {
        name: "Legal",
        desc: "Protecting the company — IP, insurance, contracts, licensing, and compliance deadlines.",
        roles: [
          r(
            "Intellectual property governance",
            "A",
            "Protect and manage company IP — trademarks, trade secrets, software, and assignment agreements.",
            false,
            "maint",
          ),
          r(
            "Maintain insurance",
            "A",
            "Carry and renew appropriate coverage (general liability, D&O, property, and the like).",
            false,
            "maint",
          ),
          r(
            "Execute & store contracts",
            "U",
            "Sign finalized agreements and keep an organized, retrievable contract archive.",
            false,
            "recurring",
          ),
          r(
            "Maintain business registrations",
            "R",
            "Keep state and local business and contractor registrations and licenses active.",
            false,
            "maint",
          ),
          r(
            "Manage legal notices",
            "A",
            "Handle official notices, service of process, and required disclosures.",
            false,
            "recurring",
          ),
          r(
            "Maintain compliance calendar",
            "A",
            "Track all recurring filing and renewal deadlines in one place.",
            true,
            "maint",
          ),
          r(
            "Manage litigation or disputes",
            "T",
            "Oversee any legal claims, demands, or disputes and coordinate counsel.",
            false,
            "recurring",
          ),
        ],
      },
      {
        name: "Employment & compensation",
        desc: "The frameworks and paperwork for paying and granting equity to the team.",
        roles: [
          r(
            "Approve compensation policies",
            "T",
            "Set salary, bonus, and benefits frameworks for the team.",
            false,
            "maint",
          ),
          r(
            "Approve equity grants",
            "T",
            "Authorize option and stock grants to employees and advisors.",
            false,
            "recurring",
          ),
          r(
            "Maintain agreements",
            "T",
            "Keep offer letters and employment, contractor, and advisor agreements current and on file.",
            false,
            "maint",
          ),
        ],
      },
    ],
  },
  {
    id: "ops",
    title: "Operations",
    sub: "Running & growing the business.",
    cats: [
      {
        name: "Coordination & planning",
        desc: "Setting direction and bringing in the advisors who help shape it.",
        roles: [
          r(
            "Identify & recruit advisors",
            "A",
            "Find and bring on advisors with relevant CT energy, housing, or finance expertise.",
            false,
            "recurring",
          ),
          r(
            "Define milestones & determine strategic plan",
            "T",
            "Set the roadmap, targets, and sequencing the company executes against.",
            false,
            "maint",
          ),
        ],
      },
      {
        name: "Capital development",
        desc: "Building the materials and relationships that bring funding in.",
        roles: [
          r(
            "Develop fundraising materials",
            "T",
            "Build the pitch deck, model, and data room used to raise capital.",
            false,
            "maint",
          ),
          r(
            "Build & maintain capital relationships",
            "A",
            "Cultivate relationships with banks, green banks, and investors for ongoing funding.",
            true,
            "recurring",
          ),
        ],
      },
      {
        name: "Partnerships & supply chain",
        desc: "Sourcing hardware and managing the vendors and contractors who deliver.",
        roles: [
          r(
            "Manage relationships with vendors, contractors, and suppliers",
            "T",
            "Own the working relationships with hardware suppliers (e.g., NuWatt), the install contractor, and service vendors.",
            false,
            "recurring",
          ),
          r(
            "Coordinate purchasing & procurement",
            "A",
            "Place and track equipment orders and manage procurement logistics.",
            false,
            "recurring",
          ),
          r(
            "Contract execution",
            "A",
            "Drive vendor and partner agreements through to signature.",
            false,
            "recurring",
          ),
        ],
      },
      {
        name: "Business development & customer engagement",
        desc: "Winning, onboarding, and keeping the property owners and partners that drive deployments.",
        roles: [
          r(
            "Manage onboarding & project delivery",
            "A",
            "Run new properties from signed agreement through installed, operating systems.",
            true,
            "recurring",
          ),
          r(
            "Negotiate agreements (including LOIs)",
            "U",
            "Lead negotiation of letters of intent and service agreements with property owners.",
            false,
            "recurring",
          ),
          r(
            "Coordinate planning & execution",
            "A",
            "Sequence the steps across parties to deliver each project on schedule.",
            false,
            "recurring",
          ),
          r(
            "Track outcomes",
            "T",
            "Measure delivery results against targets and feed lessons back into the plan.",
            false,
            "recurring",
          ),
          r(
            "Build & maintain customer relationships",
            "T",
            "Keep property owners and housing authorities engaged and satisfied over the contract life.",
            true,
            "recurring",
          ),
          r(
            "Build & maintain third-party relationships (low-income groups, others)",
            "A",
            "Develop ties with CBOs, low-income housing groups, and community organizations.",
            true,
            "recurring",
          ),
        ],
      },
    ],
  },
  {
    id: "proj",
    title: "Project & Assets",
    sub: "The per-deployment lifecycle: system design, interconnection, incentives, and asset performance.",
    cats: [
      {
        name: "System design",
        desc: "Specifying a safe, feasible, economically sound battery system for each site.",
        roles: [
          r(
            "Manage insurance, fire codes, and other liabilities",
            "R",
            "Ensure battery installs meet fire code and liability requirements and carry proper coverage.",
            false,
            "maint",
          ),
          r(
            "Advise on system configurations",
            "R",
            "Specify the right battery count and configuration per site (e.g., 3× IQ 10C) for the load.",
            true,
            "recurring",
          ),
          r(
            "Develop economic & energy use assumptions",
            "R",
            "Build the per-site energy and revenue assumptions that underpin the model.",
            false,
            "maint",
          ),
          r(
            "Evaluate technical feasibility",
            "R",
            "Assess whether a given site and electrical panel can support the proposed system.",
            true,
            "recurring",
          ),
          r(
            "Lead coordination with contractor for installing assets",
            "T",
            "Coordinate jointly with the licensed contractor on install scheduling and execution.",
            false,
            "recurring",
          ),
        ],
      },
      {
        name: "Interconnection",
        desc: "Getting each system approved and connected through the utility and program.",
        roles: [
          r(
            "Lead utility engagement",
            "A",
            "Be the primary point of contact with Eversource / UI.",
            false,
            "recurring",
          ),
          r(
            "Coordinate interconnection process",
            "A",
            "Drive interconnection applications and the connection method (e.g., meter collar) through to approval.",
            true,
            "recurring",
          ),
          r(
            "Manage approval timelines",
            "A",
            "Track and push utility and program approvals to keep projects moving.",
            false,
            "recurring",
          ),
          r(
            "Navigate program requirements",
            "A",
            "Stay current on CT ESS and utility program rules and ensure each project conforms.",
            false,
            "maint",
          ),
        ],
      },
      {
        name: "Incentives & revenue",
        desc: "Securing and structuring the CGB, ITC, and CT ESS revenue that funds the model.",
        roles: [
          r(
            "Lead CGB (or other financing institution) engagement",
            "A",
            "Own the relationship and TPO/EC approval process with CT Green Bank.",
            true,
            "recurring",
          ),
          r(
            "Maintain incentive compliance",
            "A",
            "Keep ITC, domestic-content, and program-eligibility documentation in order.",
            false,
            "maint",
          ),
          r(
            "Structure payment models (direct deposit, etc.)",
            "A",
            "Set up how CT ESS dispatch payments and other revenue flow to the company.",
            false,
            "once",
          ),
          r(
            "Coordinate ESS application(s)",
            "A",
            "Prepare and submit Energy Storage Solutions enrollments for each site.",
            true,
            "recurring",
          ),
        ],
      },
      {
        name: "Asset performance",
        desc: "Keeping installed systems running, valued, and serviced over their contract life.",
        roles: [
          r(
            "Monitor & record performance",
            "R",
            "Track fleet telemetry, dispatch, and uptime via Enlighten / EnergyHub.",
            true,
            "recurring",
          ),
          r(
            "Track value",
            "R",
            "Quantify each asset’s revenue and remaining contract value over time.",
            false,
            "recurring",
          ),
          r(
            "Manage warranties & service issues",
            "R",
            "Handle Enphase warranty claims and resolve field service issues.",
            false,
            "recurring",
          ),
        ],
      },
    ],
  },
  {
    id: "tech",
    title: "Technology",
    sub: "The technical platform and proprietary software the company runs on.",
    cats: [
      {
        name: "Software, data & fleet control",
        desc: "The platform and data layer that runs the fleet and qualifies sites.",
        roles: [
          r(
            "Enlighten admin & fleet management",
            "U",
            "Administer the Enphase Enlighten console for remote fleet management.",
            false,
            "recurring",
          ),
          r(
            "EnergyHub / DERMS dispatch operations",
            "U",
            "Operate the DERMS layer that handles Active Dispatch and telemetry.",
            true,
            "recurring",
          ),
          r(
            "Address-qualification data stack",
            "U",
            "Maintain the multi-signal API stack used to qualify addresses for the program.",
            false,
            "maint",
          ),
          r(
            "IT & data security",
            "U",
            "Manage company IT systems and protect customer and operational data.",
            false,
            "maint",
          ),
        ],
      },
      {
        name: "Proprietary software & IT infrastructure",
        desc: "The owned software products the company is built around — and the infrastructure they run on.",
        roles: [
          r(
            "Lead qualification & incentive-optimization engine",
            "U",
            "Build the proprietary engine that screens each address and cross-checks every available program to find the best possible ESS + ITC incentive stack per site.",
            true,
            "maint",
          ),
          r(
            "Installation monitoring software",
            "U",
            "Develop the owned monitoring layer over installed systems — performance, alerts, and fleet health beyond the stock Enlighten / EnergyHub views.",
            false,
            "maint",
          ),
          r(
            "Project execution software",
            "U",
            "Build the internal tool that runs each deployment end-to-end — site intake, scheduling, install tracking, interconnection, and enrollment status.",
            true,
            "maint",
          ),
          r(
            "Referral partner portal",
            "U",
            "Build the portal where CBOs, housing authorities, and referral partners submit leads and track status and payouts.",
            false,
            "maint",
          ),
          r(
            "IT infrastructure, hosting & data pipeline",
            "U",
            "Stand up and maintain the hosting, data pipeline, and infrastructure the software products run on.",
            false,
            "maint",
          ),
        ],
      },
    ],
  },
  {
    id: "new",
    title: "Proposed Additions",
    sub: "Recommended scope not yet in the source document. Assign an owner to adopt each one.",
    cats: [
      {
        name: "Tax credit monetization (§6418)",
        desc: "Turning earned tax credits into early cash through marketplace transfers.",
        roles: [
          r(
            "List & transfer ITC via marketplace (Crux / Basis)",
            "U",
            "Package and sell transferable investment tax credits on a marketplace to recover capital early.",
            true,
            "recurring",
          ),
          r(
            "Buyer diligence & transfer agreement execution",
            "U",
            "Manage buyer due diligence and execute the §6418 transfer agreements.",
            false,
            "recurring",
          ),
          r(
            "Depreciation / MACRS schedule tracking",
            "U",
            "Track accelerated depreciation schedules on owned assets for tax purposes.",
            false,
            "maint",
          ),
        ],
      },
      {
        name: "Financial operations",
        desc: "The day-to-day money machinery — books, cash, model, and lender reporting.",
        roles: [
          r(
            "Bookkeeping — AP / AR & reconciliations",
            "U",
            "Record payables and receivables and reconcile accounts on an ongoing basis.",
            true,
            "recurring",
          ),
          r(
            "Cash & treasury management",
            "U",
            "Manage the cash position, runway, and timing of inflows and outflows.",
            true,
            "recurring",
          ),
          r(
            "Maintain & update financial model",
            "U",
            "Keep the operating and project-finance model current as assumptions change.",
            true,
            "maint",
          ),
          r(
            "Lender reporting & covenant tracking",
            "U",
            "Produce required lender reports and monitor compliance with debt covenants.",
            false,
            "maint",
          ),
        ],
      },
      {
        name: "Field operations & O&M",
        desc: "Getting systems installed correctly and keeping crews servicing the fleet.",
        roles: [
          r(
            "Install oversight & commissioning sign-off",
            "U",
            "Verify installs are done correctly and formally commission each system.",
            true,
            "recurring",
          ),
          r(
            "Site survey / field-walk protocol",
            "U",
            "Run the standardized site survey and field-walk photo protocol before install.",
            false,
            "recurring",
          ),
          r(
            "Truck rolls & service dispatch",
            "U",
            "Schedule and dispatch field crews for service and repairs.",
            false,
            "recurring",
          ),
          r(
            "Enphase warranty claim handling",
            "U",
            "File and track warranty claims with Enphase for failed equipment.",
            false,
            "recurring",
          ),
          r(
            "Customer support / tenant service desk",
            "U",
            "Field tenant and owner questions and route service issues to the right place.",
            false,
            "recurring",
          ),
        ],
      },
      {
        name: "Customer acquisition & enrollment",
        desc: "Filling the pipeline and converting it into signed, enrolled sites.",
        roles: [
          r(
            "Lead generation with CBOs / housing authorities",
            "U",
            "Source new property pipeline through community organizations and housing authorities.",
            true,
            "recurring",
          ),
          r(
            "Tenant sign-up & ESA execution",
            "U",
            "Run tenant and owner enrollment and execute the energy service agreements.",
            true,
            "recurring",
          ),
          r(
            "Customer data privacy handling",
            "U",
            "Govern how customer and utility data is collected, stored, and used.",
            false,
            "maint",
          ),
        ],
      },
      {
        name: "Permitting & AHJ",
        desc: "Clearing local permits and inspections so installs can proceed.",
        roles: [
          r(
            "Local building / electrical permits",
            "U",
            "Pull required building and electrical permits from each jurisdiction.",
            false,
            "recurring",
          ),
          r(
            "Inspections & sign-offs",
            "U",
            "Schedule and pass municipal inspections for installed systems.",
            false,
            "recurring",
          ),
          r(
            "FOIA permit pulls",
            "U",
            "Use FOIA requests to pull permit data from CT towns for market intelligence.",
            false,
            "recurring",
          ),
        ],
      },
      {
        name: "Tax & equity compliance",
        desc: "Protecting the QSBS exit and meeting wage and property-tax obligations.",
        roles: [
          r(
            "QSBS compliance tracking (timing, hold, §1202 test)",
            "U",
            "Track founder-stock timing, the five-year hold, and the gross-asset test to preserve QSBS eligibility.",
            true,
            "maint",
          ),
          r(
            "Prevailing wage / Davis-Bacon determination",
            "U",
            "Determine whether prevailing-wage rules apply to each project and document the conclusion.",
            false,
            "recurring",
          ),
          r(
            "Property / sales & use tax on assets",
            "U",
            "Handle sales/use tax on equipment and any personal-property tax on systems sited at customer homes.",
            false,
            "maint",
          ),
        ],
      },
      {
        name: "Risk, regulatory & support",
        desc: "Watching the rules, standing behind performance, and planning end-of-life.",
        roles: [
          r(
            "Regulatory & docket monitoring (PURA / CT ESS)",
            "U",
            "Track PURA dockets and CT ESS program changes (e.g., dispatch rule shifts) and flag impacts.",
            true,
            "maint",
          ),
          r(
            "Performance guarantee / SLA management",
            "U",
            "Define and stand behind any uptime or savings commitments made to property owners.",
            false,
            "recurring",
          ),
          r(
            "End-of-life / decommissioning & recycling planning",
            "U",
            "Plan for battery decommissioning, removal, and recycling at contract end.",
            false,
            "maint",
          ),
          r(
            "Safety / OSHA program",
            "U",
            "Establish and maintain field-crew safety practices and OSHA compliance.",
            false,
            "maint",
          ),
        ],
      },
      {
        name: "Brand & people",
        desc: "The public face of the company and the team that scales it.",
        roles: [
          r(
            "Marketing, brand & website",
            "U",
            "Own the company brand, consumer-facing site, and marketing materials.",
            false,
            "maint",
          ),
          r(
            "Hiring & crew management",
            "U",
            "Recruit, hire, and manage staff and field crews as the company scales.",
            true,
            "recurring",
          ),
        ],
      },
    ],
  },
];

const OWNERS: Owner[] = ["R", "A", "T", "U"];

const TAB_LIST: { id: TabId; label: string; num: string }[] = [
  { id: "overview", label: "Overview", num: "00" },
  { id: "gov", label: "Governance", num: "01" },
  { id: "ops", label: "Operations", num: "02" },
  { id: "proj", label: "Project & Assets", num: "03" },
  { id: "tech", label: "Technology", num: "04" },
  { id: "new", label: "Proposed Additions", num: "05" },
];

const keyOf = (tid: TopicId, ci: number, ri: number) => `${tid}::${ci}::${ri}`;

const Chev = () => (
  <span className="role-chev">
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path
        d="M2 3.5L5 6.5L8 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const Star = () => (
  <span className="star" title="Primary — highest-effort role">
    <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M6 .8l1.55 3.36 3.65.42-2.7 2.5.73 3.62L6 9.3 2.77 11.2l.73-3.62-2.7-2.5 3.65-.42z"
        fill="currentColor"
      />
    </svg>
  </span>
);

function defaultOwnerships(): Record<string, Owner> {
  const m: Record<string, Owner> = {};
  TOPICS.forEach((t) => {
    t.cats.forEach((c, ci) => {
      c.roles.forEach((r0, ri) => {
        m[keyOf(t.id, ci, ri)] = r0.defaultOwner;
      });
    });
  });
  return m;
}

type Status = { color: "g" | "r"; text: string } | null;

export default function RolesClient() {
  const [tab, setTab] = useState<TabId>("overview");
  const [ownership, setOwnership] = useState<Record<string, Owner>>(() =>
    defaultOwnerships(),
  );
  const [filter, setFilter] = useState<"ALL" | Owner>("ALL");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<Status>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const goTab = (id: TabId) => {
    setTab(id);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const setOwner = (k: string, o: Owner) =>
    setOwnership((m) => ({ ...m, [k]: o }));

  const toggleExpanded = (k: string) =>
    setExpanded((s) => {
      const n = new Set(s);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });

  const resetDraft = () => {
    setOwnership(defaultOwnerships());
    setExpanded(new Set());
    setStatus(null);
  };

  const exportMd = () => {
    const today = new Date().toISOString().slice(0, 10);
    let md = `# CT Battery Solutions — Roles & Assignments\n\nDelaware C-Corp · Draft · exported ${today}\n\n`;
    md += `**Andrew** — Chief Executive Officer (CEO)\n**Ramil** — Chief Financial Officer (CFO)\n\nLaunch equity: 50/50.\n\nKey: ★ = primary (highest-effort) · cadence in [brackets]\n\n`;
    TOPICS.forEach((t) => {
      md += `## ${t.title}\n\n`;
      t.cats.forEach((c, ci) => {
        md += `**${c.name}** — ${c.desc}\n\n`;
        c.roles.forEach((role, ri) => {
          const k = keyOf(t.id, ci, ri);
          const owner = ownership[k] ?? role.defaultOwner;
          const star = role.primary ? "★ " : "";
          md += `- ${star}${role.name} — ${FULL[owner]} [${CAD_LABEL[role.cad]}]\n`;
        });
        md += `\n`;
      });
    });
    const blob = new Blob([md], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ctbatterysolutions-roles-assignments.md";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const nameMap = useMemo(() => {
    const m: Record<string, string[]> = {};
    TOPICS.forEach((t) => {
      t.cats.forEach((c, ci) => {
        c.roles.forEach((role, ri) => {
          (m[role.name] = m[role.name] || []).push(keyOf(t.id, ci, ri));
        });
      });
    });
    return m;
  }, []);

  const applyImport = (text: string) => {
    const re =
      /^-\s*(?:★\s*)?(.*) — (Ramil|Andrew|Together|Unassigned) \[(?:One-time|Maintenance|Recurring)\]\s*$/;
    let applied = 0;
    let unmatched = 0;
    let parsed = 0;
    const next = { ...ownership };
    text.split(/\r?\n/).forEach((line) => {
      const m = line.match(re);
      if (!m) return;
      parsed++;
      const name = m[1].trim();
      const code = OWNER_CODE[m[2]];
      const keys = nameMap[name];
      if (!keys || !code) {
        unmatched++;
        return;
      }
      keys.forEach((k) => {
        next[k] = code;
      });
      applied++;
    });
    setOwnership(next);
    if (parsed === 0) {
      setStatus({ color: "r", text: "No role lines found in that file." });
    } else {
      setStatus({
        color: "g",
        text:
          "Imported " +
          applied +
          " role" +
          (applied === 1 ? "" : "s") +
          (unmatched ? " · " + unmatched + " unrecognized" : ""),
      });
    }
  };

  const onImportClick = () => fileRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => applyImport(String(reader.result));
    reader.onerror = () =>
      setStatus({ color: "r", text: "Could not read that file." });
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="roles-doc">
      <div className="top">
        <div className="top-row">
          <span className="logo">
            Grid<em>Shift</em>
          </span>
          <span className="top-tag">Roles &amp; Assignments</span>
          <span className="top-meta">
            <span>Delaware C-Corp</span>
            <span>
              <strong>Draft 1</strong> · 5/21/2026
            </span>
          </span>
        </div>
        <div className="tabs">
          {TAB_LIST.map((t) => (
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

      {tab === "overview" && (
        <Overview
          onExport={exportMd}
          onImport={onImportClick}
          onReset={resetDraft}
          status={status}
          fileRef={fileRef}
          onFileChange={onFileChange}
        />
      )}
      {tab !== "overview" && (
        <TopicPage
          topic={TOPICS.find((t) => t.id === tab)!}
          ownership={ownership}
          setOwner={setOwner}
          filter={filter}
          setFilter={setFilter}
          expanded={expanded}
          toggleExpanded={toggleExpanded}
        />
      )}
    </div>
  );
}

function Overview({
  onExport,
  onImport,
  onReset,
  status,
  fileRef,
  onFileChange,
}: {
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
  status: Status;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <h1>
        Roles &amp; <em>Assignments</em>
      </h1>
      <p className="sub">
        A working split of every responsibility between the two founders. Open
        any topic tab, click a role to read what it covers, and use its owner
        buttons to assign it to Ramil, Andrew, Together, or leave it
        Unassigned. Export your assignments anytime.
      </p>

      <div className="lead">
        <h3>Leadership &amp; equity approach</h3>
        <div className="lead-titles">
          <div className="lt andrew">
            <div className="lt-person">Andrew</div>
            <div className="lt-title">Chief Executive Officer</div>
            <div className="lt-desc">
              Operations and high-level relationships, plus per-unit execution
              — procuring, scheduling, installing, and enrolling each battery.
            </div>
          </div>
          <div className="lt ramil">
            <div className="lt-person">Ramil</div>
            <div className="lt-title">Chief Financial Officer</div>
            <div className="lt-desc">
              Finance and reporting, legal and corporate structure, and the
              technology and software products.
            </div>
          </div>
        </div>
        <p>
          CT Battery Solutions launches on a{" "}
          <strong>50/50 founder equity split</strong>. <strong>Andrew</strong>{" "}
          leads operations and high-level relationship-building, plus the
          per-unit work of deploying each battery — procurement, scheduling,
          install, and enrollment. This load is heaviest at the start and is
          meant to be <strong>delegated to hires as the company scales</strong>
          , lightening his day-to-day over time.
        </p>
        <p>
          <strong>Ramil</strong> owns the durable foundation:{" "}
          <strong>financial reporting and modeling</strong>,{" "}
          <strong>legal and corporate-structure formation</strong>, and the{" "}
          <strong>technology and software products</strong> — the architecture
          the business keeps running on long after launch.
        </p>
        <p>
          Weighting Andrew&apos;s effort early and Ramil&apos;s toward that
          foundation balances the two contribution curves over the
          company&apos;s life, which is what makes an equal 50/50 split fair
          rather than just convenient.
        </p>
        <p>
          On titles, <strong>Andrew holds CEO</strong> as the single principal
          counterparties meet — a clear chief-executive title strengthens those
          relationships. <strong>Ramil holds CFO</strong>, anchored in the
          company&apos;s finance and legal structure and extending across the
          technology and software products — the build side, without needing
          to be its external face.
        </p>
        <p className="lead-note">
          This reflects the founders&apos; agreed approach for the formation
          documents; final titles, equity, and vesting should be confirmed in
          the certificate of incorporation, bylaws, and founder agreements with
          counsel.
        </p>
      </div>

      <div className="areas-card">
        <h3>Areas of ownership</h3>
        <div className="areas-grid">
          <div className="area-col ramil">
            <div className="area-who">Ramil</div>
            <div className="area-tags">
              <span>Technology</span>
              <span>Finance</span>
              <span>Legal &amp; Formation</span>
            </div>
          </div>
          <div className="area-col andrew">
            <div className="area-who">Andrew</div>
            <div className="area-tags">
              <span>Relationships</span>
              <span>Unit Operations</span>
            </div>
          </div>
        </div>
        <p className="areas-note">
          Generally speaking. Specific responsibilities are assigned
          role-by-role in the tabs above.
        </p>
      </div>

      <div className="toolbar">
        <button className="btn primary" onClick={onExport}>
          Export assignments (.md)
        </button>
        <button className="btn" onClick={onImport}>
          Import (.md)
        </button>
        <input
          type="file"
          ref={fileRef}
          accept=".md,.markdown,.txt,text/markdown,text/plain"
          style={{ display: "none" }}
          onChange={onFileChange}
        />
        <button className="btn" onClick={onReset}>
          Reset to draft
        </button>
        {status && (
          <span
            className="tb-status"
            style={{ color: status.color === "g" ? "var(--g)" : "var(--r)" }}
          >
            {status.text}
          </span>
        )}
      </div>
      <p className="tb-note">
        Changes live in this window. Export to save a markdown snapshot, or
        import a previously exported one to restore your selections.
      </p>
    </>
  );
}

function TopicPage({
  topic,
  ownership,
  setOwner,
  filter,
  setFilter,
  expanded,
  toggleExpanded,
}: {
  topic: Topic;
  ownership: Record<string, Owner>;
  setOwner: (k: string, o: Owner) => void;
  filter: "ALL" | Owner;
  setFilter: (f: "ALL" | Owner) => void;
  expanded: Set<string>;
  toggleExpanded: (k: string) => void;
}) {
  const total = topic.cats.reduce((s, c) => s + c.roles.length, 0);

  let visibleCount = 0;
  const cats = topic.cats.map((cat, ci) => {
    const roles = cat.roles.map((role, ri) => {
      const k = keyOf(topic.id, ci, ri);
      const owner = ownership[k] ?? role.defaultOwner;
      const visible = filter === "ALL" || owner === filter;
      if (visible) visibleCount++;
      return { role, ri, k, owner, visible };
    });
    const anyVisible = roles.some((x) => x.visible);
    return { cat, ci, roles, anyVisible };
  });

  return (
    <>
      <h2>{topic.title}</h2>
      <p className="h2-sub">
        {topic.sub}{" "}
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--t3)",
          }}
        >
          · {total} roles
        </span>
      </p>

      {topic.id === "new" && (
        <div className="callout">
          <strong>Not yet adopted.</strong> These are functions a TPO storage
          operator needs at scale that the source draft doesn&apos;t cover.
          Assigning an owner moves them into the live count.
        </div>
      )}

      <div className="toggle-bar">
        <span className="fl">Owner</span>
        {(
          [
            ["ALL", "All"],
            ["R", "Ramil"],
            ["A", "Andrew"],
            ["T", "Together"],
            ["U", "Unassigned"],
          ] as const
        ).map(([f, label]) => (
          <button
            key={f}
            className={`chip${filter === f ? " active" : ""}`}
            data-f={f}
            onClick={() => setFilter(f as "ALL" | Owner)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="legend">
        <span className="lg">
          <Star /> Primary — highest effort
        </span>
        <span className="lg">
          <span className="cad once">One-time</span> setup, done once
        </span>
        <span className="lg">
          <span className="cad maint">Maintenance</span> periodic upkeep
        </span>
        <span className="lg">
          <span className="cad recurring">Recurring</span> ongoing / per-deal
        </span>
      </div>

      <div className="cat-wrap">
        {cats.map(({ cat, ci, roles, anyVisible }) =>
          anyVisible ? (
            <div className="cat" key={ci}>
              <div className="cat-head">
                <div className="cat-head-l">
                  <span className="cat-name">{cat.name}</span>
                  <span className="cat-desc">{cat.desc}</span>
                </div>
                <span className="cc">{cat.roles.length}</span>
              </div>
              {roles.map(({ role, k, owner, visible }) =>
                visible ? (
                  <div
                    key={k}
                    className={`role${role.primary ? " primary" : ""}${
                      expanded.has(k) ? " expanded" : ""
                    }`}
                    data-owner={owner}
                  >
                    <div
                      className="role-head"
                      onClick={() => toggleExpanded(k)}
                    >
                      <Chev />
                      <div className="role-name">
                        {role.name}
                        {role.primary && <Star />}
                      </div>
                      <span className={`cad ${role.cad}`}>
                        {CAD_LABEL[role.cad]}
                      </span>
                      <div className="picker">
                        {OWNERS.map((o) => (
                          <button
                            key={o}
                            className={`pk${owner === o ? " on" : ""}`}
                            data-o={o}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOwner(k, o);
                            }}
                          >
                            {NAMES[o]}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="role-desc">
                      <div className="role-desc-inner">{role.desc}</div>
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          ) : null,
        )}
      </div>

      {visibleCount === 0 && (
        <div className="no-results">
          No roles match this owner in this topic.
        </div>
      )}
    </>
  );
}
