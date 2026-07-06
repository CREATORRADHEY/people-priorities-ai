import { Camera, AlertCircle, HelpCircle } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';
import UploadButton from './UploadButton';
import ImageGrid from './ImageGrid';

export default function ImageUploader() {
  const { images, previews, validationError, addImages, removeImage } = useImageUpload();

  const isLimitReached = images.length >= 3;

  return (
    <div className="flex flex-col items-center text-center space-y-8 max-w-lg mx-auto p-6 sm:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl shadow-xl">
      
      {/* Upload Header Icon */}
      <div className="p-4 rounded-full bg-blue-500/10 text-blue-400">
        <Camera className="h-10 w-10" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white">Attach Photo Evidence</h3>
        <p className="text-slate-400 text-xs sm:text-sm">
          Upload up to 3 photos of the broken infrastructure.
        </p>
      </div>

      {/* Selector Buttons */}
      <UploadButton onSelect={addImages} disabled={isLimitReached} />

      {/* Validation Message Display */}
      {validationError && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs text-left w-full animate-shake">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Image Preview Grid */}
      <ImageGrid images={images} previews={previews} onRemove={removeImage} />

      {/* Constraints List Footer */}
      <div className="w-full pt-4 border-t border-slate-800/80 flex flex-col space-y-2 text-left text-[11px] sm:text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="h-3.5 w-3.5 text-slate-600" />
          <span>Upload requirements and constraints:</span>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-[10px] sm:text-xs">
          <li>Maximum images: 3</li>
          <li>Supported formats: JPG, PNG, WEBP</li>
          <li>Maximum size: 5 MB per file</li>
        </ul>
      </div>
    </div>
  );
}
