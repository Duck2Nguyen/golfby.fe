'use client';

import { ArrowRight } from 'lucide-react';
import { useKeenSlider } from 'keen-slider/react';
import { useMemo, useState, useEffect } from 'react';

import { Link } from '@heroui/link';

import type { Product } from '@/components/mock-data';
import type { ProductListItem } from '@/hooks/useProducts';

import { useProducts } from '@/hooks/useProducts';
import { useWishlistToggle } from '@/hooks/useWishlistToggle';
import { useAddToCartFromList } from '@/hooks/useAddToCartFromList';

import { ProductCard } from '@/components/ProductCard';

interface TopSellingSectionProps {
  bgColor?: string;
  limit?: number;
  subtitle?: string;
  title?: string;
  viewAllHref?: string;
}

const DEFAULT_LIMIT = 8;
const MOBILE_PRODUCTS_PER_VIEW = 2;
const PRODUCT_IMAGE_FALLBACK = 'https://placehold.co/600x600?text=GolfBy';

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
    rating: 0,
    reviews: 0,
  };
};

export default function TopSellingSection({
  bgColor = 'bg-white',
  limit = DEFAULT_LIMIT,
  subtitle,
  title = 'Top SP Bán Chạy',
  viewAllHref = '/collection',
}: TopSellingSectionProps) {
  const [currentMobilePage, setCurrentMobilePage] = useState(0);

  const { getTopProducts } = useProducts({
    getTopParams: {
      by: 'bestsellers',
      limit,
    },
  });
  const { addToCartFromList, addingProductId } = useAddToCartFromList();
  const { isWishlisted, togglingProductId, toggleWishlist } = useWishlistToggle();

  const products = useMemo(() => {
    const items = getTopProducts.data?.data ?? [];
    return items.map(mapApiProductToCardData);
  }, [getTopProducts.data?.data]);

  const mobileProductPages = useMemo(() => {
    const pages: Product[][] = [];

    for (let index = 0; index < products.length; index += MOBILE_PRODUCTS_PER_VIEW) {
      pages.push(products.slice(index, index + MOBILE_PRODUCTS_PER_VIEW));
    }

    return pages;
  }, [products]);

  const [mobileSliderRef, mobileSliderInstanceRef] = useKeenSlider<HTMLDivElement>({
    mode: 'snap',
    renderMode: 'performance',
    rubberband: false,
    slideChanged(slider) {
      setCurrentMobilePage(slider.track.details.rel);
    },
    slides: {
      perView: 1,
      spacing: 0,
    },
  });

  useEffect(() => {
    mobileSliderInstanceRef.current?.update();
  }, [mobileProductPages.length]);

  const mobilePageCount = Math.max(1, mobileProductPages.length);

  const isEmpty = !getTopProducts.isLoading && products.length === 0;

  if (getTopProducts.isLoading && products.length === 0) {
    return (
      <section className={`${bgColor} py-14`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="py-8 text-center text-[1.4rem] text-muted-foreground">Đang tải top sản phẩm...</div>
        </div>
      </section>
    );
  }

  if (isEmpty) {
    return null;
  }

  return (
    <section className={`${bgColor} py-14`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-7 bg-primary rounded-full" />
              <h2 className="text-[2.4rem] sm:text-[2.8rem] text-foreground font-700">{title}</h2>
            </div>
            {subtitle && <p className="text-muted-foreground text-[1.4rem] ml-[1.9rem]">{subtitle}</p>}
          </div>

          <Link
            className="hidden sm:flex items-center gap-1.5 text-primary text-[1.4rem] hover:gap-2.5 transition-all font-500"
            href={viewAllHref}
            underline="none"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="md:hidden">
          <div ref={mobileSliderRef} className="keen-slider touch-pan-y">
            {mobileProductPages.map((productPage, pageIndex) => (
              <div key={`top-selling-mobile-page-${pageIndex}`} className="keen-slider__slide min-w-0">
                <div className="grid grid-cols-2 gap-3">
                  {productPage.map(product => (
                    <ProductCard
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

          {mobileProductPages.length > 0 ? (
            <div className="mt-4 flex items-center justify-center gap-2">
              {Array.from({ length: mobilePageCount }).map((_, index) => (
                <button
                  key={`top-selling-dot-${index}`}
                  aria-label={`Chuyển đến nhóm top sản phẩm ${index + 1}`}
                  className={[
                    'h-2 w-2 rounded-full transition-colors',
                    currentMobilePage === index ? 'bg-primary' : 'bg-foreground/25',
                  ].join(' ')}
                  onClick={() => mobileSliderInstanceRef.current?.moveToIdx(index)}
                  type="button"
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map(product => (
            <ProductCard
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

        <div className="sm:hidden mt-6 text-center">
          <Link
            className="inline-flex items-center gap-1.5 text-primary text-[1.4rem] font-500"
            href={viewAllHref}
            underline="none"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
