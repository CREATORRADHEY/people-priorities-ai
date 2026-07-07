import { HelpCircle, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationDialog({
  isOpen,
  onConfirm,
  onCancel
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close trigger button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Warning Icon */}
        <div className="p-4 rounded-full bg-blue-500/10 text-blue-400 inline-block">
          <HelpCircle className="h-10 w-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Submit Issue?</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Are you sure you want to submit this issue? This will package your details and prepare them for your MP.
          </p>
        </div>

        {/* Actions buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-semibold border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white bg-slate-900/30 hover:bg-slate-900/60 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md shadow-blue-900/30"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
