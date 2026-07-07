import { Link } from 'react-router-dom';
import { Edit2, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

interface LocationSummaryProps {
  location?: {
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    locality?: string;
    ward?: string;
    landmark?: string;
    source: 'gps' | 'manual';
    capturedAt: string;
  };
}

export default function LocationSummary({ location }: LocationSummaryProps) {
  const isValid = !!location;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-md text-left relative overflow-hidden">
      {/* Header and status badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-400" />
          <h3 className="font-bold text-white text-base">4. Location Details</h3>
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
      {location ? (
        <div className="space-y-3.5 text-sm">
          {/* Prioritize human readable fields */}
          <div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-0.5">Area / Locality</span>
            <p className="text-white font-semibold leading-snug">
              {location.locality || (location.source === 'gps' ? "Coordinates Logged" : "Unknown")}
            </p>
          </div>

          {(location.ward || location.landmark) && (
            <div className="grid grid-cols-2 gap-4">
              {location.ward && (
                <div>
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-0.5">Ward</span>
                  <p className="text-white font-semibold">{location.ward}</p>
                </div>
              )}
              {location.landmark && (
                <div>
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-0.5">Landmark</span>
                  <p className="text-white font-semibold">{location.landmark}</p>
                </div>
              )}
            </div>
          )}

          {/* Secondary coordinates details */}
          {location.source === 'gps' && location.latitude !== undefined && location.longitude !== undefined && (
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3.5 space-y-2 font-mono text-[11px] text-slate-400">
              <span className="text-slate-500 font-sans font-bold uppercase text-[10px] tracking-wider block mb-1">Secondary GPS Coordinates</span>
              <div className="flex justify-between">
                <span>Latitude:</span>
                <span className="text-white font-semibold">{location.latitude.toFixed(6)}°</span>
              </div>
              <div className="flex justify-between">
                <span>Longitude:</span>
                <span className="text-white font-semibold">{location.longitude.toFixed(6)}°</span>
              </div>
              {location.accuracy !== undefined && (
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span className="text-blue-400 font-semibold">±{location.accuracy.toFixed(1)} meters</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-slate-500 text-sm italic">No location information provided yet.</p>
      )}

      {/* Edit Link Action */}
      <div className="flex justify-end pt-2">
        <Link
          to="/submit/location"
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <Edit2 className="h-3.5 w-3.5" />
          Edit Location
        </Link>
      </div>
    </div>
  );
}
