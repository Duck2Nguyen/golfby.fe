import { useSWRConfig } from 'swr';

import { useMutation, useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

export interface WishlistProductImage {
  createdAt?: string | null;
  id: string;
  isPrimary?: boolean | null;
  key: string;
  mimeType?: string | null;
  name?: string | null;
  productId?: string | null;
  productVariantId?: string | null;
  size?: number | null;
  sortOrder?: number | null;
  url?: string | null;
}

export interface WishlistProduct {
  brandId?: string | null;
  categoryId?: string | null;
  costPrice?: string | null;
  createdAt?: string | null;
  currency?: string | null;
  description?: string | null;
  id: string;
  images?: WishlistProductImage[];
  listPrice?: string | null;
  name: string;
  salePrice?: string | null;
  slug: string;
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'DELETED' | null;
  subcategoryId?: string | null;
  updatedAt?: string | null;
}

export interface WishlistItem {
  createdAt?: string | null;
  id: string;
  product?: WishlistProduct | null;
  productId: string;
  userId: string;
}

export interface AddWishlistPayload {
  csrf?: boolean;
  productId: string;
}

export interface RemoveWishlistPayload {
  csrf?: boolean;
  productId: string;
}

const WISHLISTS_ENDPOINT = '/api/v1/wishlists';

export const useWishlists = () => {
  const { cache } = useSWRConfig();

  const cachedWishlist = cache.get(WISHLISTS_ENDPOINT) as { data?: unknown } | undefined;
  const hasCachedWishlist = Boolean(cachedWishlist?.data);

  const getMyWishlist = useSWRWrapper<WishlistItem[]>(WISHLISTS_ENDPOINT, {
    dedupingInterval: 1000 * 60 * 5,
    method: METHOD.GET,
    revalidateIfStale: false,
    revalidateOnMount: !hasCachedWishlist,
    url: WISHLISTS_ENDPOINT,
  });

  const addWishlistMutation = useMutation<boolean>('/api/v1/wishlists/{productId}', {
    loading: true,
    method: METHOD.POST,
    notification: {
      content: 'Thêm vào danh sách yêu thích thành công',
      title: 'Thành công',
    },
    url: '/api/v1/wishlists/{productId}',
  });

  const removeWishlistMutation = useMutation<boolean>('/api/v1/wishlists/{productId}', {
    loading: true,
    method: METHOD.DELETE,
    notification: {
      content: 'Xóa khỏi danh sách yêu thích thành công',
      title: 'Thành công',
    },
    url: '/api/v1/wishlists/{productId}',
  });

  return {
    addWishlistMutation,
    getMyWishlist,
    removeWishlistMutation,
  };
};

export type UseWishlistsReturn = ReturnType<typeof useWishlists>;
