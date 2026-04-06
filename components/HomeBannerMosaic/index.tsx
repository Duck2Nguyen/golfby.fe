'use client';

import { useMemo, useState, useEffect } from 'react';

import { Link } from '@heroui/link';

import type { StaticHomeItem } from '@/hooks/useStaticData';

import { fetcher } from '@/utils/restApi';

import { STATIC_HOME_CATEGORIES } from '@/hooks/useStaticData';

import { METHOD } from '@/global/common';

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface HomeBannerMosaicItem {
  href: string;
  id: string;
  imageUrl: string;
}

const MAX_BANNER_ITEMS = 5;

const TILE_LAYOUT_CLASSNAMES = [
  'col-span-2 md:col-span-6 md:row-span-2',
  'col-span-1 md:col-span-3 md:row-span-1',
  'col-span-1 md:col-span-3 md:row-span-1',
  'col-span-1 md:col-span-3 md:row-span-1',
  'col-span-1 md:col-span-3 md:row-span-1',
] as const;

const readString = (value: unknown) => {
  return typeof value === 'string' ? value.trim() : '';
};

const mapStaticHomeBannerItem = (item: StaticHomeItem): HomeBannerMosaicItem | null => {
  if (item.category !== STATIC_HOME_CATEGORIES.BANNER) {
    return null;
  }

  const value = item.value as unknown as Record<string, unknown>;
  const imageUrl = readString(value.imageUrl);
  const imageId = readString(value.imageId);
  const href = readString(value.href);

  const resolvedImageUrl = imageUrl || (imageId.startsWith('http') ? imageId : '');

  if (!resolvedImageUrl) {
    return null;
  }

  return {
    href: href || '/',
    id: item.id,
    imageUrl: resolvedImageUrl,
  };
};

const renderSkeletonGrid = () => {
  return (
    <section className="w-full max-w-7xl mx-auto">
      <div className="grid h-[36rem] grid-cols-2 gap-2 md:h-[56rem] md:grid-cols-12 md:grid-rows-2">
        {Array.from({ length: MAX_BANNER_ITEMS }, (_, index) => (
          <div
            className={`${TILE_LAYOUT_CLASSNAMES[index]} animate-pulse rounded-sm bg-gray-200`}
            key={`banner-skeleton-${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default function HomeBannerMosaic() {
  const [items, setItems] = useState<HomeBannerMosaicItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadBanners = async () => {
      setIsLoading(true);

      try {
        const payload = await fetcher<StaticHomeItem[]>('/api/v1/static-home', METHOD.GET);
        const data = Array.isArray(payload?.data) ? payload.data : [];

        const mappedItems = data
          .map(mapStaticHomeBannerItem)
          .filter((item): item is HomeBannerMosaicItem => Boolean(item))
          .slice(0, MAX_BANNER_ITEMS);

        if (isMounted) {
          setItems(mappedItems);
        }
      } catch (error) {
        if (isMounted) {
          setItems([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadBanners();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleItems = useMemo(() => {
    return items.slice(0, MAX_BANNER_ITEMS);
  }, [items]);

  if (isLoading) {
    return renderSkeletonGrid();
  }

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-7xl mx-auto py-2">
      <div className="grid h-[36rem] grid-cols-2 gap-2 md:h-[56rem] md:grid-cols-12 md:grid-rows-2">
        {visibleItems.map((item, index) => (
          <Link
            className={`${TILE_LAYOUT_CLASSNAMES[index]} group relative block overflow-hidden rounded-sm`}
            href={item.href}
            key={item.id}
          >
            <ImageWithFallback
              alt={`Home banner ${index + 1}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              src={item.imageUrl}
            />
            <span className="absolute inset-0 bg-black/5 transition-colors duration-300 group-hover:bg-black/0" />
          </Link>
        ))}
      </div>
    </section>
  );
}
