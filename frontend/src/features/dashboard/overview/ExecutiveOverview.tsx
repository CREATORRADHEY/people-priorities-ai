import React from 'react';
import { DashboardSummary } from '../types/dashboard';

interface ExecutiveOverviewProps {
  summary: DashboardSummary | null;
  loading: boolean;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({ summary, loading }) => {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="h-28 rounded-3xl border border-slate-200 bg-white animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Submissions',
      value: summary.totalSubmissions,
      color: 'border-slate-200 text-slate-900 hover:border-slate-300 bg-white',
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Critical Priorities',
      value: summary.criticalPriorityCount,
      color: 'border-rose-100 text-rose-700 bg-rose-50/30 hover:border-rose-200',
      icon: (
        <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    {
      title: 'High Priorities',
      value: summary.highPriorityCount,
      color: 'border-amber-100 text-amber-700 bg-amber-50/30 hover:border-amber-200',
      icon: (
        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: 'Active Hotspots',
      value: summary.hotspotsCount,
      color: 'border-red-100 text-red-700 bg-red-50/30 hover:border-red-200',
      icon: (
        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: 'Pending Reviews',
      value: summary.pendingReviewCount,
      color: 'border-blue-100 text-blue-700 bg-blue-50/30 hover:border-blue-200',
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`flex flex-col justify-between p-5 rounded-3xl border transition-all duration-300 shadow-sm ${card.color}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest font-sans">
              {card.title}
            </span>
            {card.icon}
          </div>
          <span className="text-3xl font-black tracking-tight mt-3 font-sans text-slate-900">
            {card.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ExecutiveOverview;
