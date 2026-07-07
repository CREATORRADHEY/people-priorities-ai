import { Link } from 'react-router-dom';
import { Edit2, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface InformationSummaryProps {
  information?: {
    title: string;
    description: string;
    category: string;
    language: string;
  };
}

export default function InformationSummary({ information }: InformationSummaryProps) {
  const isValid = !!(
    information?.title?.trim() &&
    information?.description?.trim() &&
    information?.category?.trim() &&
    information?.language?.trim()
  );

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-md text-left relative overflow-hidden">
      {/* Header and status badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-400" />
          <h3 className="font-bold text-white text-base">1. Basic Information</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold">
          {isValid ? (
            <span className="inline-flex items-center gap-1 text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              ✅ Complete
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-red-400 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
              <AlertCircle className="h-3.5 w-3.5 animate-pulse" />
              ❌ Incomplete
            </span>
          )}
        </div>
      </div>

      {/* Content details */}
      {information ? (
        <div className="space-y-3.5 text-sm">
          <div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-0.5">Title</span>
            <p className="text-white font-semibold leading-snug">{information.title}</p>
          </div>
          <div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-0.5">Description</span>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">{information.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-0.5">Category</span>
              <p className="text-white font-semibold">{information.category}</p>
            </div>
            <div>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-0.5">Language</span>
              <p className="text-white font-semibold capitalize">{information.language}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-slate-500 text-sm italic">No basic information provided yet.</p>
      )}

      {/* Edit Link Action */}
      <div className="flex justify-end pt-2">
        <Link
          to="/submit"
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <Edit2 className="h-3.5 w-3.5" />
          Edit Information
        </Link>
      </div>
    </div>
  );
}
