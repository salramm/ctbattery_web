"use client";

import { useEffect, useRef, useState } from "react";
import { MAIN, MODAL_CARD, DISCLAIMERS_CARD, STYLES } from "./preApprovalContent";
import { enhanceAddressInputs } from "./enhanceAddressInputs";

const FONTS =
  "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap";

export default function PreApprovalLanding() {
  const [legalOpen, setLegalOpen] = useState(false);
  const [disclaimersOpen, setDisclaimersOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Wire the static (innerHTML) content: legal-modal triggers + address
  // autocomplete enhancement on the (static) hero/join forms.
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    // A fresh load of "/" should start at the top; a leftover #join hash (from a
    // prior in-page nav click) otherwise makes the browser jump down on reload.
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      window.scrollTo(0, 0);
    }
    const teardownAutocomplete = enhanceAddressInputs(el);
    const onClick = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-open-disclaimers]")) {
        e.preventDefault();
        setDisclaimersOpen(true);
        return;
      }
      if (t.closest("[data-open-legal]")) {
        e.preventDefault();
        setLegalOpen(true);
      }
    };
    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("click", onClick);
      teardownAutocomplete();
    };
  }, []);

  // Esc closes the modal; lock page scroll while it's open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLegalOpen(false);
        setDisclaimersOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    document.body.style.overflow = legalOpen || disclaimersOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [legalOpen, disclaimersOpen]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={FONTS} />
      <style dangerouslySetInnerHTML={{ __html: `${STYLES}\n#dc-submit-msg{display:none}\n.ctbs-addr-input:focus{border-color:#2f5d4e;box-shadow:0 0 0 3px #e6eeea}` }} />

      <div ref={mainRef} dangerouslySetInnerHTML={{ __html: MAIN }} />

      {legalOpen && (
        <div
          onClick={() => setLegalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(26,26,24,.5)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "clamp(16px,5vh,64px) 16px",
            overflowY: "auto",
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              if ((e.target as HTMLElement).closest("[data-close-legal]")) setLegalOpen(false);
            }}
            style={{
              background: "#fafaf8",
              border: "1px solid #d8d6ce",
              borderRadius: 14,
              maxWidth: 780,
              width: "100%",
              boxShadow: "0 24px 60px rgba(26,26,24,.28)",
            }}
            dangerouslySetInnerHTML={{ __html: MODAL_CARD }}
          />
        </div>
      )}

      {disclaimersOpen && (
        <div
          onClick={() => setDisclaimersOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(26,26,24,.5)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "clamp(16px,5vh,64px) 16px",
            overflowY: "auto",
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              if ((e.target as HTMLElement).closest("[data-close-disclaimers]")) setDisclaimersOpen(false);
            }}
            style={{
              background: "#fafaf8",
              border: "1px solid #d8d6ce",
              borderRadius: 14,
              maxWidth: 780,
              width: "100%",
              boxShadow: "0 24px 60px rgba(26,26,24,.28)",
            }}
            dangerouslySetInnerHTML={{ __html: DISCLAIMERS_CARD }}
          />
        </div>
      )}
    </>
  );
}
