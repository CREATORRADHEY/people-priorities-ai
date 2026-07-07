import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Landmark, ArrowRight } from 'lucide-react';
import ProgressBar from '../../components/ProgressBar';
import ImageUploader from '../components/ImageUploader';
import { useLanguage } from '../../../landing/context/LanguageContext';

export default function ImageUploadPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleContinue = () => {
    // Navigate to Step 4: Location
    navigate('/submit/location');
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
              to="/submit/voice"
              className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="h-4 w-4 mr-1 text-slate-500" />
              {t('btnBack')}
            </Link>
            <h1 className="text-2xl font-black text-slate-950 uppercase tracking-wide">
              {t('imageSectionTitle')}
            </h1>
          </div>

          {/* Progress bar: Step 3 of 5 (Images) */}
          <ProgressBar currentStep={3} />

          {/* Image Uploader panel */}
          <div className="py-4">
            <ImageUploader />
          </div>

          {/* Action buttons */}
          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-slate-950 hover:bg-slate-900 transition-all shadow-md shadow-slate-950/20 hover:scale-[1.02] cursor-pointer"
            >
              {t('btnContinue')}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 border-t border-slate-200 text-center text-slate-500 text-xs font-semibold uppercase tracking-wider">
        {t('footerCopyright')}
      </footer>
    </div>
  );
}
