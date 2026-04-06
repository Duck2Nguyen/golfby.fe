'use client';

import { useState } from 'react';

import Image from 'next/image';

import { useBrands } from '@/hooks/useBrands';

const INITIAL_VISIBLE_BRANDS = 6;

export function BrandSlider() {
  const { getAllBrands } = useBrands();
  const [isExpanded, setIsExpanded] = useState(false);

  const allBrands = getAllBrands.data?.data ?? [];
  const hasMoreBrands = allBrands.length > INITIAL_VISIBLE_BRANDS;
  const brands = isExpanded ? allBrands : allBrands.slice(0, INITIAL_VISIBLE_BRANDS);

  return (
    <section className="border-y border-border">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-foreground/50 text-[1.3rem] font-500 mb-6 uppercase tracking-widest">
          Thương hiệu ưa chuộng
        </p>
        <div
          className={[
            'flex items-center gap-8 md:gap-14',
            isExpanded
              ? 'justify-center flex-wrap'
              : 'justify-start md:justify-center flex-nowrap overflow-x-auto',
          ].join(' ')}
        >
          {brands.map(brand => {
            const logoSrc = brand.image?.url || brand.logoUrl;

            return (
              <div
                key={brand.id}
                className="group cursor-pointer flex h-[6.5rem] w-[14rem] items-center justify-center rounded-lg p-3 transition-all hover:-translate-y-0.5"
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
          <div className="mt-6 flex justify-center">
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
