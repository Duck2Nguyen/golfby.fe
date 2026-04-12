'use client';

import { useMemo } from 'react';
import { X, RefreshCcw } from 'lucide-react';

import { useAdminUserDetail } from '@/hooks/admin/useAdminUsers';

const toNumber = (value?: number | string | null) => {
  const parsed = Number(value ?? 0);

  return Number.isFinite(parsed) ? parsed : 0;
};

const formatCurrency = (value?: number | string | null) => {
  return `${toNumber(value).toLocaleString('vi-VN')} VND`;
};

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return '--';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return date.toLocaleString('vi-VN');
};

const getRoleLabel = (role?: string | null) => {
  if (role === 'ADMIN') {
    return 'ADMIN';
  }

  if (role === 'USER') {
    return 'USER';
  }

  return role || '--';
};

const getUserStatusLabel = (status?: string | null) => {
  switch (status) {
    case 'ACTIVE':
      return 'Hoạt động';
    case 'PENDING':
      return 'Chờ duyệt';
    case 'DEACTIVATED':
      return 'Ngừng hoạt động';
    default:
      return status || '--';
  }
};

const getOrderStatusLabel = (status?: string | null) => {
  switch (status) {
    case 'PENDING':
      return 'Chờ xử lý';
    case 'PAID':
      return 'Đã thanh toán';
    case 'SHIPPED':
      return 'Đang giao';
    case 'COMPLETED':
      return 'Hoàn tất';
    case 'CANCELED':
      return 'Đã hủy';
    case 'REFUNDED':
      return 'Đã hoàn tiền';
    default:
      return status || '--';
  }
};

const getPaymentStatusLabel = (status?: string | null) => {
  switch (status) {
    case 'PENDING':
      return 'Chờ thanh toán';
    case 'PAID':
      return 'Đã thanh toán';
    case 'REFUNDED':
      return 'Đã hoàn tiền';
    case 'FAILED':
      return 'Thanh toán thất bại';
    default:
      return status || '--';
  }
};

interface UserDetailModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  userId?: string | null;
}

export default function UserDetailModal({ isOpen, onCloseAction, userId }: UserDetailModalProps) {
  const { data, error, isLoading, isValidating, mutate } = useAdminUserDetail(userId || undefined, isOpen);

  const user = data?.data;

  const orders = useMemo(() => {
    const rawOrders = Array.isArray(user?.orders) ? user.orders : [];

    return [...rawOrders].sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;

      return bTime - aTime;
    });
  }, [user?.orders]);

  const totalOrders = orders.length;
  const totalSpent = useMemo(() => {
    return orders.reduce((sum, order) => sum + toNumber(order.total), 0);
  }, [orders]);

  const displayName = useMemo(() => {
    const fullName = `${user?.lastName || ''} ${user?.firstName || ''}`.trim();

    return fullName || user?.email || '--';
  }, [user?.email, user?.firstName, user?.lastName]);

  const addressLine = useMemo(() => {
    const directAddressParts = [user?.address, user?.commune, user?.province].filter(Boolean) as string[];

    if (directAddressParts.length > 0) {
      return directAddressParts.join(', ');
    }

    const latestOrderAddress = orders
      .map(order => [order.address, order.commune, order.province].filter(Boolean) as string[])
      .find(parts => parts.length > 0);

    if (latestOrderAddress && latestOrderAddress.length > 0) {
      return latestOrderAddress.join(', ');
    }

    return 'Chưa có địa chỉ';
  }, [orders, user?.address, user?.commune, user?.province]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCloseAction}
        type="button"
      />

      <div className="relative mx-4 max-h-[90vh] w-full max-w-[96rem] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-[1.9rem] font-600 text-gray-900">Chi tiết khách hàng</h2>
            <p className="text-[1.3rem] text-gray-500">ID: {userId || '--'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-[1.3rem] text-gray-700 transition-colors hover:bg-gray-100"
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

        <div className="space-y-4 p-6">
          {isLoading ? (
            <div className="py-8 text-center text-[1.4rem] text-gray-500">
              Đang tải chi tiết khách hàng...
            </div>
          ) : error || !user ? (
            <div className="py-8 text-center text-[1.4rem] text-red-500">
              Không thể tải chi tiết khách hàng.
            </div>
          ) : (
            <>
              <section className="grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-2">
                <div>
                  <p className="text-[1.2rem] text-gray-500">Họ và tên</p>
                  <p className="text-[1.6rem] font-600 text-gray-900">{displayName}</p>
                </div>
                <div>
                  <p className="text-[1.2rem] text-gray-500">Email</p>
                  <p className="text-[1.4rem] font-500 text-gray-900">{user.email || '--'}</p>
                </div>
                <div>
                  <p className="text-[1.2rem] text-gray-500">Số điện thoại</p>
                  <p className="text-[1.4rem] font-500 text-gray-900">{user.phoneNumber || '--'}</p>
                </div>
                <div>
                  <p className="text-[1.2rem] text-gray-500">Vai trò / Trạng thái</p>
                  <p className="text-[1.4rem] font-500 text-gray-900">
                    {getRoleLabel(user.userRole || user.role)} / {getUserStatusLabel(user.userStatus)}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-[1.2rem] text-gray-500">Địa chỉ</p>
                  <p className="truncate text-[1.4rem] font-500 text-gray-900" title={addressLine}>
                    {addressLine}
                  </p>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="text-[1.2rem] text-gray-500">Tổng số đơn hàng</p>
                  <p className="text-[2.6rem] font-700 text-gray-900">{totalOrders}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="text-[1.2rem] text-gray-500">Tổng tiền đã mua</p>
                  <p className="text-[2.6rem] font-700 text-primary">{formatCurrency(totalSpent)}</p>
                </div>
              </section>

              <section className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="mb-3 text-[1.7rem] font-600 text-gray-900">Danh sách đơn hàng</h3>

                {orders.length === 0 ? (
                  <p className="text-[1.3rem] text-gray-500">Khách hàng chưa có đơn hàng nào.</p>
                ) : (
                  <div className="max-h-[34rem] overflow-y-auto">
                    <table className="w-full min-w-[72rem] border-separate border-spacing-0">
                      <thead>
                        <tr>
                          <th className="sticky top-0 bg-white px-3 py-2 text-left text-[1.2rem] font-600 text-gray-500">
                            Mã đơn
                          </th>
                          <th className="sticky top-0 bg-white px-3 py-2 text-left text-[1.2rem] font-600 text-gray-500">
                            Ngày tạo
                          </th>
                          <th className="sticky top-0 bg-white px-3 py-2 text-left text-[1.2rem] font-600 text-gray-500">
                            Trạng thái đơn
                          </th>
                          <th className="sticky top-0 bg-white px-3 py-2 text-left text-[1.2rem] font-600 text-gray-500">
                            Trạng thái thanh toán
                          </th>
                          <th className="sticky top-0 bg-white px-3 py-2 text-left text-[1.2rem] font-600 text-gray-500">
                            Tổng tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order.id}>
                            <td className="border-t border-gray-100 px-3 py-2 text-[1.3rem] font-500 text-gray-900">
                              {order.orderNumber || order.id}
                            </td>
                            <td className="border-t border-gray-100 px-3 py-2 text-[1.3rem] text-gray-700">
                              {formatDateTime(order.createdAt)}
                            </td>
                            <td className="border-t border-gray-100 px-3 py-2 text-[1.3rem] text-gray-700">
                              {getOrderStatusLabel(order.status)}
                            </td>
                            <td className="border-t border-gray-100 px-3 py-2 text-[1.3rem] text-gray-700">
                              {getPaymentStatusLabel(order.paymentStatus)}
                            </td>
                            <td className="border-t border-gray-100 px-3 py-2 text-[1.3rem] font-600 text-primary">
                              {formatCurrency(order.total)}
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
