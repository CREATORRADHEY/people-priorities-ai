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
    <div className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden p-2.5 shadow-sm hover:border-slate-950 transition-all group font-sans">
      {/* Thumbnail */}
      <div className="aspect-square w-full overflow-hidden bg-slate-50 flex items-center justify-center relative rounded-xl border border-slate-100">
        <img
          src={previewUrl}
          alt={fileName}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
        />
        {/* Overlay with Delete button */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove image"
            className="p-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white transition-all transform scale-90 group-hover:scale-100 cursor-pointer shadow-md shadow-rose-900/10"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Info footer */}
      <div className="pt-3 px-1 flex flex-col space-y-0.5">
        <span className="text-[11px] font-black text-slate-800 truncate" title={fileName}>
          {fileName}
        </span>
        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">
          {formatSize(fileSize)}
        </span>
      </div>
    </div>
  );
}
