import type { OrderStatus, PaymentStatus } from '@/hooks/useOrders';
import type { AdminOrderListItem } from '@/hooks/admin/useAdminOrders';

export const toNumber = (value?: number | string | null) => {
  const parsed = Number(value ?? 0);

  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatCurrency = (value?: number | string | null) => {
  return `${toNumber(value).toLocaleString('vi-VN')} đ`;
};

export const formatDateTime = (value?: string | null) => {
  if (!value) {
    return '--';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return date.toLocaleString('vi-VN');
};

export const getOrderStatusLabel = (status?: OrderStatus | string | null) => {
  switch (status) {
    case 'PENDING':
      return 'Chờ xử lý';
    case 'PAID':
      return 'Đã xác nhận';
    case 'SHIPPED':
      return 'Đang giao';
    case 'COMPLETED':
      return 'Hoàn tất';
    case 'CANCELED':
      return 'Đã hủy';
    case 'REFUNDED':
      return 'Hoàn tiền';
    default:
      return status || 'Không rõ';
  }
};

export const getOrderStatusClassName = (status?: OrderStatus | string | null) => {
  switch (status) {
    case 'PENDING':
      return 'bg-warning-100 text-warning-700 border-warning-200';
    case 'PAID':
      return 'bg-primary-light text-primary border-primary/20';
    case 'SHIPPED':
      return 'bg-secondary-100 text-secondary-700 border-secondary-200';
    case 'COMPLETED':
      return 'bg-success-100 text-success-700 border-success-200';
    case 'CANCELED':
      return 'bg-danger-100 text-danger border-danger/30';
    case 'REFUNDED':
      return 'bg-default-100 text-default-700 border-default-200';
    default:
      return 'bg-default-100 text-default-700 border-default-200';
  }
};

export const getPaymentStatusLabel = (status?: PaymentStatus | string | null) => {
  switch (status) {
    case 'PENDING':
      return 'Chưa thanh toán';
    case 'PAID':
      return 'Đã thanh toán';
    case 'REFUNDED':
      return 'Đã hoàn tiền';
    case 'FAILED':
      return 'Thất bại';
    default:
      return status || 'Không rõ';
  }
};

export const getPaymentStatusClassName = (status?: PaymentStatus | string | null) => {
  switch (status) {
    case 'PENDING':
      return 'bg-warning-100 text-warning-700 border-warning-200';
    case 'PAID':
      return 'bg-success-100 text-success-700 border-success-200';
    case 'REFUNDED':
      return 'bg-secondary-100 text-secondary-700 border-secondary-200';
    case 'FAILED':
      return 'bg-danger-100 text-danger border-danger/30';
    default:
      return 'bg-default-100 text-default-700 border-default-200';
  }
};

export const getCustomerDisplayName = (order?: AdminOrderListItem) => {
  const userName = `${order?.user?.lastName || ''} ${order?.user?.firstName || ''}`.trim();

  return order?.fullName || userName || '--';
};

export const getCustomerContact = (order?: AdminOrderListItem) => {
  return order?.phoneNumber || order?.user?.phoneNumber || order?.user?.email || '--';
};
