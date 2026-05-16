import type { PaginatedResponse } from '@/interfaces/response';
import type { AdminOrderListItem } from '@/hooks/admin/useAdminOrders';

import { useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

export type DashboardPeriod = 'YESTERDAY' | 'LAST_WEEK' | 'LAST_MONTH';
export type DashboardGroupBy = 'day' | 'week' | 'month';

export interface DashboardPeriodDto {
  period?: DashboardPeriod;
}

export interface DashboardNewOrdersDto {
  page?: number;
  size?: number;
}

export interface DashboardStatisticsDto {
  groupBy?: DashboardGroupBy;
  period?: DashboardPeriod;
}

export interface DashboardSummaryResponse {
  newOrders: number;
  newProducts: number;
  newUsers: number;
  period: DashboardPeriod;
  range: { end: string; start: string };
  revenue: number;
}

export interface StatisticPoint {
  label: string;
  newOrders: number;
  newProducts: number;
  newUsers: number;
  revenue: number;
  start: string;
}

export interface DashboardStatisticsResponse {
  groupBy: DashboardGroupBy;
  items: StatisticPoint[];
  period: DashboardPeriod;
  range: { end: string; start: string };
}

export const useDashboardSummary = (params?: DashboardPeriodDto) => {
  const query = new URLSearchParams();
  if (params?.period) {
    query.set('period', params.period);
  }

  const queryString = query.toString();
  const key = `dashboard-summary:${queryString || 'default'}`;

  return useSWRWrapper<DashboardSummaryResponse>(key, {
    body: params as unknown as Record<string, unknown>,
    method: METHOD.GET,
    url: '/api/v1/admin/dashboard/summary',
  });
};

export const useDashboardNewOrders = (params?: DashboardNewOrdersDto) => {
  const page = params?.page ?? 1;
  const size = params?.size ?? 20;

  const query = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  const queryString = query.toString();
  const key = `dashboard-new-orders:${queryString}`;

  return useSWRWrapper<PaginatedResponse<AdminOrderListItem>>(key, {
    body: { page, size } as unknown as Record<string, unknown>,
    method: METHOD.GET,
    url: '/api/v1/admin/dashboard/new-orders',
  });
};

export const useDashboardStatistics = (params?: DashboardStatisticsDto) => {
  const query = new URLSearchParams();
  if (params?.period) {
    query.set('period', params.period);
  }
  if (params?.groupBy) {
    query.set('groupBy', params.groupBy);
  }

  const queryString = query.toString();
  const key = `dashboard-statistics:${queryString || 'default'}`;

  return useSWRWrapper<DashboardStatisticsResponse>(key, {
    body: params as unknown as Record<string, unknown>,
    method: METHOD.GET,
    url: '/api/v1/admin/dashboard/statistics',
  });
};
