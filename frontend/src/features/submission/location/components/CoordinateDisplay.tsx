
interface CoordinateDisplayProps {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export default function CoordinateDisplay({
  latitude,
  longitude,
  accuracy
}: CoordinateDisplayProps) {
  return (
    <div className="w-full bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 space-y-3 font-mono text-xs text-slate-400">
      <div className="flex justify-between border-b border-slate-800/50 pb-2">
        <span className="text-slate-500">Latitude:</span>
        <span className="font-semibold text-white">{latitude.toFixed(6)}°</span>
      </div>
      <div className="flex justify-between border-b border-slate-800/50 pb-2">
        <span className="text-slate-500">Longitude:</span>
        <span className="font-semibold text-white">{longitude.toFixed(6)}°</span>
      </div>
      {accuracy !== undefined && (
        <div className="flex justify-between">
          <span className="text-slate-500">Accuracy:</span>
          <span className="font-semibold text-blue-400">±{accuracy.toFixed(1)} meters</span>
        </div>
      )}
    </div>
  );
}
