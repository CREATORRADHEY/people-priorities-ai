import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Camera, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SubmissionImage } from '../../types/submissionDraft';

interface ImageSummaryProps {
  images?: SubmissionImage[];
}

interface ImagePreviewUrl {
  id: string;
  url: string;
}

export default function ImageSummary({ images = [] }: ImageSummaryProps) {
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
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-md text-left relative overflow-hidden">
      {/* Header and status badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-blue-400" />
          <h3 className="font-bold text-white text-base">3. Photo Evidence</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold">
          {hasImages ? (
            <span className="inline-flex items-center gap-1 text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              ✅ Images ({images.length})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="h-3.5 w-3.5" />
              ⚠️ Images (Optional)
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
              <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
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
        <p className="text-slate-500 text-sm italic">No supporting photos attached.</p>
      )}

      {/* Edit Link Action */}
      <div className="flex justify-end pt-2">
        <Link
          to="/submit/images"
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <Edit2 className="h-3.5 w-3.5" />
          Edit Photo Evidence
        </Link>
      </div>
    </div>
  );
}
