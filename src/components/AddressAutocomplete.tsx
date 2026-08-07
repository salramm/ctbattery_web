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
 * Census-geocodes on submit.
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
  const boxRef = useRef<HTMLDivElement>(null);
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
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/lookup/suggest?q=${encodeURIComponent(q)}`);
        const json = await res.json();
        const list: Suggestion[] = json?.data?.suggestions ?? [];
        setSuggestions(list);
        setOpen(list.length > 0);
        setActive(-1);
      } catch {
        /* ignore — freeform submit still works */
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

  return (
    <div ref={boxRef} style={{ position: "relative" }}>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete="off"
        autoFocus={autoFocus}
        className={inputClassName}
        style={inputStyle}
      />
      {open && (
        <ul role="listbox" style={dropdown}>
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
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const dropdown: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 4px)",
  left: 0,
  right: 0,
  zIndex: 10050,
  margin: 0,
  padding: 4,
  listStyle: "none",
  background: "#fff",
  border: "1px solid #d8d6ce",
  borderRadius: 8,
  boxShadow: "0 12px 32px rgba(26,26,24,.16)",
  maxHeight: 260,
  overflowY: "auto",
};
const item: React.CSSProperties = {
  padding: "9px 12px",
  fontSize: 14.5,
  color: "#1a1a1a",
  cursor: "pointer",
  borderRadius: 5,
};
