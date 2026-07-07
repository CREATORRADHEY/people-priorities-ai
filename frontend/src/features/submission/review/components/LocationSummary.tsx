import { Link } from 'react-router-dom';
import { Edit2, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../landing/context/LanguageContext';

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
  const { t } = useLanguage();
  const isValid = !!location;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm text-left relative overflow-hidden font-sans">
      {/* Header and status badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-slate-800" />
          <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">4. {t('locationSectionTitle')}</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
          {isValid ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Complete
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-rose-700 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-100 animate-pulse">
              <AlertCircle className="h-3.5 w-3.5" />
              Incomplete
            </span>
          )}
        </div>
      </div>

      {/* Content details */}
      {location ? (
        <div className="space-y-3.5 text-xs text-slate-700 font-medium">
          {/* Prioritize human readable fields */}
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-0.5">{t('locationLabelLocality')}</span>
            <p className="text-slate-950 font-extrabold leading-snug">
              {location.locality || (location.source === 'gps' ? "Coordinates Logged" : "Unknown")}
            </p>
          </div>

          {(location.ward || location.landmark) && (
            <div className="grid grid-cols-2 gap-4">
              {location.ward && (
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-0.5">{t('locationLabelWard')}</span>
                  <p className="text-slate-900 font-extrabold">{location.ward}</p>
                </div>
              )}
              {location.landmark && (
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-0.5">{t('locationLabelLandmark')}</span>
                  <p className="text-slate-900 font-extrabold">{location.landmark}</p>
                </div>
              )}
            </div>
          )}

          {/* Secondary coordinates details */}
          {location.source === 'gps' && location.latitude !== undefined && location.longitude !== undefined && (
            <div className="bg-[#FAF9F6] border border-slate-200 rounded-2xl p-3.5 space-y-2 font-mono text-[11px] text-slate-500">
              <span className="text-slate-450 font-sans font-bold uppercase text-xs tracking-wider block mb-1">{t('locationLabelCoordinates')}</span>
              <div className="flex justify-between">
                <span>Latitude:</span>
                <span className="text-slate-800 font-semibold">{location.latitude.toFixed(6)}°</span>
              </div>
              <div className="flex justify-between">
                <span>Longitude:</span>
                <span className="text-slate-800 font-semibold">{location.longitude.toFixed(6)}°</span>
              </div>
              {location.accuracy !== undefined && (
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span className="text-blue-600 font-semibold">±{location.accuracy.toFixed(1)} meters</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-slate-400 text-xs italic">No location information provided yet.</p>
      )}

      {/* Edit Link Action */}
      <div className="flex justify-end pt-2 text-xs font-bold uppercase tracking-wider">
        <Link
          to="/submit/location"
          className="inline-flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <Edit2 className="h-3.5 w-3.5 text-slate-500" />
          Edit Location
        </Link>
      </div>
    </div>
  );
}
