import { Camera, AlertCircle, HelpCircle } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';
import UploadButton from './UploadButton';
import ImageGrid from './ImageGrid';
import { useLanguage } from '../../../landing/context/LanguageContext';

export default function ImageUploader() {
  const { t } = useLanguage();
  const { images, previews, validationError, addImages, removeImage } = useImageUpload();

  const isLimitReached = images.length >= 3;

  return (
    <div className="flex flex-col items-center text-center space-y-8 max-w-lg mx-auto p-6 sm:p-8 bg-[#FAF9F6] border border-slate-200 rounded-3xl shadow-sm font-sans">
      
      {/* Upload Header Icon */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 shadow-sm">
        <Camera className="h-7 w-7" />
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-extrabold text-slate-950 uppercase tracking-wider">
          {t('imageSectionTitle')}
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">
          {t('imageSubtitle')}
        </p>
      </div>

      {/* Selector Buttons */}
      <UploadButton onSelect={addImages} disabled={isLimitReached} />

      {/* Validation Message Display */}
      {validationError && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 text-rose-600 text-xs text-left w-full font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Image Preview Grid */}
      <ImageGrid images={images} previews={previews} onRemove={removeImage} />

      {/* Constraints List Footer */}
      <div className="w-full pt-4 border-t border-slate-200 flex flex-col space-y-2 text-left text-[11px] text-slate-500 font-medium">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-xs text-slate-400">
          <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
          <span>Constraints:</span>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-500">
          <li>{t('imageMaxLimit')}</li>
          <li>{t('imageSizeLimit')}</li>
          <li>Supported formats: JPG, PNG, WEBP</li>
        </ul>
      </div>
    </div>
  );
}
