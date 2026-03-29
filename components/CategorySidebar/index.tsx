'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

import { FormCheckbox } from '@/elements/FormCheckbox';

interface FilterSection {
  title: string;
  options: { label: string; count: number; checked?: boolean }[];
}

interface PriceRange {
  min: number;
  max: number;
}

interface CategorySidebarProps {
  priceRange: PriceRange;
  maxPrice: number;
  onPriceChange: (range: PriceRange) => void;
  filters: FilterSection[];
  onFilterChange: (sectionTitle: string, label: string, checked: boolean) => void;
}

function PriceSlider({
  min,
  max,
  maxPrice,
  onChange,
}: {
  min: number;
  max: number;
  maxPrice: number;
  onChange: (range: PriceRange) => void;
}) {
  const formatVND = (v: number) => new Intl.NumberFormat('vi-VN').format(v);

  const minPercent = (min / maxPrice) * 100;
  const maxPercent = (max / maxPrice) * 100;

  return (
    <div className="space-y-4">
      {/* Dual range visual */}
      <div className="relative mt-2 h-2 rounded-full bg-gray-200">
        <div
          className="absolute h-full rounded-full bg-primary"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={100000}
          value={min}
          onChange={e => onChange({ min: Math.min(Number(e.target.value), max - 100000), max })}
          className="pointer-events-none absolute h-2 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:flex-shrink-0 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
          style={{ top: 0 }}
        />
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={100000}
          value={max}
          onChange={e => onChange({ min, max: Math.max(Number(e.target.value), min + 100000) })}
          className="pointer-events-none absolute h-2 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:flex-shrink-0 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
          style={{ top: 0 }}
        />
      </div>

      {/* Price inputs */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="flex h-10 items-center rounded-lg border border-border bg-[#f8f8f8] px-3">
            <span className="mr-1 text-[1.2rem] text-muted-foreground">₫</span>
            <input
              type="text"
              value={formatVND(min)}
              readOnly
              className="w-full bg-transparent text-[1.3rem] text-foreground outline-none"
            />
          </div>
        </div>
        <span className="text-[1.3rem] text-muted-foreground">—</span>
        <div className="flex-1">
          <div className="flex h-10 items-center rounded-lg border border-border bg-[#f8f8f8] px-3">
            <span className="mr-1 text-[1.2rem] text-muted-foreground">₫</span>
            <input
              type="text"
              value={formatVND(max)}
              readOnly
              className="w-full bg-transparent text-[1.3rem] text-foreground outline-none"
            />
          </div>
        </div>
      </div>

      <button
        className="h-10 w-full rounded-xl bg-primary text-[1.3rem] text-white transition-colors hover:bg-primary-dark"
        style={{ fontWeight: 600 }}
      >
        Áp Dụng
      </button>
    </div>
  );
}

function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-5 border-b border-border/60 pb-5 last:mb-0 last:border-b-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="mb-3 flex w-full items-center justify-between text-left"
      >
        <span className="text-[1.4rem] uppercase tracking-wide text-foreground" style={{ fontWeight: 600 }}>
          {title}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {open && <div className="space-y-2.5">{children}</div>}
    </div>
  );
}

export function CategorySidebar({
  priceRange,
  maxPrice,
  onPriceChange,
  filters,
  onFilterChange,
}: CategorySidebarProps) {
  return (
    <aside className="w-full">
      {/* Price Filter */}
      <CollapsibleSection title="Giá">
        <PriceSlider min={priceRange.min} max={priceRange.max} maxPrice={maxPrice} onChange={onPriceChange} />
      </CollapsibleSection>

      {/* Dynamic Filters */}
      {filters.map(section => (
        <CollapsibleSection key={section.title} title={section.title}>
          {section.options.map(option => (
            <div key={option.label} className="flex items-center justify-between">
              <FormCheckbox
                label={option.label}
                checked={option.checked || false}
                onCheckedChange={checked => onFilterChange(section.title, option.label, checked)}
              />
              <span className="text-[1.2rem] text-muted-foreground">({option.count})</span>
            </div>
          ))}
        </CollapsibleSection>
      ))}
    </aside>
  );
}
