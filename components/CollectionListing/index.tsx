'use client';

import { useMemo, useState, useEffect } from 'react';
import { X, ChevronRight, SlidersHorizontal } from 'lucide-react';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { useCollections } from '@/hooks/useCollections';
import { useBrands, type Brand } from '@/hooks/useBrands';
import { useProducts, type GetAllProductsParams } from '@/hooks/useProducts';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { ProductListCard } from '@/components/ProductListCard';
import { CategorySidebar } from '@/components/CategorySidebar';
import { type ViewMode, CategoryToolbar } from '@/components/CategoryToolbar';

import {
  toSlug,
  type PriceRange,
  DEFAULT_MAX_PRICE,
  DEFAULT_MIN_PRICE,
  DEFAULT_PAGE_SIZE,
  buildBaseBreadcrumbs,
  normalizeSlugSegments,
  resolveCollectionRoute,
  buildCollectionRouteMap,
  mapApiProductToCardData,
} from './utils';

interface CollectionListingProps {
  slugSegments?: string[];
}

export default function CollectionListing({ slugSegments = [] }: CollectionListingProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<ViewMode>('grid-4');
  const [sortBy, setSortBy] = useState('featured');
  const [perPage, setPerPage] = useState(20);
  const [visibleCount, setVisibleCount] = useState(20);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string | null>(() =>
    toSlug(searchParams.get('brand')),
  );
  const [priceRange, setPriceRange] = useState<PriceRange>({
    max: DEFAULT_MAX_PRICE,
    min: DEFAULT_MIN_PRICE,
  });

  const { getAllBrands } = useBrands();
  const { getAllCollections } = useCollections();
  const normalizedSlugs = useMemo(() => normalizeSlugSegments(slugSegments), [slugSegments]);
  const brands = getAllBrands.data?.data ?? [];

  useEffect(() => {
    const brandFromUrl = toSlug(searchParams.get('brand'));

    setSelectedBrandSlug(current => (current === brandFromUrl ? current : brandFromUrl));
  }, [searchParams]);

  const selectedBrand = useMemo<Brand | undefined>(() => {
    if (!selectedBrandSlug) {
      return undefined;
    }

    return brands.find(brand => brand.slug === selectedBrandSlug);
  }, [brands, selectedBrandSlug]);

  useEffect(() => {
    if (!getAllBrands.isLoading && selectedBrandSlug && !selectedBrand) {
      setSelectedBrandSlug(null);
    }
  }, [getAllBrands.isLoading, selectedBrand, selectedBrandSlug]);

  useEffect(() => {
    const currentQuery = searchParams.toString();
    const nextSearchParams = new URLSearchParams(currentQuery);

    nextSearchParams.delete('minPrice');
    nextSearchParams.delete('maxPrice');

    if (selectedBrandSlug) {
      nextSearchParams.set('brand', selectedBrandSlug);
    } else {
      nextSearchParams.delete('brand');
    }

    if (priceRange.min > DEFAULT_MIN_PRICE) {
      nextSearchParams.set('fromPrice', String(priceRange.min));
    } else {
      nextSearchParams.delete('fromPrice');
    }

    if (priceRange.max < DEFAULT_MAX_PRICE) {
      nextSearchParams.set('toPrice', String(priceRange.max));
    } else {
      nextSearchParams.delete('toPrice');
    }

    const nextQuery = nextSearchParams.toString();

    if (nextQuery === currentQuery) {
      return;
    }

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [pathname, priceRange.max, priceRange.min, router, searchParams, selectedBrandSlug]);

  const collectionRouteMap = useMemo(() => {
    const collections = getAllCollections.data?.data ?? [];
    return buildCollectionRouteMap(collections);
  }, [getAllCollections.data?.data]);

  const resolvedRoute = useMemo(() => {
    return resolveCollectionRoute(collectionRouteMap, normalizedSlugs);
  }, [collectionRouteMap, normalizedSlugs]);

  const canFetchProducts = useMemo(() => {
    if (normalizedSlugs.length === 0) {
      return true;
    }

    if (getAllCollections.isLoading) {
      return false;
    }

    return Boolean(resolvedRoute);
  }, [getAllCollections.isLoading, normalizedSlugs.length, resolvedRoute]);

  const queryParams = useMemo<GetAllProductsParams | undefined>(() => {
    if (!canFetchProducts) {
      return undefined;
    }

    const hasPriceFilter = priceRange.min > DEFAULT_MIN_PRICE || priceRange.max < DEFAULT_MAX_PRICE;

    return {
      ...(selectedBrand?.id ? { brandId: selectedBrand.id } : {}),
      ...(hasPriceFilter ? { fromPrice: priceRange.min, toPrice: priceRange.max } : {}),
      page: 1,
      size: DEFAULT_PAGE_SIZE,
      ...(resolvedRoute?.params ?? {}),
    };
  }, [canFetchProducts, priceRange.max, priceRange.min, resolvedRoute?.params, selectedBrand?.id]);

  const { getAllProducts } = useProducts({
    enabled: canFetchProducts,
    getAllParams: queryParams,
  });

  const products = useMemo(() => {
    const items = getAllProducts.data?.data?.items ?? [];
    return items.map(mapApiProductToCardData);
  }, [getAllProducts.data?.data?.items]);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];

    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        break;
    }

    return sorted;
  }, [products, sortBy]);

  const displayedProducts = sortedProducts.slice(0, visibleCount);
  const totalProducts = sortedProducts.length;
  const hasMore = visibleCount < totalProducts;
  const hasPriceFilter = priceRange.min !== DEFAULT_MIN_PRICE || priceRange.max !== DEFAULT_MAX_PRICE;
  const activeFilterCount = (selectedBrand ? 1 : 0) + (hasPriceFilter ? 1 : 0);

  const gridCols =
    {
      'grid-2': 'grid-cols-1 sm:grid-cols-2',
      'grid-3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      'grid-4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      list: 'grid-cols-1',
    }[viewMode as string] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  const filterSections = useMemo(
    () => [
      {
        options: brands.map(brand => ({
          checked: brand.slug === selectedBrandSlug,
          count: 0,
          label: brand.name,
        })),
        title: 'Hãng',
      },
    ],
    [brands, selectedBrandSlug],
  );

  const handleFilterChange = (sectionTitle: string, label: string, checked: boolean) => {
    if (sectionTitle !== 'Hãng') {
      return;
    }

    const matchedBrand = brands.find(brand => brand.name === label);

    if (!matchedBrand) {
      return;
    }

    setSelectedBrandSlug(current => {
      if (!checked && current === matchedBrand.slug) {
        return null;
      }

      return checked ? matchedBrand.slug : current;
    });
  };

  const sidebarContent = (
    <CategorySidebar
      filters={filterSections}
      maxPrice={DEFAULT_MAX_PRICE}
      onFilterChangeAction={handleFilterChange}
      onPriceChangeAction={setPriceRange}
      priceRange={priceRange}
      showCount={false}
    />
  );

  useEffect(() => {
    setVisibleCount(perPage);
  }, [perPage, priceRange.max, priceRange.min, selectedBrandSlug, sortBy, resolvedRoute?.title]);

  const shownCount = Math.min(visibleCount, totalProducts);
  const shownRangeText = totalProducts === 0 ? '0' : `1-${shownCount}`;
  const progressPercent = totalProducts > 0 ? (shownCount / totalProducts) * 100 : 0;
  const showRouteNotFound = !getAllCollections.isLoading && !resolvedRoute && normalizedSlugs.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4">
        {getAllCollections.isLoading ? (
          <div className="py-20 text-center text-[1.4rem] text-muted-foreground">Đang tải dữ liệu...</div>
        ) : showRouteNotFound ? (
          <div className="py-20 text-center">
            <h1 className="text-[2.4rem] text-foreground font-700 mb-3">Không tìm thấy danh mục</h1>
            <p className="text-[1.4rem] text-muted-foreground mb-6">
              Đường dẫn không tồn tại hoặc đã được thay đổi.
            </p>
            <Link href="/collection" className="text-[1.4rem] text-primary" style={{ fontWeight: 600 }}>
              Quay về trang sản phẩm
            </Link>
          </div>
        ) : (
          <>
            <nav className="flex items-center gap-1.5 overflow-x-auto py-4 text-[1.3rem]">
              {(resolvedRoute?.breadcrumbs ?? buildBaseBreadcrumbs()).map((item, index, array) => (
                <div key={`${item.href}-${item.label}`} className="flex items-center gap-1.5">
                  {index === array.length - 1 ? (
                    <span className="whitespace-nowrap text-foreground" style={{ fontWeight: 500 }}>
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="whitespace-nowrap text-muted-foreground transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  )}
                  {index < array.length - 1 && (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                  )}
                </div>
              ))}
            </nav>

            <div className="flex gap-8 pb-16">
              <div className="hidden w-[260px] shrink-0 lg:block">
                <div className="sticky top-[140px]">{sidebarContent}</div>
              </div>

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

              <div className="min-w-0 flex-1">
                <div className="mb-6">
                  <h1 className="mb-1 text-[2.8rem] text-foreground" style={{ fontWeight: 700 }}>
                    {resolvedRoute?.title ?? 'Sản phẩm'}
                  </h1>
                  {selectedBrand && (
                    <p className="text-[1.4rem] text-muted-foreground">
                      Đang lọc theo thương hiệu:{' '}
                      <span className="text-foreground" style={{ fontWeight: 600 }}>
                        {selectedBrand.name}
                      </span>
                    </p>
                  )}
                </div>

                {activeFilterCount > 0 && (
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="text-[1.3rem] text-muted-foreground" style={{ fontWeight: 500 }}>
                      Đang lọc:
                    </span>
                    {selectedBrand && (
                      <button
                        onClick={() => setSelectedBrandSlug(null)}
                        className="flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1.5 text-[1.2rem] text-primary transition-colors hover:bg-primary hover:text-white"
                        style={{ fontWeight: 500 }}
                      >
                        {selectedBrand.name}
                        <X className="h-3 w-3" />
                      </button>
                    )}
                    {hasPriceFilter && (
                      <button
                        onClick={() =>
                          setPriceRange({
                            max: DEFAULT_MAX_PRICE,
                            min: DEFAULT_MIN_PRICE,
                          })
                        }
                        className="flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1.5 text-[1.2rem] text-primary transition-colors hover:bg-primary hover:text-white"
                        style={{ fontWeight: 500 }}
                      >
                        {new Intl.NumberFormat('vi-VN').format(priceRange.min)} -{' '}
                        {new Intl.NumberFormat('vi-VN').format(priceRange.max)}
                        <X className="h-3 w-3" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedBrandSlug(null);
                        setPriceRange({
                          max: DEFAULT_MAX_PRICE,
                          min: DEFAULT_MIN_PRICE,
                        });
                      }}
                      className="ml-1 text-[1.2rem] text-destructive hover:underline"
                      style={{ fontWeight: 500 }}
                    >
                      Xóa tất cả
                    </button>
                  </div>
                )}

                {resolvedRoute?.description && (
                  <p className="mb-4 mt-1 text-[1.4rem] text-muted-foreground">{resolvedRoute.description}</p>
                )}

                <CategoryToolbar
                  onPerPageChange={n => {
                    setPerPage(n);
                    setVisibleCount(n);
                  }}
                  onSortChange={setSortBy}
                  onViewModeChange={setViewMode}
                  perPage={perPage}
                  sortBy={sortBy}
                  totalProducts={totalProducts}
                  viewMode={viewMode}
                />

                {getAllProducts.isLoading ? (
                  <div className="py-20 text-center text-[1.4rem] text-muted-foreground">
                    Đang tải sản phẩm...
                  </div>
                ) : viewMode === 'list' ? (
                  displayedProducts.length > 0 ? (
                    <div className="space-y-4">
                      {displayedProducts.map(product => (
                        <ProductListCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-14 text-center text-[1.4rem] text-muted-foreground">
                      Chưa có sản phẩm phù hợp với bộ lọc hiện tại.
                    </div>
                  )
                ) : displayedProducts.length > 0 ? (
                  <div className={`grid ${gridCols} gap-5`}>
                    {displayedProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-14 text-center text-[1.4rem] text-muted-foreground">
                    Chưa có sản phẩm phù hợp với bộ lọc hiện tại.
                  </div>
                )}

                <div className="mt-10 flex flex-col items-center gap-4">
                  <div className="text-center">
                    <p className="mb-2 text-[1.3rem] text-muted-foreground">
                      Đang hiển thị{' '}
                      <span className="text-foreground" style={{ fontWeight: 600 }}>
                        {shownRangeText}
                      </span>{' '}
                      của{' '}
                      <span className="text-foreground" style={{ fontWeight: 600 }}>
                        {totalProducts}
                      </span>{' '}
                      sản phẩm
                    </p>
                    <div className="mx-auto h-1 w-48 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{
                          width: `${progressPercent}%`,
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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
