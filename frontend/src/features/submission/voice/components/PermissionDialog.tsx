import { Mic, AlertTriangle } from 'lucide-react';

interface PermissionDialogProps {
  onRequest: () => void;
  error: string | null;
}

export default function PermissionDialog({ onRequest, error }: PermissionDialogProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-6 max-w-sm mx-auto p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
      <div className="p-4 rounded-full bg-blue-500/10 text-blue-400">
        <Mic className="h-10 w-10 animate-bounce" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white">Microphone Access Required</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          We need permission to access your microphone so you can record your voice description.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs text-left">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}. Please click the lock icon in your address bar and reset site permissions to continue.</span>
        </div>
      )}

      <button
        type="button"
        onClick={onRequest}
        className="w-full py-3 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md shadow-blue-900/30"
      >
        Grant Permission
      </button>
    </div>
  );
}
