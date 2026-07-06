import React, { useRef } from 'react';
import { Image, Camera } from 'lucide-react';

interface UploadButtonProps {
  onSelect: (files: FileList) => void;
  disabled?: boolean;
}

export default function UploadButton({ onSelect, disabled = false }: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onSelect(e.target.files);
      // Reset input value so same files can be re-selected if deleted
      e.target.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraSelect = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
      {/* Hidden File Picker Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled}
      />

      {/* Hidden Camera Input */}
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
        disabled={disabled}
      />

      {/* Choose Files Button */}
      <button
        type="button"
        onClick={triggerFileSelect}
        disabled={disabled}
        className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold border transition-all w-full sm:w-auto ${
          disabled
            ? "border-slate-800 bg-slate-900/40 text-slate-600 cursor-not-allowed"
            : "border-blue-500/30 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:scale-105"
        }`}
      >
        <Image className="h-5 w-5" />
        Choose Images
      </button>

      {/* Camera Capture Button */}
      <button
        type="button"
        onClick={triggerCameraSelect}
        disabled={disabled}
        className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold border transition-all w-full sm:w-auto ${
          disabled
            ? "border-slate-800 bg-slate-900/40 text-slate-600 cursor-not-allowed"
            : "border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900/80 text-slate-300 hover:text-white"
        }`}
      >
        <Camera className="h-5 w-5" />
        Open Camera
      </button>
    </div>
  );
}
