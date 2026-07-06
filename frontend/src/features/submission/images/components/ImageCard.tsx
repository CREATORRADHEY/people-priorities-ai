import { Trash2 } from 'lucide-react';

interface ImageCardProps {
  previewUrl: string;
  fileName: string;
  fileSize: number;
  onRemove: () => void;
}

export default function ImageCard({
  previewUrl,
  fileName,
  fileSize,
  onRemove
}: ImageCardProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="relative group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700 transition-all">
      {/* Thumbnail */}
      <div className="aspect-square w-full overflow-hidden bg-slate-950 flex items-center justify-center relative">
        <img
          src={previewUrl}
          alt={fileName}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Overlay with Delete button on hover */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove image"
            className="p-3 rounded-full bg-red-600 hover:bg-red-500 text-white transition-colors transform scale-90 group-hover:scale-100 duration-300"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Info footer */}
      <div className="p-3 bg-slate-900 border-t border-slate-800/80 flex flex-col space-y-0.5">
        <span className="text-xs font-semibold text-slate-200 truncate" title={fileName}>
          {fileName}
        </span>
        <span className="text-[10px] text-slate-500 font-medium">
          {formatSize(fileSize)}
        </span>
      </div>
    </div>
  );
}
