import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Landmark } from 'lucide-react';

export default function SuccessPlaceholderPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-blue-600/30 selection:text-blue-200">
      {/* Header navbar */}
      <header className="bg-slate-900/40 backdrop-blur-md border-b border-slate-900 w-full py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
          <Landmark className="h-6 w-6" />
          <span className="font-bold text-white tracking-tight">People's Priorities AI</span>
        </Link>
      </header>

      {/* Main container */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl text-center relative overflow-hidden w-full">
          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />

          {/* Success Status Badge Icon */}
          <div className="p-5 rounded-full bg-emerald-500/10 text-emerald-400 inline-block">
            <ShieldCheck className="h-16 w-16 animate-pulse" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Submission Ready!
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              This prototype has successfully validated and prepared your issue submission payload.
            </p>
          </div>

          {/* Prototype Explanation Callout */}
          <div className="bg-slate-950/55 border border-slate-850 p-4 sm:p-5 rounded-2xl text-left space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Next Phase Notice</span>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Because this is a frontend prototype, no active network requests or database writes were executed. The complete structured payload with your images, location metadata, and voice duration details is compiled in memory and ready for backend submission in SPRINT 2.
            </p>
          </div>

          {/* Home Link Button */}
          <div className="pt-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-105 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
            >
              Return Home
              <ArrowRight className="h-4 w-4" />
            </Link>
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
