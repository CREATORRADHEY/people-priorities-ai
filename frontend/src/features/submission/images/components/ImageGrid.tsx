import { SubmissionImage } from '../../types/submissionDraft';
import { ImagePreview } from '../types/image';
import ImageCard from './ImageCard';

interface ImageGridProps {
  images: SubmissionImage[];
  previews: ImagePreview[];
  onRemove: (id: string) => void;
}

export default function ImageGrid({
  images,
  previews,
  onRemove
}: ImageGridProps) {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
      {images.map((img) => {
        const preview = previews.find((p) => p.id === img.id);
        if (!preview) return null;

        return (
          <ImageCard
            key={img.id}
            previewUrl={preview.previewUrl}
            fileName={img.file.name}
            fileSize={img.size}
            onRemove={() => onRemove(img.id)}
          />
        );
      })}
    </div>
  );
}
