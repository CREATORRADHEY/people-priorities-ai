import { useState, useEffect } from 'react';
import { Trash2, RotateCcw, AlertCircle, Info, Mic } from 'lucide-react';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import RecordingTimer from './RecordingTimer';
import PermissionDialog from './PermissionDialog';
import { useLanguage } from '../../../landing/context/LanguageContext';

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob | null, isValid: boolean) => void;
}

export default function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const { t } = useLanguage();
  const {
    isSupported,
    recordingState,
    duration,
    audioUrl,
    audioBlob,
    permissionError,
    requestPermission,
    startRecording,
    stopRecording,
    deleteRecording,
  } = useVoiceRecorder();

  const [hasPermission, setHasPermission] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(true);

  const isDurationValid = duration >= 3;
  const showValidationWarning = recordingState === 'recorded' && !isDurationValid;

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      setHasPermission(true);
      setShowPermissionPrompt(false);
      startRecording();
    }
  };

  const handleStop = () => {
    stopRecording();
  };

  const handleReRecord = () => {
    deleteRecording();
    startRecording();
  };

  useEffect(() => {
    if (recordingState === 'recorded' && audioBlob) {
      onRecordingComplete(audioBlob, isDurationValid);
    } else {
      onRecordingComplete(null, false);
    }
  }, [recordingState, audioBlob, isDurationValid, onRecordingComplete]);

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center text-center space-y-4 max-w-sm mx-auto p-6 bg-white border border-slate-200 rounded-3xl font-sans">
        <div className="p-4 rounded-full bg-rose-50 text-rose-600">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Browser Unsupported</h3>
        <p className="text-slate-500 text-xs leading-relaxed font-medium">
          Your browser does not support audio recording APIs. Please try using a modern browser like Chrome, Firefox, or Safari.
        </p>
      </div>
    );
  }

  if (showPermissionPrompt && !hasPermission && recordingState !== 'recording' && recordingState !== 'recorded') {
    return (
      <PermissionDialog
        onRequest={handleRequestPermission}
        error={permissionError}
      />
    );
  }

  return (
    <div className="flex flex-col items-center text-center space-y-8 max-w-md mx-auto p-6 sm:p-8 bg-[#FAF9F6] border border-slate-200 rounded-[32px] shadow-sm font-sans relative overflow-hidden">
      
      {/* Decorative background grid pattern to feel high-tech */}
      <div className="absolute inset-0 bg-grid-lines opacity-[0.02] pointer-events-none" />

      {/* Title helper */}
      <div className="space-y-1 z-10">
        <p className="text-slate-800 text-xs font-black uppercase tracking-wider">
          {recordingState === 'recording' ? t('voiceProcessing') : t('voiceSubtitle')}
        </p>
        <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-bold uppercase tracking-wider">
          <Info className="h-3.5 w-3.5 text-slate-400" />
          {t('voiceDurationLimit')}
        </p>
      </div>

      {/* Recording animations & visualizer */}
      <div className="h-28 flex items-center justify-center w-full z-10">
        {recordingState === 'recording' ? (
          <div className="flex items-center gap-1 h-12">
            <span className="w-1.5 h-6 bg-slate-950 rounded-full animate-bounce [animation-delay:0.1s]"></span>
            <span className="w-1.5 h-12 bg-slate-950 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-8 bg-slate-950 rounded-full animate-bounce [animation-delay:0.3s]"></span>
            <span className="w-1.5 h-10 bg-slate-950 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            <span className="w-1.5 h-5 bg-slate-950 rounded-full animate-bounce [animation-delay:0.5s]"></span>
          </div>
        ) : recordingState === 'recorded' ? (
          <div className="p-4 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 animate-scaleIn">
            <Mic className="h-8 w-8" />
          </div>
        ) : (
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 animate-pulse">
            <Mic className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Timer and duration values */}
      {(recordingState === 'recording' || recordingState === 'recorded') && (
        <RecordingTimer duration={duration} />
      )}

      {/* Action triggers */}
      {recordingState === 'idle' && (
        <div className="py-2 z-10">
          <button
            onClick={startRecording}
            className="h-20 w-20 rounded-full bg-[#0B0B0C] hover:bg-slate-800 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 glow-pulse cursor-pointer"
          >
            <Mic className="h-8 w-8" />
          </button>
          <p className="text-[10px] text-slate-455 font-bold uppercase tracking-wider mt-4">
            {t('voiceRecordHelp')}
          </p>
        </div>
      )}

      {recordingState === 'recording' && (
        <div className="py-2 z-10">
          <button
            onClick={handleStop}
            className="h-20 w-20 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="h-6 w-6 bg-white rounded-md" />
          </button>
          <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider mt-4 animate-pulse">
            {t('voiceStopRecord')}
          </p>
        </div>
      )}

      {/* Audio player / re-record panel */}
      {recordingState === 'recorded' && audioUrl && (
        <div className="w-full space-y-6 z-10">
          <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
            <audio
              src={audioUrl}
              controls
              className="w-full"
            />
          </div>

          <div className="flex justify-center items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
            <button
              type="button"
              onClick={handleReRecord}
              className="btn-secondary-pill px-6 py-3 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t('voiceReRecord')}
            </button>
            <button
              type="button"
              onClick={deleteRecording}
              className="px-6 py-3 rounded-full text-rose-600 border border-rose-100 hover:border-rose-300 hover:bg-rose-50 bg-rose-50/20 transition-all cursor-pointer shadow-sm"
            >
              <Trash2 className="h-3.5 w-3.5 inline-block mr-1" />
              {t('btnCancel')}
            </button>
          </div>
        </div>
      )}

      {showValidationWarning && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 text-rose-600 text-xs text-left w-full font-medium z-10">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Recording must be at least 3 seconds long. Please record again.</span>
        </div>
      )}
    </div>
  );
}
