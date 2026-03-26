import { useMutation, useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

export interface Brand {
  createdAt?: string | null;
  description?: string | null;
  id: string;
  logoUrl?: string | null;
  name: string;
  slug: string;
  updatedAt?: string | null;
}

export interface UseBrandsOptions {
  brandId?: string;
}

export interface CreateBrandPayload {
  csrfToken?: string;
  description?: string;
  logoUrl?: string;
  name: string;
  slug: string;
}

export type UpdateBrandPayload = Partial<CreateBrandPayload> & {
  id: string;
};

export interface DeleteBrandPayload {
  csrfToken?: string;
  id: string;
}

export const useBrands = (options?: UseBrandsOptions) => {
  const getAllBrands = useSWRWrapper<Brand[]>('/api/v1/brands', {
    method: METHOD.GET,
    url: '/api/v1/brands',
  });

  const getBrandById = useSWRWrapper<Brand>(options?.brandId ? `/api/v1/brands/${options.brandId}` : null, {
    method: METHOD.GET,
    noEndPoint: true,
    url: options?.brandId ? `/api/v1/brands/${options.brandId}` : '/api/v1/brands',
  });

  const createBrandMutation = useMutation<Brand>('/api/v1/admin/brands', {
    loading: true,
    method: METHOD.POST,
    notification: {
      ignoreError: false,
      ignoreSuccess: true,
    },
    url: '/api/v1/admin/brands',
  });

  const updateBrandMutation = useMutation<Brand>('/api/v1/admin/brands/{id}', {
    loading: true,
    method: METHOD.PATCH,
    notification: {
      content: 'Cập nhật thương hiệu thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/brands/{id}',
  });

  const deleteBrandMutation = useMutation<boolean>('/api/v1/admin/brands/{id}', {
    loading: true,
    method: METHOD.DELETE,
    notification: {
      content: 'Xóa thương hiệu thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/brands/{id}',
  });

  return {
    createBrandMutation,
    deleteBrandMutation,
    getAllBrands,
    getBrandById,
    updateBrandMutation,
  };
};

export type UseBrandsReturn = ReturnType<typeof useBrands>;
