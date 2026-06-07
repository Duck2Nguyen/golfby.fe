'use client';

import { useMemo, useState } from 'react';
import { X, Ban, Check, Truck, RotateCcw, RefreshCcw, PackageCheck, AlertTriangle } from 'lucide-react';

import { Spinner } from '@heroui/spinner';

import type { OrderStatus, OrderWorkflowStatus } from '@/hooks/useOrders';

import { useAdminOrderDetail, useUpdateAdminOrderStatus } from '@/hooks/admin/useAdminOrders';

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
  onUpdatedAction?: () => void;
  orderId?: string | null;
}

const getActionLabel = (status: OrderWorkflowStatus) => {
  switch (status) {
    case 'CONFIRMED':
      return 'Xác nhận đơn';
    case 'SHIPPED':
      return 'Bàn giao vận chuyển';
    case 'COMPLETED':
      return 'Giao thành công';
    case 'RETURNING':
      return 'Xử lý hoàn hàng';
    case 'RETURNED':
      return 'Đã nhận đủ và hoàn kho';
    case 'CANCELED':
      return 'Hủy đơn';
    default:
      return getOrderStatusLabel(status);
  }
};

const getConfirmDescription = (from: OrderStatus | null | undefined, to: OrderWorkflowStatus) => {
  if (to === 'CONFIRMED') {
    return 'Hệ thống sẽ kiểm tra và trừ tồn kho của toàn bộ sản phẩm trong đơn.';
  }
  if (to === 'CANCELED' && from === 'CONFIRMED') {
    return 'Đơn sẽ bị hủy và toàn bộ số lượng đã giữ sẽ được hoàn lại kho.';
  }
  if (to === 'CANCELED') {
    return 'Đơn sẽ bị hủy và không thể chuyển lại trạng thái trước đó.';
  }
  if (to === 'RETURNING') {
    return 'Đơn sẽ chuyển sang trạng thái đang hoàn hàng. Kho chưa được cộng lại ở bước này.';
  }
  if (to === 'RETURNED') {
    return 'Chỉ xác nhận khi nhân viên đã nhận và kiểm tra đủ toàn bộ sản phẩm. Hệ thống sẽ hoàn toàn bộ số lượng vào kho.';
  }

  return `Đơn sẽ chuyển sang trạng thái “${getOrderStatusLabel(to)}” và không thể quay lại trạng thái trước.`;
};

const getActionIcon = (status: OrderWorkflowStatus) => {
  switch (status) {
    case 'CONFIRMED':
      return PackageCheck;
    case 'SHIPPED':
      return Truck;
    case 'COMPLETED':
      return Check;
    case 'RETURNING':
    case 'RETURNED':
      return RotateCcw;
    case 'CANCELED':
      return Ban;
    default:
      return Check;
  }
};

const buildTimeline = (
  currentStatus: OrderStatus | null | undefined,
  historyStatuses: OrderStatus[],
): OrderStatus[] => {
  if (currentStatus === 'CANCELED') {
    return Array.from(
      new Set<OrderStatus>([...historyStatuses.filter(status => status !== 'CANCELED'), 'CANCELED']),
    );
  }

  if (currentStatus === 'RETURNING' || currentStatus === 'RETURNED') {
    return [
      'PENDING',
      'CONFIRMED',
      'SHIPPED',
      ...(historyStatuses.includes('COMPLETED') ? (['COMPLETED'] as const) : []),
      'RETURNING',
      'RETURNED',
    ];
  }

  return ['PENDING', 'CONFIRMED', 'SHIPPED', 'COMPLETED'];
};

export default function OrderDetailModal({
  isOpen,
  onCloseAction,
  onUpdatedAction,
  orderId,
}: OrderDetailModalProps) {
  const [pendingStatus, setPendingStatus] = useState<OrderWorkflowStatus | null>(null);
  const { data, error, isLoading, isValidating, mutate } = useAdminOrderDetail(orderId || undefined, isOpen);
  const updateStatusMutation = useUpdateAdminOrderStatus();

  const order = data?.data;

  const shippingAddress = useMemo(() => {
    return [order?.address, order?.commune, order?.province].filter(Boolean).join(', ');
  }, [order?.address, order?.commune, order?.province]);

  const historyStatuses = useMemo(
    () => (order?.statusHistory ?? []).map(item => item.toStatus),
    [order?.statusHistory],
  );
  const timeline = useMemo(
    () => buildTimeline(order?.status, historyStatuses),
    [historyStatuses, order?.status],
  );
  const visitedStatuses = useMemo(
    () => new Set<OrderStatus>([...historyStatuses, ...(order?.status ? [order.status] : [])]),
    [historyStatuses, order?.status],
  );

  const handleConfirmStatus = async () => {
    if (!orderId || !pendingStatus) return;

    try {
      await updateStatusMutation.trigger({
        csrf: true,
        orderId,
        status: pendingStatus,
      });
      setPendingStatus(null);
      await mutate();
      onUpdatedAction?.();
    } catch {
      setPendingStatus(null);
      await mutate();
    }
  };

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

      <div className="relative flex max-h-[92vh] w-full max-w-[104rem] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
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
              <section className="rounded-xl border border-gray-200 bg-white px-5 py-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-[1.6rem] font-700 text-gray-900">Tiến trình đơn hàng</h3>
                    <p className="text-[1.2rem] text-gray-500">
                      Trạng thái chỉ được chuyển tiếp theo đúng quy trình.
                    </p>
                  </div>
                  <span className="rounded-full border border-primary/20 bg-primary-light px-3 py-1 text-[1.2rem] font-600 text-primary">
                    {getOrderStatusLabel(order.status)}
                  </span>
                </div>

                <div className="flex min-w-[64rem] items-start overflow-x-auto pb-2">
                  {timeline.map((status, index) => {
                    const visited = visitedStatuses.has(status);
                    const current = order.status === status;

                    return (
                      <div className="flex flex-1 items-start" key={`${status}-${index}`}>
                        <div className="flex min-w-[10rem] flex-col items-center text-center">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                              visited
                                ? 'border-primary bg-primary text-white'
                                : 'border-gray-200 bg-white text-gray-400'
                            } ${current ? 'ring-4 ring-primary/15' : ''}`}
                          >
                            {visited ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
                          </div>
                          <p
                            className={`mt-2 text-[1.2rem] font-600 ${
                              visited ? 'text-gray-900' : 'text-gray-400'
                            }`}
                          >
                            {getOrderStatusLabel(status)}
                          </p>
                        </div>
                        {index < timeline.length - 1 ? (
                          <div
                            className={`mt-4 h-0.5 flex-1 ${
                              visitedStatuses.has(timeline[index + 1]) ? 'bg-primary' : 'bg-gray-200'
                            }`}
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                {(order.allowedTransitions ?? []).length > 0 ? (
                  <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4">
                    {(order.allowedTransitions ?? []).map(status => {
                      const Icon = getActionIcon(status);
                      const cannotConfirm = status === 'CONFIRMED' && !order.inventory?.canConfirm;
                      const destructive = status === 'CANCELED';

                      return (
                        <button
                          className={`flex h-10 items-center gap-2 rounded-lg px-4 text-[1.3rem] font-600 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                            destructive ? 'bg-danger hover:bg-danger/90' : 'bg-primary hover:bg-primary-dark'
                          }`}
                          disabled={cannotConfirm || updateStatusMutation.isMutating}
                          key={status}
                          onClick={() => setPendingStatus(status)}
                          title={cannotConfirm ? 'Cần nhập đủ tồn kho trước khi xác nhận đơn' : undefined}
                          type="button"
                        >
                          <Icon className="h-4 w-4" />
                          {getActionLabel(status)}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </section>

              {order.status === 'PENDING' && order.inventory && !order.inventory.canConfirm ? (
                <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="mb-3 flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                    <div>
                      <h3 className="text-[1.5rem] font-700 text-amber-900">Chưa đủ tồn kho để xác nhận</h3>
                      <p className="text-[1.3rem] text-amber-800">
                        Nhập thêm sản phẩm trong trang quản lý sản phẩm, sau đó tải lại đơn hàng.
                      </p>
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-amber-200 bg-white">
                    <table className="w-full min-w-[56rem]">
                      <thead>
                        <tr className="text-left text-[1.2rem] text-gray-500">
                          <th className="px-3 py-2">SKU</th>
                          <th className="px-3 py-2">Đơn cần</th>
                          <th className="px-3 py-2">Tồn hiện tại</th>
                          <th className="px-3 py-2">Còn thiếu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.inventory.items.map(item => (
                          <tr className="border-t border-gray-100 text-[1.3rem]" key={item.variantId}>
                            <td className="px-3 py-2 font-600 text-gray-900">{item.sku || item.variantId}</td>
                            <td className="px-3 py-2">{item.requiredQuantity}</td>
                            <td className="px-3 py-2">{item.availableStock}</td>
                            <td className="px-3 py-2 font-700 text-danger">{item.shortage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : null}

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
                <div className="mb-4">
                  <h3 className="text-[1.7rem] font-700 text-gray-900">Sản phẩm cần chuẩn bị</h3>
                  <p className="mt-0.5 text-[1.2rem] text-gray-500">
                    Kiểm tra đúng phân loại và các lựa chọn Custom trước khi đóng gói.
                  </p>
                </div>

                {(order.lines ?? []).length === 0 ? (
                  <p className="text-[1.3rem] text-gray-500">Đơn hàng chưa có sản phẩm.</p>
                ) : (
                  <div className="max-h-[48rem] space-y-3 overflow-y-auto pr-1">
                    {(order.lines ?? []).map((line, index) => {
                      const variantOptions = (line.variant?.selectedOptionValues ?? [])
                        .map(item => ({
                          name: item.optionValue?.option?.name?.trim(),
                          value: item.optionValue?.value?.trim(),
                        }))
                        .filter(item => item.name && item.value);
                      const customValues = (line.customValues ?? []).filter(
                        item => item.optionLabel?.trim() && item.valueLabel?.trim(),
                      );

                      return (
                        <article
                          className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                          key={line.id}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3">
                            <div className="flex min-w-0 items-start gap-3">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[1.3rem] font-700 text-primary">
                                {index + 1}
                              </span>
                              <div className="min-w-0">
                                <h4 className="text-[1.5rem] font-700 text-gray-900">
                                  {line.productName || '--'}
                                </h4>
                                <p className="mt-0.5 text-[1.2rem] text-gray-500">
                                  Đơn giá: {formatCurrency(line.unitPrice)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-5">
                              <div className="text-right">
                                <p className="text-[1.1rem] uppercase tracking-wide text-gray-500">
                                  Số lượng
                                </p>
                                <p className="text-[1.8rem] font-800 text-gray-900">{line.quantity ?? 0}</p>
                              </div>
                              <div className="min-w-[12rem] text-right">
                                <p className="text-[1.1rem] uppercase tracking-wide text-gray-500">
                                  Thành tiền
                                </p>
                                <p className="text-[1.5rem] font-700 text-primary">
                                  {formatCurrency(line.lineTotal)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-3 p-4 md:grid-cols-2">
                            <div className="rounded-lg border border-gray-200 p-3">
                              <p className="mb-2 text-[1.2rem] font-700 uppercase tracking-wide text-gray-500">
                                Phân loại sản phẩm
                              </p>
                              {variantOptions.length > 0 ? (
                                <dl className="space-y-1.5">
                                  {variantOptions.map(option => (
                                    <div
                                      className="flex items-start justify-between gap-4 text-[1.3rem]"
                                      key={`${option.name}-${option.value}`}
                                    >
                                      <dt className="text-gray-500">{option.name}</dt>
                                      <dd className="text-right font-700 text-gray-900">{option.value}</dd>
                                    </div>
                                  ))}
                                </dl>
                              ) : (
                                <p className="text-[1.3rem] text-gray-500">Sản phẩm không có phân loại.</p>
                              )}
                            </div>

                            <div
                              className={`rounded-lg border p-3 ${
                                customValues.length > 0 ? 'border-amber-200 bg-amber-50' : 'border-gray-200'
                              }`}
                            >
                              <p
                                className={`mb-2 text-[1.2rem] font-700 uppercase tracking-wide ${
                                  customValues.length > 0 ? 'text-amber-700' : 'text-gray-500'
                                }`}
                              >
                                Lựa chọn Custom
                              </p>
                              {customValues.length > 0 ? (
                                <dl className="space-y-2">
                                  {customValues.map(customValue => (
                                    <div
                                      className="flex items-start justify-between gap-4 text-[1.3rem]"
                                      key={customValue.id}
                                    >
                                      <dt className="text-amber-800">{customValue.optionLabel?.trim()}</dt>
                                      <dd className="text-right font-700 text-gray-900">
                                        {customValue.valueLabel?.trim()}
                                        {(customValue.priceModifier ?? 0) > 0 ? (
                                          <span className="ml-1 whitespace-nowrap text-[1.1rem] font-500 text-amber-700">
                                            (+{formatCurrency(customValue.priceModifier)})
                                          </span>
                                        ) : null}
                                      </dd>
                                    </div>
                                  ))}
                                </dl>
                              ) : (
                                <p className="text-[1.3rem] text-gray-500">Không có lựa chọn Custom.</p>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>

      {pendingStatus ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <button
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setPendingStatus(null)}
            type="button"
          />
          <div className="relative w-full max-w-[46rem] rounded-2xl bg-white p-6 shadow-2xl">
            <button
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100"
              onClick={() => setPendingStatus(null)}
              type="button"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-[1.8rem] font-700 text-gray-900">
              Xác nhận {getActionLabel(pendingStatus).toLowerCase()}?
            </h3>
            <p className="mt-2 text-[1.4rem] leading-relaxed text-gray-600">
              {getConfirmDescription(order?.status, pendingStatus)}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                className="h-10 flex-1 rounded-lg border border-gray-200 text-[1.4rem] text-gray-700 hover:bg-gray-50"
                disabled={updateStatusMutation.isMutating}
                onClick={() => setPendingStatus(null)}
                type="button"
              >
                Quay lại
              </button>
              <button
                className={`h-10 flex-1 rounded-lg text-[1.4rem] font-600 text-white disabled:opacity-60 ${
                  pendingStatus === 'CANCELED'
                    ? 'bg-danger hover:bg-danger/90'
                    : 'bg-primary hover:bg-primary-dark'
                }`}
                disabled={updateStatusMutation.isMutating}
                onClick={() => {
                  void handleConfirmStatus();
                }}
                type="button"
              >
                {updateStatusMutation.isMutating ? 'Đang cập nhật...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
