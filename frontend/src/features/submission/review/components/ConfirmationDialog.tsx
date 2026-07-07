import { HelpCircle, X } from 'lucide-react';
import { useLanguage } from '../../../landing/context/LanguageContext';

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
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#F8F9FA]/80 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div className="relative bg-white border border-slate-200 rounded-[32px] p-6 sm:p-8 max-w-sm w-full text-center space-y-6 shadow-2xl animate-scaleIn">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#0B0B0C]" />

        {/* Close trigger button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Warning Icon */}
        <div className="p-4 rounded-full bg-slate-50 border border-slate-200 text-slate-900 inline-block shadow-sm">
          <HelpCircle className="h-9 w-9 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider">Submit Report</h3>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
            Are you sure you want to submit this issue? This will package your details and prepare them for your MP.
          </p>
        </div>

        {/* Actions buttons */}
        <div className="flex gap-3 pt-2 text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-secondary-pill py-3 cursor-pointer shadow-sm"
          >
            {t('btnCancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 btn-primary-pill py-3 cursor-pointer shadow-md shadow-slate-900/10"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
