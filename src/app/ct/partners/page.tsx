import type { Metadata } from "next";
import "./partners.css";
import PartnerHero from "./PartnerHero";
import PartnerForm from "./PartnerForm";

export const metadata: Metadata = {
  title: "Partner with CT Battery Solutions — Refer customers, get paid",
  description:
    "Refer Connecticut homeowners to a free home battery and earn a transparent bounty per qualified install. Built for electricians, realtors, property managers, and community organizations.",
};

const Check = () => (
  <svg
    className="marker"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 7l3 3 5-6" />
  </svg>
);

const X = () => (
  <svg
    className="marker"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 3l8 8M11 3l-8 8" />
  </svg>
);

export default function PartnersPage() {
  return (
    <div className="ctpp">
      {/* ─── Header ───────────────────────────────────────── */}
      <header className="site">
        <div className="wrap row">
          <a className="brand" href="/ct/partners">
            <span className="mark" aria-hidden="true"></span>
            <span className="name">
              CT Battery Solutions
            </span>
          </a>
          <div className="header-meta">
            <a href="/ct">For homeowners →</a>
          </div>
        </div>
      </header>

      <PartnerHero />

      {/* ─── How it works ─────────────────────────────────── */}
      <section id="how">
        <div className="wrap">
          <p className="section-label">How it works</p>
          <h2 className="section-title">Four steps from referral to payout.</h2>

          <div className="steps">
            <div className="step">
              <div className="num">01</div>
              <div className="icon" aria-hidden="true">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 14h24" />
                  <path d="M5 14l6-6h12l6 6" />
                  <rect x="5" y="14" width="24" height="14" rx="1.5" />
                  <circle cx="11" cy="21" r="1" fill="currentColor" stroke="none" />
                  <circle cx="17" cy="21" r="1" fill="currentColor" stroke="none" />
                  <circle cx="23" cy="21" r="1" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <h3>You apply</h3>
              <p>
                Short form. We confirm your license, brokerage, or org and send a
                partner agreement.
              </p>
            </div>

            <div className="step">
              <div className="num">02</div>
              <div className="icon" aria-hidden="true">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 6h12l5 5v17H9z" />
                  <path d="M21 6v5h5" />
                  <path d="M13 17h8" />
                  <path d="M13 22h8" />
                </svg>
              </div>
              <h3>You refer a homeowner</h3>
              <p>
                Use your custom link, send a marketing kit, or submit the address
                directly through your dashboard.
              </p>
            </div>

            <div className="step">
              <div className="num">03</div>
              <div className="icon" aria-hidden="true">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="6" width="16" height="22" rx="1.5" />
                  <path d="M13 12h8" />
                  <path d="M13 17h8" />
                  <circle cx="20" cy="22" r="1" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <h3>We install at no cost</h3>
              <p>
                Our crew handles permits, install, and inspection. You can stay in
                the loop or stay out of it.
              </p>
            </div>

            <div className="step">
              <div className="num">04</div>
              <div className="icon" aria-hidden="true">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="17" cy="17" r="11" />
                  <path d="M14 17l2 2 5-5" />
                </svg>
              </div>
              <h3>You get paid</h3>
              <p>
                Direct deposit within 30 days of permit close-out. Tier shown in
                your dashboard before install.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── What you earn ────────────────────────────────── */}
      <section id="earn">
        <div className="wrap">
          <p className="section-label">What you earn</p>
          <div className="earn">
            <div className="copy">
              <h2>
                Up to $350 per qualifying install. Same rate, every install.
              </h2>
              <p>
                No tiered &ldquo;gold/silver/platinum&rdquo; partner ladders.
                No volume games. Same flat rate whether it&apos;s your first
                referral or your fiftieth.
              </p>
              <p>
                501(c)(3) partner? Same dollar amount, routed as a
                tax-deductible donation to your organization in lieu of cash.
                We send a tax receipt with the payout.
              </p>
            </div>

            <div>
              <table className="payouts">
                <thead>
                  <tr>
                    <th>Install</th>
                    <th>What qualifies</th>
                    <th style={{ textAlign: "right" }}>Bounty</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Per qualifying install</td>
                    <td>
                      <div className="desc">
                        Connecticut homeowner, eligibility passed, install
                        completed and permit closed.
                      </div>
                    </td>
                    <td>Up to $350</td>
                  </tr>
                  <tr>
                    <td>Community-org donation</td>
                    <td>
                      <div className="desc">
                        501(c)(3) partner can route the bounty as a
                        tax-deductible donation to their organization instead of
                        cash.
                      </div>
                    </td>
                    <td>same rate</td>
                  </tr>
                </tbody>
              </table>
              <p className="payouts-footnote">
                Bounties paid by ACH within 30 calendar days of permit
                close-out. 1099-NEC issued each January.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Good fit ─────────────────────────────────────── */}
      <section id="fit">
        <div className="wrap">
          <p className="section-label">Who&apos;s a good fit</p>
          <h2 className="section-title tight">
            Built for people already trusted in CT homes.
          </h2>

          <div className="fit-grid">
            <div className="fit-col yes">
              <h3>+ Good fit</h3>
              <ul>
                <li>
                  <Check />
                  <div>
                    <strong>Licensed CT electricians</strong> doing service
                    upgrades, panel work, or solar tie-ins.
                  </div>
                </li>
                <li>
                  <Check />
                  <div>
                    <strong>Realtors and brokers</strong> closing on single-family
                    homes and individually-metered townhomes (up to 4 units) in CT.
                  </div>
                </li>
                <li>
                  <Check />
                  <div>
                    <strong>Property managers</strong> with portfolios of
                    owner-occupied or long-term-tenant single-family homes and
                    individually-metered townhomes (up to 4 units).
                  </div>
                </li>
                <li>
                  <Check />
                  <div>
                    <strong>Community organizations</strong> serving Hartford, New
                    Haven, Bridgeport, and Waterbury residents.
                  </div>
                </li>
                <li>
                  <Check />
                  <div>
                    <strong>HVAC, roofing, and home-services contractors</strong>{" "}
                    already in homes for other work.
                  </div>
                </li>
              </ul>
            </div>
            <div className="fit-col no">
              <h3>− Not a fit</h3>
              <ul>
                <li>
                  <X />
                  <div>
                    Lead-gen brokers reselling scraped lists or unconsented leads.
                  </div>
                </li>
                <li>
                  <X />
                  <div>
                    Door-to-door canvassing operations without W-2 employees and
                    licensing.
                  </div>
                </li>
                <li>
                  <X />
                  <div>
                    Anyone who wants to use high-pressure tactics or misrepresent
                    the program.
                  </div>
                </li>
                <li>
                  <X />
                  <div>
                    Out-of-state partners — the program is Connecticut-only and we
                    keep this tight.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Marketing materials ──────────────────────────── */}
      <section id="materials">
        <div className="wrap">
          <div className="materials">
            <div>
              <p className="section-label">Marketing materials</p>
              <h2>Everything you need to talk about us, ready to use.</h2>
              <p className="lead">
                Co-branded with your business. We write the copy, you can edit it.
                Order printed pieces from your dashboard at cost.
              </p>
            </div>
            <ul className="material-list">
              <li>
                <span className="id">M-001</span>
                <div className="item">
                  <h4>One-page homeowner explainer</h4>
                  <p>
                    The whole offer in plain language. Print on demand or hand out
                    at appointments.
                  </p>
                </div>
                <span className="fmt">PDF · Print</span>
              </li>
              <li>
                <span className="id">M-002</span>
                <div className="item">
                  <h4>Tri-fold mailer</h4>
                  <p>
                    Standard #10 envelope size. Optional bulk-rate mailing service.
                  </p>
                </div>
                <span className="fmt">PDF · Print</span>
              </li>
              <li>
                <span className="id">M-003</span>
                <div className="item">
                  <h4>Custom referral link &amp; QR code</h4>
                  <p>
                    Tracks installs back to you automatically. Drop the QR on a
                    yard sign or a card.
                  </p>
                </div>
                <span className="fmt">URL · PNG</span>
              </li>
              <li>
                <span className="id">M-004</span>
                <div className="item">
                  <h4>Email template</h4>
                  <p>
                    Pre-written intro for past clients or your member list. Edit
                    freely.
                  </p>
                </div>
                <span className="fmt">HTML · TXT</span>
              </li>
              <li>
                <span className="id">M-005</span>
                <div className="item">
                  <h4>Social graphics</h4>
                  <p>
                    Square and vertical formats. Open Graph image included.
                  </p>
                </div>
                <span className="fmt">PNG · MP4</span>
              </li>
              <li>
                <span className="id">M-006</span>
                <div className="item">
                  <h4>Compliance copy block</h4>
                  <p>
                    The disclosure language we recommend you include in any paid
                    promotion.
                  </p>
                </div>
                <span className="fmt">TXT</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────── */}
      <section id="faq">
        <div className="wrap">
          <div className="faq">
            <div>
              <p className="section-label">FAQ</p>
              <h2 className="section-title tight">Partner questions, answered.</h2>
            </div>
            <div>
              <details className="qa">
                <summary>
                  How do I get paid, and when?
                  <span className="toggle" aria-hidden="true"></span>
                </summary>
                <div className="answer">
                  <p>
                    ACH direct deposit within 30 calendar days of the permit
                    closing out on your referral&apos;s install. We send a payout
                    statement the same day with the install address, tier, and
                    amount. 1099-NEC issued in January.
                  </p>
                </div>
              </details>

              <details className="qa">
                <summary>
                  Do I need a contractor&apos;s license?
                  <span className="toggle" aria-hidden="true"></span>
                </summary>
                <div className="answer">
                  <p>
                    No — referrers don&apos;t need to be licensed. If you&apos;re a
                    CT-licensed electrician, we&apos;ll route you a higher tier of
                    marketing support and (separately) installation subcontracting
                    opportunities if you want them.
                  </p>
                </div>
              </details>

              <details className="qa">
                <summary>
                  What if my referral doesn&apos;t qualify?
                  <span className="toggle" aria-hidden="true"></span>
                </summary>
                <div className="answer">
                  <p>
                    You owe us nothing and we owe you nothing. We tell the
                    homeowner exactly why they didn&apos;t qualify and, when
                    possible, what to do about it. Your dashboard logs the
                    disposition.
                  </p>
                </div>
              </details>

              <details className="qa">
                <summary>
                  Can I bulk-submit a list of leads?
                  <span className="toggle" aria-hidden="true"></span>
                </summary>
                <div className="answer">
                  <p>
                    Only with documented homeowner consent for each row. We
                    won&apos;t accept scraped, purchased, or unconsented lists —
                    period. If you have a member list and explicit opt-in, we can
                    run a managed email campaign on your behalf.
                  </p>
                </div>
              </details>

              <details className="qa">
                <summary>
                  Is there exclusivity or a non-compete?
                  <span className="toggle" aria-hidden="true"></span>
                </summary>
                <div className="answer">
                  <p>
                    No. Refer to whoever you want. We just ask that referrals you
                    send <em>us</em> are unique to us at the time you submit them.
                  </p>
                </div>
              </details>

              <details className="qa">
                <summary>
                  How does the community-org donation work?
                  <span className="toggle" aria-hidden="true"></span>
                </summary>
                <div className="answer">
                  <p>
                    If you&apos;re a 501(c)(3), every bounty can be paid as a
                    charitable donation to your organization instead of cash. Same
                    dollar amounts. We send a tax receipt with the payout. Useful
                    when your members want the program but the org doesn&apos;t
                    want to handle 1099 income.
                  </p>
                </div>
              </details>

              <details className="qa">
                <summary>
                  What if a homeowner has a bad experience?
                  <span className="toggle" aria-hidden="true"></span>
                </summary>
                <div className="answer">
                  <p>
                    Tell us. We treat partner-flagged complaints as P0. Our crew is
                    W-2 and trained on consent and transparency, but if something
                    goes wrong we want to hear it before the homeowner has to
                    escalate.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Apply ────────────────────────────────────────── */}
      <section className="apply" id="apply">
        <div className="wrap">
          <div className="apply-grid">
            <div>
              <p className="section-label">Apply</p>
              <h2>Tell us about your business.</h2>
              <p className="lead">
                Three minutes. We review every application by hand and reply
                within three business days. If you&apos;re a fit, we&apos;ll send a
                partner agreement and your dashboard login.
              </p>
              <p className="lead-meta">
                Direct line ·{" "}
                <a href="mailto:partners@ctbatterysolutions.com">
                  partners@ctbatterysolutions.com
                </a>
                <br />
                Phone · (860) 555-0140
                <br />
                Hours · Mon–Fri, 9am–5pm ET
              </p>
            </div>

            <PartnerForm />
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────── */}
      <footer className="site">
        <div className="wrap row">
          <div className="col">© 2026 CT Battery Solutions, Inc.</div>
          <div className="col links">
            <a href="/ct/about">About</a>
            <a href="/ct/contact">Contact</a>
            <a href="/ct/privacy">Privacy</a>
            <a href="/ct/terms">Terms</a>
            <a href="/ct">For homeowners</a>
          </div>
          <div className="col">
            <a href="mailto:partners@ctbatterysolutions.com">
              partners@ctbatterysolutions.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
