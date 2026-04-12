'use client';

import { ArrowRight } from 'lucide-react';
import { useKeenSlider } from 'keen-slider/react';
import { useMemo, useState, useEffect, type CSSProperties } from 'react';

import Image from 'next/image';
import { Link } from '@heroui/link';

import { useSWRWrapper } from '@/hooks/swr';
import { useBrands } from '@/hooks/useBrands';
import { useWishlistToggle } from '@/hooks/useWishlistToggle';
import { useAddToCartFromList } from '@/hooks/useAddToCartFromList';
import { useProducts, type ProductListItem } from '@/hooks/useProducts';
import { useCollections, type CollectionTreeNode } from '@/hooks/useCollections';
import {
  type StaticHomeItem,
  STATIC_HOME_CATEGORIES,
  STATIC_HOME_COLLECTION_DIRECTIONS,
} from '@/hooks/useStaticData';

import { METHOD } from '@/global/common';

import { ProductCard } from '../ProductCard';

import type { Product } from '../mock-data';

interface ProductSectionProps {
  bgColor?: string;
}

interface CollectionSectionBrand {
  id: string;
  logoUrl?: string | null;
  name: string;
  slug?: string | null;
}

interface ProductCardActions {
  isAddingToCart: boolean;
  isWishlisted: boolean;
  isWishlistLoading: boolean;
  onAddToCartAction: (currentProduct: Product) => void;
  onToggleWishlistAction: (currentProduct: Product) => void;
}

interface ProductCardWithActionsProps extends ProductCardActions {
  product: Product;
}

type CollectionStaticHomeDirection =
  (typeof STATIC_HOME_COLLECTION_DIRECTIONS)[keyof typeof STATIC_HOME_COLLECTION_DIRECTIONS];

interface CollectionStaticBanner {
  collectionId: string;
  direction: CollectionStaticHomeDirection;
  href: string;
  id: string;
  imageUrl: string;
}

const PRODUCTS_PER_COLLECTION_DEFAULT = 8;
const MOBILE_PRODUCTS_PER_COLLECTION = 6;
const PRODUCTS_PER_COLLECTION_WITH_VERTICAL_BANNER = 3;
const MOBILE_PRODUCTS_PER_VIEW = 2;
const BRANDS_PER_COLLECTION = 4;
const PRODUCT_IMAGE_FALLBACK = 'https://placehold.co/600x600?text=GolfBy';
const API_BASE_URL = (process.env.BASE_API_URL ?? '').replace(/\/$/, '');
const SECTION_CONTAINER_CLASSNAME = 'mx-auto w-full max-w-[140rem] px-4 md:px-6 xl:px-0';

const readString = (value: unknown) => {
  return typeof value === 'string' ? value.trim() : '';
};

const readCollectionBannerDirection = (value: unknown): CollectionStaticHomeDirection | null => {
  const direction = readString(value).toLowerCase();

  if (direction === STATIC_HOME_COLLECTION_DIRECTIONS.HORIZONTAL) {
    return STATIC_HOME_COLLECTION_DIRECTIONS.HORIZONTAL;
  }

  if (direction === STATIC_HOME_COLLECTION_DIRECTIONS.VERTICAL) {
    return STATIC_HOME_COLLECTION_DIRECTIONS.VERTICAL;
  }

  return null;
};

const mapStaticHomeCollectionBanner = (item: StaticHomeItem): CollectionStaticBanner | null => {
  if (item.category !== STATIC_HOME_CATEGORIES.COLLECTION) {
    return null;
  }

  const value = item.value as unknown as Record<string, unknown>;
  const collectionId = readString(value.collectionId);
  const direction = readCollectionBannerDirection(value.direction);
  const imageUrl = readString(value.imageUrl);
  const imageId = readString(value.imageId);
  const href = readString(value.href);

  const resolvedImageUrl = imageUrl || (imageId.startsWith('http') ? imageId : '');

  if (!collectionId || !direction || !resolvedImageUrl) {
    return null;
  }

  return {
    collectionId,
    direction,
    href: href || '/',
    id: item.id,
    imageUrl: resolvedImageUrl,
  };
};

const buildCollectionBrandHref = (collectionSlug: string, brandSlug?: string | null) => {
  if (!brandSlug) {
    return `/collection/${collectionSlug}`;
  }

  const query = new URLSearchParams({ brand: brandSlug });

  return `/collection/${collectionSlug}?${query.toString()}`;
};

const normalizeBrandLogoUrl = (logoUrl?: string | null) => {
  if (!logoUrl) {
    return null;
  }

  const normalizedUrl = logoUrl.trim();

  if (!normalizedUrl) {
    return null;
  }

  if (normalizedUrl.startsWith('data:') || /^https?:\/\//i.test(normalizedUrl)) {
    return normalizedUrl;
  }

  if (normalizedUrl.startsWith('//')) {
    return `https:${normalizedUrl}`;
  }

  if (!API_BASE_URL) {
    return normalizedUrl.startsWith('/') ? normalizedUrl : null;
  }

  if (normalizedUrl.startsWith('/')) {
    return `${API_BASE_URL}${normalizedUrl}`;
  }

  return `${API_BASE_URL}/${normalizedUrl}`;
};

const toNumber = (value?: string | null) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const mapApiProductToCardData = (item: ProductListItem): Product => {
  const salePrice = toNumber(item.salePrice);
  const listPrice = toNumber(item.listPrice);

  const price = salePrice > 0 ? salePrice : listPrice;
  const originalPrice = salePrice > 0 && listPrice > salePrice ? listPrice : undefined;
  const discount =
    originalPrice && originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined;

  return {
    brand: item.brand?.name ?? 'GolfBy',
    ...(discount ? { badge: 'sale' } : {}),
    ...(discount ? { discount } : {}),
    id: item.id,
    image: item.images?.[0]?.url || PRODUCT_IMAGE_FALLBACK,
    name: item.name,
    ...(originalPrice ? { originalPrice } : {}),
    price,
    rating: 5,
    reviews: 0,
  };
};

interface CollectionProductSectionProps {
  bgColor: string;
  brandMetaById: Map<string, CollectionSectionBrand>;
  collectionBanners: CollectionStaticBanner[];
  collection: CollectionTreeNode;
}

interface CollectionSectionBannerCardProps {
  banner: CollectionStaticBanner;
  collectionName: string;
  horizontalCount?: number;
  orientation: CollectionStaticHomeDirection;
}

function CollectionSectionBannerCard({
  banner,
  collectionName,
  horizontalCount = 1,
  orientation,
}: CollectionSectionBannerCardProps) {
  const isHorizontal = orientation === STATIC_HOME_COLLECTION_DIRECTIONS.HORIZONTAL;
  const isCompactHorizontal = isHorizontal && horizontalCount > 2;

  const horizontalHeightClassName = isCompactHorizontal
    ? 'h-[14rem] sm:h-[13rem] lg:h-[18rem]'
    : 'h-[14rem] sm:h-[18rem] lg:h-[18rem]';

  const imageSizes = isHorizontal
    ? `(min-width: 1280px) ${Math.max(Math.round(100 / horizontalCount), 20)}vw, (min-width: 768px) ${Math.max(
        Math.round(100 / horizontalCount),
        33,
      )}vw, 100vw`
    : '(min-width: 1024px) 24rem, 100vw';

  return (
    <Link
      className={`group relative block overflow-hidden ${
        isHorizontal ? horizontalHeightClassName : 'min-h-[32rem] lg:min-h-0'
      }`}
      href={banner.href}
      underline="none"
    >
      <Image
        alt={`${collectionName} banner`}
        className="object-contain transition-transform duration-500 group-hover:scale-[1.02] rounded-[1.2rem] overflow-hidden"
        fill
        sizes={imageSizes}
        src={banner.imageUrl}
      />
    </Link>
  );
}

function BrandLogo({ alt, src }: { alt: string; src?: string | null }) {
  const [hasImageError, setHasImageError] = useState(false);
  const normalizedSource = useMemo(() => normalizeBrandLogoUrl(src), [src]);

  if (!normalizedSource || hasImageError) {
    return null;
  }

  return (
    <div className="relative h-[3.2rem] w-[9rem] shrink-0">
      <Image
        alt={alt}
        className="object-contain object-right"
        fill
        onError={() => setHasImageError(true)}
        sizes="90px"
        src={normalizedSource}
      />
    </div>
  );
}

function ProductCardWithActions({
  isAddingToCart,
  isWishlisted,
  isWishlistLoading,
  onAddToCartAction,
  onToggleWishlistAction,
  product,
}: ProductCardWithActionsProps) {
  return (
    <ProductCard
      isAddingToCart={isAddingToCart}
      isWishlisted={isWishlisted}
      isWishlistLoading={isWishlistLoading}
      onAddToCartAction={onAddToCartAction}
      onToggleWishlistAction={onToggleWishlistAction}
      product={product}
    />
  );
}

function CollectionProductSection({
  bgColor,
  brandMetaById,
  collection,
  collectionBanners,
}: CollectionProductSectionProps) {
  const hasVerticalBanner = collectionBanners.some(
    banner => banner.direction === STATIC_HOME_COLLECTION_DIRECTIONS.VERTICAL,
  );
  const productFetchSize = hasVerticalBanner
    ? Math.max(PRODUCTS_PER_COLLECTION_WITH_VERTICAL_BANNER, MOBILE_PRODUCTS_PER_COLLECTION)
    : PRODUCTS_PER_COLLECTION_DEFAULT;
  const [currentMobileProductPage, setCurrentMobileProductPage] = useState(0);

  const { addToCartFromList, addingProductId } = useAddToCartFromList();
  const { isWishlisted, togglingProductId, toggleWishlist } = useWishlistToggle();
  const { getAllProducts } = useProducts({
    getAllParams: {
      collectionId: collection.id,
      page: 1,
      size: productFetchSize,
    },
  });

  const products = useMemo(() => {
    const items = getAllProducts.data?.data?.items ?? [];
    return items.map(mapApiProductToCardData);
  }, [getAllProducts.data?.data?.items]);

  const sectionBrands = useMemo<CollectionSectionBrand[]>(() => {
    const brandsFromCollection = (collection.brands ?? [])
      .filter(brand => Boolean(brand?.id && brand?.name))
      .slice(0, BRANDS_PER_COLLECTION)
      .map(brand => {
        const matchedGlobalBrand = brandMetaById.get(brand.id);

        return {
          id: brand.id,
          logoUrl: matchedGlobalBrand?.logoUrl ?? brand.logoUrl,
          name: brand.name,
          slug: brand.slug ?? matchedGlobalBrand?.slug,
        };
      });

    if (brandsFromCollection.length > 0) {
      return brandsFromCollection;
    }

    const brandsFromProducts: CollectionSectionBrand[] = [];
    const seenBrandIds = new Set<string>();

    (getAllProducts.data?.data?.items ?? []).forEach(item => {
      const brandId = item.brand?.id;
      const brandName = item.brand?.name;

      if (
        !brandId ||
        !brandName ||
        seenBrandIds.has(brandId) ||
        brandsFromProducts.length >= BRANDS_PER_COLLECTION
      ) {
        return;
      }
      seenBrandIds.add(brandId);
      const matchedGlobalBrand = brandMetaById.get(brandId);

      brandsFromProducts.push({
        id: brandId,
        logoUrl: matchedGlobalBrand?.logoUrl,
        name: matchedGlobalBrand?.name ?? brandName,
        slug: matchedGlobalBrand?.slug,
      });
    });

    return brandsFromProducts;
  }, [brandMetaById, collection.brands, getAllProducts.data?.data?.items]);

  const isEmpty = !getAllProducts.isLoading && products.length === 0;
  const showBrandSidebar = sectionBrands.length > 0;

  const verticalBanner = useMemo(() => {
    return collectionBanners.find(banner => banner.direction === STATIC_HOME_COLLECTION_DIRECTIONS.VERTICAL);
  }, [collectionBanners]);

  const horizontalBanners = useMemo(() => {
    return collectionBanners.filter(
      banner => banner.direction === STATIC_HOME_COLLECTION_DIRECTIONS.HORIZONTAL,
    );
  }, [collectionBanners]);

  const desktopProducts = useMemo(() => {
    const desktopLimit = hasVerticalBanner
      ? PRODUCTS_PER_COLLECTION_WITH_VERTICAL_BANNER
      : PRODUCTS_PER_COLLECTION_DEFAULT;

    return products.slice(0, desktopLimit);
  }, [hasVerticalBanner, products]);

  const mobileProducts = useMemo(() => {
    return products.slice(0, MOBILE_PRODUCTS_PER_COLLECTION);
  }, [products]);

  const mobileProductPages = useMemo(() => {
    const pages: Product[][] = [];

    for (let index = 0; index < mobileProducts.length; index += MOBILE_PRODUCTS_PER_VIEW) {
      pages.push(mobileProducts.slice(index, index + MOBILE_PRODUCTS_PER_VIEW));
    }

    return pages;
  }, [mobileProducts]);

  const [mobileProductSliderRef, mobileProductSliderInstanceRef] = useKeenSlider<HTMLDivElement>({
    mode: 'snap',
    rubberband: false,
    slideChanged(slider) {
      setCurrentMobileProductPage(slider.track.details.rel);
    },
    slides: {
      perView: 1,
      spacing: 15,
    },
  });

  const [mobileBrandSliderRef, mobileBrandSliderInstanceRef] = useKeenSlider<HTMLDivElement>({
    breakpoints: {
      '(min-width: 520px)': {
        slides: {
          perView: 2,
          spacing: 12,
        },
      },
    },
    mode: 'snap',
    rubberband: false,
    slides: {
      perView: 1.5,
      spacing: 12,
    },
  });

  const [mobileHorizontalBannerSliderRef, mobileHorizontalBannerSliderInstanceRef] =
    useKeenSlider<HTMLDivElement>({
      drag: horizontalBanners.length > 1,
      mode: 'snap',
      renderMode: 'performance',
      rubberband: false,
      slides: {
        perView: 1,
        spacing: 8,
      },
    });

  useEffect(() => {
    mobileProductSliderInstanceRef.current?.update();
  }, [mobileProductPages.length]);

  useEffect(() => {
    mobileBrandSliderInstanceRef.current?.update();
  }, [sectionBrands.length]);

  useEffect(() => {
    mobileHorizontalBannerSliderInstanceRef.current?.update();
  }, [horizontalBanners.length]);

  const productGridClassName = verticalBanner
    ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-5'
    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5';

  const mobileProductPageCount = Math.max(1, mobileProductPages.length);

  const horizontalBannerGridStyle = useMemo<CSSProperties | undefined>(() => {
    if (horizontalBanners.length <= 1) {
      return undefined;
    }

    return {
      ['--horizontal-banner-columns' as string]: `repeat(${horizontalBanners.length}, minmax(0, 1fr))`,
    };
  }, [horizontalBanners.length]);

  return (
    <section className={`${bgColor} py-8 md:py-14`}>
      <div className={SECTION_CONTAINER_CLASSNAME}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-7 bg-primary rounded-full" />
              <h2 className="text-[2.4rem] sm:text-[2.8rem] text-foreground font-700">{collection.name}</h2>
            </div>
            {collection.description && (
              <p className="text-muted-foreground text-[1.4rem] ml-[1.9rem]">{collection.description}</p>
            )}
          </div>

          <Link
            className="hidden sm:flex items-center gap-1.5 text-primary text-[1.4rem] hover:gap-2.5 transition-all font-500"
            href={`/collection/${collection.slug}`}
            underline="none"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {getAllProducts.isLoading && (
          <div className="py-8 text-center text-[1.4rem] text-muted-foreground">Đang tải sản phẩm...</div>
        )}

        {isEmpty && (
          <div className="py-8 text-center text-[1.4rem] text-muted-foreground">
            Chưa có sản phẩm trong collection này.
          </div>
        )}

        {!getAllProducts.isLoading && products.length > 0 && (
          <>
            <div
              className={`grid gap-4 md:gap-5 ${showBrandSidebar ? 'xl:grid-cols-[minmax(0,1fr)_30rem]' : ''}`}
            >
              <div className="flex flex-col gap-4 md:gap-5">
                <div
                  className={`grid gap-4 md:gap-5 ${verticalBanner ? 'lg:grid-cols-[30rem_minmax(0,1fr)]' : ''}`}
                >
                  {verticalBanner ? (
                    <div className="hidden lg:block">
                      <CollectionSectionBannerCard
                        banner={verticalBanner}
                        collectionName={collection.name}
                        orientation={STATIC_HOME_COLLECTION_DIRECTIONS.VERTICAL}
                      />
                    </div>
                  ) : null}

                  <div className="lg:hidden">
                    <div ref={mobileProductSliderRef} className="keen-slider">
                      {mobileProductPages.map((productPage, pageIndex) => (
                        <div
                          key={`collection-mobile-page-${collection.id}-${pageIndex}`}
                          className="keen-slider__slide min-w-0"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            {productPage.map(product => (
                              <ProductCardWithActions
                                key={product.id}
                                isAddingToCart={addingProductId === String(product.id)}
                                isWishlisted={isWishlisted(String(product.id))}
                                isWishlistLoading={togglingProductId === String(product.id)}
                                onAddToCartAction={currentProduct =>
                                  addToCartFromList({
                                    productId: String(currentProduct.id),
                                    productName: currentProduct.name,
                                  })
                                }
                                onToggleWishlistAction={currentProduct =>
                                  toggleWishlist({
                                    productId: String(currentProduct.id),
                                    productName: currentProduct.name,
                                  })
                                }
                                product={product}
                              />
                            ))}

                            {productPage.length < MOBILE_PRODUCTS_PER_VIEW ? (
                              <div aria-hidden className="invisible" />
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`hidden lg:grid ${productGridClassName}`}>
                    {desktopProducts.map(product => (
                      <ProductCardWithActions
                        key={product.id}
                        isAddingToCart={addingProductId === String(product.id)}
                        isWishlisted={isWishlisted(String(product.id))}
                        isWishlistLoading={togglingProductId === String(product.id)}
                        onAddToCartAction={currentProduct =>
                          addToCartFromList({
                            productId: String(currentProduct.id),
                            productName: currentProduct.name,
                          })
                        }
                        onToggleWishlistAction={currentProduct =>
                          toggleWishlist({
                            productId: String(currentProduct.id),
                            productName: currentProduct.name,
                          })
                        }
                        product={product}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {showBrandSidebar && (
                <div className="hidden xl:flex xl:flex-col xl:gap-4">
                  {sectionBrands.map(brand => {
                    return (
                      <Link
                        key={brand.id}
                        className="group flex items-center justify-between rounded-[1.6rem] border border-border bg-white px-6 py-3 transition-all hover:border-primary/40 hover:bg-primary-light/20"
                        href={buildCollectionBrandHref(collection.slug, brand.slug)}
                        underline="none"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-[1.6rem] leading-[2.2rem] text-foreground font-700">
                            {brand.name}
                          </span>
                          <span className="text-[1.4rem] leading-[2rem] text-muted-foreground font-500 group-hover:text-primary">
                            Xem ngay
                          </span>
                        </div>

                        <BrandLogo alt={brand.name} src={brand.logoUrl} />
                      </Link>
                    );
                  })}

                  <Link
                    className="flex h-[4rem] items-center justify-center rounded-[1.6rem] border border-border bg-white text-[1.4rem] leading-[2.2rem] text-foreground font-600 transition-all hover:border-primary hover:text-primary"
                    href={`/collection/${collection.slug}`}
                    underline="none"
                  >
                    Xem tất cả
                  </Link>
                </div>
              )}
            </div>

            {mobileProductPages.length > 0 ? (
              <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
                {Array.from({ length: mobileProductPageCount }).map((_, index) => (
                  <button
                    key={`collection-product-dot-${collection.id}-${index}`}
                    aria-label={`Chuyển đến nhóm sản phẩm ${index + 1}`}
                    className={[
                      'h-2 w-2 rounded-full transition-colors',
                      currentMobileProductPage === index ? 'bg-primary' : 'bg-foreground/25',
                    ].join(' ')}
                    onClick={() => mobileProductSliderInstanceRef.current?.moveToIdx(index)}
                    type="button"
                  />
                ))}
              </div>
            ) : null}

            {showBrandSidebar ? (
              <div className="mt-4 md:mt-5 xl:hidden">
                <div ref={mobileBrandSliderRef} className="keen-slider">
                  {sectionBrands.map(brand => (
                    <div key={brand.id} className="keen-slider__slide">
                      <Link
                        className="group flex h-full items-center justify-between rounded-[1.6rem] border border-border bg-white px-4 py-3 transition-all hover:border-primary/40 hover:bg-primary-light/20"
                        href={buildCollectionBrandHref(collection.slug, brand.slug)}
                        underline="none"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-[1.6rem] leading-[2.2rem] text-foreground font-700">
                            {brand.name}
                          </span>
                          <span className="text-[1.4rem] leading-[2rem] text-muted-foreground font-500 group-hover:text-primary">
                            Xem ngay
                          </span>
                        </div>

                        <BrandLogo alt={brand.name} src={brand.logoUrl} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {horizontalBanners.length > 0 ? (
              <div className="mt-4 md:mt-5">
                <div className="md:hidden">
                  <div ref={mobileHorizontalBannerSliderRef} className="keen-slider touch-pan-y">
                    {horizontalBanners.map(banner => (
                      <div key={banner.id} className="keen-slider__slide min-w-0">
                        <CollectionSectionBannerCard
                          banner={banner}
                          collectionName={collection.name}
                          horizontalCount={horizontalBanners.length}
                          orientation={STATIC_HOME_COLLECTION_DIRECTIONS.HORIZONTAL}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="hidden md:grid md:gap-5 md:[grid-template-columns:var(--horizontal-banner-columns)]"
                  style={horizontalBannerGridStyle}
                >
                  {horizontalBanners.map(banner => (
                    <CollectionSectionBannerCard
                      key={banner.id}
                      banner={banner}
                      collectionName={collection.name}
                      horizontalCount={horizontalBanners.length}
                      orientation={STATIC_HOME_COLLECTION_DIRECTIONS.HORIZONTAL}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            <div className="sm:hidden mt-6 text-center">
              <Link
                className="inline-flex items-center gap-1.5 text-primary text-[1.4rem] font-500"
                href={`/collection/${collection.slug}`}
                underline="none"
              >
                Xem tất cả
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export function ProductSection({ bgColor = 'bg-white' }: ProductSectionProps) {
  const { getAllBrands } = useBrands();
  const { getAllCollections } = useCollections();
  const staticHome = useSWRWrapper<StaticHomeItem[]>('/api/v1/static-home', {
    method: METHOD.GET,
    url: '/api/v1/static-home',
  });

  const brandMetaById = useMemo(() => {
    const allBrands = getAllBrands.data?.data ?? [];

    return new Map(
      allBrands.map(brand => [
        brand.id,
        {
          id: brand.id,
          logoUrl: brand.image?.url ?? brand.logoUrl,
          name: brand.name,
          slug: brand.slug,
        },
      ]),
    );
  }, [getAllBrands.data?.data]);

  const parentCollections = useMemo(() => {
    const collections = getAllCollections.data?.data ?? [];
    const roots = collections.filter(collection => !collection.parentId);

    return roots.length > 0 ? roots : collections;
  }, [getAllCollections.data?.data]);

  const collectionBannersByCollectionId = useMemo(() => {
    const entries = staticHome.data?.data ?? [];
    const nextMap = new Map<string, CollectionStaticBanner[]>();

    entries
      .map(mapStaticHomeCollectionBanner)
      .filter((item): item is CollectionStaticBanner => Boolean(item))
      .forEach(item => {
        const currentItems = nextMap.get(item.collectionId) ?? [];
        currentItems.push(item);
        nextMap.set(item.collectionId, currentItems);
      });

    return nextMap;
  }, [staticHome.data?.data]);

  if (getAllCollections.isLoading && parentCollections.length === 0) {
    return (
      <section className={`${bgColor} py-8 md:py-14`}>
        <div className={SECTION_CONTAINER_CLASSNAME}>
          <div className="py-8 text-center text-[1.4rem] text-muted-foreground">Đang tải collections...</div>
        </div>
      </section>
    );
  }

  if (parentCollections.length === 0) {
    return null;
  }

  return (
    <>
      {parentCollections.map((collection, index) => (
        <CollectionProductSection
          key={collection.id}
          bgColor={index % 2 === 0 ? bgColor : bgColor === 'bg-white' ? 'bg-muted' : bgColor}
          brandMetaById={brandMetaById}
          collectionBanners={collectionBannersByCollectionId.get(collection.id) ?? []}
          collection={collection}
        />
      ))}
    </>
  );
}
