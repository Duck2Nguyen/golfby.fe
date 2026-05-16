import type { PaginatedResponse } from '@/interfaces/response';

import { useMutation, useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

export interface Voucher {
  createdAt: string;
  code: string;
  endsAt?: string;
  id: string;
  isActive: boolean;
  maxValue?: number;
  minOrderTotal?: number;
  name: string;
  startsAt?: string;
  type: 'PERCENT' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  usageCount: number;
  usageLimit?: number;
  value: number;
}

export interface ListVouchersDto {
  isActive?: boolean;
  page?: number;
  search?: string;
  size?: number;
  sortBy?: 'createdAt' | 'name' | 'code' | 'startsAt' | 'endsAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateVoucherDto {
  code: string;
  csrf?: boolean;
  endsAt?: string;
  isActive?: boolean;
  maxValue?: number;
  minOrderTotal?: number;
  name: string;
  startsAt?: string;
  type: 'PERCENT' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  usageLimit?: number;
  value: number;
}

export interface UpdateVoucherDto extends Partial<Omit<CreateVoucherDto, 'csrf'>> {
  csrf?: boolean;
  id: string;
}

export const useAdminVouchers = (query: ListVouchersDto) => {
  const cleanQuery = Object.fromEntries(
    Object.entries(query).filter(([_, v]) => v !== undefined && v !== null && v !== ''),
  );

  const qs = new URLSearchParams(cleanQuery as Record<string, string>).toString();
  const urlWithQs = qs ? `/api/v1/admin/vouchers?${qs}` : '/api/v1/admin/vouchers';

  return useSWRWrapper<PaginatedResponse<Voucher>>(urlWithQs, {
    url: '/api/v1/admin/vouchers',
    method: METHOD.GET,
    body: cleanQuery as unknown as Record<string, unknown>,
  });
};

export const useAdminVoucherDetail = (id?: string, enabled: boolean = true) => {
  const shouldFetch = Boolean(id && enabled);

  return useSWRWrapper<Voucher>(shouldFetch ? `/api/v1/admin/vouchers/${id}` : null, {
    method: METHOD.GET,
    url: id ? `/api/v1/admin/vouchers/${id}` : '/api/v1/admin/vouchers',
  });
};

export const useCreateVoucher = () => {
  return useMutation('/api/v1/admin/vouchers', {
    method: METHOD.POST,
    notification: {
      content: 'Tạo mã giảm giá thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/vouchers',
  });
};

export const useUpdateVoucher = () => {
  return useMutation('/api/v1/admin/vouchers/{id}', {
    method: METHOD.PATCH,
    notification: {
      content: 'Cập nhật mã giảm giá thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/vouchers/{id}',
  });
};

export const useDeleteVoucher = () => {
  return useMutation('/api/v1/admin/vouchers/{id}', {
    method: METHOD.DELETE,
    notification: {
      content: 'Xoá mã giảm giá thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/vouchers/{id}',
  });
};
