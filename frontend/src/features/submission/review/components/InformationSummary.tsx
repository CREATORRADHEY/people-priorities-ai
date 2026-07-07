import { Link } from 'react-router-dom';
import { Edit2, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../landing/context/LanguageContext';

interface InformationSummaryProps {
  information?: {
    fullName?: string;
    mobileNumber?: string;
    title: string;
    description: string;
    category: string;
    language: string;
  };
}

export default function InformationSummary({ information }: InformationSummaryProps) {
  const { t } = useLanguage();
  const isValid = !!(
    information?.title?.trim() &&
    information?.description?.trim() &&
    information?.category?.trim() &&
    information?.language?.trim()
  );

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm text-left relative overflow-hidden font-sans">
      {/* Header and status badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-800" />
          <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">1. {t('infoSectionTitle')}</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider">
          {isValid ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Complete
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-rose-700 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-100 animate-pulse">
              <AlertCircle className="h-3.5 w-3.5" />
              Incomplete
            </span>
          )}
        </div>
      </div>

      {/* Content details */}
      {information ? (
        <div className="space-y-3.5 text-xs text-slate-700">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">{t('reviewTitleLabel')}</span>
            <p className="text-slate-900 font-extrabold leading-snug">{information.title}</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">{t('reviewDescLabel')}</span>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line font-medium">{information.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">{t('reviewCategoryLabel')}</span>
              <p className="text-slate-900 font-extrabold">{t(information.category as any) || information.category}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">{t('reviewLanguageLabel')}</span>
              <p className="text-slate-900 font-extrabold capitalize">{t(`lang_${information.language}` as any) || information.language}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-slate-400 text-xs italic">No basic information provided yet.</p>
      )}

      {/* Edit Link Action */}
      <div className="flex justify-end pt-2 text-[10px] font-bold uppercase tracking-wider">
        <Link
          to="/submit"
          className="inline-flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <Edit2 className="h-3.5 w-3.5 text-slate-500" />
          Edit Information
        </Link>
      </div>
    </div>
  );
}
