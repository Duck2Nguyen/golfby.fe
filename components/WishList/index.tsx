'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Grid2x2, Grid3x3, LayoutGrid, LayoutList, ChevronRight } from 'lucide-react';

import { Link } from '@heroui/link';

import { useWishlists, type WishlistItem } from '@/hooks/useWishlists';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import EmptyWishlist from '@/components/WishList/EmptyWishlist';
import WishlistGridItem from '@/components/WishList/WishlistGridItem';
import WishlistListItem from '@/components/WishList/WishlistListItem';

import type { ViewMode, WishlistDisplayItem } from './types';

const viewModes: { icon: ReactNode; label: string; mode: ViewMode }[] = [
  { mode: 'list', icon: <LayoutList className="w-4 h-4" />, label: 'Danh sách' },
  { mode: '2col', icon: <Grid2x2 className="w-4 h-4" />, label: '2 cột' },
  { mode: '3col', icon: <Grid3x3 className="w-4 h-4" />, label: '3 cột' },
  { mode: '4col', icon: <LayoutGrid className="w-4 h-4" />, label: '4 cột' },
];

const formatAddedAt = (createdAt?: string | null) => {
  if (!createdAt) {
    return 'vừa xong';
  }

  const createdAtDate = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - createdAtDate.getTime();

  if (Number.isNaN(diffMs) || diffMs < 0) {
    return 'vừa xong';
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) {
    return 'vừa xong';
  }

  if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  }

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) {
    return `${diffWeeks} tuần trước`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  return `${Math.max(diffMonths, 1)} tháng trước`;
};

const toNumber = (value?: string | null) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function WishList() {
  const [viewMode, setViewMode] = useState<ViewMode>('4col');

  const { getMyWishlist, removeWishlistMutation } = useWishlists();
  const { data, error, isLoading, mutate } = getMyWishlist;

  const wishlistItems = useMemo<WishlistDisplayItem[]>(() => {
    const sourceItems: WishlistItem[] = data?.data ?? [];

    return sourceItems
      .filter(item => Boolean(item.product))
      .map(item => {
        const product = item.product!;
        const listPrice = toNumber(product.listPrice);
        const salePrice = toNumber(product.salePrice);
        const hasSalePrice = salePrice > 0;
        const price = hasSalePrice ? salePrice : listPrice;
        const originalPrice = hasSalePrice && listPrice > salePrice ? listPrice : undefined;
        const firstImage = product.images?.[0];

        return {
          addedAtLabel: formatAddedAt(item.createdAt),
          brand: 'GolfBy',
          id: item.id,
          image: firstImage?.url || firstImage?.key || 'https://placehold.co/600x600?text=GolfBy',
          name: product.name,
          originalPrice,
          price,
          productId: item.productId,
        };
      });
  }, [data?.data]);

  const handleRemove = async (productId: string) => {
    await removeWishlistMutation.trigger({ csrf: true, productId });
    await mutate();
  };

  const gridClass = {
    list: 'grid-cols-1',
    '2col': 'grid-cols-1 sm:grid-cols-2',
    '3col': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4col': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[viewMode];

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-1.5 text-[13px] text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-500">Wish List</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] text-foreground mb-1 font-700">Danh Mục Theo Dõi</h1>
            <p className="text-[14px] text-muted-foreground">{wishlistItems.length} sản phẩm đang theo dõi</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[13px] text-muted-foreground mr-1 font-500">Xem dưới dạng</span>
            <div className="flex items-center bg-white border border-border rounded-xl overflow-hidden">
              {viewModes.map(({ mode, icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  title={label}
                  className={`p-2.5 transition-all duration-200 ${
                    viewMode === mode
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:text-primary hover:bg-muted'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-[1.4rem] text-muted-foreground">
            Đang tải danh sách yêu thích...
          </div>
        ) : error ? (
          <div className="py-12 text-center text-[1.4rem] text-danger">
            Không thể tải danh sách yêu thích.
          </div>
        ) : wishlistItems.length === 0 ? (
          <EmptyWishlist />
        ) : viewMode === 'list' ? (
          <div className="space-y-3">
            {wishlistItems.map(item => (
              <WishlistListItem
                key={item.id}
                item={item}
                isRemoving={removeWishlistMutation.isMutating}
                onRemove={handleRemove}
              />
            ))}
          </div>
        ) : (
          <div className={`grid ${gridClass} gap-5`}>
            {wishlistItems.map(item => (
              <WishlistGridItem
                key={item.id}
                item={item}
                isRemoving={removeWishlistMutation.isMutating}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
