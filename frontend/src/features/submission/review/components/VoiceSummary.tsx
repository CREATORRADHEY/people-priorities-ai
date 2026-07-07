import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Mic, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../landing/context/LanguageContext';

interface VoiceSummaryProps {
  voice?: {
    blob?: Blob;
    duration?: number;
  };
}

export default function VoiceSummary({ voice }: VoiceSummaryProps) {
  const { t } = useLanguage();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const isValid = !!voice?.blob;

  useEffect(() => {
    if (voice?.blob) {
      const url = URL.createObjectURL(voice.blob);
      setAudioUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
    setAudioUrl(null);
    return undefined;
  }, [voice?.blob]);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm text-left relative overflow-hidden font-sans">
      {/* Header and status badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className="h-4 w-4 text-slate-800" />
          <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">2. {t('voiceSectionTitle')}</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
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
      {voice?.blob ? (
        <div className="space-y-4 text-xs text-slate-700 font-medium">
          <div className="flex justify-between items-center bg-[#FAF9F6] p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">{t('reviewVoiceLabel')}:</span>
            <span className="font-bold text-slate-900 font-mono text-sm bg-white px-2.5 py-0.5 rounded border border-slate-200">
              {t('reviewVoiceDuration', { seconds: voice.duration ? Math.floor(voice.duration) : 0 })}
            </span>
          </div>

          {/* Native Browser Player */}
          {audioUrl && (
            <div className="w-full">
              <audio src={audioUrl} controls className="w-full bg-white rounded-xl p-2 border border-slate-200" />
            </div>
          )}
        </div>
      ) : (
        <p className="text-slate-400 text-xs italic">No voice recording provided yet.</p>
      )}

      {/* Edit Link Action */}
      <div className="flex justify-end pt-2 text-xs font-bold uppercase tracking-wider">
        <Link
          to="/submit/voice"
          className="inline-flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <Edit2 className="h-3.5 w-3.5 text-slate-500" />
          Edit Voice Evidence
        </Link>
      </div>
    </div>
  );
}
