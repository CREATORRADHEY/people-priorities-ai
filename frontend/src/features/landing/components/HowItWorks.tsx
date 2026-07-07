import { useLanguage } from '../context/LanguageContext';

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      number: "01",
      title: t('step1Title'),
      description: t('step1Desc')
    },
    {
      number: "02",
      title: t('step2Title'),
      description: t('step2Desc')
    },
    {
      number: "03",
      title: t('step3Title'),
      description: t('step3Desc')
    }
  ];

  return (
    <section id="how-it-works" className="relative bg-[#FAF9F6] py-20 md:py-28 border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tighter uppercase">
            {t('howTitle')}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold uppercase tracking-wider">
            {t('howSubtitle')}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-1/4 left-[15%] right-[15%] h-[1px] bg-slate-200 z-0" />

          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-4 relative z-10 group">
              {/* Number Circle */}
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white border border-slate-250 text-slate-900 text-lg font-black shadow-sm group-hover:border-slate-950 group-hover:text-white group-hover:bg-slate-950 transition-all duration-300">
                {step.number}
              </div>

              {/* Step Title */}
              <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-slate-950 transition-colors pt-1.5 uppercase tracking-wider">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xs font-medium">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
