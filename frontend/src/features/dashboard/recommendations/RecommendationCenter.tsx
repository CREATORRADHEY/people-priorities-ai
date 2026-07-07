import React, { useMemo } from 'react';
import { RecommendationItem } from '../types/dashboard';

interface RecommendationCenterProps {
  items: RecommendationItem[] | null;
  onSelectRow: (submissionId: string) => void;
}

export const RecommendationCenter: React.FC<RecommendationCenterProps> = ({ items, onSelectRow }) => {
  const groupedRecommendations = useMemo(() => {
    if (!items) return {};

    const groups: { [department: string]: RecommendationItem[] } = {};
    items.forEach((item) => {
      const dept = item.recommendedDepartment || 'General Administration';
      if (!groups[dept]) {
        groups[dept] = [];
      }
      groups[dept].push(item);
    });

    return groups;
  }, [items]);

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'immediate':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'high':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'standard':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const departments = Object.keys(groupedRecommendations);

  if (departments.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs py-10">
        No pending recommendation directives.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4 font-sans">
      <div className="flex-1 overflow-y-auto max-h-[290px] pr-1 space-y-4 custom-scrollbar">
        {departments.map((dept) => {
          const recs = groupedRecommendations[dept];
          return (
            <div key={dept} className="flex flex-col space-y-2">
              {/* Department Group Header */}
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-1 flex items-center justify-between">
                <span>{dept}</span>
                <span className="text-[10px] text-slate-500 lowercase font-medium">
                  {recs.length} {recs.length === 1 ? 'action' : 'actions'}
                </span>
              </div>

              {/* Recommendation Cards */}
              <div className="space-y-2.5">
                {recs.map((rec, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSelectRow(rec.submissionId)}
                    className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 hover:text-blue-400 transition-all cursor-pointer flex flex-col space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                        {rec.primaryCategory}
                      </span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded border uppercase tracking-wider font-bold ${getUrgencyBadge(
                          rec.urgency
                        )}`}
                      >
                        {rec.urgency}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {rec.recommendedAction}
                    </p>

                    <div className="text-[10px] text-slate-500 flex items-center gap-1 leading-normal italic font-medium">
                      <span>Reason:</span>
                      <span className="line-clamp-1">{rec.reason}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendationCenter;
