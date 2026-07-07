import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Landmark, Send } from 'lucide-react';
import ProgressBar from '../../components/ProgressBar';
import InformationSummary from '../components/InformationSummary';
import VoiceSummary from '../components/VoiceSummary';
import ImageSummary from '../components/ImageSummary';
import LocationSummary from '../components/LocationSummary';
import ValidationPanel from '../components/ValidationPanel';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { useSubmissionReview } from '../hooks/useSubmissionReview';
import { useSubmissionWorkflow } from '../../hooks/useSubmissionWorkflow';
import { useSubmissionDraft } from '../../hooks/useSubmissionDraft';
import { PROGRESS_MESSAGES } from '../../services/progressMessages';
import { useLanguage } from '../../../landing/context/LanguageContext';

export default function ReviewPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { draft, errors, isValid } = useSubmissionReview();
  const { updateDraft } = useSubmissionDraft();
  const { loading, state: workflowState, error: workflowError, submitDraft, resetWorkflow } = useSubmissionWorkflow();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmitClick = () => {
    if (isValid) {
      setIsDialogOpen(true);
    }
  };

  const handleConfirmSubmit = async () => {
    setIsDialogOpen(false);
    
    const result = await submitDraft(draft);
    if (result.success) {
      // Clean up the draft metadata and files after success
      updateDraft(() => ({ images: [] }));
      
      // Navigate to the Success screen passing the ID results
      navigate('/submit/success', {
        state: {
          submissionId: result.submissionId,
          requestId: result.requestId
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 flex flex-col justify-between selection:bg-slate-900/10 selection:text-slate-950 font-sans">
      {/* Header navbar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 w-full py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="flex items-center space-x-2.5 text-slate-900 hover:text-slate-700 transition-colors">
          <Landmark className="h-5 w-5 text-slate-950" />
          <span className="font-black text-slate-950 uppercase tracking-wider text-sm sm:text-base">{t('brandName')}</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          {t('btnCancel')}
        </Link>
      </header>

      {/* Main container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-950" />

          {/* Heading and Back Link */}
          <div className="space-y-4">
            <Link
              to="/submit/location"
              className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="h-4 w-4 mr-1 text-slate-500" />
              {t('btnBack')}
            </Link>
            <h1 className="text-2xl font-black text-slate-950 uppercase tracking-wide">
              {t('reviewSectionTitle')}
            </h1>
          </div>

          {/* Progress bar: Step 5 of 5 */}
          <ProgressBar currentStep={5} />

          {/* Summaries list */}
          <div className="space-y-6">
            <InformationSummary information={draft.information} />
            <VoiceSummary voice={draft.voice} />
            <ImageSummary images={draft.images} />
            <LocationSummary location={draft.location} />
          </div>

          {/* Validation panel */}
          <ValidationPanel errors={errors} isValid={isValid} />

          {/* Action buttons */}
          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={handleSubmitClick}
              disabled={!isValid || loading}
              className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-wider text-white transition-all shadow-md ${
                isValid && !loading
                  ? "bg-slate-950 hover:bg-slate-900 hover:scale-[1.02] cursor-pointer shadow-slate-950/20"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
              }`}
            >
              {t('btnSubmit')}
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-[#FAF9F6]/80 backdrop-blur-md flex flex-col items-center justify-center z-[100]">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-sm w-full mx-4 text-center space-y-6 shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-950 rounded-t-3xl" />
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full border-2 border-slate-200 border-t-slate-950 animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-950 uppercase tracking-wider">Submitting Issue</h3>
              <p className="text-slate-600 text-xs font-bold uppercase tracking-wider animate-pulse">
                {PROGRESS_MESSAGES[workflowState] || 'Uploading Grievance...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {workflowError && !loading && (
        <div className="fixed inset-0 bg-[#FAF9F6]/80 backdrop-blur-md flex flex-col items-center justify-center z-[100]">
          <div className="bg-white border border-rose-200 rounded-3xl p-8 max-w-md w-full mx-4 text-center space-y-6 shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500 rounded-t-3xl" />
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight uppercase">Submission Failed</h3>
              <p className="text-slate-500 text-xs font-medium">{workflowError}</p>
            </div>
            <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => submitDraft(draft)}
                className="flex-1 px-4 py-3 bg-slate-950 hover:bg-slate-900 rounded-full text-white shadow-md transition-all cursor-pointer"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={resetWorkflow}
                className="flex-1 px-4 py-3 bg-white hover:bg-slate-55 rounded-full text-slate-700 transition-colors cursor-pointer border border-slate-200"
              >
                {t('btnCancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Overlay Modal */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setIsDialogOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white py-6 border-t border-slate-200 text-center text-slate-500 text-xs font-semibold uppercase tracking-wider">
        {t('footerCopyright')}
      </footer>
    </div>
  );
}
