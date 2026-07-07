import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Landmark, Send } from 'lucide-react';
import ProgressBar from '../../components/ProgressBar';
import InformationSummary from '../components/InformationSummary';
import VoiceSummary from '../components/VoiceSummary';
import ImageSummary from '../components/ImageSummary';
import LocationSummary from '../components/LocationSummary';
import ValidationPanel from '../components/ValidationPanel';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { useSubmissionReview } from '../hooks/useSubmissionReview';

export default function ReviewPage() {
  const navigate = useNavigate();
  const { draft, payload, errors, isValid } = useSubmissionReview();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmitClick = () => {
    if (isValid) {
      setIsDialogOpen(true);
    }
  };

  const handleConfirmSubmit = () => {
    setIsDialogOpen(false);
    
    // Log the generated payload for future integration debugging
    console.log("Submission Payload Built Successfully:", payload);

    // Route to confirmation screen (mock)
    navigate('/submit/success');
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
              to="/submit/location"
              className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Review Your Submission
            </h1>
          </div>

          {/* Progress bar: Step 5 of 5 */}
          <ProgressBar currentStep={5} />

          {/* Summaries list */}
          <div className="space-y-6">
            <InformationSummary information={draft.information} />
            <VoiceSummary voice={draft.voice} />
            <ImageSummary images={draft.images} />
            <LocationSummary location={draft.location} />
          </div>

          {/* Validation panel */}
          <ValidationPanel errors={errors} isValid={isValid} />

          {/* Action buttons */}
          <div className="pt-6 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={handleSubmitClick}
              disabled={!isValid}
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white transition-all shadow-lg ${
                isValid
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-105 cursor-pointer shadow-blue-500/20 hover:shadow-blue-500/30"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
              }`}
            >
              Submit Issue
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog Overlay Modal */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setIsDialogOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-slate-950 py-6 border-t border-slate-900 text-center text-slate-600 text-xs sm:text-sm">
        © 2026 People's Priorities AI. All rights reserved.
      </footer>
    </div>
  );
}
