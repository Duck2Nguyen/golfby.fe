import { useMemo } from 'react';

import { useMutation, useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

export type CheckoutPaymentMethod = 'CASH_ON_DELIVERY' | 'BANK_TRANSFER' | 'ONLINE_GATEWAY';
export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELED' | 'REFUNDED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';

export interface CheckoutOrderLine {
  createdAt?: string;
  id: string;
  lineTotal?: number;
  product?: {
    id?: string;
    name?: string;
    slug?: string;
  } | null;
  productId?: string;
  productName?: string;
  quantity?: number;
  sku?: string | null;
  unitPrice?: number;
  variant?: {
    id?: string;
    sku?: string;
  } | null;
  variantId?: string | null;
}

export interface OrderShippingMethod {
  code?: string;
  fee?: number;
  id?: string;
  name?: string;
}

export interface DirectCheckoutPayloadItem {
  productId: string;
  quantity?: number;
  variantId?: string;
}

export interface CheckoutPayload {
  address: string;
  cartItemIds?: string[];
  commune: string;
  csrf?: boolean;
  directItems?: DirectCheckoutPayloadItem[];
  discountCode?: string;
  district: string;
  fullName: string;
  note?: string;
  paymentMethod: CheckoutPaymentMethod;
  phoneNumber: string;
  province: string;
  shippingCode: string;
}

export interface CheckoutOrder {
  address?: string;
  commune?: string;
  createdAt?: string;
  discountId?: string | null;
  discountTotal?: number;
  district?: string;
  fullName?: string;
  id: string;
  note?: string | null;
  orderNumber?: string;
  paymentMethod?: CheckoutPaymentMethod;
  paymentStatus?: PaymentStatus;
  phoneNumber?: string;
  province?: string;
  lines?: CheckoutOrderLine[];
  shippingMethod?: OrderShippingMethod | null;
  shippingFee?: number;
  shippingMethodId?: string;
  status?: OrderStatus;
  subtotal?: number;
  total?: number;
  updatedAt?: string;
  userId?: string;
  vietqrUrl?: string;
}

export interface CheckoutOrderDetail extends CheckoutOrder {
  lines?: CheckoutOrderLine[];
  shippingMethod?: OrderShippingMethod | null;
}

export interface UseOrdersOptions {
  enabledOrderDetail?: boolean;
  orderId?: string;
}

export const useOrders = (options?: UseOrdersOptions) => {
  const requestNonce = useMemo(() => Date.now().toString(36), []);
  const shouldFetchOrderDetail = Boolean(options?.orderId && (options?.enabledOrderDetail ?? true));
  const getMyOrdersKey = `orders:list:${requestNonce}`;

  const getMyOrders = useSWRWrapper<CheckoutOrder[]>(getMyOrdersKey, {
    dedupingInterval: 0,
    method: METHOD.GET,
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    url: '/api/v1/orders',
  });

  const getOrderDetail = useSWRWrapper<CheckoutOrderDetail>(
    shouldFetchOrderDetail ? `orders:detail:${options?.orderId}` : null,
    {
      method: METHOD.GET,
      url: options?.orderId ? `/api/v1/orders/${options.orderId}` : '/api/v1/orders',
    },
  );

  const checkoutMutation = useMutation<CheckoutOrder>('/api/v1/orders/checkout', {
    loading: true,
    method: METHOD.POST,
    url: '/api/v1/orders/checkout',
  });

  return {
    checkoutMutation,
    getOrderDetail,
    getMyOrders,
  };
};

export type UseOrdersReturn = ReturnType<typeof useOrders>;
