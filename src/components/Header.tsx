"use client";

export default function Header() {
  return (
    <header className="bg-ink text-white flex items-center justify-between px-6 h-14 shrink-0 z-10">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-brand rounded-md flex items-center justify-center">
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
            <path d="M8 1L3 6h4v4H3l5 5 5-5H9V6h4L8 1z" fill="#fff" />
          </svg>
        </div>
        <div className="text-[16px] font-semibold tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
          Grid<span className="text-brand font-light">Shift</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-mono text-[10px] text-ink4 bg-white/[.06] px-2.5 py-0.5 rounded tracking-wider">
          MVP
        </span>
        <span className="font-mono text-[10px] text-ink4 bg-white/[.06] px-2.5 py-0.5 rounded tracking-wider hidden sm:block">
          5 MARKETS
        </span>
        <div
          className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] font-semibold text-white cursor-pointer"
          style={{ background: "linear-gradient(135deg, var(--color-brand), var(--color-teal))" }}
          title="User"
        >
          R
        </div>
      </div>
    </header>
  );
}
