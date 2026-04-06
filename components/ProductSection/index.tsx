'use client';

import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';

import Image from 'next/image';

import { Link } from '@heroui/link';

import { useBrands } from '@/hooks/useBrands';
import { useProducts, type ProductListItem } from '@/hooks/useProducts';
import { useCollections, type CollectionTreeNode } from '@/hooks/useCollections';

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

const PRODUCTS_PER_COLLECTION = 8;
const BRANDS_PER_COLLECTION = 4;
const PRODUCT_IMAGE_FALLBACK = 'https://placehold.co/600x600?text=GolfBy';
const API_BASE_URL = (process.env.BASE_API_URL ?? '').replace(/\/$/, '');

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
  collection: CollectionTreeNode;
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

function CollectionProductSection({ bgColor, collection, brandMetaById }: CollectionProductSectionProps) {
  const { getAllProducts } = useProducts({
    getAllParams: {
      collectionId: collection.id,
      page: 1,
      size: PRODUCTS_PER_COLLECTION,
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

      if (!brandId || !brandName || seenBrandIds.has(brandId) || brandsFromProducts.length >= BRANDS_PER_COLLECTION) {
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

  return (
    <section className={`${bgColor} py-14`}>
      <div className="max-w-7xl mx-auto px-4">
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
            <div className={`grid gap-4 md:gap-5 ${showBrandSidebar ? 'xl:grid-cols-[minmax(0,1fr)_30rem]' : ''}`}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {showBrandSidebar && (
                <div className="hidden xl:flex xl:flex-col xl:gap-4">
                  {sectionBrands.map(brand => {
                    return (
                      <Link
                        key={brand.id}
                        className="group flex items-center justify-between rounded-[1.6rem] border border-border bg-white p-6 transition-all hover:border-primary/40 hover:bg-primary-light/20"
                        href={buildCollectionBrandHref(collection.slug, brand.slug)}
                        underline="none"
                      >
                        <div className="flex flex-col gap-2">
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
                    className="flex h-[6rem] items-center justify-center rounded-[1.6rem] border border-border bg-white text-[1.6rem] leading-[2.2rem] text-foreground font-600 transition-all hover:border-primary hover:text-primary"
                    href={`/collection/${collection.slug}`}
                    underline="none"
                  >
                    Xem tất cả
                  </Link>
                </div>
              )}
            </div>

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

  if (getAllCollections.isLoading && parentCollections.length === 0) {
    return (
      <section className={`${bgColor} py-14`}>
        <div className="max-w-7xl mx-auto px-4">
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
          collection={collection}
        />
      ))}
    </>
  );
}
