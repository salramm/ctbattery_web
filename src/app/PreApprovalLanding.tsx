"use client";

import { useEffect, useRef, useState } from "react";
import { MAIN, MODAL_CARD, STYLES } from "./preApprovalContent";

const FONTS =
  "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap";

export default function PreApprovalLanding() {
  const [legalOpen, setLegalOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Wire the static (innerHTML) content: legal-modal triggers + form preview.
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onClick = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-open-legal]")) {
        e.preventDefault();
        setLegalOpen(true);
      }
    };
    const onSubmit = (e: Event) => {
      e.preventDefault();
      const msg = el.querySelector<HTMLElement>("#dc-submit-msg");
      if (msg) msg.style.display = "block";
    };
    el.addEventListener("click", onClick);
    el.addEventListener("submit", onSubmit);
    return () => {
      el.removeEventListener("click", onClick);
      el.removeEventListener("submit", onSubmit);
    };
  }, []);

  // Esc closes the modal; lock page scroll while it's open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLegalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    document.body.style.overflow = legalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [legalOpen]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={FONTS} />
      <style dangerouslySetInnerHTML={{ __html: `${STYLES}\n#dc-submit-msg{display:none}` }} />

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
    </>
  );
}
