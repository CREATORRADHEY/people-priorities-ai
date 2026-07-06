import { HOW_IT_WORKS } from '../constants/content';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-slate-950 py-20 md:py-28 border-t border-slate-900">
      {/* Background blur */}
      <div className="absolute top-[20%] left-[50%] -translate-x-[50%] w-[50%] h-[30%] rounded-full bg-indigo-950/20 blur-[100px] z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {HOW_IT_WORKS.title}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            {HOW_IT_WORKS.subtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-1/4 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-blue-600/30 z-0" />

          {HOW_IT_WORKS.steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-4 relative z-10 group">
              {/* Number Circle */}
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-900 border-2 border-slate-800 text-blue-400 text-xl font-black shadow-lg shadow-black/40 group-hover:border-blue-500 group-hover:text-white group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all scale-105 duration-300">
                {step.number}
              </div>

              {/* Step Title */}
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors pt-2">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
