'use client';

import { useMemo, useState, useCallback } from 'react';

import { addToast } from '@heroui/toast';
import { useRouter } from 'next/navigation';

import { useSession } from './auth';
import { useWishlists } from './useWishlists';

interface ToggleWishlistPayload {
  productId: string;
  productName?: string;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const useWishlistToggle = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { addWishlistMutation, getMyWishlist, removeWishlistMutation } = useWishlists();

  const [togglingProductId, setTogglingProductId] = useState<string | null>(null);

  const wishlistedProductIds = useMemo(() => {
    const items = getMyWishlist.data?.data ?? [];

    return new Set(items.map(item => item.productId));
  }, [getMyWishlist.data?.data]);

  const isWishlisted = useCallback(
    (productId: string) => {
      return wishlistedProductIds.has(productId);
    },
    [wishlistedProductIds],
  );

  const toggleWishlist = useCallback(
    async ({ productId, productName }: ToggleWishlistPayload) => {
      if (!session?.isAuthenticated) {
        addToast({
          color: 'warning',
          description: 'Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích.',
        });
        router.push('/login');
        return false;
      }

      if (!UUID_PATTERN.test(productId)) {
        addToast({
          color: 'warning',
          description: productName
            ? `${productName} chưa hỗ trợ thêm vào wishlist ở chế độ này.`
            : 'Sản phẩm này chưa hỗ trợ thêm vào wishlist ở chế độ này.',
        });
        return false;
      }

      setTogglingProductId(productId);

      try {
        if (wishlistedProductIds.has(productId)) {
          await removeWishlistMutation.trigger({
            csrf: true,
            productId,
          });
        } else {
          await addWishlistMutation.trigger({
            csrf: true,
            productId,
          });
        }

        await getMyWishlist.mutate();

        return true;
      } catch {
        return false;
      } finally {
        setTogglingProductId(current => (current === productId ? null : current));
      }
    },
    [addWishlistMutation, getMyWishlist, removeWishlistMutation, router, session?.isAuthenticated, wishlistedProductIds],
  );

  return {
    isWishlisted,
    togglingProductId,
    toggleWishlist,
    wishlistedProductIds,
  };
};

export type UseWishlistToggleReturn = ReturnType<typeof useWishlistToggle>;
