'use client';

import { X, Upload, ImagePlus } from 'lucide-react';
import React, { useRef, useMemo, useState, useEffect } from 'react';

import { addToast } from '@heroui/toast';

import type { AdminProductDetailImage } from '@/hooks/admin/useAdminProduct';

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

import DeleteImageConfirmModal from '../DeleteImageConfirmModal';

interface GalleryImageItem {
  fileIndex?: number;
  imageId?: string;
  kind: 'existing' | 'new-file' | 'url';
  url: string;
  urlIndex?: number;
}

interface MultiUploadImageProps {
  /**
   * Existing images from API (when in edit mode)
   */
  existingImages?: AdminProductDetailImage[];

  /**
   * New image files or URLs
   */
  imageFiles: File[];

  /**
   * URL images list (create mode)
   */
  images?: string[];

  /**
   * Thumbnail URL (primary image)
   */
  thumbnail: string;

  /**
   * Mode: create (no API calls) or edit (with API delete/upload)
   */
  isEdit?: boolean;

  /**
   * Loading state while deleting existing image.
   */
  isDeleteLoading?: boolean;

  /**
   * Callback when new files are selected (for create mode)
   */
  onImageFilesChangeAction: (files: File[]) => void;

  /**
   * Legacy: callback when images list changes (create mode)
   */
  onImagesChangeAction?: (images: string[]) => void;

  /**
   * Callback when thumbnail changes
   */
  onThumbnailChangeAction: (thumbnail: string) => void;

  /**
   * Callback for deleting an existing image in edit mode.
   */
  onDeleteExistingImageAction?: (imageId: string) => Promise<void>;

  /**
   * Callback for uploading new image in edit mode.
   */
  onUploadExistingImageAction?: (file: File) => Promise<void>;
}

export default function MultiUploadImage({
  existingImages = [],
  imageFiles,
  images = [],
  thumbnail,
  isEdit = false,
  isDeleteLoading = false,
  onImageFilesChangeAction,
  onImagesChangeAction,
  onThumbnailChangeAction,
  onDeleteExistingImageAction,
  onUploadExistingImageAction,
}: MultiUploadImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileToPreviewUrlMapRef = useRef<Map<string, File>>(new Map());

  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    imageId?: string;
  }>({ isOpen: false });

  const galleryImages = useMemo(() => images.filter(Boolean), [images]);

  // Map file objects to preview URLs
  const newImagePreviewUrls = useMemo(() => {
    return imageFiles.map(file => {
      const existing = Array.from(fileToPreviewUrlMapRef.current.entries()).find(([_, f]) => f === file);
      if (existing) return existing[0];

      const url = URL.createObjectURL(file);
      fileToPreviewUrlMapRef.current.set(url, file);
      return url;
    });
  }, [imageFiles]);

  // Combine images for gallery display.
  const allGalleryImages = useMemo<GalleryImageItem[]>(() => {
    const existingItems: GalleryImageItem[] = existingImages
      .filter(image => Boolean(image.url))
      .map(image => ({
        imageId: image.id,
        kind: 'existing',
        url: image.url as string,
      }));

    const urlItems: GalleryImageItem[] = galleryImages.map((url, index) => ({
      kind: 'url',
      url,
      urlIndex: index,
    }));

    const fileItems: GalleryImageItem[] = newImagePreviewUrls.map((url, index) => ({
      fileIndex: index,
      kind: 'new-file',
      url,
    }));

    if (isEdit) {
      return [...existingItems, ...fileItems];
    }

    return [...urlItems, ...fileItems];
  }, [existingImages, galleryImages, isEdit, newImagePreviewUrls]);

  const visibleThumbLimit = 7;
  const overflowCount = Math.max(0, allGalleryImages.length - visibleThumbLimit);
  const visibleThumbs = allGalleryImages.slice(0, visibleThumbLimit);

  const activeImage =
    thumbnail && activeImageIndex === null
      ? thumbnail
      : allGalleryImages[activeImageIndex ?? 0]?.url || thumbnail || '';

  const isEmptyState = !thumbnail && allGalleryImages.length === 0;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      fileToPreviewUrlMapRef.current.forEach((_, url) => {
        URL.revokeObjectURL(url);
      });
      fileToPreviewUrlMapRef.current.clear();
    };
  }, []);

  // Handle gallery index out of bounds
  useEffect(() => {
    if (activeImageIndex === null) return;
    if (activeImageIndex >= allGalleryImages.length) {
      setActiveImageIndex(allGalleryImages.length > 0 ? allGalleryImages.length - 1 : null);
    }
  }, [activeImageIndex, allGalleryImages.length]);

  // ============ File & URL Management ============

  const cleanupPreviewUrl = (url: string) => {
    if (!fileToPreviewUrlMapRef.current.has(url)) return;
    URL.revokeObjectURL(url);
    fileToPreviewUrlMapRef.current.delete(url);
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const newFiles = Array.from(fileList);

    // If in edit mode, upload immediately
    if (isEdit) {
      for (const file of newFiles) {
        try {
          if (!onUploadExistingImageAction) {
            throw new Error('Missing onUploadExistingImageAction callback');
          }

          await onUploadExistingImageAction(file);
        } catch (error) {
          console.error('[ProductForm] Upload image failed:', error);
          addToast({
            color: 'danger',
            description: 'Tải ảnh thất bại',
          });
        }
      }
    } else {
      newFiles.forEach(file => {
        const previewUrl = URL.createObjectURL(file);
        fileToPreviewUrlMapRef.current.set(previewUrl, file);
      });

      // Create mode: collect files
      onImageFilesChangeAction([...imageFiles, ...newFiles]);

      if (!thumbnail) {
        const firstPreview = Array.from(fileToPreviewUrlMapRef.current.entries()).find(
          ([, file]) => file === newFiles[0],
        )?.[0];

        if (firstPreview) {
          onThumbnailChangeAction(firstPreview);
        }
      }
    }

    event.target.value = '';
  };

  const handleAddByUrl = () => {
    const imageUrl = newImageUrl.trim();
    if (!imageUrl) return;

    if (!thumbnail) {
      onThumbnailChangeAction(imageUrl);
      setNewImageUrl('');
      return;
    }

    onImagesChangeAction?.([...galleryImages, imageUrl]);
    setNewImageUrl('');
  };

  // ============ Delete Management ============

  const handleDeleteImage = async (imageId: string) => {
    if (!isEdit) return;

    try {
      if (!onDeleteExistingImageAction) {
        throw new Error('Missing onDeleteExistingImageAction callback');
      }

      await onDeleteExistingImageAction(imageId);

      if (activeImageIndex !== null) {
        setActiveImageIndex(null);
      }

      setDeleteConfirmModal({ isOpen: false });
    } catch (error) {
      console.error('[ProductForm] Delete image failed:', error);
      addToast({
        color: 'danger',
        description: 'Xóa ảnh thất bại',
      });
    }
  };

  const handleRemoveNewImage = (index: number) => {
    const imageUrl = newImagePreviewUrls[index];
    if (!imageUrl) return;

    cleanupPreviewUrl(imageUrl);
    const nextFiles = imageFiles.filter((_, i) => i !== index);
    onImageFilesChangeAction(nextFiles);

    // Adjust active index if needed
    const galleryPrefixCount = isEdit
      ? existingImages.filter(image => Boolean(image.url)).length
      : galleryImages.length;

    if (activeImageIndex === index + galleryPrefixCount) {
      const newLength = allGalleryImages.length - 1;
      setActiveImageIndex(newLength > 0 ? Math.max(0, newLength - 1) : null);
    }
  };

  // ============ Thumbnail Management ============

  const handleSetThumbnail = (index: number) => {
    const pickedImage = allGalleryImages[index];
    if (!pickedImage) return;

    onThumbnailChangeAction(pickedImage.url as string);
    setActiveImageIndex(null);
  };

  return (
    <>
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
            {/* Main Image Viewer */}
            <div className="overflow-hidden rounded-xl border border-border bg-muted">
              <div className="relative aspect-square lg:aspect-auto lg:h-full">
                {activeImage && (
                  <ImageWithFallback
                    alt="Ảnh chính"
                    className="h-full w-full object-cover"
                    src={activeImage}
                  />
                )}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:h-full lg:grid-rows-2">
              {visibleThumbs.map((imageItem, index) => {
                const isActive = activeImageIndex === index;
                const shouldShowOverflow = overflowCount > 0 && index === visibleThumbLimit - 1;

                return (
                  <button
                    className={`group relative aspect-square overflow-hidden rounded-xl border bg-muted lg:h-full lg:aspect-auto ${
                      isActive ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                    }`}
                    key={`${imageItem.kind}-${imageItem.url}`}
                    onClick={() => setActiveImageIndex(index)}
                    type="button"
                  >
                    <ImageWithFallback
                      alt={`Ảnh ${index + 1}`}
                      className="h-full w-full object-cover"
                      src={imageItem.url}
                    />

                    {shouldShowOverflow && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-[2rem] font-700 text-white">
                        +{overflowCount}
                      </div>
                    )}

                    {/* Delete Button - only for existing images in edit mode */}
                    {isEdit && imageItem.kind === 'existing' && (
                      <button
                        className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={e => {
                          e.stopPropagation();
                          setDeleteConfirmModal({
                            isOpen: true,
                            imageId: imageItem.imageId,
                          });
                        }}
                        type="button"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}

                    {/* Delete Button - for new images */}
                    {imageItem.kind === 'new-file' && (
                      <button
                        className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={e => {
                          e.stopPropagation();
                          if (typeof imageItem.fileIndex === 'number') {
                            handleRemoveNewImage(imageItem.fileIndex);
                          }
                        }}
                        type="button"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}

                    {/* Set as Thumbnail Button */}
                    <button
                      className="absolute right-1 bottom-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[1rem] text-white opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={e => {
                        e.stopPropagation();
                        handleSetThumbnail(index);
                      }}
                      type="button"
                    >
                      Bìa
                    </button>
                  </button>
                );
              })}

              {/* Add Image Button */}
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

        {!isEdit && (
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
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteImageConfirmModal
        isLoading={isDeleteLoading}
        isOpen={deleteConfirmModal.isOpen}
        onCancelAction={() => setDeleteConfirmModal({ isOpen: false })}
        onConfirmAction={() => {
          if (!deleteConfirmModal.imageId) {
            return;
          }

          handleDeleteImage(deleteConfirmModal.imageId);
        }}
      />
    </>
  );
}
