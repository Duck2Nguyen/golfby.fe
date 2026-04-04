'use client';

import { useMemo } from 'react';
import { ArrowLeft, RefreshCcw } from 'lucide-react';

import Link from 'next/link';
import { Spinner } from '@heroui/spinner';

import { useOrders, type OrderStatus, type PaymentStatus, type CheckoutOrderLine } from '@/hooks/useOrders';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

interface OrderDetailProps {
  orderId: string;
}

const formatCurrency = (value?: number) => {
  return `${(value ?? 0).toLocaleString('vi-VN')} VND`;
};

const formatDateTime = (value?: string) => {
  if (!value) {
    return '--';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return date.toLocaleString('vi-VN');
};

const getOrderStatusMeta = (status?: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return {
        badgeClassName: 'bg-warning-100 text-warning-700',
        label: 'Chờ xử lý',
      };
    case 'PAID':
      return {
        badgeClassName: 'bg-success-100 text-success-700',
        label: 'Đã thanh toán',
      };
    case 'SHIPPED':
      return {
        badgeClassName: 'bg-primary/10 text-primary',
        label: 'Đang giao',
      };
    case 'COMPLETED':
      return {
        badgeClassName: 'bg-success-100 text-success-700',
        label: 'Hoàn tất',
      };
    case 'CANCELED':
      return {
        badgeClassName: 'bg-danger-100 text-danger',
        label: 'Đã hủy',
      };
    case 'REFUNDED':
      return {
        badgeClassName: 'bg-secondary-100 text-secondary-700',
        label: 'Đã hoàn tiền',
      };
    default:
      return {
        badgeClassName: 'bg-default-100 text-default-700',
        label: status || 'Không rõ',
      };
  }
};

const getPaymentStatusMeta = (status?: PaymentStatus) => {
  switch (status) {
    case 'PENDING':
      return {
        badgeClassName: 'bg-warning-100 text-warning-700',
        label: 'Chờ thanh toán',
      };
    case 'PAID':
      return {
        badgeClassName: 'bg-success-100 text-success-700',
        label: 'Đã thanh toán',
      };
    case 'REFUNDED':
      return {
        badgeClassName: 'bg-secondary-100 text-secondary-700',
        label: 'Đã hoàn tiền',
      };
    case 'FAILED':
      return {
        badgeClassName: 'bg-danger-100 text-danger',
        label: 'Thanh toán thất bại',
      };
    default:
      return {
        badgeClassName: 'bg-default-100 text-default-700',
        label: status || 'Không rõ',
      };
  }
};

const getPaymentMethodLabel = (paymentMethod?: string) => {
  switch (paymentMethod) {
    case 'BANK_TRANSFER':
      return 'Chuyển khoản ngân hàng';
    case 'CASH_ON_DELIVERY':
      return 'Thanh toán khi nhận hàng';
    case 'ONLINE_GATEWAY':
      return 'Cổng thanh toán trực tuyến';
    default:
      return paymentMethod || '--';
  }
};

const toNumber = (value?: number | string | null) => {
  const parsed = Number(value ?? 0);

  return Number.isFinite(parsed) ? parsed : 0;
};

const buildLineTotal = (line: CheckoutOrderLine) => {
  const lineTotal = toNumber(line.lineTotal);

  if (lineTotal > 0) {
    return lineTotal;
  }

  const quantity = toNumber(line.quantity);
  const unitPrice = toNumber(line.unitPrice);

  return quantity * unitPrice;
};

interface OrderLineViewModel {
  createdAt?: string;
  id: string;
  lineTotal: number;
  productId?: string;
  productName: string;
  quantity: number;
  sku: string;
  unitPrice: number;
  variantId?: string;
}

interface OrderDetailLineFallback {
  items?: CheckoutOrderLine[];
  lines?: CheckoutOrderLine[];
  orderLines?: CheckoutOrderLine[];
}

export default function OrderDetail({ orderId }: OrderDetailProps) {
  const { getOrderDetail, getMyOrders } = useOrders({
    enabledOrderDetail: Boolean(orderId),
    orderId: orderId || undefined,
  });

  const order = getOrderDetail.data?.data;
  const fallbackOrder = useMemo(() => {
    const orders = Array.isArray(getMyOrders.data?.data) ? getMyOrders.data.data : [];

    return orders.find(item => item.id === orderId);
  }, [getMyOrders.data?.data, orderId]);

  const normalizedLines = useMemo<OrderLineViewModel[]>(() => {
    const orderWithFallbackKeys = order as (typeof order & OrderDetailLineFallback) | undefined;
    const fallbackOrderWithKeys = fallbackOrder as
      | (typeof fallbackOrder & OrderDetailLineFallback)
      | undefined;

    const lineSources = [
      orderWithFallbackKeys?.lines,
      orderWithFallbackKeys?.orderLines,
      orderWithFallbackKeys?.items,
      fallbackOrderWithKeys?.lines,
      fallbackOrderWithKeys?.orderLines,
      fallbackOrderWithKeys?.items,
    ];

    const rawLines =
      lineSources.find(source => Array.isArray(source) && source.length > 0) ??
      (Array.isArray(orderWithFallbackKeys?.lines) ? orderWithFallbackKeys.lines : []);

    return rawLines.map((line, index) => {
      const productName = line.productName || line.product?.name || '--';
      const sku = line.sku || line.variant?.sku || line.variantId || '--';
      const quantity = toNumber(line.quantity);
      const unitPrice = toNumber(line.unitPrice);
      const lineTotal = buildLineTotal(line);

      return {
        createdAt: line.createdAt,
        id: line.id || `line-${index}`,
        lineTotal,
        ...(line.productId ? { productId: line.productId } : {}),
        productName,
        quantity,
        sku,
        unitPrice,
        ...(line.variantId ? { variantId: line.variantId } : {}),
      };
    });
  }, [fallbackOrder, order]);

  const shippingAddress = useMemo(() => {
    return [order?.address, order?.commune, order?.district, order?.province].filter(Boolean).join(', ');
  }, [order?.address, order?.commune, order?.district, order?.province]);

  const orderStatusMeta = getOrderStatusMeta(order?.status);
  const paymentStatusMeta = getPaymentStatusMeta(order?.paymentStatus);

  if (!orderId) {
    return (
      <div className="min-h-screen bg-[#f8f9fa]">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-10">
          <section className="rounded-2xl border border-border bg-white p-8 text-center">
            <p className="text-[1.6rem] font-600 text-foreground">Không tìm thấy mã đơn hàng.</p>
            <Link
              href="/orders"
              className="mt-4 inline-flex items-center rounded-xl bg-primary px-4 py-2 text-[1.4rem] text-white transition-colors hover:bg-primary-dark"
            >
              Quay lại lịch sử đơn hàng
            </Link>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 pb-16">
        <nav className="flex items-center gap-1.5 py-4 text-[13px]">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            Trang Chủ
          </Link>
          <span className="text-muted-foreground/50">›</span>
          <Link href="/orders" className="text-muted-foreground hover:text-primary transition-colors">
            Lịch sử đơn hàng
          </Link>
          <span className="text-muted-foreground/50">›</span>
          <span className="text-foreground font-500">Chi tiết đơn</span>
        </nav>

        <section className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-[2.6rem] leading-[3.2rem] font-700 text-foreground">Chi tiết đơn hàng</h1>
            <p className="mt-1 text-[1.4rem] text-muted-foreground">Xem đầy đủ thông tin đơn hàng của bạn.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                void getOrderDetail.mutate();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-[1.4rem] text-foreground transition-colors hover:bg-default-100"
            >
              <RefreshCcw className={`h-4 w-4 ${getOrderDetail.isValidating ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-[1.4rem] text-foreground transition-colors hover:bg-default-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Link>
          </div>
        </section>

        {getOrderDetail.isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner label="Đang tải chi tiết đơn hàng" size="lg" />
          </div>
        ) : getOrderDetail.error || !order ? (
          <section className="rounded-2xl border border-danger/30 bg-white p-8 text-center">
            <p className="text-[1.6rem] font-600 text-danger">Không thể tải chi tiết đơn hàng.</p>
            <button
              type="button"
              onClick={() => {
                void getOrderDetail.mutate();
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2 text-[1.4rem] text-foreground transition-colors hover:bg-default-100"
            >
              <RefreshCcw className="h-4 w-4" />
              Thử lại
            </button>
          </section>
        ) : (
          <div className="space-y-4">
            <section className="rounded-2xl border border-border bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[1.8rem] font-700 text-foreground">{order.orderNumber || '--'}</p>
                  <p className="mt-1 text-[1.3rem] text-muted-foreground">
                    Tạo lúc: {formatDateTime(order.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-[1.2rem] font-600 ${orderStatusMeta.badgeClassName}`}
                  >
                    Đơn: {orderStatusMeta.label}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-[1.2rem] font-600 ${paymentStatusMeta.badgeClassName}`}
                  >
                    Thanh toán: {paymentStatusMeta.label}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_30rem]">
                <div className="rounded-xl border border-border bg-default-50 p-4">
                  <p className="text-[1.3rem] font-700 text-foreground">Thông tin nhận hàng</p>
                  <p className="mt-1 text-[1.4rem] text-foreground">{order.fullName || '--'}</p>
                  <p className="mt-1 text-[1.3rem] text-muted-foreground">{order.phoneNumber || '--'}</p>
                  <p className="mt-1 text-[1.3rem] text-muted-foreground">{shippingAddress || '--'}</p>
                  {order.note && (
                    <p className="mt-2 text-[1.3rem] text-muted-foreground">Ghi chú: {order.note}</p>
                  )}
                </div>

                <div className="rounded-xl border border-border bg-default-50 p-4">
                  <p className="text-[1.2rem] text-muted-foreground">Phương thức thanh toán</p>
                  <p className="text-[1.4rem] font-700 text-foreground">
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </p>

                  <p className="mt-2 text-[1.2rem] text-muted-foreground">Tạm tính</p>
                  <p className="text-[1.4rem] font-700 text-foreground">{formatCurrency(order.subtotal)}</p>

                  <p className="mt-2 text-[1.2rem] text-muted-foreground">Giảm giá</p>
                  <p className="text-[1.4rem] font-700 text-foreground">
                    {formatCurrency(order.discountTotal)}
                  </p>

                  <p className="mt-2 text-[1.2rem] text-muted-foreground">Phí vận chuyển</p>
                  <p className="text-[1.4rem] font-700 text-foreground">
                    {formatCurrency(order.shippingFee)}
                  </p>

                  <p className="mt-2 text-[1.2rem] text-muted-foreground">Tổng thanh toán</p>
                  <p className="text-[1.7rem] font-700 text-primary">{formatCurrency(order.total)}</p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-white p-5">
              <h2 className="text-[1.8rem] font-700 text-foreground">Sản phẩm trong đơn</h2>
              <div className="mt-3 space-y-1">
                {normalizedLines.map(line => (
                  <div key={line.id} className="rounded-xl border border-border bg-default-50 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[1.5rem] font-700 text-foreground">{line.productName}</p>
                        <p className="mt-0.5 text-[1.3rem] text-muted-foreground">
                          Số lượng: {line.quantity}
                        </p>
                        <p className="mt-0.5 text-[1.3rem] text-muted-foreground">
                          Đơn giá: {formatCurrency(line.unitPrice)}
                        </p>
                      </div>
                      <p className="text-[1.5rem] font-700 text-primary">{formatCurrency(line.lineTotal)}</p>
                    </div>
                  </div>
                ))}
                {normalizedLines.length === 0 && (
                  <p className="text-[1.3rem] text-muted-foreground">
                    Không có dữ liệu sản phẩm trong chi tiết đơn hàng. Vui lòng bấm &quot;Làm mới&quot; để thử
                    tải lại.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
