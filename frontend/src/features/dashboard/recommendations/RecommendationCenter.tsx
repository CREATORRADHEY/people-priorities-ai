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
        return 'text-rose-700 bg-rose-50 border-rose-100';
      case 'high':
        return 'text-amber-700 bg-amber-50 border-amber-100';
      case 'standard':
        return 'text-blue-700 bg-blue-50 border-blue-100';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-100';
    }
  };

  const departments = Object.keys(groupedRecommendations);

  if (departments.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-405 text-xs py-10 font-sans">
        No pending recommendation directives.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4 font-sans text-xs">
      <div className="flex-1 overflow-y-auto max-h-[290px] pr-1 space-y-5 custom-scrollbar">
        {departments.map((dept) => {
          const recs = groupedRecommendations[dept];
          return (
            <div key={dept} className="flex flex-col space-y-2.5">
              {/* Department Group Header */}
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>{dept}</span>
                <span className="text-[9px] text-slate-400 font-bold lowercase tracking-wider">
                  {recs.length} {recs.length === 1 ? 'action' : 'actions'}
                </span>
              </div>

              {/* Recommendation Cards */}
              <div className="space-y-2.5">
                {recs.map((rec, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSelectRow(rec.submissionId)}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-350 hover:text-slate-900 transition-all cursor-pointer flex flex-col space-y-1.5 group shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800 group-hover:text-slate-950 transition-colors uppercase tracking-wider">
                        {rec.primaryCategory}
                      </span>
                      <span
                        className={`text-[8px] px-2 py-0.5 rounded border uppercase tracking-wider font-extrabold ${getUrgencyBadge(
                          rec.urgency
                        )}`}
                      >
                        {rec.urgency}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                      {rec.recommendedAction}
                    </p>

                    <div className="text-[10px] text-slate-400 flex items-center gap-1 leading-normal italic font-medium">
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
