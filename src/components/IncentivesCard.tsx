"use client";

interface Incentive {
  incentive_name: string;
  incentive_page: string;
  incentive_type: string;
  incentive_descr: string;
}

interface IncentivesCardProps {
  incentives: Incentive[];
  state: string;
}

export default function IncentivesCard({
  incentives,
  state,
}: IncentivesCardProps) {
  if (!incentives.length) return null;

  return (
    <div className="gs-card overflow-hidden animate-in p-0">
      <div className="px-5 py-3 border-b border-bg2 flex items-center justify-between">
        <span className="gs-card-title">State &amp; Federal Incentives</span>
        <span className="gs-pill gs-pill-green">{incentives.length} active</span>
      </div>
      <div className="divide-y divide-bg2 max-h-[300px] overflow-y-auto">
        {incentives.map((inc, i) => (
          <div key={i} className="px-5 py-2.5 hover:bg-brand-glow transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {inc.incentive_name}
                </p>
                {inc.incentive_type && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                    {inc.incentive_type}
                  </span>
                )}
                {inc.incentive_descr && (
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                    {inc.incentive_descr}
                  </p>
                )}
              </div>
              {inc.incentive_page && (
                <a
                  href={inc.incentive_page}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs text-gs-emerald hover:underline"
                >
                  Details
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
