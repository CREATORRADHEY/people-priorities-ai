import React from 'react';
import { HotspotItem } from '../types/dashboard';

interface HotspotViewProps {
  items: HotspotItem[] | null;
}

export const HotspotView: React.FC<HotspotViewProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs py-10">
        No active regional hotspots.
      </div>
    );
  }

  // Get maximum count for visual scale normalization
  const maxCount = Math.max(...items.map((i) => i.issueCount), 1);

  return (
    <div className="flex flex-col h-full space-y-4 font-sans">
      <div className="flex-1 overflow-y-auto max-h-[290px] pr-1 space-y-3.5 custom-scrollbar">
        {items.map((item, idx) => {
          const percentage = (item.issueCount / maxCount) * 100;
          return (
            <div key={idx} className="flex flex-col space-y-1 group">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                    {item.locality}
                  </span>
                  <span className="text-[10px] text-slate-500">•</span>
                  <span className="text-[10px] text-slate-400 font-medium bg-slate-900 px-2 py-0.5 rounded border border-slate-800/60">
                    {item.topCategory}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-200">
                    {item.issueCount} reports
                  </span>
                  {item.isHotspot && (
                    <span className="flex h-2 w-2 relative" title="Active Regional Hotspot">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                  )}
                </div>
              </div>

              {/* Progress track */}
              <div className="h-1.5 w-full rounded-full bg-slate-900 border border-slate-800/40 overflow-hidden">
                <div
                  style={{ width: `${percentage}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.isHotspot
                      ? 'bg-gradient-to-r from-rose-500 to-red-500'
                      : 'bg-gradient-to-r from-blue-500 to-teal-500'
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
