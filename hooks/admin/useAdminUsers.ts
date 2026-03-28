import type { UserInfo } from '@/interfaces/model';
import type { ROLE, USER_STATUS } from '@/global/common';
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
  csrf?: boolean;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  phone: string;
  role: ROLE;
  status: USER_STATUS;
}

export interface UpdateAdminUserPayload {
  csrf?: boolean;
  id: string;
  status: USER_STATUS;
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
  return useMutation('/api/v1/admin/users/{id}/update-status', {
    method: METHOD.PATCH,
    notification: {
      content: 'Cập nhật trạng thái người dùng thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/users/{id}/update-status',
  });
};
