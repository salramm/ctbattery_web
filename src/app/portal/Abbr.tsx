"use client";

/**
 * Glossary components (05-UI-DELTA D7).
 *
 * Two ways in, both explicit:
 *   <Abbr k="ROF" />            — an inline term in running text
 *   <Def k="LI" className="lpill li">LI</Def>  — a pill, chip, code or badge
 *
 * The mock reached the same effect with a DOM TreeWalker that rewrote text
 * nodes after render. That is §4 shim #2 and is not ported — nothing here
 * touches the DOM, so a definition can never attach itself to the wrong word.
 *
 * Tap-capable by requirement: the mock is hover-only (`.abbr::after`), which
 * leaves every definition unreachable on a phone. These toggle on click/tap and
 * on keyboard focus, and dismiss on Escape or an outside tap, while still
 * showing on hover at the pointer.
 */

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { defineTerm } from "@/lib/glossary";

function useDismiss(open: boolean, close: () => void, ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close, ref]);
}

interface BaseProps {
  /** Glossary key. Falls back to the rendered text when omitted. */
  k?: string;
  /** Explicit definition, when the term is not in the glossary. */
  def?: string;
  className?: string;
  children?: ReactNode;
  title?: string;
}

/** Inline abbreviation: `<Abbr k="ROF" />` renders ROF with its definition. */
export function Abbr({ k, def, className, children }: BaseProps) {
  const term = k ?? (typeof children === "string" ? children : "");
  const definition = def ?? defineTerm(term);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const id = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, ref);

  if (!definition) return <>{children ?? term}</>;

  return (
    <span
      ref={ref}
      className={`gabbr${open ? " open" : ""}${className ? ` ${className}` : ""}`}
      tabIndex={0}
      role="button"
      aria-describedby={open ? id : undefined}
      aria-label={`${term}: ${definition}`}
      onClick={(e) => {
        e.stopPropagation();
        setOpen((v) => !v);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((v) => !v);
        }
      }}
    >
      {children ?? term}
      <span className="gtip" id={id} role="tooltip">
        {definition}
      </span>
    </span>
  );
}

/**
 * A self-defining element: pills, block codes, X-id chips, ledger/claim/ticket
 * statuses. Keeps whatever class the element already had, so the visual stays
 * exactly as designed and only the definition is added.
 */
export function Def({ k, def, className, children, title }: BaseProps) {
  const term = k ?? (typeof children === "string" ? children : "");
  const definition = def ?? defineTerm(term);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const id = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, ref);

  if (!definition) {
    return <span className={className} title={title}>{children ?? term}</span>;
  }

  return (
    <span
      ref={ref}
      className={`gdef${open ? " open" : ""}${className ? ` ${className}` : ""}`}
      tabIndex={0}
      role="button"
      aria-describedby={open ? id : undefined}
      aria-label={`${term}: ${definition}`}
      onClick={(e) => {
        e.stopPropagation();
        setOpen((v) => !v);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((v) => !v);
        }
      }}
    >
      {children ?? term}
      <span className="gtip" id={id} role="tooltip">
        {definition}
      </span>
    </span>
  );
}
