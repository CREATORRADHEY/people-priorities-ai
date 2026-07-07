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
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/20 backdrop-blur-sm animate-fade-in font-sans">
      {/* Semi-transparent click-away overlay */}
      <div className="flex-1 cursor-pointer" onClick={onClose} />

      {/* Drawer Body */}
      <div className="w-full max-w-2xl bg-[#F8F9FA] border-l border-slate-200 p-8 overflow-y-auto flex flex-col h-full shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
          <div className="flex flex-col">
            <h2 className="text-sm font-black text-slate-950 uppercase tracking-wider">
              Submission Explorer
            </h2>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 font-bold">
              ID: {data?.submission?.id || 'Loading...'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-250 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Loading details */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-slate-950 animate-spin mb-4"></div>
            <span className="text-xs text-slate-450 font-bold uppercase tracking-wider">Loading audit lineage...</span>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-rose-600 py-10">
            <svg className="w-12 h-12 mb-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h4 className="font-extrabold text-slate-900 uppercase text-sm">Unable to load lineage explorer</h4>
            <p className="text-xs opacity-75 mt-1">{error}</p>
          </div>
        )}

        {/* Content Lineage Timeline */}
        {!loading && !error && data && (
          <div className="flex-1 flex flex-col space-y-6">
            
            {/* ──────── STEP 1: Submission Received ──────── */}
            <div className="relative pl-6 border-l-2 border-slate-200 pb-2">
              <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-300"></div>
              
              <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-950 uppercase tracking-widest mb-2 select-none">
                <span>1. Submission Received</span>
                <span className="text-[10px] text-slate-400 normal-case font-medium">
                  {formatDate(data.submission.serverCreatedAt)}
                </span>
              </div>
              
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2.5 font-sans shadow-sm">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Raw Description</span>
                  <p className="text-xs text-slate-700 leading-relaxed mt-0.5 font-medium">
                    {data.submission.information.issueDescription}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Declared Language</span>
                    <span className="text-slate-800 font-extrabold uppercase mt-0.5 block">
                      {data.submission.information.language}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Declared Category</span>
                    <span className="text-slate-800 font-extrabold mt-0.5 block">
                      {data.submission.information.category}
                    </span>
                  </div>
                </div>
                {/* Media Details */}
                {(data.submission.voice || (data.submission.images && data.submission.images.length > 0)) && (
                  <div className="border-t border-slate-100 pt-2 flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
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
            <div className="relative pl-6 border-l-2 border-slate-200 pb-2">
              <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-300"></div>
              
              <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-950 uppercase tracking-widest mb-2 select-none">
                <span>2. AI Analysis Completed</span>
                {data.analysis && (
                  <span className="text-[10px] text-slate-400 normal-case font-medium">
                    {formatDate(data.analysis.processedAt)}
                  </span>
                )}
              </div>
              
              {!data.analysis ? (
                <div className="p-4 rounded-2xl border border-slate-200 bg-white text-slate-400 text-xs italic shadow-sm">
                  Analysis pending or skipped.
                </div>
              ) : (
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 font-sans shadow-sm">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">English Translation & Summary</span>
                    <p className="text-xs text-slate-700 leading-relaxed mt-0.5 font-medium">
                      {data.analysis.summary}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Inferred Category</span>
                      <span className="text-slate-800 font-extrabold mt-0.5 block">
                        {data.analysis.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">AI Confidence Score</span>
                      <span className="text-slate-800 font-extrabold font-mono mt-0.5 block">
                        {Math.round(data.analysis.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Extracted Themes</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {data.analysis.themes.map((theme, idx) => (
                        <span key={idx} className="text-[9px] bg-slate-50 text-slate-600 border border-slate-150 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ──────── STEP 3: Intelligence Generated ──────── */}
            <div className="relative pl-6 border-l-2 border-slate-200 pb-2">
              <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-300"></div>
              
              <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-950 uppercase tracking-widest mb-2 select-none">
                <span>3. Intelligence Generated</span>
                {data.intelligence && (
                  <span className="text-[10px] text-slate-400 normal-case font-medium">
                    {formatDate(data.intelligence.generatedAt)}
                  </span>
                )}
              </div>
              
              {!data.intelligence ? (
                <div className="p-4 rounded-2xl border border-slate-200 bg-white text-slate-400 text-xs italic shadow-sm">
                  Intelligence stubs generated.
                </div>
              ) : (
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 font-sans shadow-sm">
                  <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-100 pb-2.5">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Duplicate Status</span>
                      <span className="text-slate-800 font-extrabold mt-0.5 block">
                        {data.intelligence.isDuplicate ? '⚠️ Duplicate report detected' : '✅ Original report'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Hotspot Zone Status</span>
                      <span className="text-slate-800 font-extrabold mt-0.5 block">
                        {data.intelligence.isHotspot ? '🔥 Regional Hotspot' : '✅ Isolated report'}
                      </span>
                    </div>
                  </div>

                  {/* Themes normalization */}
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Normalized Government Themes</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {data.intelligence.normalizedThemes.map((theme, idx) => (
                        <span key={idx} className="text-[9px] bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ──────── STEP 4: Decision Directed ──────── */}
            <div className="relative pl-6">
              <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-300"></div>
              
              <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-950 uppercase tracking-widest mb-2 select-none">
                <span>4. Decision Directed</span>
              </div>
              
              {!data.intelligence ? (
                <div className="p-4 rounded-2xl border border-slate-200 bg-white text-slate-400 text-xs italic shadow-sm">
                  Decision stubs pending.
                </div>
              ) : (
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-4 font-sans shadow-sm">
                  
                  {/* Priority score callout */}
                  <div className="flex items-center justify-between bg-slate-950 text-white p-4 rounded-2xl">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider">Priority Level</span>
                      <span className="text-sm font-black uppercase tracking-wider mt-0.5">
                        {data.intelligence.priorityLevel}
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] text-slate-455 font-bold uppercase tracking-wider">Priority Score</span>
                      <span className="text-2xl font-black text-emerald-400 font-mono">
                        {data.intelligence.priorityScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Score contribution breakdown */}
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                      Score Weight Contribution Breakdown
                    </span>
                    <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-[9px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-[8px] text-slate-400 font-sans font-bold block uppercase tracking-wider">Severity</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">
                          {data.intelligence.primaryCategory ? 21 : 0} pts
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 font-sans font-bold block uppercase tracking-wider">Freq</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">
                          {data.intelligence.isHotspot ? 20 : 0} pts
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 font-sans font-bold block uppercase tracking-wider">Hotspot</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">
                          {data.intelligence.isHotspot ? 20 : 0} pts
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 font-sans font-bold block uppercase tracking-wider">Location</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">
                          7.5 pts
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 font-sans font-bold block uppercase tracking-wider">AI Conf</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">
                          {Math.round((data.intelligence.categoryConfidence || 0) * 10)} pts
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Details */}
                  <div className="border-t border-slate-100 pt-3.5 space-y-2.5">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Recommended Action Directive</span>
                      <p className="text-xs text-slate-900 font-extrabold leading-relaxed mt-0.5">
                        {data.intelligence.recommendedAction}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Directed Department</span>
                        <span className="text-slate-800 font-extrabold mt-0.5 block">
                          {data.intelligence.recommendedDepartment}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Action Urgency</span>
                        <span className="text-slate-800 font-extrabold mt-0.5 block">
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
