import { Compass, Loader2, AlertCircle, Edit3 } from 'lucide-react';
import { GPSState } from '../types/location';
import { useLanguage } from '../../../landing/context/LanguageContext';

interface LocationPermissionProps {
  onCapture: () => void;
  onManualClick: () => void;
  state: GPSState;
  error: string | null;
}

export default function LocationPermission({
  onCapture,
  onManualClick,
  state,
  error
}: LocationPermissionProps) {
  const { t } = useLanguage();
  const isFetching = state === 'fetching';

  return (
    <div className="flex flex-col items-center text-center space-y-6 max-w-sm mx-auto p-6 bg-[#FAF9F6] border border-slate-200 rounded-3xl shadow-sm font-sans">
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 shadow-sm">
        {isFetching ? (
          <Loader2 className="h-7 w-7 animate-spin text-slate-800" />
        ) : (
          <Compass className="h-7 w-7 animate-pulse text-slate-800" />
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-extrabold text-slate-950 uppercase tracking-wider">
          {t('locationSectionTitle')}
        </h3>
        <p className="text-slate-550 text-xs sm:text-sm leading-relaxed font-medium">
          {t('locationSubtitle')}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 text-rose-600 text-xs text-left w-full font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-3 w-full text-xs font-bold uppercase tracking-wider">
        {/* GPS Capture trigger */}
        <button
          type="button"
          onClick={onCapture}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full text-white bg-slate-950 hover:bg-slate-900 disabled:bg-slate-100 disabled:text-slate-400 transition-colors shadow-md shadow-slate-950/10 cursor-pointer"
        >
          {isFetching && <Loader2 className="h-4 w-4 animate-spin" />}
          {isFetching ? t('locationCapturing') : t('locationBtnCapture')}
        </button>

        {/* Manual Fallback trigger */}
        <button
          type="button"
          onClick={onManualClick}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full text-slate-700 border border-slate-250 hover:border-slate-400 hover:text-slate-900 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
        >
          <Edit3 className="h-4 w-4 text-slate-700" />
          Enter Location Manually
        </button>
      </div>
    </div>
  );
}
