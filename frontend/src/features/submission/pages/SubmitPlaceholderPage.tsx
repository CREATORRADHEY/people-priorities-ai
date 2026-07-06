import { Link } from 'react-router-dom';
import { ArrowLeft, Hourglass, Landmark } from 'lucide-react';

export default function SubmitPlaceholderPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-blue-600/30 selection:text-blue-200">
      {/* Navbar Minimal */}
      <header className="bg-slate-900/40 backdrop-blur-md border-b border-slate-900 w-full py-4 px-6 flex items-center">
        <Link to="/" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
          <Landmark className="h-6 w-6" />
          <span className="font-bold text-white tracking-tight">People's Priorities AI</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6 relative overflow-hidden shadow-2xl">
          {/* Animated hourglass container */}
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-blue-500/10 text-blue-400 animate-pulse">
            <Hourglass className="h-10 w-10 animate-spin" style={{ animationDuration: '3s' }} />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Submit Development Issue
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our citizen intake portal is undergoing final system integrations.
            </p>
          </div>

          <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            Coming in FP-1.3
          </div>

          <div className="pt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 border border-transparent rounded-xl text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-all hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Minimal */}
      <footer className="bg-slate-950 py-6 border-t border-slate-900 text-center text-slate-600 text-xs sm:text-sm">
        © 2026 People's Priorities AI. All rights reserved.
      </footer>
    </div>
  );
}
