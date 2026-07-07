import React from 'react';


import { useDashboardData } from '../hooks/useDashboardData';
import { DashboardWidget } from '../components/DashboardWidget';
import { DashboardErrorBoundary } from '../components/DashboardErrorBoundary';
import ExecutiveOverview from '../overview/ExecutiveOverview';
import PriorityQueue from '../priority/PriorityQueue';
import HotspotView from '../hotspots/HotspotView';
import DuplicateClusters from '../duplicates/DuplicateClusters';
import RecommendationCenter from '../recommendations/RecommendationCenter';
import HumanReviewQueue from '../review/HumanReviewQueue';
import SubmissionExplorer from '../explorer/SubmissionExplorer';

export const DashboardPage: React.FC = () => {
  const {
    summary,
    priorities,
    hotspots,
    recommendations,
    reviewQueue,
    explorer,
  } = useDashboardData();

  const handleSelectSubmission = (id: string) => {
    explorer.fetchExplorer(id);
  };

  const handleCloseExplorer = () => {
    explorer.clear();
  };


  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="border-b border-slate-900 bg-slate-950/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-[0_0_12px_rgba(59,130,246,0.3)]">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />

              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-widest text-slate-100 uppercase">
                Aequitas AI
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Decision Portal
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800/80">
              🇮🇳 District Member of Parliament Desk
            </span>
          </div>
        </div>
      </nav>

      {/* Page Body container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900/60 pb-5">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-slate-100 uppercase tracking-wide">
              District Decision Intelligence Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1 leading-normal max-w-2xl">
              Provides deterministic, explainable intelligence synthesized from citizen mobile reports. Filter, rank, and allocate department work orders in real-time.
            </p>
          </div>
          <button
            onClick={async () => {
              await Promise.all([
                summary.refetch(),
                priorities.refetch(),
                hotspots.refetch(),
                recommendations.refetch(),
                reviewQueue.refetch(),
              ]);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-900 cursor-pointer transition-all self-start md:self-center"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18" />
            </svg>
            Refresh Dashboard
          </button>
        </div>

        {/* Overview Row */}
        <DashboardErrorBoundary>
          <ExecutiveOverview summary={summary.data} loading={summary.loading} />
        </DashboardErrorBoundary>

        {/* 3-Column Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Priorities Column (takes 2 widths on lg) */}
          <div className="lg:col-span-2 flex flex-col">
            <DashboardErrorBoundary>
              <DashboardWidget
                id="widget-priorities"
                title="Priority Action Queue"
                loading={priorities.loading}
                error={priorities.error}
                onRefetch={priorities.refetch}
                className="flex-1"
              >
                <PriorityQueue
                  items={priorities.data}
                  onSelectRow={handleSelectSubmission}
                />
              </DashboardWidget>
            </DashboardErrorBoundary>
          </div>

          {/* Right Column Stack */}
          <div className="flex flex-col space-y-6">
            
            {/* Hotspots Widget */}
            <DashboardErrorBoundary>
              <DashboardWidget
                id="widget-hotspots"
                title="Active Locality Hotspots"
                loading={hotspots.loading}
                error={hotspots.error}
                onRefetch={hotspots.refetch}
              >
                <HotspotView items={hotspots.data} />
              </DashboardWidget>
            </DashboardErrorBoundary>

            {/* Recommendation Directives */}
            <DashboardErrorBoundary>
              <DashboardWidget
                id="widget-recommendations"
                title="Department Directives"
                loading={recommendations.loading}
                error={recommendations.error}
                onRefetch={recommendations.refetch}
              >
                <RecommendationCenter
                  items={recommendations.data}
                  onSelectRow={handleSelectSubmission}
                />
              </DashboardWidget>
            </DashboardErrorBoundary>

            {/* Duplicate report clusters */}
            <DashboardErrorBoundary>
              <DashboardWidget
                id="widget-duplicates"
                title="Duplicate Report Clusters"
                loading={priorities.loading}
                error={priorities.error}
                onRefetch={priorities.refetch}
              >
                <DuplicateClusters
                  priorities={priorities.data}
                  onSelectRow={handleSelectSubmission}
                />
              </DashboardWidget>
            </DashboardErrorBoundary>

            {/* Human verification queue */}
            <DashboardErrorBoundary>
              <DashboardWidget
                id="widget-review"
                title="Verification Queue (Low AI Confidence)"
                loading={reviewQueue.loading}
                error={reviewQueue.error}
                onRefetch={reviewQueue.refetch}
              >
                <HumanReviewQueue
                  items={reviewQueue.data}
                  onSelectRow={handleSelectSubmission}
                />
              </DashboardWidget>
            </DashboardErrorBoundary>

          </div>

        </div>

      </main>

      {/* Detail Audit Lineage Drawer */}
      <SubmissionExplorer
        data={explorer.data}
        loading={explorer.loading}
        error={explorer.error}
        onClose={handleCloseExplorer}
      />
    </div>
  );
};

export default DashboardPage;
