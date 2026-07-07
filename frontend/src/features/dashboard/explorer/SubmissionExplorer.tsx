import React from 'react';
import { SubmissionExplorerResponse } from '../types/dashboard';

interface SubmissionExplorerProps {
  data: SubmissionExplorerResponse | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

export const SubmissionExplorer: React.FC<SubmissionExplorerProps> = ({
  data,
  loading,
  error,
  onClose,
}) => {
  if (!data && !loading && !error) return null;

  // Formatting date strings safely
  const formatDate = (isoString?: string) => {
    if (!isoString) return 'N/A';
    try {
      return new Date(isoString).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fade-in font-sans">
      {/* Semi-transparent click-away overlay */}
      <div className="flex-1 cursor-pointer" onClick={onClose} />

      {/* Drawer Body */}
      <div className="w-full max-w-2xl bg-slate-950 border-l border-slate-800 p-8 overflow-y-auto flex flex-col h-full shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
              Submission Explorer
            </h2>
            <span className="text-xs text-slate-500 font-mono mt-0.5">
              ID: {data?.submission?.id || 'Loading...'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Loading details */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin mb-4"></div>
            <span className="text-sm text-slate-400">Loading audit lineage...</span>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-rose-400 py-10">
            <svg className="w-12 h-12 mb-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h4 className="font-semibold text-slate-200">Unable to load lineage explorer</h4>
            <p className="text-xs opacity-75 mt-1">{error}</p>
          </div>
        )}

        {/* Content Lineage Timeline */}
        {!loading && !error && data && (
          <div className="flex-1 flex flex-col space-y-6">
            
            {/* ──────── STEP 1: Submission Received ──────── */}
            <div className="relative pl-6 border-l-2 border-blue-500/30 pb-2">
              {/* Dot */}
              <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
              
              <div className="flex items-center justify-between text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 select-none">
                <span>1. Submission Received</span>
                <span className="text-[10px] text-slate-500 normal-case font-medium">
                  {formatDate(data.submission.serverCreatedAt)}
                </span>
              </div>
              
              <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/60 space-y-2.5 font-sans">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Raw Description</span>
                  <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                    {data.submission.information.issueDescription}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Declared Language</span>
                    <span className="text-slate-300 font-semibold uppercase mt-0.5 block">
                      {data.submission.information.language}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Declared Category</span>
                    <span className="text-slate-300 font-semibold mt-0.5 block">
                      {data.submission.information.category}
                    </span>
                  </div>
                </div>
                {/* Media Details */}
                {(data.submission.voice || (data.submission.images && data.submission.images.length > 0)) && (
                  <div className="border-t border-slate-900 pt-2 flex items-center gap-4 text-[10px] text-slate-500">
                    {data.submission.voice && (
                      <span className="flex items-center gap-1">
                        🎙️ Voice ({Math.round(data.submission.voice.duration)}s)
                      </span>
                    )}
                    {data.submission.images && data.submission.images.length > 0 && (
                      <span className="flex items-center gap-1">
                        🖼️ Images ({data.submission.images.length})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ──────── STEP 2: AI Analysis Completed ──────── */}
            <div className="relative pl-6 border-l-2 border-blue-500/30 pb-2">
              <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border border-blue-400"></div>
              
              <div className="flex items-center justify-between text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 select-none">
                <span>2. AI Analysis Completed</span>
                {data.analysis && (
                  <span className="text-[10px] text-slate-500 normal-case font-medium">
                    {formatDate(data.analysis.processedAt)}
                  </span>
                )}
              </div>
              
              {!data.analysis ? (
                <div className="p-4 rounded-xl border border-slate-900/60 bg-slate-950/20 text-slate-500 text-xs italic">
                  Analysis pending or skipped.
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/60 space-y-3 font-sans">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">English Translation & Summary</span>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                      {data.analysis.summary}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Inferred Category</span>
                      <span className="text-slate-300 font-semibold mt-0.5 block">
                        {data.analysis.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">AI Confidence Score</span>
                      <span className="text-slate-300 font-semibold font-mono mt-0.5 block">
                        {Math.round(data.analysis.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Extracted Themes</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {data.analysis.themes.map((theme, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800/80 px-2.5 py-0.5 rounded-full">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ──────── STEP 3: Intelligence Generated ──────── */}
            <div className="relative pl-6 border-l-2 border-blue-500/30 pb-2">
              <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border border-blue-400"></div>
              
              <div className="flex items-center justify-between text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 select-none">
                <span>3. Intelligence Generated</span>
                {data.intelligence && (
                  <span className="text-[10px] text-slate-500 normal-case font-medium">
                    {formatDate(data.intelligence.generatedAt)}
                  </span>
                )}
              </div>
              
              {!data.intelligence ? (
                <div className="p-4 rounded-xl border border-slate-900/60 bg-slate-950/20 text-slate-500 text-xs italic">
                  Intelligence stubs generated.
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/60 space-y-3 font-sans">
                  <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-900 pb-2.5">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Duplicate Status</span>
                      <span className="text-slate-300 font-semibold mt-0.5 block">
                        {data.intelligence.isDuplicate ? '⚠️ Duplicate report detected' : '✅ Original report'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Hotspot Zone Status</span>
                      <span className="text-slate-300 font-semibold mt-0.5 block">
                        {data.intelligence.isHotspot ? '🔥 Regional Hotspot' : '✅ Isolated report'}
                      </span>
                    </div>
                  </div>

                  {/* Themes normalization */}
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Normalized Government Themes</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {data.intelligence.normalizedThemes.map((theme, idx) => (
                        <span key={idx} className="text-[10px] bg-blue-950/30 text-blue-300 border border-blue-800/20 px-2.5 py-0.5 rounded-full font-semibold">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ──────── STEP 4: Decision Directed (Priority Score Breakdown) ──────── */}
            <div className="relative pl-6">
              <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 select-none">
                <span>4. Decision Directed</span>
              </div>
              
              {!data.intelligence ? (
                <div className="p-4 rounded-xl border border-slate-900/60 bg-slate-950/20 text-slate-500 text-xs italic">
                  Decision stubs pending.
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/60 space-y-4 font-sans">
                  
                  {/* Priority score callout */}
                  <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/40 p-3.5 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Priority Level</span>
                      <span className="text-base font-extrabold text-slate-200 mt-0.5">
                        {data.intelligence.priorityLevel}
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Priority Score</span>
                      <span className="text-2xl font-black text-emerald-400 font-mono">
                        {data.intelligence.priorityScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Score contribution breakdown */}
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                      Score Weight Contribution Breakdown
                    </span>
                    <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-[10px] text-slate-400 bg-slate-900/30 p-2.5 rounded-xl border border-slate-900">
                      <div>
                        <span className="text-[8px] text-slate-500 block">Severity (30%)</span>
                        <span className="font-bold text-slate-200 block mt-0.5">
                          {data.intelligence.primaryCategory ? 21 : 0} pts
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 block">Freq (25%)</span>
                        <span className="font-bold text-slate-200 block mt-0.5">
                          {data.intelligence.isHotspot ? 20 : 0} pts
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 block">Hotspot (20%)</span>
                        <span className="font-bold text-slate-200 block mt-0.5">
                          {data.intelligence.isHotspot ? 20 : 0} pts
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 block">Location (15%)</span>
                        <span className="font-bold text-slate-200 block mt-0.5">
                          7.5 pts
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 block">AI Conf (10%)</span>
                        <span className="font-bold text-slate-200 block mt-0.5">
                          {Math.round((data.intelligence.categoryConfidence || 0) * 10)} pts
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Details */}
                  <div className="border-t border-slate-900 pt-3.5 space-y-2.5">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Recommended Action Directive</span>
                      <p className="text-xs text-emerald-200 font-bold leading-relaxed mt-0.5">
                        {data.intelligence.recommendedAction}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Directed Department</span>
                        <span className="text-slate-300 font-semibold mt-0.5 block">
                          {data.intelligence.recommendedDepartment}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Action Urgency</span>
                        <span className="text-slate-300 font-semibold mt-0.5 block">
                          {data.intelligence.urgency}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionExplorer;
