import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Landmark, ArrowRight } from 'lucide-react';
import ProgressBar from '../../components/ProgressBar';
import LocationPermission from '../components/LocationPermission';
import ManualLocationForm from '../components/ManualLocationForm';
import LocationCard from '../components/LocationCard';
import { useLocation } from '../hooks/useLocation';

export default function LocationPage() {
  const navigate = useNavigate();
  const { location, gpsState, gpsError, captureGPSLocation, updateManualLocation, clearLocation } = useLocation();
  const [isManualActive, setIsManualActive] = useState(false);

  const handleContinue = () => {
    if (location) {
      navigate('/submit/review');
    }
  };

  const handleManualSave = (locality: string, ward: string, landmark: string) => {
    updateManualLocation(locality, ward, landmark);
    setIsManualActive(false);
  };

  const handleManualCancel = () => {
    setIsManualActive(false);
  };

  const handleClear = () => {
    clearLocation();
    setIsManualActive(false);
  };

  // Determine what layout card to render
  const renderIntake = () => {
    if (location) {
      return (
        <LocationCard
          location={location}
          onClear={handleClear}
        />
      );
    }

    if (isManualActive) {
      return (
        <ManualLocationForm
          onSave={handleManualSave}
          onCancel={handleManualCancel}
          initialValues={location}
        />
      );
    }

    return (
      <LocationPermission
        onCapture={captureGPSLocation}
        onManualClick={() => setIsManualActive(true)}
        state={gpsState}
        error={gpsError}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-blue-600/30 selection:text-blue-200">
      {/* Header navbar */}
      <header className="bg-slate-900/40 backdrop-blur-md border-b border-slate-900 w-full py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
          <Landmark className="h-6 w-6" />
          <span className="font-bold text-white tracking-tight">People's Priorities AI</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </Link>
      </header>

      {/* Main container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />

          {/* Heading and Back Link */}
          <div className="space-y-4">
            <Link
              to="/submit/images"
              className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Location
            </h1>
          </div>

          {/* Progress bar: Step 4 of 5 (Location) */}
          <ProgressBar currentStep={4} />

          {/* Location Intake Panel */}
          <div className="py-4">
            {renderIntake()}
          </div>

          {/* Action buttons */}
          <div className="pt-6 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={handleContinue}
              disabled={!location}
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white transition-all shadow-lg ${
                location
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-105 cursor-pointer shadow-blue-500/20 hover:shadow-blue-500/30"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
              }`}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 py-6 border-t border-slate-900 text-center text-slate-600 text-xs sm:text-sm">
        © 2026 People's Priorities AI. All rights reserved.
      </footer>
    </div>
  );
}
