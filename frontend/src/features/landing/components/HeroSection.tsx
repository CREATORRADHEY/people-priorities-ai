import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { HERO } from '../constants/content';

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-slate-950 pt-32 pb-24 md:pt-40 md:pb-36 flex items-center min-h-[90vh]">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[10%] w-[60%] h-[70%] rounded-full bg-indigo-900/15 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            Decision Intelligence Portal
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-none bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-200">
            {HERO.title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 font-normal leading-relaxed max-w-3xl mx-auto">
            {HERO.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/submit"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 border border-transparent rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-105"
            >
              {HERO.cta}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 border border-slate-700 hover:border-slate-500 rounded-xl text-base font-semibold text-slate-300 hover:text-white bg-slate-900/50 hover:bg-slate-900/80 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
