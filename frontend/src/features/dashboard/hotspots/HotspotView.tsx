import React from 'react';
import { HotspotItem } from '../types/dashboard';

interface HotspotViewProps {
  items: HotspotItem[] | null;
}

export const HotspotView: React.FC<HotspotViewProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs py-10">
        No active hotspot clusters.
      </div>
    );
  }

  // Find max issue count to calculate percentage widths correctly
  const maxIssuesCount = Math.max(...items.map((item) => item.issueCount), 1);

  return (
    <div className="flex flex-col h-full space-y-4 font-sans text-xs">
      <div className="flex-1 overflow-y-auto max-h-[290px] pr-1 space-y-3.5 custom-scrollbar">
        {items.map((hotspot) => {
          const widthPercentage = Math.min((hotspot.issueCount / maxIssuesCount) * 100, 100);

          return (
            <div key={hotspot.locality} className="space-y-1.5">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-800 font-extrabold">{hotspot.locality}</span>
                <div className="flex items-center gap-2">
                  {/* Category badge */}
                  <span className="text-[9px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-500 font-bold uppercase tracking-wider">
                    {hotspot.topCategory}
                  </span>
                  {/* Ping Indicator */}
                  {hotspot.isHotspot && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                  )}
                  <span className="text-slate-900 font-black">{hotspot.issueCount} reports</span>
                </div>
              </div>

              {/* Progress track */}
              <div className="h-1.5 w-full bg-slate-100 border border-slate-200/40 rounded-full overflow-hidden">
                <div
                  style={{ width: `${widthPercentage}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    hotspot.isHotspot ? 'bg-rose-500' : 'bg-slate-400'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HotspotView;
