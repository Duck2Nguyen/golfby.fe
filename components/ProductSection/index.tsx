'use client';

import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';

import { Link } from '@heroui/link';

import { useProducts, type ProductListItem } from '@/hooks/useProducts';
import { useCollections, type CollectionTreeNode } from '@/hooks/useCollections';

import { ProductCard } from '../ProductCard';

import type { Product } from '../mock-data';

interface ProductSectionProps {
  bgColor?: string;
}

const PRODUCTS_PER_COLLECTION = 8;
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
    rating: 5,
    reviews: 0,
  };
};

interface CollectionProductSectionProps {
  bgColor: string;
  collection: CollectionTreeNode;
}

function CollectionProductSection({ bgColor, collection }: CollectionProductSectionProps) {
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

  const isEmpty = !getAllProducts.isLoading && products.length === 0;

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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
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
  const { getAllCollections } = useCollections();

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
          collection={collection}
        />
      ))}
    </>
  );
}
