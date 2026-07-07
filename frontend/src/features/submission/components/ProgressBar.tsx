
interface ProgressBarProps {
  currentStep: number;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const steps = [
    { number: 1, label: "Information" },
    { number: 2, label: "Voice" },
    { number: 3, label: "Images" },
    { number: 4, label: "Location" },
    { number: 5, label: "Review" }
  ];

  return (
    <div className="w-full space-y-4">
      {/* Steps Header */}
      <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-slate-400">
        <span>Step {currentStep} of {steps.length}</span>
        <span className="text-blue-400 font-bold">{steps[currentStep - 1].label}</span>
      </div>

      {/* Progress Bar Track */}
      <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-5 gap-2 text-center text-[10px] sm:text-xs">
        {steps.map((step) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          
          return (
            <div
              key={step.number}
              className={`font-semibold transition-colors duration-300 ${
                isActive 
                  ? "text-blue-400" 
                  : isCompleted 
                    ? "text-indigo-400" 
                    : "text-slate-600"
              }`}
            >
              <div className="hidden sm:block">{step.label}</div>
              <div className="sm:hidden">{step.number}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
