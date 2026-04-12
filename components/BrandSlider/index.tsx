'use client';

import { useState, useEffect } from 'react';
import { useKeenSlider } from 'keen-slider/react';

import Image from 'next/image';

import { useBrands } from '@/hooks/useBrands';

const INITIAL_VISIBLE_BRANDS = 6;

export function BrandSlider() {
  const { getAllBrands } = useBrands();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxSlide, setMaxSlide] = useState(0);
  const [mobileSlidesPerView, setMobileSlidesPerView] = useState(2);

  const allBrands = getAllBrands.data?.data ?? [];
  const hasMoreBrands = allBrands.length > INITIAL_VISIBLE_BRANDS;
  const desktopBrands = isExpanded ? allBrands : allBrands.slice(0, INITIAL_VISIBLE_BRANDS);

  const [sliderRef, sliderInstanceRef] = useKeenSlider<HTMLDivElement>({
    breakpoints: {
      '(min-width: 520px)': {
        slides: {
          perView: 3,
          spacing: 12,
        },
      },
    },
    created(slider) {
      setMaxSlide(slider.track.details.maxIdx);
    },
    mode: 'snap',
    rubberband: false,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    slides: {
      perView: 2,
      spacing: 12,
    },
    updated(slider) {
      const sliderMaxIdx = slider.track.details.maxIdx;

      setMaxSlide(sliderMaxIdx);
      setCurrentSlide(prev => Math.min(prev, sliderMaxIdx));
    },
  });

  useEffect(() => {
    const mobileBreakpoint = window.matchMedia('(min-width: 520px)');

    const updateSlidesPerView = () => {
      setMobileSlidesPerView(mobileBreakpoint.matches ? 3 : 2);
    };

    updateSlidesPerView();
    mobileBreakpoint.addEventListener('change', updateSlidesPerView);

    return () => {
      mobileBreakpoint.removeEventListener('change', updateSlidesPerView);
    };
  }, []);

  useEffect(() => {
    sliderInstanceRef.current?.update();
  }, [allBrands.length, sliderInstanceRef]);

  const mobilePageCount = Math.ceil((maxSlide + 1) / mobileSlidesPerView);
  const currentMobilePage = Math.floor(currentSlide / mobileSlidesPerView);

  return (
    <section className="border-y border-border">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-foreground/50 text-[1.3rem] font-500 mb-6 uppercase tracking-widest">
          Thương hiệu ưa chuộng
        </p>
        <div className="md:hidden">
          <div ref={sliderRef} className="keen-slider">
            {allBrands.map(brand => {
              const logoSrc = brand.image?.url || brand.logoUrl;

              return (
                <div
                  key={brand.id}
                  className="keen-slider__slide group flex h-[6.5rem] cursor-pointer items-center justify-center rounded-lg p-3 transition-all"
                  title={brand.name}
                >
                  {logoSrc ? (
                    <div className="relative h-full w-full">
                      <Image
                        alt={brand.name}
                        className="object-contain"
                        fill
                        sizes="(max-width: 768px) 120px, 140px"
                        src={logoSrc}
                      />
                    </div>
                  ) : (
                    <span className="line-clamp-1 text-center text-[1.4rem] font-600 text-foreground/80">
                      {brand.name}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {mobilePageCount > 1 ? (
            <div className="mt-4 flex items-center justify-center gap-2">
              {Array.from({ length: mobilePageCount }).map((_, index) => (
                <button
                  key={`brand-slider-dot-${index}`}
                  aria-label={`Chuyển đến nhóm thương hiệu ${index + 1}`}
                  className={[
                    'h-2 w-2 rounded-full transition-colors',
                    currentMobilePage === index ? 'bg-primary' : 'bg-foreground/25',
                  ].join(' ')}
                  onClick={() => sliderInstanceRef.current?.moveToIdx(index * mobileSlidesPerView)}
                  type="button"
                />
              ))}
            </div>
          ) : null}
        </div>

        <div
          className={[
            'hidden items-center gap-14 md:flex',
            isExpanded ? 'justify-center flex-wrap' : 'justify-center',
          ].join(' ')}
        >
          {desktopBrands.map(brand => {
            const logoSrc = brand.image?.url || brand.logoUrl;

            return (
              <div
                key={brand.id}
                className="group flex h-[6.5rem] w-[14rem] shrink-0 cursor-pointer items-center justify-center rounded-lg p-3 transition-all hover:-translate-y-0.5"
                title={brand.name}
              >
                {logoSrc ? (
                  <div className="relative h-full w-full">
                    <Image
                      alt={brand.name}
                      className="object-contain"
                      fill
                      sizes="(max-width: 768px) 120px, 140px"
                      src={logoSrc}
                    />
                  </div>
                ) : (
                  <span className="line-clamp-1 text-center text-[1.4rem] font-600 text-foreground/80">
                    {brand.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {hasMoreBrands ? (
          <div className="mt-6 hidden justify-center md:flex">
            <button
              className="rounded-full border border-border px-4 py-2 text-[1.3rem] font-600 text-foreground transition-colors hover:bg-white"
              onClick={() => setIsExpanded(prev => !prev)}
              type="button"
            >
              {isExpanded ? 'Thu gọn' : 'Xem thêm'}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
