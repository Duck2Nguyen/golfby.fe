import type { UserInfo } from '@/interfaces/model';
import type { PaginatedResponse } from '@/interfaces/response';

import { useMutation, useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

export const useAdminUsers = (page: number, size: number) => {
  return useSWRWrapper<PaginatedResponse<UserInfo>>(`/api/v1/admin/users?page=${page}&size=${size}`, {
    url: `/api/v1/admin/users`,
    method: METHOD.GET,
    body: { page, size } as unknown as Record<string, unknown>,
  });
};

export interface CreateAdminUserPayload {
  csrfToken?: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  phone: string;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateAdminUserPayload {
  csrfToken?: string;
  id: string;
  role?: 'ADMIN' | 'USER';
  status?: 'ACTIVE' | 'INACTIVE';
}

export const useCreateAdminUser = () => {
  return useMutation('/api/v1/admin/users', {
    method: METHOD.POST,
    notification: {
      content: 'Tạo người dùng thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/users',
  });
};

export const useUpdateAdminUser = () => {
  return useMutation('/api/v1/admin/users/{id}/update', {
    method: METHOD.PATCH,
    notification: {
      content: 'Cập nhật người dùng thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/users/{id}/update',
  });
};
