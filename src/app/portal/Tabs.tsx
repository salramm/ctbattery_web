"use client";

import { useState, type ReactNode } from "react";

type Tab = { id: string; label: string; content: ReactNode };

export default function Tabs({
  tabs,
  initial,
}: {
  tabs: Tab[];
  initial?: string;
}) {
  const [active, setActive] = useState(initial ?? tabs[0]?.id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <>
      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active === t.id}
            className={`tab-btn${active === t.id ? " active" : ""}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">{current?.content}</div>
    </>
  );
}
