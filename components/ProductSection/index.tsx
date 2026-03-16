'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

import { ProductCard } from '../ProductCard';

import type { Product } from '../mock-data';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  tabs?: string[];
  bgColor?: string;
}

export function ProductSection({
  title,
  subtitle,
  products,
  tabs,
  bgColor = 'bg-white',
}: ProductSectionProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className={`${bgColor} py-14`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-7 bg-primary rounded-full" />
              <h2 className="text-[2.4rem] sm:text-[2.8rem] text-foreground" style={{ fontWeight: 700 }}>
                {title}
              </h2>
            </div>
            {subtitle && <p className="text-muted-foreground text-[1.4rem] ml-[1.9rem]">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            {/* Tabs */}
            {tabs && tabs.length > 0 && (
              <div className="flex items-center bg-muted rounded-xl p-1 gap-0.5">
                {tabs.map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(i)}
                    className={`px-4 py-2 rounded-lg text-[1.3rem] transition-all ${
                      activeTab === i
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}

            <a
              href="#"
              className="hidden sm:flex items-center gap-1.5 text-primary text-[1.4rem] hover:gap-2.5 transition-all"
              style={{ fontWeight: 500 }}
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="sm:hidden mt-6 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-primary text-[1.4rem]"
            style={{ fontWeight: 500 }}
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
