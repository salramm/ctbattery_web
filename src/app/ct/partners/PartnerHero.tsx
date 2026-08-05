"use client";

import { useState } from "react";

type PartnerType = "electrician" | "realtor" | "property" | "community";

const TABS: { id: PartnerType; label: string }[] = [
  { id: "electrician", label: "Electricians" },
  { id: "realtor", label: "Realtors" },
  { id: "property", label: "Property managers" },
  { id: "community", label: "Community orgs" },
];

const COPY: Record<
  PartnerType,
  { headline: React.ReactNode; subhead: string }
> = {
  electrician: {
    headline: (
      <>
        Refer a Connecticut homeowner. Get paid up to <em>$350</em> per install.
      </>
    ),
    subhead:
      "Already in CT homes for service work? Send qualifying customers our way and we pay a transparent bounty for every install we complete. No exclusivity, no quotas, no hidden tiers.",
  },
  realtor: {
    headline: (
      <>
        Hand your CT clients a free battery — and earn up to <em>$350</em> per install.
      </>
    ),
    subhead:
      "A meaningful closing gift that costs your client nothing. We handle install, permits, and warranty. You get paid when the install closes out — no listing or showing involvement required.",
  },
  property: {
    headline: (
      <>
        Add backup power to your CT single-family homes and townhomes at zero
        cost — and earn up to <em>$350</em> per install.
      </>
    ),
    subhead:
      "Resilience is now a standard tenant ask. We install at no cost to the property or tenant, with the owner's consent. You earn a per-install bounty across the portfolio.",
  },
  community: {
    headline: (
      <>
        Bring backup power to your members — donations up to <em>$350</em> per
        install.
      </>
    ),
    subhead:
      "Route every bounty as a tax-deductible donation to your 501(c)(3). Same as cash payouts. Built for org-led outreach across CT.",
  },
};

export default function PartnerHero() {
  const [active, setActive] = useState<PartnerType>("electrician");
  const { headline, subhead } = COPY[active];

  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Partner program</p>

            <div className="partner-type" role="tablist" aria-label="Partner type">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  data-type={t.id}
                  aria-pressed={active === t.id}
                  onClick={() => setActive(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <h1>{headline}</h1>
            <p className="subhead">{subhead}</p>

            <div className="hero-ctas">
              <a className="btn-primary" href="#apply">
                Apply to partner
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </a>
              <a className="btn-ghost" href="#how">
                See how it works
              </a>
            </div>

            <p className="hero-meta">
              <span>Application reviewed in 3 business days</span> · No setup fee
              · W-9 required for payouts
            </p>
          </div>

          <aside className="earnings-card" aria-label="Example payout">
            <p className="label">Per qualifying install</p>
            <div className="row">
              <div className="k">Bounty</div>
              <div className="v">
                Up to $350<small>USD</small>
              </div>
            </div>
            <div className="row">
              <div className="k">Paid by</div>
              <div className="v" style={{ fontSize: 15 }}>
                ACH, within 30 days of permit close-out
              </div>
            </div>
            <div className="row">
              <div className="k">Tax form</div>
              <div className="v" style={{ fontSize: 15 }}>
                1099-NEC issued each January
              </div>
            </div>
            <p className="footnote">
              Same flat rate whether it&apos;s your first referral or your
              fiftieth. Numbers are illustrative — your partner agreement
              governs exact amounts.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
