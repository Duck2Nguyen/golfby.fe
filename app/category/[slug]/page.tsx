'use client';

import { useMemo, useState } from 'react';
import { X, ChevronRight, SlidersHorizontal } from 'lucide-react';

import Link from 'next/link';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { CategorySidebar } from '@/components/CategorySidebar';
import { ProductListCard } from '@/components/ProductListCard';
import { type ViewMode, CategoryToolbar } from '@/components/CategoryToolbar';
import {
  shaftProducts,
  flexFilters as initialFlexFilters,
  brandFilters as initialBrandFilters,
  weightFilters as initialWeightFilters,
  materialFilters as initialMaterialFilters,
} from '@/components/category-mock-data';

export default function CategoryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid-4');
  const [sortBy, setSortBy] = useState('featured');
  const [perPage, setPerPage] = useState(20);
  const [visibleCount, setVisibleCount] = useState(20);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 8000000 });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState([
    { title: 'Hãng', options: [...initialBrandFilters] },
    { title: 'Độ cứng (Flex)', options: [...initialFlexFilters] },
    { title: 'Chất liệu', options: [...initialMaterialFilters] },
    { title: 'Trọng lượng', options: [...initialWeightFilters] },
  ]);

  const handleFilterChange = (sectionTitle: string, label: string, checked: boolean) => {
    setFilters(prev =>
      prev.map(section =>
        section.title === sectionTitle
          ? {
              ...section,
              options: section.options.map(opt => (opt.label === label ? { ...opt, checked } : opt)),
            }
          : section,
      ),
    );
  };

  // Active filters count
  const activeFilterCount = filters.reduce(
    (count, section) => count + section.options.filter(o => o.checked).length,
    0,
  );

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...shaftProducts];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
        sorted.sort((a, b) => b.id - a.id);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return sorted;
  }, [sortBy]);

  const displayedProducts = sortedProducts.slice(0, visibleCount);
  const totalProducts = shaftProducts.length;
  const hasMore = visibleCount < totalProducts;

  const gridCols =
    {
      'grid-2': 'grid-cols-1 sm:grid-cols-2',
      'grid-3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      'grid-4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      list: 'grid-cols-1',
    }[viewMode as string] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  const sidebarContent = (
    <CategorySidebar
      priceRange={priceRange}
      maxPrice={8000000}
      onPriceChange={setPriceRange}
      filters={filters}
      onFilterChange={handleFilterChange}
    />
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 py-4 text-[1.3rem]">
          <Link href="/" className="text-muted-foreground transition-colors hover:text-primary">
            Trang Chủ
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          <span className="text-foreground" style={{ fontWeight: 500 }}>
            Shaft Gậy
          </span>
        </nav>

        <div className="flex gap-8 pb-16">
          {/* Sidebar - Desktop */}
          <div className="hidden w-[260px] shrink-0 lg:block">
            <div className="sticky top-[140px]">{sidebarContent}</div>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl transition-colors hover:bg-primary-dark lg:hidden"
          >
            <SlidersHorizontal className="h-5 w-5" />
            {activeFilterCount > 0 && (
              <span
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[1rem] text-white"
                style={{ fontWeight: 700 }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilterOpen(false)} />
              <div className="absolute bottom-0 left-0 top-0 w-[320px] max-w-[85vw] overflow-y-auto bg-white shadow-2xl">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-5 py-4">
                  <h3 className="text-[1.6rem] text-foreground" style={{ fontWeight: 600 }}>
                    Bộ Lọc
                  </h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-5">{sidebarContent}</div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="min-w-0 flex-1">
            {/* Title */}
            <div className="mb-6">
              <h1 className="mb-1 text-[2.8rem] text-foreground" style={{ fontWeight: 700 }}>
                Shaft Gậy
              </h1>
              <p className="text-[1.4rem] text-muted-foreground">
                Shaft chính hãng từ các thương hiệu hàng đầu thế giới — Graphite Design, Fujikura, NSPRO và
                nhiều hơn nữa
              </p>
            </div>

            {/* Active Filters Tags */}
            {activeFilterCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-[1.3rem] text-muted-foreground" style={{ fontWeight: 500 }}>
                  Đang lọc:
                </span>
                {filters.flatMap(section =>
                  section.options
                    .filter(o => o.checked)
                    .map(opt => (
                      <button
                        key={`${section.title}-${opt.label}`}
                        onClick={() => handleFilterChange(section.title, opt.label, false)}
                        className="flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1.5 text-[1.2rem] text-primary transition-colors hover:bg-primary hover:text-white"
                        style={{ fontWeight: 500 }}
                      >
                        {opt.label}
                        <X className="h-3 w-3" />
                      </button>
                    )),
                )}
                <button
                  onClick={() =>
                    setFilters(prev =>
                      prev.map(s => ({
                        ...s,
                        options: s.options.map(o => ({ ...o, checked: false })),
                      })),
                    )
                  }
                  className="ml-1 text-[1.2rem] text-destructive hover:underline"
                  style={{ fontWeight: 500 }}
                >
                  Xóa tất cả
                </button>
              </div>
            )}

            {/* Toolbar */}
            <CategoryToolbar
              totalProducts={totalProducts}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
              perPage={perPage}
              onPerPageChange={n => {
                setPerPage(n);
                setVisibleCount(n);
              }}
            />

            {/* Product Grid / List */}
            {viewMode === 'list' ? (
              <div className="space-y-4">
                {displayedProducts.map(product => (
                  <ProductListCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className={`grid ${gridCols} gap-5`}>
                {displayedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination / Load More */}
            <div className="mt-10 flex flex-col items-center gap-4">
              {/* Progress */}
              <div className="text-center">
                <p className="mb-2 text-[1.3rem] text-muted-foreground">
                  Đang hiển thị{' '}
                  <span style={{ fontWeight: 600 }} className="text-foreground">
                    1-{Math.min(visibleCount, totalProducts)}
                  </span>{' '}
                  của{' '}
                  <span style={{ fontWeight: 600 }} className="text-foreground">
                    {totalProducts}
                  </span>{' '}
                  sản phẩm
                </p>
                <div className="mx-auto h-1 w-48 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{
                      width: `${(Math.min(visibleCount, totalProducts) / totalProducts) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {hasMore && (
                <button
                  onClick={() => setVisibleCount(prev => prev + perPage)}
                  className="h-12 rounded-xl border-2 border-border px-10 text-[1.4rem] text-foreground transition-colors hover:border-primary hover:text-primary"
                  style={{ fontWeight: 600 }}
                >
                  Hiển Thị Thêm
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
