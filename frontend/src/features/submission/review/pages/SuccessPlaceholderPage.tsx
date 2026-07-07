import { useLocation, Link, Navigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Landmark } from 'lucide-react';
import { useLanguage } from '../../../landing/context/LanguageContext';

export default function SuccessPlaceholderPage() {
  const location = useLocation();
  const { t } = useLanguage();
  const { submissionId, requestId } = (location.state as { submissionId?: string; requestId?: string }) || {};

  // Redirect to home if direct URL access without a valid submission state occurs
  if (!submissionId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 flex flex-col justify-between selection:bg-slate-900/10 selection:text-slate-950 font-sans">
      {/* Header navbar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 w-full py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="flex items-center space-x-2.5 text-slate-900 hover:text-slate-700 transition-colors">
          <Landmark className="h-5 w-5 text-slate-950" />
          <span className="font-black text-slate-950 uppercase tracking-wider text-sm sm:text-base">{t('brandName')}</span>
        </Link>
      </header>

      {/* Main container */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 shadow-xl text-center relative overflow-hidden w-full">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-950" />

          {/* Success Status Badge Icon */}
          <div className="p-4 rounded-full bg-emerald-50 text-emerald-600 inline-block">
            <ShieldCheck className="h-10 w-10 animate-pulse" />
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-black text-slate-950 uppercase tracking-wide">
              {t('successTitle')}
            </h1>
            <p className="text-slate-555 text-xs sm:text-sm font-medium leading-relaxed">
              {t('successSubtitle')}
            </p>
          </div>

          {/* Reference IDs layout card */}
          <div className="bg-[#FAF9F6] border border-slate-200 p-6 rounded-2xl text-left space-y-4 shadow-inner">
            <div className="flex justify-between items-center py-2 border-b border-slate-200/60">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">{t('successStatusLabel')}</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                RECEIVED
              </span>
            </div>
            
            <div className="flex flex-col gap-1 py-1">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Submission ID</span>
              <span className="font-mono text-xs sm:text-sm text-slate-800 font-bold break-all select-all">
                {submissionId}
              </span>
            </div>

            {requestId && (
              <div className="flex flex-col gap-1 py-1 border-t border-slate-200/60">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">{t('successRefLabel')}</span>
                <span className="font-mono text-xs text-slate-500 break-all select-all">
                  {requestId}
                </span>
              </div>
            )}
          </div>

          {/* Home Link Button */}
          <div className="pt-4 text-xs font-bold uppercase tracking-wider">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full text-white bg-slate-950 hover:bg-slate-900 shadow-md shadow-slate-950/20 hover:scale-[1.02] transition-all cursor-pointer"
            >
              {t('successBtnHome')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 border-t border-slate-200 text-center text-slate-500 text-xs font-semibold uppercase tracking-wider">
        {t('footerCopyright')}
      </footer>
    </div>
  );
}
