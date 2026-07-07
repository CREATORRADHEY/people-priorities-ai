import { MapPin, Trash2, ShieldCheck, Compass } from 'lucide-react';
import { LocationData } from '../types/location';
import CoordinateDisplay from './CoordinateDisplay';

interface LocationCardProps {
  location: LocationData;
  onClear: () => void;
}

export default function LocationCard({ location, onClear }: LocationCardProps) {
  const isGps = location.source === 'gps';

  return (
    <div className="flex flex-col space-y-5 max-w-md mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl w-full text-left relative overflow-hidden">
      
      {/* Decorative tag */}
      <div className="absolute top-0 right-0 p-3 flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-900 border-l border-b border-slate-800 rounded-bl-xl">
        {isGps ? (
          <>
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
            GPS Tagged
          </>
        ) : (
          <>
            <Compass className="h-3.5 w-3.5 text-indigo-400" />
            Manual Entry
          </>
        )}
      </div>

      <div className="flex items-start gap-3.5 pt-2">
        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 mt-0.5 shrink-0">
          <MapPin className="h-6 w-6" />
        </div>
        
        {/* Human Readable Location Priority */}
        <div className="flex-1 space-y-1 pr-16 min-w-0">
          <h4 className="text-sm font-semibold text-slate-400">Captured Location</h4>
          <p className="text-lg font-bold text-white leading-snug truncate">
            {location.locality || (isGps ? "Coordinates Logged" : "Unknown Locality")}
          </p>
          {(location.ward || location.landmark) && (
            <div className="text-xs text-slate-400 space-y-0.5 font-medium">
              {location.ward && <p>Ward: <span className="text-white">{location.ward}</span></p>}
              {location.landmark && <p>Landmark: <span className="text-white">{location.landmark}</span></p>}
            </div>
          )}
        </div>
      </div>

      {/* Secondary Coordinates Display (Prioritized below human-readable strings) */}
      {isGps && location.latitude !== undefined && location.longitude !== undefined && (
        <div className="space-y-1.5 pt-2">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Secondary GPS Data</span>
          <CoordinateDisplay
            latitude={location.latitude}
            longitude={location.longitude}
            accuracy={location.accuracy}
          />
        </div>
      )}

      {/* Reset/Remove Action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 transition-colors text-sm font-semibold"
        >
          <Trash2 className="h-4 w-4" />
          Clear Location
        </button>
      </div>
    </div>
  );
}
