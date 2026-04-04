'use client';

import { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, RefreshCcw } from 'lucide-react';

import Link from 'next/link';
import { Spinner } from '@heroui/spinner';

import { useOrders } from '@/hooks/useOrders';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

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

const getOrderStatusMeta = (status?: string) => {
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

const getPaymentStatusMeta = (status?: string) => {
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

export default function CheckoutPayment() {
  const [isQueryReady, setIsQueryReady] = useState(false);
  const [queryParams, setQueryParams] = useState({
    orderId: '',
    vietqrUrl: '',
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    setQueryParams({
      orderId: searchParams.get('orderId')?.trim() || '',
      vietqrUrl: searchParams.get('vietqrUrl')?.trim() || '',
    });
    setIsQueryReady(true);
  }, []);

  const { orderId, vietqrUrl } = queryParams;

  const { getOrderDetail } = useOrders({
    enabledOrderDetail: Boolean(orderId),
    orderId: orderId || undefined,
  });

  const order = getOrderDetail.data?.data;

  const shippingAddress = useMemo(() => {
    return [order?.address, order?.commune, order?.district, order?.province].filter(Boolean).join(', ');
  }, [order?.address, order?.commune, order?.district, order?.province]);

  const orderStatusMeta = getOrderStatusMeta(order?.status);
  const paymentStatusMeta = getPaymentStatusMeta(order?.paymentStatus);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 pb-16">
        <nav className="flex items-center gap-1.5 py-4 text-[13px]">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            Trang Chủ
          </Link>
          <span className="text-muted-foreground/50">›</span>
          <Link href="/checkout" className="text-muted-foreground hover:text-primary transition-colors">
            Thanh Toán
          </Link>
          <span className="text-muted-foreground/50">›</span>
          <span className="text-foreground font-500">Quét QR</span>
        </nav>

        {!isQueryReady ? (
          <div className="flex items-center justify-center py-20">
            <Spinner label="Đang chuẩn bị thanh toán" size="lg" />
          </div>
        ) : !orderId ? (
          <section className="rounded-2xl border border-border bg-white p-8 text-center">
            <p className="text-[1.6rem] font-600 text-foreground">
              Không tìm thấy thông tin đơn hàng để thanh toán.
            </p>
            <Link
              href="/checkout"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-[1.4rem] text-white transition-colors hover:bg-primary-dark"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại thanh toán
            </Link>
          </section>
        ) : getOrderDetail.isLoading && !order ? (
          <div className="flex items-center justify-center py-20">
            <Spinner label="Đang tải đơn hàng" size="lg" />
          </div>
        ) : getOrderDetail.error && !order ? (
          <section className="rounded-2xl border border-danger/30 bg-white p-8 text-center">
            <p className="text-[1.6rem] font-600 text-danger">Không thể tải thông tin đơn hàng.</p>
            <button
              type="button"
              onClick={() => {
                void getOrderDetail.mutate();
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2 text-[1.4rem] text-foreground transition-colors hover:bg-default-100"
            >
              <RefreshCcw className="h-4 w-4" />
              Tải lại
            </button>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[38rem_minmax(0,1fr)]">
            <section className="rounded-2xl border border-border bg-white p-6">
              <h1 className="text-[2.0rem] leading-[2.8rem] font-700 text-foreground">
                Thanh toán chuyển khoản
              </h1>
              <p className="mt-2 text-[1.4rem] leading-[2rem] text-muted-foreground">
                Quét mã QR bên dưới để hoàn tất thanh toán cho đơn hàng.
              </p>

              <div className="mt-5 rounded-2xl border border-border bg-default-50 p-4">
                {vietqrUrl ? (
                  <ImageWithFallback
                    src={vietqrUrl}
                    alt="Mã QR thanh toán"
                    className="mx-auto h-[28rem] w-[28rem] rounded-xl border border-border bg-white object-contain"
                  />
                ) : (
                  <p className="py-16 text-center text-[1.4rem] text-muted-foreground">
                    Không có mã QR cho đơn hàng này.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  void getOrderDetail.mutate();
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-[1.4rem] text-foreground transition-colors hover:bg-default-100"
              >
                <RefreshCcw className={`h-4 w-4 ${getOrderDetail.isValidating ? 'animate-spin' : ''}`} />
                Cập nhật trạng thái
              </button>
            </section>

            <section className="rounded-2xl border border-border bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[2.0rem] leading-[2.8rem] font-700 text-foreground">
                  Thông tin đơn hàng
                </h2>
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

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-default-50 p-4">
                  <p className="text-[1.2rem] text-muted-foreground">Mã đơn hàng</p>
                  <p className="text-[1.5rem] font-700 text-foreground">{order?.orderNumber || '--'}</p>
                </div>
                <div className="rounded-xl border border-border bg-default-50 p-4">
                  <p className="text-[1.2rem] text-muted-foreground">Thời gian tạo</p>
                  <p className="text-[1.5rem] font-700 text-foreground">{formatDateTime(order?.createdAt)}</p>
                </div>
                <div className="rounded-xl border border-border bg-default-50 p-4">
                  <p className="text-[1.2rem] text-muted-foreground">Phương thức thanh toán</p>
                  <p className="text-[1.5rem] font-700 text-foreground">
                    {getPaymentMethodLabel(order?.paymentMethod)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-default-50 p-4">
                  <p className="text-[1.2rem] text-muted-foreground">Tổng thanh toán</p>
                  <p className="text-[1.7rem] font-700 text-destructive">{formatCurrency(order?.total)}</p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-border p-4">
                <p className="text-[1.3rem] font-700 text-foreground">Người nhận</p>
                <p className="mt-1 text-[1.4rem] text-foreground">{order?.fullName || '--'}</p>
                <p className="mt-1 text-[1.4rem] text-muted-foreground">{order?.phoneNumber || '--'}</p>
                <p className="mt-1 text-[1.4rem] text-muted-foreground">{shippingAddress || '--'}</p>
              </div>

              <div className="mt-5 rounded-xl border border-border p-4">
                <p className="mb-3 text-[1.3rem] font-700 text-foreground">Sản phẩm trong đơn</p>
                <div className="space-y-2">
                  {(order?.lines ?? []).map(line => (
                    <div
                      key={line.id}
                      className="flex items-start justify-between gap-3 rounded-lg bg-default-50 p-3"
                    >
                      <div>
                        <p className="text-[1.4rem] font-600 text-foreground">{line.productName || '--'}</p>
                        <p className="text-[1.2rem] text-muted-foreground">
                          SL: {line.quantity ?? 0}
                          {line.sku ? ` • SKU: ${line.sku}` : ''}
                        </p>
                      </div>
                      <p className="text-[1.3rem] font-700 text-foreground">
                        {formatCurrency(line.lineTotal)}
                      </p>
                    </div>
                  ))}
                  {(order?.lines ?? []).length === 0 && (
                    <p className="text-[1.3rem] text-muted-foreground">Không có dữ liệu sản phẩm.</p>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
