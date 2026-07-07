import { MapPin, Trash2, ShieldCheck, Compass } from 'lucide-react';
import { LocationData } from '../types/location';
import CoordinateDisplay from './CoordinateDisplay';
import { useLanguage } from '../../../landing/context/LanguageContext';

interface LocationCardProps {
  location: LocationData;
  onClear: () => void;
}

export default function LocationCard({ location, onClear }: LocationCardProps) {
  const { t } = useLanguage();
  const isGps = location.source === 'gps';

  return (
    <div className="flex flex-col space-y-5 max-w-md mx-auto p-6 bg-white border border-slate-200 rounded-3xl shadow-sm w-full text-left relative overflow-hidden font-sans">
      
      {/* Decorative tag */}
      <div className="absolute top-0 right-0 p-3 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-505 bg-[#FAF9F6] border-l border-b border-slate-200 rounded-bl-xl">
        {isGps ? (
          <>
            <ShieldCheck className="h-3.5 w-3.5 text-slate-700 animate-pulse" />
            GPS Tagged
          </>
        ) : (
          <>
            <Compass className="h-3.5 w-3.5 text-slate-500" />
            Manual Entry
          </>
        )}
      </div>

      <div className="flex items-start gap-3.5 pt-2">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 mt-0.5 shrink-0 shadow-sm">
          <MapPin className="h-5 w-5" />
        </div>
        
        {/* Human Readable Location Priority */}
        <div className="flex-1 space-y-1 pr-16 min-w-0">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Captured Location</h4>
          <p className="text-base font-extrabold text-slate-900 leading-snug truncate">
            {location.locality || (isGps ? "Coordinates Logged" : "Unknown Locality")}
          </p>
          {(location.ward || location.landmark) && (
            <div className="text-xs text-slate-500 space-y-0.5 font-medium">
              {location.ward && <p>{t('locationLabelWard')}: <span className="text-slate-900 font-bold">{location.ward}</span></p>}
              {location.landmark && <p>{t('locationLabelLandmark')}: <span className="text-slate-900 font-bold">{location.landmark}</span></p>}
            </div>
          )}
        </div>
      </div>

      {/* Secondary Coordinates Display (Prioritized below human-readable strings) */}
      {isGps && location.latitude !== undefined && location.longitude !== undefined && (
        <div className="space-y-1.5 pt-2">
          <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">{t('locationLabelCoordinates')}</span>
          <CoordinateDisplay
            latitude={location.latitude}
            longitude={location.longitude}
            accuracy={location.accuracy}
          />
        </div>
      )}

      {/* Reset/Remove Action */}
      <div className="pt-2 text-xs font-bold uppercase tracking-wider">
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-full border border-rose-200 hover:border-rose-300 text-rose-600 hover:text-rose-700 bg-rose-50/50 hover:bg-rose-50 transition-colors cursor-pointer shadow-sm"
        >
          <Trash2 className="h-4 w-4" />
          Clear Location
        </button>
      </div>
    </div>
  );
}
