import { AlertTriangle, CheckCircle } from 'lucide-react';

interface ValidationPanelProps {
  errors: string[];
  isValid: boolean;
}

export default function ValidationPanel({ errors, isValid }: ValidationPanelProps) {
  if (isValid) {
    return (
      <div className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-left">
        <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-bold text-sm">All Systems Go!</h4>
          <p className="text-xs text-emerald-500/80 font-medium">
            Every section has been successfully validated and is ready for packaging.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-left">
      <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <h4 className="font-bold text-sm text-white">Validation Errors Found</h4>
        <p className="text-xs text-red-400/80 font-medium">
          Please correct the following errors before submitting:
        </p>
        <ul className="list-disc pl-5 pt-1.5 space-y-1 text-xs">
          {errors.map((err, idx) => (
            <li key={idx} className="font-medium text-slate-300">
              {err}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
