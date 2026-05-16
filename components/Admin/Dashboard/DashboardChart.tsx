'use client';

import { useState } from 'react';

import { Bar, XAxis, YAxis, Legend, Tooltip, BarChart, CartesianGrid, ResponsiveContainer } from 'recharts';

import { type DashboardPeriod, type DashboardGroupBy, useDashboardStatistics } from '@/hooks/useStatistic';

interface DashboardChartProps {
  period?: DashboardPeriod;
}

export default function DashboardChart({ period = 'LAST_MONTH' }: DashboardChartProps) {
  const [groupBy, setGroupBy] = useState<DashboardGroupBy>('day');

  const { data: chartDataResp, isLoading } = useDashboardStatistics({ period, groupBy });
  const chartData = chartDataResp?.data?.items || [];

  return (
    <div className="flex h-[45rem] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[1.8rem] font-700 text-gray-900">Thống kê hoạt động</h2>
          <p className="mt-1 text-[1.3rem] text-gray-500">Biểu đồ tổng quan về doanh thu và tương tác</p>
        </div>

        <div className="flex rounded-lg bg-gray-100 p-1">
          {(['day', 'week', 'month'] as const).map(p => (
            <button
              key={p}
              onClick={() => setGroupBy(p)}
              className={`rounded-md px-4 py-1.5 text-[1.3rem] font-500 transition-all ${
                groupBy === p ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {p === 'day' ? 'Theo ngày' : p === 'week' ? 'Theo tuần' : 'Theo tháng'}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[300px] flex-1">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 13 }}
                dy={10}
              />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 13 }}
                tickFormatter={value => `${value / 1000000}M`}
                width={60}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 13 }}
                width={40}
              />
              <Tooltip
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #f3f4f6',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  padding: '12px 16px',
                }}
                formatter={(value: any, name: any) => {
                  const num = Number(value) || 0;
                  if (name === 'Doanh thu') return [`${num.toLocaleString('vi-VN')} đ`, String(name)];
                  return [num.toLocaleString('vi-VN'), String(name)];
                }}
                labelStyle={{ color: '#111827', fontWeight: 600, marginBottom: '8px' }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                name="Doanh thu"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                yAxisId="right"
                dataKey="newOrders"
                name="Đơn mới"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                yAxisId="right"
                dataKey="newUsers"
                name="User mới"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
