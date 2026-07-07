import React, { useState } from 'react';
import FormField from '../../components/FormField';
import { useLanguage } from '../../../landing/context/LanguageContext';

interface ManualLocationFormProps {
  onSave: (locality: string, ward: string, landmark: string) => void;
  onCancel: () => void;
  initialValues?: { locality?: string; ward?: string; landmark?: string };
}

export default function ManualLocationForm({
  onSave,
  onCancel,
  initialValues
}: ManualLocationFormProps) {
  const { t } = useLanguage();
  const [locality, setLocality] = useState(initialValues?.locality || '');
  const [ward, setWard] = useState(initialValues?.ward || '');
  const [landmark, setLandmark] = useState(initialValues?.landmark || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locality.trim()) {
      setError("Area/Locality is required.");
      return;
    }
    setError(null);
    onSave(locality, ward, landmark);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto p-6 bg-[#FAF9F6] border border-slate-200 rounded-3xl shadow-sm w-full text-left font-sans">
      <h3 className="text-xs font-extrabold text-slate-950 uppercase tracking-wider mb-2">
        Enter Location Details
      </h3>
      
      {/* Area / Locality */}
      <FormField
        label={t('locationLabelLocality') + " *"}
        name="locality"
        value={locality}
        onChange={(e) => {
          setLocality(e.target.value);
          if (error) setError(null);
        }}
        placeholder="e.g. Indiranagar Sector 2"
        required
        error={error || undefined}
      />

      {/* Ward */}
      <FormField
        label={t('locationLabelWard')}
        name="ward"
        value={ward}
        onChange={(e) => setWard(e.target.value)}
        placeholder="e.g. Ward No. 42"
      />

      {/* Landmark */}
      <FormField
        label={t('locationLabelLandmark')}
        name="landmark"
        value={landmark}
        onChange={(e) => setLandmark(e.target.value)}
        placeholder={t('locationPlaceholderLandmark')}
      />

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 text-xs font-bold uppercase tracking-wider">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-full border border-slate-250 hover:border-slate-400 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 transition-colors cursor-pointer shadow-sm"
        >
          {t('btnCancel')}
        </button>
        <button
          type="submit"
          className="flex-1 py-3 rounded-full text-white bg-slate-950 hover:bg-slate-900 transition-colors shadow-md shadow-slate-950/10 cursor-pointer"
        >
          Save Location
        </button>
      </div>
    </form>
  );
}
