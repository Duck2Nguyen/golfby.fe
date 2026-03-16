import type { UserInfo } from '@/interfaces/model';

import { useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
}

export const useAdminUsers = (page: number, size: number) => {
  return useSWRWrapper<PaginatedResponse<UserInfo>>(`/api/v1/admin/users?page=${page}&size=${size}`, {
    url: `/api/v1/admin/users`,
    method: METHOD.GET,
    body: { page, size } as unknown as Record<string, unknown>,
  });
};
