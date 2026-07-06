import { useState, useEffect } from 'react';
import { Trash2, RotateCcw, AlertCircle, Info } from 'lucide-react';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import RecordButton from './RecordButton';
import RecordingTimer from './RecordingTimer';
import PermissionDialog from './PermissionDialog';

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob | null, isValid: boolean) => void;
}

export default function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
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

  // Check if recording satisfies duration constraints (3 sec min)
  const isDurationValid = duration >= 3;
  const showValidationWarning = recordingState === 'recorded' && !isDurationValid;

  // Handle permission request click
  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      setHasPermission(true);
      setShowPermissionPrompt(false);
      // Start recording immediately after permission granted for better UX
      startRecording();
    }
  };

  // Stop recording manually
  const handleStop = () => {
    stopRecording();
  };

  // Re-record
  const handleReRecord = () => {
    deleteRecording();
    startRecording();
  };

  // Update parent when recording blob updates
  useEffect(() => {
    if (recordingState === 'recorded' && audioBlob) {
      onRecordingComplete(audioBlob, isDurationValid);
    } else {
      onRecordingComplete(null, false);
    }
  }, [recordingState, audioBlob, isDurationValid, onRecordingComplete]);

  // 1. Browser capability guard
  if (!isSupported) {
    return (
      <div className="flex flex-col items-center text-center space-y-4 max-w-sm mx-auto p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
        <div className="p-4 rounded-full bg-red-500/10 text-red-400">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h3 className="text-lg font-bold text-white">Browser Unsupported</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Your browser does not support audio recording APIs. Please try using a modern browser like Chrome, Firefox, or Safari.
        </p>
      </div>
    );
  }

  // 2. Permission prompt guard
  if (showPermissionPrompt && !hasPermission && recordingState !== 'recording' && recordingState !== 'recorded') {
    return (
      <PermissionDialog
        onRequest={handleRequestPermission}
        error={permissionError}
      />
    );
  }

  return (
    <div className="flex flex-col items-center text-center space-y-8 max-w-md mx-auto p-6 sm:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl shadow-xl">
      
      {/* Title helper */}
      <div className="space-y-1">
        <p className="text-slate-400 text-sm font-semibold">
          {recordingState === 'recording' ? "Recording Description..." : "Tap below to describe your issue"}
        </p>
        {recordingState === 'recording' && (
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <Info className="h-3 w-3 text-blue-400" />
            Auto-stops at 2:00 minutes
          </p>
        )}
      </div>

      {/* Timer and visualizer placeholder */}
      {(recordingState === 'recording' || recordingState === 'recorded') && (
        <RecordingTimer duration={duration} />
      )}

      {/* Recording states buttons */}
      {recordingState === 'idle' && (
        <div className="py-4">
          <RecordButton isRecording={false} onClick={startRecording} />
        </div>
      )}

      {recordingState === 'recording' && (
        <div className="py-4">
          <RecordButton isRecording={true} onClick={handleStop} />
        </div>
      )}

      {/* Audio playback and edit controls */}
      {recordingState === 'recorded' && audioUrl && (
        <div className="w-full space-y-6 animate-fadeIn">
          {/* Native HTML audio player */}
          <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-inner">
            <audio
              src={audioUrl}
              controls
              className="w-full"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-center items-center gap-4">
            <button
              type="button"
              onClick={handleReRecord}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-900/80 transition-colors text-sm font-semibold"
            >
              <RotateCcw className="h-4 w-4" />
              Record Again
            </button>
            <button
              type="button"
              onClick={deleteRecording}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 transition-colors text-sm font-semibold"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Duration validation error */}
      {showValidationWarning && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs text-left animate-shake">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Recording must be at least 3 seconds long. Please record again.</span>
        </div>
      )}
    </div>
  );
}
