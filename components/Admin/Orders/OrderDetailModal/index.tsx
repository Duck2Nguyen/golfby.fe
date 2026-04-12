'use client';

import { useMemo } from 'react';
import { X, RefreshCcw } from 'lucide-react';

import { Spinner } from '@heroui/spinner';

import { useAdminOrderDetail } from '@/hooks/admin/useAdminOrders';

import {
  formatCurrency,
  formatDateTime,
  getCustomerContact,
  getOrderStatusLabel,
  getPaymentStatusLabel,
  getCustomerDisplayName,
} from '../helpers';

interface OrderDetailModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  orderId?: string | null;
}

export default function OrderDetailModal({ isOpen, onCloseAction, orderId }: OrderDetailModalProps) {
  const { data, error, isLoading, isValidating, mutate } = useAdminOrderDetail(orderId || undefined, isOpen);

  const order = data?.data;

  const shippingAddress = useMemo(() => {
    return [order?.address, order?.commune, order?.province].filter(Boolean).join(', ');
  }, [order?.address, order?.commune, order?.province]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCloseAction}
        type="button"
      />

      <div className="relative flex max-h-[92vh] w-full max-w-[96rem] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-[2.0rem] font-700 text-gray-900">Chi tiết đơn hàng</h2>
            <p className="text-[1.3rem] text-gray-500">ID: {orderId || '--'}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-[1.3rem] text-gray-700 transition-colors hover:bg-gray-100"
              onClick={() => {
                void mutate();
              }}
              type="button"
            >
              <RefreshCcw className={`h-4 w-4 ${isValidating ? 'animate-spin' : ''}`} />
              Làm mới
            </button>

            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
              onClick={onCloseAction}
              type="button"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner label="Đang tải đơn hàng" size="lg" />
            </div>
          ) : error || !order ? (
            <div className="py-10 text-center text-[1.4rem] text-danger">
              Không thể tải thông tin đơn hàng.
            </div>
          ) : (
            <>
              <section className="grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-2">
                <div>
                  <p className="text-[1.2rem] text-gray-500">Mã đơn hàng</p>
                  <p className="text-[1.6rem] font-700 text-gray-900">{order.orderNumber || '--'}</p>
                </div>
                <div>
                  <p className="text-[1.2rem] text-gray-500">Thời gian đặt</p>
                  <p className="text-[1.4rem] font-500 text-gray-900">{formatDateTime(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-[1.2rem] text-gray-500">Khách hàng</p>
                  <p className="text-[1.4rem] font-500 text-gray-900">{getCustomerDisplayName(order)}</p>
                  <p className="text-[1.2rem] text-gray-500">{getCustomerContact(order)}</p>
                </div>
                <div>
                  <p className="text-[1.2rem] text-gray-500">Trạng thái</p>
                  <p className="text-[1.4rem] font-500 text-gray-900">
                    Đơn: {getOrderStatusLabel(order.status)}
                  </p>
                  <p className="text-[1.4rem] font-500 text-gray-900">
                    Thanh toán: {getPaymentStatusLabel(order.paymentStatus)}
                  </p>
                </div>
                <div>
                  <p className="text-[1.2rem] text-gray-500">Tạm tính</p>
                  <p className="text-[1.5rem] font-600 text-gray-900">{formatCurrency(order.subtotal)}</p>
                </div>
                <div>
                  <p className="text-[1.2rem] text-gray-500">Tổng thanh toán</p>
                  <p className="text-[1.8rem] font-700 text-primary">{formatCurrency(order.total)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-[1.2rem] text-gray-500">Địa chỉ giao hàng</p>
                  <p className="text-[1.4rem] text-gray-900">{shippingAddress || '--'}</p>
                </div>
              </section>

              <section className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="mb-3 text-[1.7rem] font-600 text-gray-900">Sản phẩm trong đơn</h3>

                {(order.lines ?? []).length === 0 ? (
                  <p className="text-[1.3rem] text-gray-500">Đơn hàng chưa có sản phẩm.</p>
                ) : (
                  <div className="max-h-[36rem] overflow-y-auto">
                    <table className="w-full min-w-[68rem] border-separate border-spacing-0">
                      <thead>
                        <tr>
                          <th className="sticky top-0 bg-white px-3 py-2 text-left text-[1.2rem] font-600 text-gray-500">
                            Sản phẩm
                          </th>
                          <th className="sticky top-0 bg-white px-3 py-2 text-left text-[1.2rem] font-600 text-gray-500">
                            SKU
                          </th>
                          <th className="sticky top-0 bg-white px-3 py-2 text-left text-[1.2rem] font-600 text-gray-500">
                            SL
                          </th>
                          <th className="sticky top-0 bg-white px-3 py-2 text-left text-[1.2rem] font-600 text-gray-500">
                            Thành tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(order.lines ?? []).map(line => (
                          <tr key={line.id}>
                            <td className="border-t border-gray-100 px-3 py-2 text-[1.3rem] text-gray-900">
                              {line.productName || '--'}
                            </td>
                            <td className="border-t border-gray-100 px-3 py-2 text-[1.3rem] text-gray-700">
                              {line.sku || '--'}
                            </td>
                            <td className="border-t border-gray-100 px-3 py-2 text-[1.3rem] text-gray-700">
                              {line.quantity ?? 0}
                            </td>
                            <td className="border-t border-gray-100 px-3 py-2 text-[1.3rem] font-600 text-primary">
                              {formatCurrency(line.lineTotal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
