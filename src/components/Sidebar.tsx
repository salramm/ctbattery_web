"use client";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasResults: boolean;
}

const sections = [
  {
    label: "Overview",
    items: [
      { id: "map", icon: "◫", label: "Territory Map" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { id: "analysis", icon: "◉", label: "Site Analysis" },
    ],
  },
];

export default function Sidebar({
  activeTab,
  onTabChange,
  hasResults,
}: SidebarProps) {
  return (
    <nav className="bg-white border-r border-bg3 flex flex-col overflow-y-auto shrink-0 w-[220px] max-md:w-full max-md:flex-row max-md:border-r-0 max-md:border-b max-md:overflow-x-auto max-md:py-1">
      {sections.map((section) => (
        <div key={section.label}>
          <div className="font-mono text-[9px] tracking-[.12em] text-ink4 px-5 pt-4 pb-1.5 uppercase max-md:hidden">
            {section.label}
          </div>
          {section.items.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2.5 w-full text-left px-5 py-2 text-[13px] transition-all border-l-[3px] max-md:border-l-0 max-md:border-b-2 max-md:px-3.5 max-md:whitespace-nowrap ${
                activeTab === item.id
                  ? "bg-brand-light text-brand2 font-medium border-l-brand max-md:border-b-brand"
                  : "text-ink3 border-transparent hover:bg-brand-glow hover:text-ink2"
              }`}
            >
              <span className="w-[18px] text-center text-sm shrink-0">
                {item.icon}
              </span>
              {item.label}
              {item.id === "analysis" && hasResults && (
                <span className="ml-auto font-mono text-[10px] bg-brand text-white px-1.5 py-0.5 rounded-lg font-medium max-md:ml-1">
                  Ready
                </span>
              )}
            </button>
          ))}
        </div>
      ))}

      <div className="mt-auto px-5 py-4 border-t border-bg2 max-md:hidden">
        <div className="text-[11px] text-ink4 leading-relaxed">
          CT Battery Solutions Platform v0.1
          <br />
          C&I BESS Intelligence
          <br />
          <span className="text-brand">5 markets &middot; 41K tariffs</span>
        </div>
      </div>
    </nav>
  );
}
