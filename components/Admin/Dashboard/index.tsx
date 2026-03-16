'use client';

const STAT_CARDS = [
  { title: 'Doanh thu hôm nay', value: '124,500,000 đ', growth: '+15%', positive: true },
  { title: 'Đơn hàng mới', value: '+142', growth: '+8%', positive: true },
  { title: 'Sản phẩm đã bán', value: '450', growth: '-2%', positive: false },
  { title: 'Lượt truy cập', value: '12,400', growth: '+22%', positive: true },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-[2.4rem] font-700 text-gray-900">Bảng Điều Khiển</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map(stat => (
          <div
            key={stat.title}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
          >
            <p className="text-[1.3rem] font-500 text-gray-400">{stat.title}</p>
            <div className="mt-3 flex items-end justify-between">
              <span className="text-[2.4rem] font-700 text-gray-900">{stat.value}</span>
              <span
                className={`rounded-full px-3 py-1 text-[1.2rem] font-600 ${
                  stat.positive ? 'bg-primary-100 text-primary-600' : 'bg-red-50 text-red-500'
                }`}
              >
                {stat.growth}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Chart placeholder */}
        <div className="flex h-[40rem] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm xl:col-span-2">
          <div className="mb-4 h-16 w-16 animate-pulse rounded-full bg-primary-500/20 blur-xl" />
          <p className="text-[1.6rem] font-500 text-gray-400">Biểu đồ doanh thu 12 tháng</p>
          <p className="mt-2 text-[1.3rem] text-gray-300">(Chờ tích hợp Recharts / ApexCharts)</p>
        </div>

        {/* Recent orders */}
        <div className="flex h-[40rem] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[1.8rem] font-700 text-gray-900">Đơn hàng mới</h2>
            <span className="cursor-pointer text-[1.3rem] font-500 text-primary-500 hover:underline">
              Xem tất cả
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-gray-100 hover:bg-gray-50"
              >
                <div className="flex h-[4rem] w-[4rem] flex-shrink-0 items-center justify-center rounded-xl bg-primary-500/10">
                  <span className="text-[1.2rem] font-700 text-primary-500">#</span>
                </div>
                <div className="flex-1">
                  <p className="text-[1.3rem] font-600 text-gray-800">Đơn hàng #DH-00{i}</p>
                  <p className="text-[1.1rem] text-gray-400">Vài phút trước</p>
                </div>
                <div className="text-right">
                  <p className="text-[1.3rem] font-700 text-primary-500">
                    {(1200000 * i).toLocaleString()} đ
                  </p>
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
