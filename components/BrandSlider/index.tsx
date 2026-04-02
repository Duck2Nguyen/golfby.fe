'use client';

import { useBrands } from '@/hooks/useBrands';

export function BrandSlider() {
  const { getAllBrands } = useBrands();

  const brands = (getAllBrands.data?.data ?? []).slice(0, 8);

  return (
    <section className="bg-muted border-y border-border">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-foreground/50 text-[1.3rem] font-500 mb-6 uppercase tracking-widest">
          Thương hiệu ưa chuộng
        </p>
        <div className="flex items-center justify-center flex-wrap gap-8 md:gap-14">
          {brands.map(brand => (
            <div key={brand.id} className="group cursor-pointer transition-all">
              <span className="text-[1.8rem] md:text-[2.2rem] text-foreground font-700 group-hover:text-primary transition-colors tracking-tight select-none">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
