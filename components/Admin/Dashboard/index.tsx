'use client';

import { useState } from 'react';
import {
  Users,
  Clock,
  Package,
  PackageX,
  DollarSign,
  ArrowUpRight,
  ShoppingCart,
  ArrowDownRight,
} from 'lucide-react';

import { useDashboardSummary, type DashboardPeriod, useDashboardNewOrders } from '@/hooks/useStatistic';

import DashboardChart from './DashboardChart';

export default function Dashboard() {
  const [period, setPeriod] = useState<DashboardPeriod>('LAST_MONTH');

  const { data: summaryData } = useDashboardSummary({ period });
  const { data: newOrdersData, isLoading: isLoadingOrders } = useDashboardNewOrders({ page: 1, size: 6 });

  const summary = summaryData?.data;
  const newOrders = newOrdersData?.data?.items || [];

  const formatGrowth = (percentage?: number) => {
    if (percentage === undefined) return '...';

    return `${percentage > 0 ? '+' : ''}${percentage.toLocaleString('vi-VN')}%`;
  };

  const STAT_CARDS = [
    {
      title: 'Tổng doanh thu',
      value: summary ? `${summary.revenue.toLocaleString('vi-VN')}đ` : '...',
      growth: formatGrowth(summary?.growth.revenue.percentage),
      positive: (summary?.growth.revenue.percentage ?? 0) >= 0,
      icon: DollarSign,
      color: 'green',
    },
    {
      title: 'Đơn hàng mới',
      value: summary ? summary.newOrders.toLocaleString('vi-VN') : '...',
      growth: formatGrowth(summary?.growth.newOrders.percentage),
      positive: (summary?.growth.newOrders.percentage ?? 0) >= 0,
      icon: ShoppingCart,
      color: 'blue',
    },
    {
      title: 'Sản phẩm mới',
      value: summary ? summary.newProducts.toLocaleString('vi-VN') : '...',
      growth: formatGrowth(summary?.growth.newProducts.percentage),
      positive: (summary?.growth.newProducts.percentage ?? 0) >= 0,
      icon: Package,
      color: 'violet',
    },
    {
      title: 'Người dùng mới',
      value: summary ? summary.newUsers.toLocaleString('vi-VN') : '...',
      growth: formatGrowth(summary?.growth.newUsers.percentage),
      positive: (summary?.growth.newUsers.percentage ?? 0) >= 0,
      icon: Users,
      color: 'orange',
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'blue':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'violet':
        return 'bg-violet-50 text-violet-600 border-violet-100';
      case 'orange':
        return 'bg-orange-50 text-orange-600 border-orange-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    // Tạm fake status nếu không có
    return (
      <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[1.1rem] font-500 text-amber-600 border border-amber-200">
        <Clock className="h-3 w-3" />
        Đang xử lý
      </span>
    );
  };

  return (
    <div className="space-y-8 h-full">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[2.4rem] font-800 text-gray-900 tracking-tight">Tổng quan</h1>
          <p className="mt-1 text-[1.4rem] text-gray-500">Theo dõi hoạt động kinh doanh của bạn</p>
        </div>
        <select
          value={period}
          onChange={e => setPeriod(e.target.value as DashboardPeriod)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[1.4rem] font-500 text-gray-700 outline-none shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="YESTERDAY">Hôm nay</option>
          <option value="LAST_WEEK">Tuần nay</option>
          <option value="LAST_MONTH">Tháng nay</option>
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map(stat => {
          const Icon = stat.icon;
          const colorClasses = getColorClasses(stat.color);

          return (
            <div
              key={stat.title}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 h-[14rem] shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-3 flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border ${colorClasses}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[1.2rem] font-600 ${
                    stat.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {stat.positive ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {stat.growth}
                </span>
              </div>

              <div>
                <p className="text-[2.4rem] font-800 tracking-tight text-gray-900">{stat.value}</p>
                <p className="mt-1 text-[1.2rem] font-500 text-gray-500">{stat.title}</p>
              </div>

              {/* Decorative background element */}
              <div
                className={`absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-5 transition-transform duration-500 group-hover:scale-150 ${colorClasses.split(' ')[0]}`}
              />
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Chart Component */}
        <DashboardChart initialPeriod={period} />

        {/* Recent Orders List */}
        <div className="flex h-[55rem] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-[1.8rem] font-700 text-gray-900">Đơn hàng mới</h2>
              <p className="text-[1.3rem] text-gray-500">Các giao dịch gần đây</p>
            </div>
            <button className="rounded-lg px-3 py-1.5 text-[1.3rem] font-600 text-primary transition-colors hover:bg-primary/5">
              Xem tất cả
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-2">
            {isLoadingOrders ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-100 border-t-primary" />
              </div>
            ) : newOrders.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <PackageX className="mb-3 h-12 w-12 text-gray-300" />
                <p className="text-[1.4rem] font-500 text-gray-900">Chưa có đơn hàng nào</p>
                <p className="mt-1 text-[1.3rem] text-gray-500">Đơn hàng mới sẽ xuất hiện ở đây</p>
              </div>
            ) : (
              newOrders.map((order: any, index: number) => (
                <div
                  key={order.id || index}
                  className="group flex cursor-pointer items-center gap-4 rounded-xl border border-gray-50 bg-gray-50/50 p-3.5 transition-all hover:border-primary/20 hover:bg-primary/5"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white text-[1.4rem] font-700 text-gray-600 shadow-sm transition-colors group-hover:border-primary/20 group-hover:text-primary">
                    {order.customerName ? order.customerName.charAt(0).toUpperCase() : '#'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[1.4rem] font-600 text-gray-900">
                      Đơn hàng #{order.orderNumber || order.id?.toString().slice(0, 8)}
                    </p>
                    <p className="mt-0.5 truncate text-[1.2rem] text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Vừa xong'}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <p className="text-[1.4rem] font-700 text-gray-900">
                      {order.total?.toLocaleString('vi-VN') || '0'} ₫
                    </p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
