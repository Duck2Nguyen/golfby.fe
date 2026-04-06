'use client';

import { useState, useCallback } from 'react';

import { addToast } from '@heroui/toast';
import { useRouter } from 'next/navigation';

import { useSession } from './auth';
import { useCarts } from './useCarts';

interface AddToCartFromListPayload {
  productId: string;
  productName?: string;
  quantity?: number;
  variantId?: string;
}

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: string | string[] }).message;

    if (Array.isArray(message)) {
      return message[0] || 'Không thể thêm sản phẩm vào giỏ hàng.';
    }

    return message || 'Không thể thêm sản phẩm vào giỏ hàng.';
  }

  return 'Không thể thêm sản phẩm vào giỏ hàng.';
};

export const useAddToCartFromList = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { addToCartMutation, getMyCart } = useCarts();

  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  const addToCartFromList = useCallback(
    async ({ productId, productName, quantity = 1, variantId }: AddToCartFromListPayload) => {
      if (!session?.isAuthenticated) {
        addToast({
          color: 'warning',
          description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.',
        });
        router.push('/login');
        return false;
      }

      setAddingProductId(productId);

      try {
        await addToCartMutation.trigger({
          csrf: true,
          productId,
          quantity,
          ...(variantId ? { variantId } : {}),
        });

        await getMyCart.mutate();

        addToast({
          color: 'success',
          description: productName
            ? `Đã thêm ${productName} vào giỏ hàng.`
            : 'Đã thêm sản phẩm vào giỏ hàng.',
        });

        return true;
      } catch (error) {
        addToast({
          color: 'danger',
          description: getErrorMessage(error),
        });

        return false;
      } finally {
        setAddingProductId(current => (current === productId ? null : current));
      }
    },
    [addToCartMutation, getMyCart, router, session?.isAuthenticated],
  );

  return {
    addToCartFromList,
    addingProductId,
  };
};

export type UseAddToCartFromListReturn = ReturnType<typeof useAddToCartFromList>;
