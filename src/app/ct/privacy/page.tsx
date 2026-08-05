import type { Metadata } from "next";
import "../_styles/doc.css";

export const metadata: Metadata = {
  title: "Privacy Policy — CT Battery Solutions",
  description:
    "What we collect, why, who we share with, and your rights. Plain English.",
};

export default function PrivacyPage() {
  return (
    <div className="ctdoc">
      <header className="site">
        <div className="wrap row">
          <a className="brand" href="/ct">
            <span className="mark" aria-hidden="true" />
            <span className="name">
              CT Battery Solutions
            </span>
          </a>
          <nav className="site-nav" aria-label="Primary">
            <a href="/ct">Homeowners</a>
            <a href="/ct/partners">Partners</a>
            <a href="/ct/about">About</a>
            <a href="/ct/contact">Contact</a>
          </nav>
        </div>
      </header>

      <section className="doc-hero">
        <div className="wrap">
          <p className="eyebrow">Legal · plain language</p>
          <h1 className="page-h1">
            Privacy <em>policy</em>.
          </h1>
          <p className="doc-meta">
            <span>
              <strong>Effective:</strong> April 1, 2026
            </span>
            <span>
              <strong>Version:</strong> 2026.04
            </span>
            <span>
              <strong>Applies to:</strong> ctbatterysolutions.com &amp; the CT Battery Solutions
              portal
            </span>
          </p>
        </div>
      </section>

      <section className="doc-body">
        <div className="wrap doc-grid">
          <aside className="toc">
            <div className="label">Contents</div>
            <ol>
              <li>
                <a href="#p1">Plain-English summary</a>
              </li>
              <li>
                <a href="#p2">What we collect</a>
              </li>
              <li>
                <a href="#p3">Why we collect it</a>
              </li>
              <li>
                <a href="#p4">Who we share it with</a>
              </li>
              <li>
                <a href="#p5">How long we keep it</a>
              </li>
              <li>
                <a href="#p6">How we keep it safe</a>
              </li>
              <li>
                <a href="#p7">Your rights</a>
              </li>
              <li>
                <a href="#p8">Cookies &amp; analytics</a>
              </li>
              <li>
                <a href="#p9">Children</a>
              </li>
              <li>
                <a href="#p10">Changes</a>
              </li>
              <li>
                <a href="#p11">Contact</a>
              </li>
            </ol>
          </aside>

          <article className="article">
            <p>
              This Privacy Policy explains what personal information{" "}
              <strong>CT Battery Solutions, Inc.</strong> (&ldquo;we,&rdquo;
              &ldquo;us&rdquo;) collects when you use ctbatterysolutions.com or the
              CT Battery Solutions homeowner portal, why we collect it, and what you can do
              about it. We&apos;ve kept this short and direct.
            </p>

            <h2 id="p1">Plain-English summary</h2>
            <div className="callout">
              <p>
                <strong>We don&apos;t sell your data.</strong> We collect
                what&apos;s needed to enroll you in the program, install your
                battery, operate it, and keep your account secure. We share with
                three parties only: your electric utility, the program
                administrator, and our subcontracted vendors (hosting,
                monitoring, billing). You can request a copy or deletion of your
                data at any time.
              </p>
            </div>

            <h2 id="p2">What we collect</h2>
            <table className="data">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Examples</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Identity</td>
                  <td>Name, address, phone, email</td>
                </tr>
                <tr>
                  <td>Household</td>
                  <td>
                    Eversource / UI account number, dwelling type, ownership
                    status
                  </td>
                </tr>
                <tr>
                  <td>Property</td>
                  <td>
                    Electrical panel info, install location preferences, optional
                    uploaded panel photos
                  </td>
                </tr>
                <tr>
                  <td>Eligibility flags</td>
                  <td>
                    Utility territory, distressed-municipality status, optional
                    income tier indicator
                  </td>
                </tr>
                <tr>
                  <td>System telemetry</td>
                  <td>
                    Battery state of charge, dispatch &amp; outage history,
                    firmware version (post-install only)
                  </td>
                </tr>
                <tr>
                  <td>Account</td>
                  <td>
                    Sign-in credentials (we store password hashes, not
                    passwords), session tokens
                  </td>
                </tr>
                <tr>
                  <td>Communications</td>
                  <td>
                    Emails, support tickets, SMS records you exchange with us
                  </td>
                </tr>
                <tr>
                  <td>Site analytics</td>
                  <td>
                    Page views, referrers, device type, IP address, approximate
                    location (city level)
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              We never collect Social Security Numbers, government IDs, or full
              bank account numbers — none of those are required to enroll.
            </p>

            <h2 id="p3">Why we collect it</h2>
            <ul>
              <li>
                <strong>To enroll your home</strong> in the Connecticut Energy
                Storage Solutions program (this requires we share your name,
                address, and Eversource / UI account number with the utility and
                the Green Bank).
              </li>
              <li>
                <strong>To install and operate the battery</strong> (telemetry,
                support tickets, install scheduling).
              </li>
              <li>
                <strong>To communicate with you</strong> about appointments,
                dispatch events, outages, and your account.
              </li>
              <li>
                <strong>To run our business</strong> — fraud prevention,
                security, accounting, satisfying our legal obligations.
              </li>
              <li>
                <strong>To improve the Site</strong> — basic, aggregate
                analytics; never individually identifying.
              </li>
            </ul>

            <h2 id="p4">Who we share it with</h2>
            <table className="data">
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>What &amp; why</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Eversource &amp; UI</td>
                  <td>
                    Account number, address, install confirmation — to enroll
                    your meter in the state program. They are bound by their own
                    customer-data privacy commitments.
                  </td>
                </tr>
                <tr>
                  <td>Connecticut Green Bank</td>
                  <td>
                    De-identified install metadata (zip code, install date,
                    capacity) for program administration.
                  </td>
                </tr>
                <tr>
                  <td>Enphase Energy</td>
                  <td>
                    System serial number and telemetry — they manufacture the
                    battery and provide warranty + monitoring services.
                  </td>
                </tr>
                <tr>
                  <td>Hosting &amp; tooling vendors</td>
                  <td>
                    Standard infrastructure (hosting, error tracking, email
                    delivery, e-signature). Each is contractually limited to
                    using your data only to provide the service to us.
                  </td>
                </tr>
                <tr>
                  <td>Legal authorities</td>
                  <td>
                    If required by law (subpoena, court order). We will tell you
                    unless legally prohibited.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              <strong>We do not sell your personal information.</strong> We do
              not run advertising on the Site, and we don&apos;t share with ad
              networks.
            </p>

            <h2 id="p5">How long we keep it</h2>
            <ul>
              <li>
                <strong>Active enrollment data</strong> — for the duration of
                your ESA term, plus 7 years (legal &amp; tax retention).
              </li>
              <li>
                <strong>Eligibility-check data without enrollment</strong> — 90
                days, then deleted unless you opt in to a follow-up reminder.
              </li>
              <li>
                <strong>Support tickets</strong> — 3 years from close date.
              </li>
              <li>
                <strong>Site analytics</strong> — IP and identifiers anonymized
                after 30 days; aggregates retained indefinitely.
              </li>
            </ul>

            <h2 id="p6">How we keep it safe</h2>
            <ul>
              <li>TLS encryption on every page and API call.</li>
              <li>Encryption at rest for databases and backups.</li>
              <li>Two-factor authentication for staff accounts.</li>
              <li>Least-privilege access — only people who need a record see it.</li>
              <li>Annual penetration test by an independent security firm.</li>
            </ul>
            <p>
              If we suffer a data breach affecting your personal information, we
              will notify you in writing within 72 hours of discovery, in line
              with Connecticut Public Act 21-59.
            </p>

            <h2 id="p7">Your rights</h2>
            <p>Connecticut residents have the right to:</p>
            <ul>
              <li>
                <strong>Know</strong> what personal information we hold about
                you;
              </li>
              <li>
                <strong>Get a copy</strong> in a portable format;
              </li>
              <li>
                <strong>Correct</strong> inaccurate information;
              </li>
              <li>
                <strong>Delete</strong> your information (subject to
                legal/contractual retention periods);
              </li>
              <li>
                <strong>Opt out</strong> of any marketing communications;
              </li>
              <li>
                <strong>Appeal</strong> any decision we make on a request you
                file.
              </li>
            </ul>
            <p>
              Email{" "}
              <a href="mailto:privacy@ctbatterysolutions.com">
                privacy@ctbatterysolutions.com
              </a>{" "}
              with the subject line &ldquo;Privacy request&rdquo; and we&apos;ll
              respond within 30 days. Free, no penalty for asking.
            </p>

            <h2 id="p8">Cookies &amp; analytics</h2>
            <p>
              We use a small number of cookies for essential Site function
              (sign-in, CSRF protection) and one privacy-respecting analytics
              cookie that does not track you across sites. We don&apos;t use
              third-party advertising cookies and don&apos;t load social-media
              pixels.
            </p>
            <p>
              Your browser&apos;s &ldquo;Do Not Track&rdquo; or &ldquo;Global
              Privacy Control&rdquo; signal is honored as an opt-out of any
              non-essential analytics.
            </p>

            <h2 id="p9">Children</h2>
            <p>
              The Site is not directed to children under 13 and we do not
              knowingly collect data from them. If you believe a child has given
              us information, email{" "}
              <a href="mailto:privacy@ctbatterysolutions.com">
                privacy@ctbatterysolutions.com
              </a>{" "}
              and we&apos;ll delete it.
            </p>

            <h2 id="p10">Changes</h2>
            <p>
              If we change this policy in a way that materially affects your
              rights, we&apos;ll email registered users at least 14 days before
              the change takes effect, and we&apos;ll keep prior versions
              available on request.
            </p>

            <h2 id="p11">Contact</h2>
            <p>
              CT Battery Solutions, Inc.
              <br />
              Attn: Privacy
              <br />
              42 Pratt Street, Suite 300
              <br />
              Hartford, CT 06103
              <br />
              <br />
              Privacy:{" "}
              <a href="mailto:privacy@ctbatterysolutions.com">
                privacy@ctbatterysolutions.com
              </a>
              <br />
              General:{" "}
              <a href="mailto:hello@ctbatterysolutions.com">
                hello@ctbatterysolutions.com
              </a>
              <br />
              Phone: (860) 555 0140
            </p>
          </article>
        </div>
      </section>

      <footer className="site">
        <div className="wrap row">
          <div className="col">© 2026 CT Battery Solutions, Inc.</div>
          <div className="col links">
            <a href="/ct/about">About</a>
            <a href="/ct/contact">Contact</a>
            <a href="/ct/privacy">Privacy</a>
            <a href="/ct/terms">Terms</a>
          </div>
          <div className="col">
            <a href="mailto:hello@ctbatterysolutions.com">hello@ctbatterysolutions.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
