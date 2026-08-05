import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Overview — CT Battery Solutions Portal",
  robots: { index: false, follow: false },
};

const TILES: { num: string; href: string; title: string; desc: string }[] = [
  {
    num: "01",
    href: "/portal/nonprofits",
    title: "Non-profits",
    desc: "Connecticut housing, energy, and community organizations to build relationships with.",
  },
  {
    num: "02",
    href: "/portal/equipment",
    title: "Battery systems",
    desc: "Hardware options under consideration, with capacity, cost, and program eligibility.",
  },
  {
    num: "03",
    href: "/portal/calculator",
    title: "Per-install calculator",
    desc: "Project economics — cost in vs program revenue out, by tier and dispatch frequency.",
  },
  {
    num: "04",
    href: "/portal/incentives",
    title: "Incentives",
    desc: "Federal ITC, CT Energy Storage Solutions, ConnectedSolutions / GridEdge, MACRS, and more.",
  },
  {
    num: "05",
    href: "/portal/timeline",
    title: "Formation & development",
    desc: "Two-stage framework: legal formation, then credibility / capital / regulatory / operations / scale.",
  },
  {
    num: "06",
    href: "/portal/founder-alignment",
    title: "Founder alignment",
    desc: "Two-founder decision tool — equity split, vesting, roles, decisions, exit triggers, signed agreement.",
  },
  {
    num: "07",
    href: "/portal/roles",
    title: "Roles & assignments",
    desc: "Working split of every responsibility — Ramil, Andrew, Together, or Unassigned. Export to markdown.",
  },
];

export default function PortalOverviewPage() {
  return (
    <>
      <div className="page-head">
        <p className="eyebrow">Portal</p>
        <h1>CT Battery Solutions Management Portal.</h1>
        <p className="lead">
          Internal workspace for tracking what&apos;s happening across the
          project — partner relationships, hardware, project economics, and
          program incentives. Pick a section below to dive in.
        </p>
      </div>

      <div className="tiles">
        {TILES.map((t) => (
          <Link key={t.href} href={t.href} className="tile">
            <div className="num">{t.num}</div>
            <h3>{t.title}</h3>
            <p>{t.desc}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
