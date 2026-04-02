'use client';

import { useState } from 'react';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface ProductGalleryProps {
  discount?: number;
  images: string[];
  productName: string;
}

export default function ProductGallery({ discount, images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const goPrev = () => setSelectedIndex(i => (i === 0 ? images.length - 1 : i - 1));
  const goNext = () => setSelectedIndex(i => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="relative group rounded-2xl overflow-hidden bg-[#fafafa] border border-border/50 mb-4">
        <div className="aspect-square relative overflow-hidden">
          <ImageWithFallback
            src={images[selectedIndex]}
            alt={`${productName} - Ảnh ${selectedIndex + 1}`}
            className={`w-full h-full object-contain transition-transform duration-500 cursor-zoom-in ${
              zoomed ? 'scale-150' : 'scale-100'
            }`}
            onClick={() => setZoomed(!zoomed)}
          />
        </div>

        {/* Zoom hint */}
        <button
          onClick={() => setZoomed(!zoomed)}
          className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Arrow Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Badge */}
        {discount && discount > 0 && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-destructive text-white rounded-lg text-[11px] uppercase tracking-wide font-700">
            -{discount}%
          </span>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
              idx === selectedIndex
                ? 'border-primary shadow-md shadow-primary/20'
                : 'border-border/50 hover:border-primary/40'
            }`}
          >
            <ImageWithFallback
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
