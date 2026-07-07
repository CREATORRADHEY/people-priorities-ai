import React from 'react';
import { ReviewItem } from '../types/dashboard';

interface HumanReviewQueueProps {
  items: ReviewItem[] | null;
  onSelectRow: (submissionId: string) => void;
}

export const HumanReviewQueue: React.FC<HumanReviewQueueProps> = ({ items, onSelectRow }) => {
  if (!items || items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-405 text-xs py-10 font-sans">
        Review queue is currently empty.
      </div>
    );
  }

  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 font-sans text-xs">
      <div className="flex-1 overflow-y-auto max-h-[290px] pr-1 space-y-2.5 custom-scrollbar">
        {items.map((item) => (
          <div
            key={item.submissionId}
            onClick={() => onSelectRow(item.submissionId)}
            className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-350 transition-all cursor-pointer flex flex-col space-y-1.5 group shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors line-clamp-1">
                {item.title}
              </span>
              <span className="text-[8px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded font-extrabold uppercase tracking-wider shrink-0">
                Review Required
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
              <span>Category: {item.category}</span>
              <span>Ward: {item.locality}</span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5 font-medium">
              <span className="flex items-center gap-1">
                AI Confidence: 
                <span className="text-rose-600 font-bold font-mono">
                  {Math.round(item.confidence * 100)}%
                </span>
              </span>
              <span>Processed {formatDate(item.processedAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HumanReviewQueue;
