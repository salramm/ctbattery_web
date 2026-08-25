"use client";

import { useState, useRef, useEffect } from "react";
import { API_BASE } from "@/lib/api";

export type PickedAddress = { address: string; lat: number; lng: number };
type Suggestion = { label: string; lat: number; lng: number };

interface Props {
  value: string;
  onChange: (v: string) => void;
  onPick?: (p: PickedAddress) => void;
  placeholder?: string;
  id?: string;
  ariaLabel?: string;
  autoFocus?: boolean;
  inputClassName?: string;
  inputStyle?: React.CSSProperties;
}

/**
 * Key-less address autocomplete. Debounced typeahead against the backend
 * /api/lookup/suggest (Photon, CT-biased); each suggestion carries lat/lng so a
 * pick needs no extra geocode. Freeform text still works — the backend
 * Census-geocodes on submit. Shows loading + empty states, a location-pin per
 * row, and highlights the typed prefix.
 */
export default function AddressAutocomplete({
  value,
  onChange,
  onPick,
  placeholder,
  id,
  ariaLabel,
  autoFocus,
  inputClassName,
  inputStyle,
}: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false); // a query was actually run
  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const skipRef = useRef(false); // don't re-fetch immediately after a pick

  useEffect(() => {
    if (skipRef.current) {
      skipRef.current = false;
      return;
    }
    const q = value.trim();
    if (q.length < 3) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      setTouched(false);
      return;
    }
    setLoading(true);
    setOpen(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/lookup/suggest?q=${encodeURIComponent(q)}`);
        const json = await res.json();
        const list: Suggestion[] = json?.data?.suggestions ?? [];
        setSuggestions(list);
        setActive(-1);
        setTouched(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Keep the active option in view during keyboard navigation.
  useEffect(() => {
    if (active < 0 || !listRef.current) return;
    const el = listRef.current.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const pick = (s: Suggestion) => {
    skipRef.current = true;
    onChange(s.label);
    onPick?.({ address: s.label, lat: s.lat, lng: s.lng });
    setOpen(false);
    setSuggestions([]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      if (active >= 0) {
        e.preventDefault(); // choose the highlighted suggestion instead of submitting
        pick(suggestions[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showPanel = open && value.trim().length >= 3;

  return (
    <div ref={boxRef} style={{ position: "relative" }}>
      <style>{"@keyframes ctbs-aa-spin{to{transform:rotate(360deg)}}"}</style>
      <div style={{ position: "relative" }}>
        <span aria-hidden="true" style={pinWrap}>
          <PinIcon color="#8a8a82" />
        </span>
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => value.trim().length >= 3 && setOpen(true)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          role="combobox"
          aria-expanded={showPanel}
          aria-autocomplete="list"
          autoComplete="off"
          autoFocus={autoFocus}
          className={inputClassName}
          style={{ ...inputStyle, paddingLeft: 38 }}
        />
        {loading && (
          <span aria-hidden="true" style={spinnerWrap}>
            <span style={spinner} />
          </span>
        )}
      </div>

      {showPanel && (
        <ul ref={listRef} role="listbox" style={dropdown}>
          {suggestions.map((s, i) => (
            <li
              key={`${s.label}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(s);
              }}
              onMouseEnter={() => setActive(i)}
              style={{ ...item, background: i === active ? "#eef3f1" : "#fff" }}
            >
              <span aria-hidden="true" style={{ flex: "none", display: "flex", color: i === active ? "#2f5d4e" : "#b3b3ab", marginTop: 1 }}>
                <PinIcon color="currentColor" />
              </span>
              <span style={{ minWidth: 0 }}>{highlight(s.label, value)}</span>
            </li>
          ))}
          {!loading && touched && suggestions.length === 0 && (
            <li style={{ ...item, cursor: "default", color: "#8a8a82" }}>
              No matches — you can type your full address and continue.
            </li>
          )}
          {loading && suggestions.length === 0 && (
            <li style={{ ...item, cursor: "default", color: "#8a8a82" }}>Searching…</li>
          )}
        </ul>
      )}
    </div>
  );
}

// Bold the portion of the label that matches the typed text (first occurrence).
function highlight(label: string, query: string): React.ReactNode {
  const q = query.trim();
  if (!q) return label;
  const idx = label.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return label;
  return (
    <>
      {label.slice(0, idx)}
      <strong style={{ fontWeight: 700, color: "#1a1a1a" }}>{label.slice(idx, idx + q.length)}</strong>
      {label.slice(idx + q.length)}
    </>
  );
}

function PinIcon({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

const pinWrap: React.CSSProperties = {
  position: "absolute",
  left: 13,
  top: "50%",
  transform: "translateY(-50%)",
  display: "flex",
  pointerEvents: "none",
};
const spinnerWrap: React.CSSProperties = {
  position: "absolute",
  right: 13,
  top: "50%",
  transform: "translateY(-50%)",
  display: "flex",
  pointerEvents: "none",
};
const spinner: React.CSSProperties = {
  width: 15,
  height: 15,
  borderRadius: "50%",
  border: "2px solid #d8d6ce",
  borderTopColor: "#2f5d4e",
  display: "inline-block",
  animation: "ctbs-aa-spin .8s linear infinite",
};
const dropdown: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 6px)",
  left: 0,
  right: 0,
  zIndex: 10050,
  margin: 0,
  padding: 5,
  listStyle: "none",
  background: "#fff",
  border: "1px solid #d8d6ce",
  borderRadius: 10,
  boxShadow: "0 14px 36px rgba(26,26,24,.18)",
  maxHeight: 280,
  overflowY: "auto",
};
const item: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "flex-start",
  padding: "10px 12px",
  fontSize: 14.5,
  lineHeight: 1.4,
  color: "#3a3a37",
  cursor: "pointer",
  borderRadius: 7,
};
