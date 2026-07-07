import { Compass, Loader2, AlertCircle, Edit3 } from 'lucide-react';
import { GPSState } from '../types/location';

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
  const isFetching = state === 'fetching';

  return (
    <div className="flex flex-col items-center text-center space-y-6 max-w-sm mx-auto p-6 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl">
      <div className={`p-4 rounded-full ${isFetching ? "bg-blue-500/10 text-blue-400" : "bg-blue-500/10 text-blue-400"}`}>
        {isFetching ? (
          <Loader2 className="h-10 w-10 animate-spin" />
        ) : (
          <Compass className="h-10 w-10 animate-pulse" />
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white">Find Issue Location</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Use your browser's GPS capability to tag the exact coordinates of the reported problem.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs text-left w-full">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-3 w-full">
        {/* GPS Capture trigger */}
        <button
          type="button"
          onClick={onCapture}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 transition-colors shadow-md shadow-blue-900/30"
        >
          {isFetching && <Loader2 className="h-4 w-4 animate-spin" />}
          {isFetching ? "Capturing Location..." : "Use Current Location"}
        </button>

        {/* Manual Fallback trigger */}
        <button
          type="button"
          onClick={onManualClick}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl font-bold text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white bg-slate-900/40 hover:bg-slate-900/80 transition-all"
        >
          <Edit3 className="h-4 w-4" />
          Enter Location Manually
        </button>
      </div>
    </div>
  );
}
