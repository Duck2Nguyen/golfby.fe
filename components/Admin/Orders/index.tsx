'use client';

import { useMemo, useState, useEffect } from 'react';
import { Truck, Search, Download, DollarSign, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

import type { OrderStatus, PaymentStatus } from '@/hooks/useOrders';
import type { AdminOrderListItem, AdminOrdersQueryParams } from '@/hooks/admin/useAdminOrders';

import { useAdminOrders, ADMIN_ORDER_STATUSES, ADMIN_PAYMENT_STATUSES } from '@/hooks/admin/useAdminOrders';

import DataGrid from '@/components/DataGrid';

import { getColumnDefs } from './config';
import OrderDetailModal from './OrderDetailModal';
import {
  toNumber,
  formatCurrency,
  formatDateTime,
  getOrderStatusLabel,
  getPaymentStatusLabel,
  getCustomerDisplayName,
} from './helpers';

const ITEMS_PER_PAGE = 10;

const exportCsvCell = (value: string) => {
  return `"${value.replace(/"/g, '""')}"`;
};

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'ALL' | PaymentStatus>('ALL');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);

  const queryParams = useMemo<AdminOrdersQueryParams>(() => {
    const params: AdminOrdersQueryParams = {
      page: currentPage,
      size: ITEMS_PER_PAGE,
    };

    const normalizedSearch = searchQuery.trim();

    if (normalizedSearch) {
      params.orderNumber = normalizedSearch;
    }

    if (statusFilter !== 'ALL') {
      params.status = statusFilter;
    }

    if (paymentStatusFilter !== 'ALL') {
      params.paymentStatus = paymentStatusFilter;
    }

    return params;
  }, [currentPage, searchQuery, statusFilter, paymentStatusFilter]);

  const { data: response, isLoading, isValidating, mutate } = useAdminOrders(queryParams);

  const orders = response?.data?.items ?? [];
  const totalCount = response?.data?.totalCount ?? 0;

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + toNumber(order.total), 0);
    const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
    const shippedOrders = orders.filter(order => {
      return order.status === 'SHIPPED' || order.status === 'COMPLETED';
    }).length;

    return {
      pendingOrders,
      shippedOrders,
      totalOrders: totalCount,
      totalRevenue,
    };
  }, [orders, totalCount]);

  const columnDefs = useMemo(() => {
    return getColumnDefs({
      onView: (order: AdminOrderListItem) => {
        setViewingOrderId(order.id);
        setShowDetailModal(true);
      },
    });
  }, []);

  const rangeStart = totalCount === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const rangeEnd = Math.min(currentPage * ITEMS_PER_PAGE, totalCount);

  const exportOrdersAction = () => {
    if (!orders.length) {
      return;
    }

    const headers = ['Mã đơn hàng', 'Khách hàng', 'Tổng tiền', 'Trạng thái', 'Thanh toán', 'Ngày đặt'];

    const rows = orders.map(order => {
      return [
        order.orderNumber || order.id,
        getCustomerDisplayName(order),
        formatCurrency(order.total),
        getOrderStatusLabel(order.status),
        getPaymentStatusLabel(order.paymentStatus),
        formatDateTime(order.createdAt),
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(value => exportCsvCell(value)).join(','))
      .join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    });

    const csvUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = csvUrl;
    link.download = `admin-orders-page-${currentPage}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(csvUrl);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[1.3rem] text-gray-500">Tổng đơn hàng</p>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[3.0rem] leading-[3.2rem] font-700 text-gray-900">{stats.totalOrders}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[1.3rem] text-gray-500">Tổng doanh thu</p>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-100 text-success-700">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[3.0rem] leading-[3.2rem] font-700 text-gray-900">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[1.3rem] text-gray-500">Chờ xử lý</p>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning-100 text-warning-700">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[3.0rem] leading-[3.2rem] font-700 text-gray-900">{stats.pendingOrders}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[1.3rem] text-gray-500">Đã giao hàng</p>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-100 text-secondary-700">
              <Truck className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[3.0rem] leading-[3.2rem] font-700 text-gray-900">{stats.shippedOrders}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white flex-1 flex flex-col">
        <div className="flex flex-col gap-3 px-5 py-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative w-full max-w-[44rem]">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  className="h-10 w-full rounded-lg bg-gray-100 py-0 pr-4 pl-9 text-[1.3rem] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  onChange={event => {
                    setSearchQuery(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Tìm theo mã đơn..."
                  type="text"
                  value={searchQuery}
                />
              </div>

              <select
                className="h-10 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 text-[1.3rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                onChange={event => {
                  setStatusFilter(event.target.value as 'ALL' | OrderStatus);
                  setCurrentPage(1);
                }}
                value={statusFilter}
              >
                <option value="ALL">Tất cả trạng thái</option>
                {ADMIN_ORDER_STATUSES.map(status => (
                  <option key={status} value={status}>
                    {getOrderStatusLabel(status)}
                  </option>
                ))}
              </select>

              <select
                className="h-10 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 text-[1.3rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                onChange={event => {
                  setPaymentStatusFilter(event.target.value as 'ALL' | PaymentStatus);
                  setCurrentPage(1);
                }}
                value={paymentStatusFilter}
              >
                <option value="ALL">Tất cả thanh toán</option>
                {ADMIN_PAYMENT_STATUSES.map(status => (
                  <option key={status} value={status}>
                    {getPaymentStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="flex h-10 items-center justify-center gap-2 self-end rounded-lg border border-gray-200 px-4 text-[1.3rem] text-gray-700 transition-colors hover:bg-gray-100"
              onClick={exportOrdersAction}
              type="button"
            >
              <Download className="h-4 w-4" />
              Xuất Excel
            </button>
          </div>
        </div>

        <div className="relative overflow-x-auto flex-1 py-2 px-5">
          <DataGrid
            className="w-full h-full"
            columnDefs={columnDefs}
            defaultColDef={{
              cellClass: 'text-[1.3rem] text-gray-700',
              suppressHeaderMenuButton: true,
            }}
            headerHeight={44}
            loading={isLoading || isValidating}
            rowData={orders}
            rowHeight={68}
          />
        </div>

        <div className="flex flex-col gap-3 px-5 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[1.3rem] text-gray-500">
            Hiển thị <span className="font-500 text-gray-900">{rangeStart}</span> -{' '}
            <span className="font-500 text-gray-900">{rangeEnd}</span> trong tổng{' '}
            <span className="font-500 text-gray-900">{totalCount}</span> đơn hàng
          </p>

          <div className="flex items-center gap-2">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-[1.3rem] text-gray-700">
              Trang <span className="font-600">{currentPage}</span> / {totalPages}
            </span>

            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <OrderDetailModal
        isOpen={showDetailModal}
        onCloseAction={() => {
          setShowDetailModal(false);
          setViewingOrderId(null);
          void mutate();
        }}
        orderId={viewingOrderId}
      />
    </div>
  );
}
