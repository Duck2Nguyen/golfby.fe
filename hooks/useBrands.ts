import { useMutation, useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

export interface BrandImage {
  brandId?: string;
  id: string;
  key?: string;
  mimeType?: string | null;
  name?: string | null;
  size?: number | null;
  url?: string | null;
}

export interface Brand {
  createdAt?: string | null;
  description?: string | null;
  id: string;
  image?: BrandImage | null;
  logoUrl?: string | null;
  name: string;
  slug: string;
  updatedAt?: string | null;
}

export interface UseBrandsOptions {
  brandId?: string;
}

export interface CreateBrandPayload {
  csrf?: boolean;
  description?: string;
  logoUrl?: string;
  name: string;
  slug: string;
}

export type UpdateBrandPayload = Partial<CreateBrandPayload> & {
  id: string;
};

export interface CreateBrandFormDataPayload extends CreateBrandPayload {
  file?: File | null;
}

export interface UpdateBrandFormDataPayload extends Omit<UpdateBrandPayload, 'csrf'> {
  csrf?: boolean;
  file?: File | null;
}

export interface DeleteBrandPayload {
  csrf?: boolean;
  id: string;
}

const buildBrandBodyPayload = (
  payload: Partial<Omit<CreateBrandPayload, 'csrf'>>,
): Record<string, unknown> => {
  const brandBody: Record<string, unknown> = {};

  if (payload.name !== undefined) brandBody.name = payload.name;
  if (payload.slug !== undefined) brandBody.slug = payload.slug;
  if (payload.description !== undefined) brandBody.description = payload.description;
  if (payload.logoUrl !== undefined) brandBody.logoUrl = payload.logoUrl;

  return brandBody;
};

export const buildCreateBrandFormDataPayload = (payload: CreateBrandFormDataPayload): FormData => {
  const formData = new FormData();

  formData.append('brand', JSON.stringify(buildBrandBodyPayload(payload)));

  if (payload.file) {
    formData.append('file', payload.file);
  }

  if (payload.csrf) {
    formData.append('csrf', 'true');
  }

  return formData;
};

export const buildUpdateBrandFormDataPayload = (payload: UpdateBrandFormDataPayload): FormData => {
  const formData = new FormData();

  formData.append('id', payload.id);
  formData.append('brand', JSON.stringify(buildBrandBodyPayload(payload)));

  if (payload.file) {
    formData.append('file', payload.file);
  }

  if (payload.csrf) {
    formData.append('csrf', 'true');
  }

  return formData;
};

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
