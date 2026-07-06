import { Mic, Square } from 'lucide-react';

interface RecordButtonProps {
  isRecording: boolean;
  onClick: () => void;
}

export default function RecordButton({ isRecording, onClick }: RecordButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center justify-center p-8 rounded-full border-4 transition-all duration-300 ${
        isRecording
          ? "border-red-500 bg-red-600/10 text-red-500 hover:bg-red-600/20 ring-4 ring-red-500/20"
          : "border-blue-500 bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 hover:scale-105"
      }`}
    >
      {isRecording ? (
        <>
          {/* Animated concentric pulse wave */}
          <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
          <Square className="h-8 w-8 relative z-10" fill="currentColor" />
        </>
      ) : (
        <Mic className="h-8 w-8 relative z-10" />
      )}
    </button>
  );
}
