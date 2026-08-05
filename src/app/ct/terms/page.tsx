import type { Metadata } from "next";
import "../_styles/doc.css";

export const metadata: Metadata = {
  title: "Terms of Service — CT Battery Solutions",
  description:
    "How using ctbatterysolutions.com works, in plain language. Connecticut law applies.",
};

export default function TermsPage() {
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
            Terms of <em>service</em>.
          </h1>
          <p className="doc-meta">
            <span>
              <strong>Effective:</strong> April 1, 2026
            </span>
            <span>
              <strong>Version:</strong> 2026.04
            </span>
            <span>
              <strong>Governing law:</strong> State of Connecticut
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
                <a href="#s1">About these terms</a>
              </li>
              <li>
                <a href="#s2">Who can use the site</a>
              </li>
              <li>
                <a href="#s3">The eligibility check</a>
              </li>
              <li>
                <a href="#s4">The Energy Storage Agreement</a>
              </li>
              <li>
                <a href="#s5">Your account &amp; portal</a>
              </li>
              <li>
                <a href="#s6">Acceptable use</a>
              </li>
              <li>
                <a href="#s7">Communications</a>
              </li>
              <li>
                <a href="#s8">Intellectual property</a>
              </li>
              <li>
                <a href="#s9">Disclaimers</a>
              </li>
              <li>
                <a href="#s10">Limitation of liability</a>
              </li>
              <li>
                <a href="#s11">Indemnification</a>
              </li>
              <li>
                <a href="#s12">Disputes &amp; arbitration</a>
              </li>
              <li>
                <a href="#s13">Changes to these terms</a>
              </li>
              <li>
                <a href="#s14">Termination</a>
              </li>
              <li>
                <a href="#s15">Contact</a>
              </li>
            </ol>
          </aside>

          <article className="article">
            <p>
              These Terms of Service govern your use of{" "}
              <strong>ctbatterysolutions.com</strong>, the <strong>CT Battery Solutions</strong>{" "}
              homeowner portal, and any related applications (together, the
              &ldquo;Site&rdquo;). The Site is operated by{" "}
              <strong>CT Battery Solutions, Inc.</strong> (&ldquo;we,&rdquo;
              &ldquo;us,&rdquo; &ldquo;our&rdquo;), a Delaware limited liability
              company doing business in Connecticut. By using the Site you agree
              to these terms. If you don&apos;t agree, please don&apos;t use the
              Site.
            </p>

            <h2 id="s1">About these terms</h2>
            <p>
              We&apos;ve tried to write this document in plain English. Where
              defined terms appear, they&apos;re{" "}
              <strong>bolded on first use</strong>. These Terms cover your
              interaction with the Site itself; the actual battery program is
              governed by a separate <strong>Energy Storage Agreement</strong>{" "}
              (&ldquo;ESA&rdquo;) that you sign during enrollment.
            </p>

            <h2 id="s2">Who can use the site</h2>
            <p>
              You may use the Site if you&apos;re at least 18 years old and a
              Connecticut resident, or if you&apos;re acting on behalf of a
              Connecticut household, business, electrician, realtor, or
              nonprofit. You agree to provide accurate information when asked.
            </p>
            <p>
              The Site is not directed to children under 13. We do not knowingly
              collect data from children under 13 — see our{" "}
              <a href="/ct/privacy">Privacy Policy</a>.
            </p>

            <h2 id="s3">The eligibility check</h2>
            <p>
              The eligibility checker on our Site provides a non-binding
              preliminary indication of whether your address may qualify for the
              Connecticut Energy Storage Solutions program. A
              &ldquo;qualified&rdquo; result is <strong>not</strong> an offer or
              guarantee of installation. Final eligibility depends on:
            </p>
            <ul>
              <li>An on-site survey by a licensed electrician;</li>
              <li>
                Confirmation that your electrical service meets program
                requirements;
              </li>
              <li>
                Continued availability of program funding from the Connecticut
                Green Bank and the electric distribution company;
              </li>
              <li>
                Receipt of any required consents (including landlord consent for
                renters).
              </li>
            </ul>

            <h2 id="s4">The Energy Storage Agreement</h2>
            <p>
              If you proceed with enrollment, you&apos;ll review and sign the{" "}
              <strong>Energy Storage Agreement (ESA)</strong>. The ESA — not
              these Terms — governs the installation, operation, ownership,
              term, and termination of the battery system. Key points (full text
              in your ESA):
            </p>
            <div className="callout">
              <p>
                <strong>$0 cost</strong> for installation, operation, and
                maintenance for the 10-year term. <strong>We own the battery</strong>{" "}
                for the term and you have full use of it. You may end the
                agreement with <strong>90 days&apos; written notice</strong>,
                with <strong>no penalty</strong>; we remove the system at our
                cost.
              </p>
            </div>
            <p>
              If anything in these Terms conflicts with your signed ESA,{" "}
              <strong>the ESA controls</strong> for matters relating to the
              battery system.
            </p>

            <h2 id="s5">Your account &amp; portal</h2>
            <p>
              Once enrolled, you&apos;ll get access to the homeowner portal.
              You&apos;re responsible for keeping your sign-in credentials
              private and for all activity under your account. Please tell us
              right away (
              <a href="mailto:support@ctbatterysolutions.com">
                support@ctbatterysolutions.com
              </a>
              ) if you suspect your account has been used without permission.
            </p>
            <h3>Data we show you</h3>
            <p>
              The portal displays your system&apos;s state of charge, dispatch
              history, outage history, and maintenance schedule. Numbers are
              presented as best-available estimates from the manufacturer&apos;s
              monitoring platform; revenue-grade billing data is held by your
              electric utility.
            </p>

            <h2 id="s6">Acceptable use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Site to violate any law or regulation;</li>
              <li>
                Submit false information in an enrollment form, or impersonate
                another person;
              </li>
              <li>
                Attempt to access another household&apos;s data, account, or
                system telemetry;
              </li>
              <li>
                Probe, scan, or test the security of the Site or its underlying
                infrastructure without written permission;
              </li>
              <li>Scrape or replicate the Site for commercial purposes;</li>
              <li>
                Tamper with, modify, or relocate an installed battery system
                (this also breaches your ESA).
              </li>
            </ul>

            <h2 id="s7">Communications</h2>
            <p>
              By giving us your phone number or email, you agree we can use them
              for transactional communications about your enrollment, install
              scheduling, dispatch events, outages, and account. Marketing
              communications are opt-in only; you can opt out any time by
              replying STOP to a text or using the unsubscribe link in an email.
              Standard message and data rates may apply for SMS.
            </p>

            <h2 id="s8">Intellectual property</h2>
            <p>
              The Site, the CT Battery Solutions name and logo, and our written content are
              owned by CT Battery Solutions, Inc. You may use the Site for
              its intended purpose. You may not reproduce, sell, or create
              derivative works from our content without written permission.
              Third-party trademarks (Enphase, Eversource, etc.) belong to their
              owners.
            </p>

            <h2 id="s9">Disclaimers</h2>
            <p>
              Except as expressly set out in your signed ESA, the Site and its
              content are provided <strong>&ldquo;as is&rdquo; and &ldquo;as available&rdquo;</strong>{" "}
              without warranties of any kind. We don&apos;t guarantee the Site
              will be uninterrupted, error-free, or free of harmful components.
              Information on the Site is for general purposes; check with us or
              your utility for decisions that depend on specifics.
            </p>

            <h2 id="s10">Limitation of liability</h2>
            <p>
              To the fullest extent permitted by Connecticut law, our total
              liability under these Terms (excluding obligations under your
              signed ESA) is capped at <strong>$100</strong>. We are not liable
              for indirect, incidental, consequential, or punitive damages
              arising from your use of the Site. Nothing in this section limits
              liability for fraud, gross negligence, or anything that can&apos;t
              be limited under applicable law.
            </p>

            <h2 id="s11">Indemnification</h2>
            <p>
              You agree to defend and hold us harmless from third-party claims
              arising out of (a) your breach of these Terms, (b) your violation
              of law, or (c) information you submit through the Site that turns
              out not to be yours to submit.
            </p>

            <h2 id="s12">Disputes &amp; arbitration</h2>
            <p>
              We&apos;d really rather work it out directly first. Email{" "}
              <a href="mailto:legal@ctbatterysolutions.com">
                legal@ctbatterysolutions.com
              </a>{" "}
              with your concern; we&apos;ll respond within 10 business days.
            </p>
            <p>
              If we can&apos;t resolve it, disputes related to{" "}
              <strong>these Terms</strong> will be resolved by binding
              arbitration in Hartford, Connecticut, administered by the American
              Arbitration Association under its Consumer Arbitration Rules.{" "}
              <strong>You retain the right to bring small-claims court actions.</strong>{" "}
              Class actions are waived.
            </p>
            <p>
              This section does not apply to disputes under your{" "}
              <strong>signed ESA</strong> — those are governed by the dispute
              provisions in the ESA itself.
            </p>
            <p>
              Connecticut law governs these Terms, without regard to
              conflict-of-laws principles.
            </p>

            <h2 id="s13">Changes to these terms</h2>
            <p>
              We may update these Terms from time to time. The
              &ldquo;Effective&rdquo; date at the top of the page indicates the
              current version. For material changes, we&apos;ll email registered
              users at least 14 days before the change takes effect. Continued
              use of the Site after that date constitutes acceptance.
            </p>

            <h2 id="s14">Termination</h2>
            <p>
              You can stop using the Site at any time. We may suspend or
              terminate Site access if you breach these Terms or if it&apos;s
              necessary to protect the Site, our customers, or third parties.
              Termination of Site access does not by itself terminate your ESA —
              those are separate agreements with separate exit terms (90 days&apos;
              written notice, no penalty).
            </p>

            <h2 id="s15">Contact</h2>
            <p>
              CT Battery Solutions, Inc.
              <br />
              42 Pratt Street, Suite 300
              <br />
              Hartford, CT 06103
              <br />
              <br />
              General:{" "}
              <a href="mailto:hello@ctbatterysolutions.com">
                hello@ctbatterysolutions.com
              </a>
              <br />
              Legal:{" "}
              <a href="mailto:legal@ctbatterysolutions.com">
                legal@ctbatterysolutions.com
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
