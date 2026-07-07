import React from 'react';

export interface DashboardWidgetProps {
  id: string;
  title: string;
  loading: boolean;
  error?: string | null;
  className?: string;
  onRefetch?: () => void;
  children: React.ReactNode;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  id,
  title,
  loading,
  error,
  className = '',
  onRefetch,
  children,
}) => {
  return (
    <div
      id={id}
      className={`relative flex flex-col min-h-[220px] bg-white border border-slate-200 p-6 rounded-3xl shadow-sm transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h3 className="text-xs font-black text-slate-900 tracking-wider uppercase font-sans">{title}</h3>
        {onRefetch && (
          <button
            onClick={onRefetch}
            disabled={loading}
            className="flex items-center justify-center p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all cursor-pointer"
            title="Refetch Widget Data"
          >
            <svg
              className={`w-4 h-4 ${loading ? 'animate-spin text-slate-900' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-slate-950 animate-spin mb-3"></div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Syncing widget...</span>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center text-rose-600 font-sans">
          <svg className="w-10 h-10 mb-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs font-bold uppercase tracking-wider">Failed to load {title.toLowerCase()}</p>
          <span className="text-xs opacity-75 max-w-[280px] mt-1 font-medium">{error}</span>
        </div>
      )}

      {/* Content State */}
      {!loading && !error && (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
};

export default DashboardWidget;
