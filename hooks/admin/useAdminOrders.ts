import type { UserInfo } from '@/interfaces/model';
import type { PaginatedResponse } from '@/interfaces/response';
import type {
  OrderStatus,
  PaymentStatus,
  CheckoutOrderLine,
  OrderWorkflowStatus,
  OrderShippingMethod,
  CheckoutPaymentMethod,
} from '@/hooks/useOrders';

import { useMutation, useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

export const ADMIN_ORDER_STATUSES: OrderWorkflowStatus[] = [
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'COMPLETED',
  'RETURNING',
  'RETURNED',
  'CANCELED',
];

export const ADMIN_PAYMENT_STATUSES: PaymentStatus[] = ['PENDING', 'PAID', 'REFUNDED', 'FAILED'];

export interface AdminOrdersQueryParams {
  orderNumber?: string;
  page?: number;
  paymentStatus?: PaymentStatus;
  size?: number;
  status?: OrderStatus;
  userId?: string;
}

export interface AdminOrderLine extends CheckoutOrderLine {
  createdAt?: string;
}

export interface AdminOrderInventoryItem {
  availableStock: number;
  requiredQuantity: number;
  shortage: number;
  sku?: string | null;
  variantId: string;
  variantStatus: string;
}

export interface AdminOrderStatusHistoryItem {
  changedBy?: string | null;
  createdAt?: string | null;
  fromStatus?: OrderStatus | null;
  id: string;
  toStatus: OrderStatus;
  user?: UserInfo | null;
}

export interface AdminOrderListItem {
  address?: string | null;
  commune?: string | null;
  createdAt?: string | null;
  discountId?: string | null;
  discountTotal?: number | null;
  fullName?: string | null;
  id: string;
  lines?: AdminOrderLine[];
  note?: string | null;
  orderNumber?: string | null;
  paymentMethod?: CheckoutPaymentMethod | null;
  paymentStatus?: PaymentStatus | null;
  phoneNumber?: string | null;
  province?: string | null;
  shippingFee?: number | null;
  shippingMethod?: OrderShippingMethod | null;
  shippingMethodId?: string | null;
  status?: OrderStatus | null;
  subtotal?: number | null;
  total?: number | null;
  updatedAt?: string | null;
  user?: UserInfo | null;
  userId?: string | null;
}

export interface AdminOrderDetail extends AdminOrderListItem {
  allowedTransitions?: OrderWorkflowStatus[];
  discount?: Record<string, unknown> | null;
  inventory?: {
    canConfirm: boolean;
    items: AdminOrderInventoryItem[];
    totalShortage: number;
  };
  statusHistory?: AdminOrderStatusHistoryItem[];
  transactions?: Record<string, unknown>[];
}

export interface UpdateAdminOrderStatusPayload {
  csrf?: boolean;
  orderId: string;
  status: OrderWorkflowStatus;
}

const normalizeListParams = (
  params?: AdminOrdersQueryParams,
): Required<Pick<AdminOrdersQueryParams, 'page' | 'size'>> &
  Omit<AdminOrdersQueryParams, 'page' | 'size'> => {
  const normalized: Required<Pick<AdminOrdersQueryParams, 'page' | 'size'>> &
    Omit<AdminOrdersQueryParams, 'page' | 'size'> = {
    page: params?.page ?? 1,
    size: params?.size ?? 10,
  };

  if (params?.status) normalized.status = params.status;
  if (params?.paymentStatus) normalized.paymentStatus = params.paymentStatus;
  if (params?.userId) normalized.userId = params.userId;

  const normalizedOrderNumber = params?.orderNumber?.trim();
  if (normalizedOrderNumber) {
    normalized.orderNumber = normalizedOrderNumber;
  }

  return normalized;
};

const buildListOrdersKey = (
  params: Required<Pick<AdminOrdersQueryParams, 'page' | 'size'>> &
    Omit<AdminOrdersQueryParams, 'page' | 'size'>,
) => {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
  });

  if (params.status) searchParams.set('status', params.status);
  if (params.paymentStatus) searchParams.set('paymentStatus', params.paymentStatus);
  if (params.userId) searchParams.set('userId', params.userId);
  if (params.orderNumber) searchParams.set('orderNumber', params.orderNumber);

  return `admin-orders:list:${searchParams.toString()}`;
};

export const useAdminOrders = (params?: AdminOrdersQueryParams) => {
  const normalizedParams = normalizeListParams(params);

  return useSWRWrapper<PaginatedResponse<AdminOrderListItem>>(buildListOrdersKey(normalizedParams), {
    body: normalizedParams as unknown as Record<string, unknown>,
    method: METHOD.GET,
    url: '/api/v1/admin/orders',
  });
};

export const useAdminOrderDetail = (orderId?: string, enabled: boolean = true) => {
  const shouldFetch = Boolean(orderId && enabled);

  return useSWRWrapper<AdminOrderDetail>(shouldFetch ? `admin-orders:detail:${orderId}` : null, {
    method: METHOD.GET,
    url: orderId ? `/api/v1/admin/orders/${orderId}` : '/api/v1/admin/orders',
  });
};

export const useUpdateAdminOrderStatus = () => {
  return useMutation('/api/v1/admin/orders/{orderId}/status', {
    method: METHOD.PATCH,
    notification: {
      content: 'Cập nhật trạng thái đơn hàng thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/orders/{orderId}/status',
  });
};
