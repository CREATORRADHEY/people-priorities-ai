import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Landmark, ArrowRight } from 'lucide-react';
import ProgressBar from '../../components/ProgressBar';
import ImageUploader from '../components/ImageUploader';

export default function ImageUploadPage() {
  const navigate = useNavigate();

  const handleContinue = () => {
    // Navigate to Step 4: Review
    navigate('/submit/review');
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
              to="/submit/voice"
              className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Upload Images
            </h1>
          </div>

          {/* Progress bar: Step 3 of 4 (Images) */}
          <ProgressBar currentStep={3} />

          {/* Image Uploader panel */}
          <div className="py-4">
            <ImageUploader />
          </div>

          {/* Action buttons */}
          <div className="pt-6 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-105 cursor-pointer shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
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
