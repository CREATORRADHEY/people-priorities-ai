import { Link } from 'react-router-dom';
import { ArrowLeft, Landmark, Hourglass } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';

interface ComingSoonPlaceholderProps {
  stepNumber: number;
  stepTitle: string;
  featurePack: string;
}

export default function ComingSoonPlaceholder({
  stepNumber,
  stepTitle,
  featurePack
}: ComingSoonPlaceholderProps) {
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
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl relative overflow-hidden">
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Submit Development Issue
            </h1>
          </div>

          {/* Progress bar representing actual workflow step */}
          <ProgressBar currentStep={stepNumber} />

          {/* Coming soon section */}
          <div className="flex flex-col items-center justify-center text-center space-y-6 pt-4">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-blue-500/10 text-blue-400 animate-pulse">
              <Hourglass className="h-10 w-10 animate-spin" style={{ animationDuration: '4s' }} />
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white">Step {stepNumber}: {stepTitle}</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                This workflow stage is currently undergoing local validation and asset integrations.
              </p>
            </div>

            <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              Coming in {featurePack}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Back button to go to previous step */}
              {stepNumber > 1 && (
                <Link
                  to={stepNumber === 2 ? "/submit" : stepNumber === 3 ? "/submit/voice" : "/submit/images"}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-800 hover:border-slate-700 rounded-xl text-sm font-semibold text-slate-300 bg-slate-900/40 hover:bg-slate-900/80 transition-colors w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              )}
            </div>
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
