'use client';

import { useMemo, useState } from 'react';
import { RefreshCcw, ReceiptText } from 'lucide-react';

import Link from 'next/link';
import { Spinner } from '@heroui/spinner';

import type { OrderStatus, PaymentStatus, CheckoutOrderLine } from '@/hooks/useOrders';

import { useOrders } from '@/hooks/useOrders';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

const formatCurrency = (value?: number) => {
  return `${(value ?? 0).toLocaleString('vi-VN')} VND`;
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

const getLineTotal = (line: CheckoutOrderLine) => {
  const lineTotal = line.lineTotal ?? 0;

  if (lineTotal > 0) {
    return lineTotal;
  }

  const unitPrice = line.unitPrice ?? 0;
  const quantity = line.quantity ?? 0;

  return unitPrice * quantity;
};

type OrderStatusFilter = 'ALL' | OrderStatus;

const ORDER_STATUS_FILTERS: Array<{ label: string; value: OrderStatusFilter }> = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Chờ xử lý', value: 'PENDING' },
  { label: 'Đã thanh toán', value: 'PAID' },
  { label: 'Đang giao', value: 'SHIPPED' },
  { label: 'Hoàn tất', value: 'COMPLETED' },
  { label: 'Đã hủy', value: 'CANCELED' },
  { label: 'Đã hoàn tiền', value: 'REFUNDED' },
];

export default function OrderHistory() {
  const { getMyOrders } = useOrders();
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<OrderStatusFilter>('ALL');

  const allOrders = useMemo(() => {
    return Array.isArray(getMyOrders.data?.data) ? getMyOrders.data.data : [];
  }, [getMyOrders.data?.data]);

  const filteredOrders = useMemo(() => {
    if (selectedStatusFilter === 'ALL') {
      return allOrders;
    }

    return allOrders.filter(order => order.status === selectedStatusFilter);
  }, [allOrders, selectedStatusFilter]);

  const toggleExpandedOrder = (orderId: string) => {
    setExpandedOrderIds(previous =>
      previous.includes(orderId) ? previous.filter(id => id !== orderId) : [...previous, orderId],
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 pb-16">
        <nav className="flex items-center gap-1.5 py-4 text-[13px]">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            Trang Chủ
          </Link>
          <span className="text-muted-foreground/50">›</span>
          <span className="text-foreground font-500">Lịch sử đơn hàng</span>
        </nav>

        <section className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-[2.6rem] leading-[3.2rem] font-700 text-foreground">Lịch sử đơn hàng</h1>
            <p className="mt-1 text-[1.4rem] text-muted-foreground">
              Danh sách tất cả đơn hàng của tài khoản hiện tại.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              void getMyOrders.mutate();
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-[1.4rem] text-foreground transition-colors hover:bg-default-100"
          >
            <RefreshCcw className={`h-4 w-4 ${getMyOrders.isValidating ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </section>

        <section className="mb-5 flex flex-wrap items-center gap-2">
          <p className="text-[1.3rem] font-600 text-muted-foreground">Lọc trạng thái:</p>
          {ORDER_STATUS_FILTERS.map(filter => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setSelectedStatusFilter(filter.value)}
              className={`rounded-full px-3 py-1.5 text-[1.2rem] font-600 transition-colors ${
                selectedStatusFilter === filter.value
                  ? 'bg-primary text-white'
                  : 'border border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-primary'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </section>

        {getMyOrders.isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner label="Đang tải danh sách đơn hàng" size="lg" />
          </div>
        ) : getMyOrders.error ? (
          <section className="rounded-2xl border border-danger/30 bg-white p-8 text-center">
            <p className="text-[1.6rem] font-600 text-danger">Không thể tải lịch sử đơn hàng.</p>
            <button
              type="button"
              onClick={() => {
                void getMyOrders.mutate();
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2 text-[1.4rem] text-foreground transition-colors hover:bg-default-100"
            >
              <RefreshCcw className="h-4 w-4" />
              Thử lại
            </button>
          </section>
        ) : allOrders.length === 0 ? (
          <section className="rounded-2xl border border-border bg-white p-10 text-center">
            <ReceiptText className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-[1.8rem] font-700 text-foreground">Chưa có đơn hàng</p>
            <p className="mt-1 text-[1.4rem] text-muted-foreground">
              Đơn hàng của bạn sẽ hiển thị tại đây khi phát sinh giao dịch.
            </p>
            <Link
              href="/collection"
              className="mt-5 inline-flex items-center rounded-xl bg-primary px-5 py-2 text-[1.4rem] text-white transition-colors hover:bg-primary-dark"
            >
              Tiếp tục mua sắm
            </Link>
          </section>
        ) : filteredOrders.length === 0 ? (
          <section className="rounded-2xl border border-border bg-white p-10 text-center">
            <ReceiptText className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-[1.8rem] font-700 text-foreground">Không có đơn ở trạng thái đã chọn</p>
            <button
              type="button"
              onClick={() => setSelectedStatusFilter('ALL')}
              className="mt-4 inline-flex items-center rounded-xl bg-primary px-5 py-2 text-[1.4rem] text-white transition-colors hover:bg-primary-dark"
            >
              Xem tất cả đơn hàng
            </button>
          </section>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const orderStatusMeta = getOrderStatusMeta(order.status);
              const paymentStatusMeta = getPaymentStatusMeta(order.paymentStatus);
              const previewLines = (order.lines ?? []).slice(0, 2);
              const hiddenLinesCount = Math.max((order.lines?.length ?? 0) - previewLines.length, 0);
              const isExpanded = expandedOrderIds.includes(order.id);

              return (
                <article key={order.id} className="rounded-2xl border border-border bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="max-w-[56rem] truncate text-[1.6rem] leading-[2.2rem] font-700 text-foreground">
                        {order.orderNumber || '--'}
                      </p>
                      <p className="mt-1 text-[1.2rem] text-muted-foreground">Tổng thanh toán</p>
                      <p className="text-[1.8rem] leading-[2.4rem] font-700 text-primary">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex flex-wrap justify-end items-center gap-2">
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
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleExpandedOrder(order.id)}
                          className="inline-flex items-center rounded-lg bg-default-100 px-3 py-1.5 text-[1.2rem] text-foreground transition-colors hover:bg-default-200"
                        >
                          {isExpanded ? 'Thu gọn' : 'Mở rộng'}
                        </button>
                        <Link
                          href={`/orders/${order.id}`}
                          className="inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-[1.2rem] text-white transition-colors hover:bg-primary-dark"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 rounded-xl border border-border bg-default-50 p-4">
                      <p className="text-[1.3rem] font-700 text-foreground">Sản phẩm trong đơn</p>
                      <div className="mt-2 space-y-2">
                        {previewLines.map(line => (
                          <div key={line.id} className="rounded-lg border border-border bg-white px-3 py-2">
                            <p
                              className="text-[1.4rem] font-600 text-foreground truncate"
                              title={line.productName || '--'}
                            >
                              {line.productName || '--'}
                            </p>
                            <div className="mt-0.5 flex flex-wrap items-center justify-between gap-2">
                              <p
                                className="min-w-0 text-[1.2rem] text-muted-foreground truncate"
                                title={line.sku || '--'}
                              >
                                SL: {line.quantity ?? 0}
                              </p>
                              <p className="text-[1.2rem] font-700 text-foreground">
                                {formatCurrency(getLineTotal(line))}
                              </p>
                            </div>
                          </div>
                        ))}
                        {previewLines.length === 0 && (
                          <p className="text-[1.3rem] text-muted-foreground">Không có dữ liệu sản phẩm.</p>
                        )}
                        {hiddenLinesCount > 0 && (
                          <p className="text-[1.2rem] text-primary">+{hiddenLinesCount} sản phẩm khác...</p>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
