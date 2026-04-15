import { useSession } from '@/hooks/auth';
import { useMutation, useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

export interface CartProductImage {
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

export interface CartProduct {
  brandId?: string | null;
  categoryId?: string | null;
  costPrice?: string | null;
  createdAt?: string | null;
  currency?: string | null;
  description?: string | null;
  id: string;
  images?: CartProductImage[];
  listPrice?: string | null;
  name: string;
  salePrice?: string | null;
  slug: string;
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'DELETED' | null;
  subcategoryId?: string | null;
  updatedAt?: string | null;
}

export interface CartVariant {
  barcode?: string | null;
  costPrice?: string | null;
  createdAt?: string | null;
  deletedAt?: string | null;
  id: string;
  listPrice?: string | null;
  productId: string;
  salePrice?: string | null;
  selectedOptionValues?: CartVariantSelectedOptionValue[];
  sku?: string | null;
  status?: 'ACTIVE' | 'ARCHIVED' | 'DELETED' | null;
  stock?: number | null;
  updatedAt?: string | null;
}

export interface CartVariantOption {
  id: string;
  name: string;
}

export interface CartVariantOptionValue {
  id: string;
  option?: CartVariantOption | null;
  optionId: string;
  value: string;
}

export interface CartVariantSelectedOptionValue {
  optionValue?: CartVariantOptionValue | null;
  productOptionValueId: string;
  variantId: string;
}

export interface CartItem {
  createdAt?: string | null;
  id: string;
  product?: CartProduct | null;
  productId: string;
  quantity: number;
  updatedAt?: string | null;
  userId: string;
  variant?: CartVariant | null;
  variantId?: string | null;
}

export interface AddToCartPayload {
  csrf?: boolean;
  productId: string;
  quantity?: number;
  variantId?: string;
}

export interface UpdateCartItemPayload {
  csrf?: boolean;
  itemId: string;
  quantity: number;
}

export interface RemoveCartItemPayload {
  csrf?: boolean;
  itemId: string;
}

export const useCarts = () => {
  const { data: session } = useSession();

  // Build key with userId to separate cache per user
  // If user is authenticated, add userId to key; otherwise use base key for guest
  const cartKey = session?.userInfo?.id ? `/api/v1/cart:${session.userInfo.id}` : '/api/v1/cart';

  const getMyCart = useSWRWrapper<CartItem[]>(cartKey, {
    method: METHOD.GET,
    url: '/api/v1/cart',
  });

  const addToCartMutation = useMutation<CartItem>('/api/v1/cart', {
    loading: true,
    method: METHOD.POST,
    notification: {
      ignoreError: false,
      ignoreSuccess: true,
    },
    url: '/api/v1/cart',
  });

  const updateCartItemMutation = useMutation<CartItem>('/api/v1/cart/{itemId}', {
    loading: true,
    method: METHOD.PATCH,
    url: '/api/v1/cart/{itemId}',
  });

  const removeCartItemMutation = useMutation<boolean>('/api/v1/cart/{itemId}', {
    loading: true,
    method: METHOD.DELETE,
    url: '/api/v1/cart/{itemId}',
  });

  return {
    addToCartMutation,
    getMyCart,
    removeCartItemMutation,
    updateCartItemMutation,
  };
};

export type UseCartsReturn = ReturnType<typeof useCarts>;
