import { useState, useEffect, useRef, useCallback } from 'react';
import { useSubmissionDraft } from '../../hooks/useSubmissionDraft';
import { SubmissionImage } from '../../types/submissionDraft';
import { ImagePreview } from '../types/image';

const MAX_IMAGES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function useImageUpload() {
  const { draft, updateDraft } = useSubmissionDraft();
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const previewsRef = useRef<ImagePreview[]>([]);
  previewsRef.current = previews;

  // Revoke object URLs on component unmount
  useEffect(() => {
    return () => {
      previewsRef.current.forEach((prev) => {
        URL.revokeObjectURL(prev.previewUrl);
      });
    };
  }, []);

  // Synchronize draft.images with local preview URLs
  useEffect(() => {
    const currentImages = draft.images || [];

    // Revoke URLs for removed images
    previews.forEach((prev) => {
      const stillExists = currentImages.some((img) => img.id === prev.id);
      if (!stillExists) {
        URL.revokeObjectURL(prev.previewUrl);
      }
    });

    // Map new previews list
    const updatedPreviews = currentImages.map((img) => {
      const existing = previews.find((p) => p.id === img.id);
      if (existing) {
        return existing;
      }
      return {
        id: img.id,
        previewUrl: URL.createObjectURL(img.file),
      };
    });

    setPreviews(updatedPreviews);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.images]);

  // Add images to the draft
  const addImages = useCallback((filesList: FileList | File[]) => {
    setValidationError(null);
    const files = Array.from(filesList);
    const currentImages = draft.images || [];

    if (currentImages.length >= MAX_IMAGES) {
      setValidationError(`Maximum of ${MAX_IMAGES} images allowed.`);
      return;
    }

    const newImagesToAppend: SubmissionImage[] = [];

    for (const file of files) {
      if (currentImages.length + newImagesToAppend.length >= MAX_IMAGES) {
        setValidationError(`Some images were skipped. Maximum limit of ${MAX_IMAGES} images reached.`);
        break;
      }

      // 1. Validation: Allowed mimeTypes
      if (!ALLOWED_TYPES.includes(file.type)) {
        setValidationError(`Invalid file type "${file.name}". Allowed formats: JPG, PNG, WEBP.`);
        continue;
      }

      // 2. Validation: Maximum file size (5MB)
      if (file.size > MAX_FILE_SIZE) {
        setValidationError(`File "${file.name}" exceeds the 5 MB limit.`);
        continue;
      }

      // 3. Validation: Rejection of zero-byte files
      if (file.size === 0) {
        setValidationError(`File "${file.name}" is empty (0 bytes) and was rejected.`);
        continue;
      }

      // 4. Validation: Avoid duplicate files (same name, size, type)
      const isDuplicate = currentImages.some(
        (img) =>
          img.file.name === file.name &&
          img.file.size === file.size &&
          img.file.type === file.type
      ) || newImagesToAppend.some(
        (img) =>
          img.file.name === file.name &&
          img.file.size === file.size &&
          img.file.type === file.type
      );

      if (isDuplicate) {
        continue; // silently ignore duplicate
      }

      // Create unique ID based on file metadata and timestamp
      const id = `${file.name}-${file.size}-${Date.now()}`;
      newImagesToAppend.push({
        id,
        file,
        mimeType: file.type,
        size: file.size,
      });
    }

    if (newImagesToAppend.length > 0) {
      updateDraft((prev) => ({
        ...prev,
        // Preserve image insertion order
        images: [...(prev.images || []), ...newImagesToAppend],
      }));
    }
  }, [draft.images, updateDraft]);

  // Remove image from the draft
  const removeImage = useCallback((id: string) => {
    setValidationError(null);
    updateDraft((prev) => ({
      ...prev,
      images: (prev.images || []).filter((img) => img.id !== id),
    }));
  }, [updateDraft]);

  return {
    images: draft.images || [],
    previews,
    validationError,
    addImages,
    removeImage,
  };
}
