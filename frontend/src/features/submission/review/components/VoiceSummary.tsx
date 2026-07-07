import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Mic, CheckCircle2, AlertCircle } from 'lucide-react';

interface VoiceSummaryProps {
  voice?: {
    blob?: Blob;
    duration?: number;
  };
}

export default function VoiceSummary({ voice }: VoiceSummaryProps) {
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

  const formatDuration = (sec?: number) => {
    if (sec === undefined) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-md text-left relative overflow-hidden">
      {/* Header and status badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-blue-400" />
          <h3 className="font-bold text-white text-base">2. Voice Recording</h3>
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
      {voice?.blob ? (
        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-center bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 font-medium">Recording Duration:</span>
            <span className="font-bold text-white font-mono text-base bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
              {formatDuration(voice.duration)}
            </span>
          </div>

          {/* Native Browser Player */}
          {audioUrl && (
            <div className="w-full">
              <audio src={audioUrl} controls className="w-full filter invert hue-rotate-180 brightness-90 bg-slate-900 rounded-lg" />
            </div>
          )}
        </div>
      ) : (
        <p className="text-slate-500 text-sm italic">No voice recording provided yet.</p>
      )}

      {/* Edit Link Action */}
      <div className="flex justify-end pt-2">
        <Link
          to="/submit/voice"
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <Edit2 className="h-3.5 w-3.5" />
          Edit Voice Evidence
        </Link>
      </div>
    </div>
  );
}
