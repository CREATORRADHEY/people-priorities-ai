import React, { useState } from 'react';
import FormField from '../../components/FormField';

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
  const [locality, setLocality] = useState(initialValues?.locality || '');
  const [ward, setWard] = useState(initialValues?.ward || '');
  const [landmark, setLandmark] = useState(initialValues?.landmark || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locality.trim()) {
      setError("Locality is required.");
      return;
    }
    setError(null);
    onSave(locality, ward, landmark);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto p-6 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl w-full text-left">
      <h3 className="text-lg font-bold text-white mb-2">Enter Location Details</h3>
      
      {/* Area / Locality */}
      <FormField
        label="Area / Locality"
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
        label="Ward (Optional)"
        name="ward"
        value={ward}
        onChange={(e) => setWard(e.target.value)}
        placeholder="e.g. Ward No. 42"
      />

      {/* Landmark */}
      <FormField
        label="Landmark (Optional)"
        name="landmark"
        value={landmark}
        onChange={(e) => setLandmark(e.target.value)}
        placeholder="e.g. Near Metro Station"
      />

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl font-semibold border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white bg-slate-900/30 hover:bg-slate-900/60 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md shadow-blue-900/30"
        >
          Save Location
        </button>
      </div>
    </form>
  );
}
