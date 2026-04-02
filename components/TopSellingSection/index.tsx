'use client';

import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';

import { Link } from '@heroui/link';

import type { Product } from '@/components/mock-data';
import type { ProductListItem } from '@/hooks/useProducts';

import { useProducts } from '@/hooks/useProducts';

import { ProductCard } from '@/components/ProductCard';

interface TopSellingSectionProps {
  bgColor?: string;
  limit?: number;
  subtitle?: string;
  title?: string;
  viewAllHref?: string;
}

const DEFAULT_LIMIT = 10;
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
  const { getAllProducts } = useProducts({
    getAllParams: {
      page: 1,
      size: limit,
    },
  });

  const products = useMemo(() => {
    const items = getAllProducts.data?.data?.items ?? [];
    return items.map(mapApiProductToCardData);
  }, [getAllProducts.data?.data?.items]);

  const isEmpty = !getAllProducts.isLoading && products.length === 0;

  if (getAllProducts.isLoading && products.length === 0) {
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
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
