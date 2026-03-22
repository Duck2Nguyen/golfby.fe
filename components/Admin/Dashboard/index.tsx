'use client';

import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ShoppingCart,
  ArrowDownRight,
} from 'lucide-react';

const STAT_CARDS = [
  {
    title: 'Tổng doanh thu',
    value: '1.245.000.000đ',
    growth: '+12.5%',
    positive: true,
    icon: DollarSign,
    iconClassName: 'bg-green-50 text-green-600',
  },
  {
    title: 'Đơn hàng',
    value: '3.456',
    growth: '+8.2%',
    positive: true,
    icon: ShoppingCart,
    iconClassName: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Sản phẩm',
    value: '892',
    growth: '+3.1%',
    positive: true,
    icon: Package,
    iconClassName: 'bg-violet-50 text-violet-600',
  },
  {
    title: 'Người dùng',
    value: '12.458',
    growth: '-2.4%',
    positive: false,
    icon: Users,
    iconClassName: 'bg-orange-50 text-orange-600',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map(stat => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconClassName}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`flex items-center gap-0.5 text-[1.3rem] font-500 ${
                    stat.positive ? 'text-green-600' : 'text-red-500'
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

              <p className="mb-0.5 text-[2.4rem] font-700 text-gray-900">{stat.value}</p>
              <p className="text-[1.3rem] text-gray-500">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="flex h-[40rem] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white xl:col-span-2">
          <TrendingUp className="mb-3 h-12 w-12 text-gray-300" />
          <p className="text-[1.5rem] text-gray-500">
            Biểu đồ thống kê và báo cáo chi tiết sẽ được hiển thị ở đây
          </p>
        </div>

        <div className="flex h-[40rem] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[1.8rem] font-700 text-gray-900">Đơn hàng mới</h2>
            <span className="cursor-pointer text-[1.3rem] font-500 text-primary hover:underline">
              Xem tất cả
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
            {[1, 2, 3, 4, 5, 6].map(item => (
              <div
                key={item}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-gray-200 hover:bg-gray-50"
              >
                <div className="flex h-[4rem] w-[4rem] flex-shrink-0 items-center justify-center rounded-xl bg-primary-light">
                  <span className="text-[1.2rem] font-700 text-primary">#</span>
                </div>

                <div className="flex-1">
                  <p className="text-[1.3rem] font-600 text-gray-800">Đơn hàng #DH-00{item}</p>
                  <p className="text-[1.1rem] text-gray-400">Vài phút trước</p>
                </div>

                <div className="text-right">
                  <p className="text-[1.3rem] font-700 text-primary">{(1200000 * item).toLocaleString()} đ</p>
                  <p className="text-[1.1rem] text-amber-500">Đang xử lý</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
