'use client';

import { X, Upload, ImagePlus } from 'lucide-react';
import { useRef, useMemo, useState, useEffect } from 'react';

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface MultiUploadImageProps {
  images: string[];
  onImageFilesChangeAction: (files: File[]) => void;
  onImagesChangeAction: (images: string[]) => void;
  onThumbnailChangeAction: (thumbnail: string) => void;
  thumbnail: string;
}

export default function MultiUploadImage({
  images,
  onImageFilesChangeAction,
  onImagesChangeAction,
  onThumbnailChangeAction,
  thumbnail,
}: MultiUploadImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileByPreviewUrlRef = useRef<Map<string, File>>(new Map());

  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');

  const galleryImages = useMemo(() => images.filter(Boolean), [images]);
  const isEmptyState = !thumbnail && galleryImages.length === 0;

  const visibleThumbLimit = 7;
  const overflowCount = Math.max(0, galleryImages.length - visibleThumbLimit);
  const visibleThumbs = galleryImages.slice(0, visibleThumbLimit);

  useEffect(() => {
    if (activeGalleryIndex === null) {
      return;
    }

    if (activeGalleryIndex >= galleryImages.length) {
      setActiveGalleryIndex(galleryImages.length > 0 ? galleryImages.length - 1 : null);
    }
  }, [activeGalleryIndex, galleryImages.length]);

  const activeImage =
    thumbnail && activeGalleryIndex === null
      ? thumbnail
      : galleryImages[activeGalleryIndex ?? 0] || thumbnail || '';

  const emitSelectedFiles = (nextThumbnail: string, nextGallery: string[]) => {
    const orderedPreviewUrls = [nextThumbnail, ...nextGallery].filter(Boolean);
    const dedup = new Set<File>();

    orderedPreviewUrls.forEach(url => {
      const file = fileByPreviewUrlRef.current.get(url);
      if (file) {
        dedup.add(file);
      }
    });

    onImageFilesChangeAction(Array.from(dedup));
  };

  const removePreviewUrl = (url: string) => {
    if (!fileByPreviewUrlRef.current.has(url)) {
      return;
    }

    URL.revokeObjectURL(url);
    fileByPreviewUrlRef.current.delete(url);
  };

  const handleRemoveImage = (index: number) => {
    const nextGallery = [...galleryImages];
    const removed = nextGallery.splice(index, 1)[0];
    if (removed) {
      removePreviewUrl(removed);
    }
    onImagesChangeAction(nextGallery);
    emitSelectedFiles(thumbnail, nextGallery);

    if (activeGalleryIndex === null) {
      return;
    }

    if (activeGalleryIndex === index) {
      setActiveGalleryIndex(nextGallery.length > 0 ? Math.max(0, index - 1) : null);
      return;
    }

    if (activeGalleryIndex > index) {
      setActiveGalleryIndex(activeGalleryIndex - 1);
    }
  };

  const handleSetThumbnail = (index: number) => {
    const pickedImage = galleryImages[index];

    if (!pickedImage) {
      return;
    }

    const nextGallery = [...galleryImages];
    nextGallery.splice(index, 1);

    if (thumbnail) {
      nextGallery.unshift(thumbnail);
    }

    onThumbnailChangeAction(pickedImage);
    onImagesChangeAction(nextGallery);
    emitSelectedFiles(pickedImage, nextGallery);
    setActiveGalleryIndex(null);
  };

  const handleAddByUrl = () => {
    const imageUrl = newImageUrl.trim();

    if (!imageUrl) {
      return;
    }

    if (!thumbnail) {
      onThumbnailChangeAction(imageUrl);
      setNewImageUrl('');
      emitSelectedFiles(imageUrl, galleryImages);
      setActiveGalleryIndex(null);

      return;
    }

    onImagesChangeAction([...galleryImages, imageUrl]);
    emitSelectedFiles(thumbnail, [...galleryImages, imageUrl]);
    setNewImageUrl('');
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;

    if (!fileList || fileList.length === 0) {
      return;
    }

    const fileUrls = Array.from(fileList).map(file => URL.createObjectURL(file));
    const files = Array.from(fileList);

    fileUrls.forEach((url, index) => {
      const file = files[index];
      if (file) {
        fileByPreviewUrlRef.current.set(url, file);
      }
    });

    if (!thumbnail && fileUrls.length > 0) {
      const [first, ...rest] = fileUrls;
      onThumbnailChangeAction(first);
      onImagesChangeAction([...galleryImages, ...rest]);
      emitSelectedFiles(first, [...galleryImages, ...rest]);
      setActiveGalleryIndex(null);
    } else {
      const nextGallery = [...galleryImages, ...fileUrls];
      onImagesChangeAction(nextGallery);
      emitSelectedFiles(thumbnail, nextGallery);
    }

    event.target.value = '';
  };

  useEffect(() => {
    return () => {
      fileByPreviewUrlRef.current.forEach((_, previewUrl) => {
        URL.revokeObjectURL(previewUrl);
      });
      fileByPreviewUrlRef.current.clear();
    };
  }, []);

  return (
    <div className="space-y-3">
      {isEmptyState ? (
        <button
          className="flex h-32 w-32 items-center justify-center rounded-xl border border-dashed border-border bg-muted text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          onClick={handleOpenFilePicker}
          type="button"
        >
          <ImagePlus className="h-6 w-6" />
        </button>
      ) : (
        <div className="grid grid-cols-1 gap-2 lg:h-[34rem] lg:grid-cols-[2fr_4fr]">
          <div className="overflow-hidden rounded-xl border border-border bg-muted">
            <div className="relative aspect-square lg:aspect-auto lg:h-full">
              {activeImage && (
                <ImageWithFallback alt="Ảnh chính" className="h-full w-full object-cover" src={activeImage} />
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:h-full lg:grid-rows-2">
            {visibleThumbs.map((image, index) => {
              const isActive = activeGalleryIndex === index;
              const shouldShowOverflow = overflowCount > 0 && index === visibleThumbLimit - 1;

              return (
                <button
                  className={`group relative aspect-square overflow-hidden rounded-xl border bg-muted lg:h-full lg:aspect-auto ${
                    isActive ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                  }`}
                  key={`${image}-${index}`}
                  onClick={() => setActiveGalleryIndex(index)}
                  type="button"
                >
                  <ImageWithFallback
                    alt={`Ảnh ${index + 1}`}
                    className="h-full w-full object-cover"
                    src={image}
                  />

                  {shouldShowOverflow && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-[2rem] font-700 text-white">
                      +{overflowCount}
                    </div>
                  )}

                  <button
                    className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={event => {
                      event.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>

                  <button
                    className="absolute right-1 bottom-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[1rem] text-white opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={event => {
                      event.stopPropagation();
                      handleSetThumbnail(index);
                    }}
                    type="button"
                  >
                    Cover
                  </button>
                </button>
              );
            })}

            <button
              className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-border bg-muted text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary lg:h-full lg:aspect-auto"
              onClick={handleOpenFilePicker}
              type="button"
            >
              <ImagePlus className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <input
        accept="image/*"
        className="hidden"
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
        type="file"
      />

      <div className="flex gap-2">
        <input
          className="h-10 w-full rounded-lg bg-input-background px-4 text-[1.4rem] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          onChange={event => setNewImageUrl(event.target.value)}
          onKeyDown={event => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            handleAddByUrl();
          }}
          placeholder="Dán URL ảnh rồi Enter"
          type="text"
          value={newImageUrl}
        />
        <button
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-border px-4 text-[1.3rem] font-500 text-foreground transition-colors hover:bg-muted"
          onClick={handleAddByUrl}
          type="button"
        >
          <Upload className="h-4 w-4" />
          Thêm
        </button>
      </div>
    </div>
  );
}
