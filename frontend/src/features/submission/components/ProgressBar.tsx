import { useLanguage } from '../../landing/context/LanguageContext';

interface ProgressBarProps {
  currentStep: number;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const { t } = useLanguage();

  const steps = [
    { number: 1, label: t('infoSectionTitle') },
    { number: 2, label: t('voiceSectionTitle') },
    { number: 3, label: t('imageSectionTitle') },
    { number: 4, label: t('locationSectionTitle') },
    { number: 5, label: t('reviewSectionTitle') }
  ];

  return (
    <div className="w-full space-y-4 font-sans">
      {/* Steps Header */}
      <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-slate-500">
        <span>{t('stepIndicator', { current: currentStep, total: steps.length })}</span>
        <span className="text-slate-950 font-black">{steps[currentStep - 1].label}</span>
      </div>

      {/* Progress Bar Track */}
      <div className="relative h-1 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-100">
        <div
          className="absolute top-0 left-0 h-full bg-slate-950 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs uppercase font-extrabold tracking-wider">
        {steps.map((step) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          
          return (
            <div
              key={step.number}
              className={`transition-colors duration-300 ${
                isActive 
                  ? "text-slate-950 font-black" 
                  : isCompleted 
                    ? "text-slate-650" 
                    : "text-slate-350"
              }`}
            >
              <div className="hidden sm:block leading-tight">{step.label}</div>
              <div className="sm:hidden">{step.number}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
