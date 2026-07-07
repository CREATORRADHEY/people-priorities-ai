import React from 'react';
import { ReviewItem } from '../types/dashboard';

interface HumanReviewQueueProps {
  items: ReviewItem[] | null;
  onSelectRow: (submissionId: string) => void;
}

export const HumanReviewQueue: React.FC<HumanReviewQueueProps> = ({ items, onSelectRow }) => {
  if (!items || items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs py-10">
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
    <div className="flex flex-col h-full space-y-4 font-sans">
      <div className="flex-1 overflow-y-auto max-h-[290px] pr-1 space-y-2.5 custom-scrollbar">
        {items.map((item) => (
          <div
            key={item.submissionId}
            onClick={() => onSelectRow(item.submissionId)}
            className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-all cursor-pointer flex flex-col space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-1">
                {item.title}
              </span>
              <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Review Required
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
              <span>Category: {item.category}</span>
              <span>Ward: {item.locality}</span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-0.5">
              <span className="flex items-center gap-1">
                AI Confidence: 
                <span className="text-rose-400 font-bold font-mono">
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
