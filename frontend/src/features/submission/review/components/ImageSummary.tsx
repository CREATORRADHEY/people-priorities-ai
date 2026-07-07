import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Camera, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SubmissionImage } from '../../types/submissionDraft';
import { useLanguage } from '../../../landing/context/LanguageContext';

interface ImageSummaryProps {
  images?: SubmissionImage[];
}

interface ImagePreviewUrl {
  id: string;
  url: string;
}

export default function ImageSummary({ images = [] }: ImageSummaryProps) {
  const { t } = useLanguage();
  const [previews, setPreviews] = useState<ImagePreviewUrl[]>([]);

  useEffect(() => {
    // Generate object URLs
    const urls = images.map((img) => ({
      id: img.id,
      url: URL.createObjectURL(img.file),
    }));
    setPreviews(urls);

    // Revoke object URLs on cleanup
    return () => {
      urls.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [images]);

  const hasImages = images.length > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm text-left relative overflow-hidden font-sans">
      {/* Header and status badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-slate-800" />
          <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">3. {t('imageSectionTitle')}</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider">
          {hasImages ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Images ({images.length})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-700 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-100">
              <AlertCircle className="h-3.5 w-3.5" />
              Optional
            </span>
          )}
        </div>
      </div>

      {/* Content details */}
      {hasImages ? (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img) => {
            const preview = previews.find((p) => p.id === img.id);
            if (!preview) return null;

            return (
              <div key={img.id} className="relative group aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
                <img
                  src={preview.url}
                  alt={img.file.name}
                  className="h-full w-full object-cover"
                />
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-slate-400 text-xs italic">No supporting photos attached.</p>
      )}

      {/* Edit Link Action */}
      <div className="flex justify-end pt-2 text-[10px] font-bold uppercase tracking-wider">
        <Link
          to="/submit/images"
          className="inline-flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <Edit2 className="h-3.5 w-3.5 text-slate-500" />
          Edit Photo Evidence
        </Link>
      </div>
    </div>
  );
}
