import type { RestResponse, PaginatedResponse } from '@/interfaces/response';

import { useMutation, useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

export type AdminProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'DELETED';

export interface AdminProductOptionValuePayload {
  value: string;
}

export interface AdminProductOptionPayload {
  name: string;
  values: AdminProductOptionValuePayload[];
}

export interface CreateAdminProductPayload {
  categoryId?: string;
  brandId?: string;
  costPrice?: string;
  currency?: string;
  description?: string;
  listPrice?: string;
  name: string;
  productOptions: AdminProductOptionPayload[];
  salePrice?: string;
  slug: string;
  status?: Exclude<AdminProductStatus, 'DELETED'>;
  subcategoryId?: string;
}

export type UpdateAdminProductPayload = Partial<CreateAdminProductPayload>;

export interface GetAllAdminProductParams {
  brandId?: string;
  categoryId?: string;
  page?: number;
  search?: string;
  size?: number;
  status?: AdminProductStatus;
  subcategoryId?: string;
}

export interface AdminProductImage {
  id: string;
  isPrimary?: boolean;
  key: string;
  mimeType?: string;
  name?: string;
  productId: string;
  size?: number;
  sortOrder?: number;
  url?: string;
}

export interface AdminProductListImage extends AdminProductImage {
  isPrimary?: boolean;
}

export interface AdminProductListBrand {
  id: string;
  name: string;
}

export interface AdminProductListCategory {
  id: string;
  name: string;
}

export interface AdminProductListOptionValue {
  id?: string;
  value: string;
}

export interface AdminProductListOption {
  id?: string;
  name: string;
  values?: AdminProductListOptionValue[];
}

export interface AdminProductListItem {
  brand?: AdminProductListBrand | null;
  brandId?: string | null;
  category?: AdminProductListCategory | null;
  categoryId?: string | null;
  costPrice?: string | null;
  createdAt?: string;
  currency?: string;
  description?: string | null;
  id: string;
  images?: AdminProductListImage[];
  listPrice?: string | null;
  name: string;
  productOptions?: AdminProductListOption[];
  salePrice?: string | null;
  slug?: string;
  status?: AdminProductStatus;
  subcategoryId?: string | null;
  updatedAt?: string;
}

export type UploadProductImagePayload = {
  altText?: string;
  id: string;
  image: File;
  isPrimary?: boolean;
};

export type RemoveProductImagePayload = {
  id: string;
  imageId: string;
};

export type SetPrimaryProductImagePayload = {
  id: string;
  imageId: string;
};

export const MAX_CREATE_PRODUCT_IMAGES = 10;
export const MAX_CREATE_PRODUCT_IMAGE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_CREATE_PRODUCT_IMAGE_TYPES = ['image/png', 'image/jpeg'];

export const validateCreateProductImages = (files: File[]) => {
  if (files.length > MAX_CREATE_PRODUCT_IMAGES) {
    return {
      isValid: false,
      message: `Maximum ${MAX_CREATE_PRODUCT_IMAGES} images allowed`,
    };
  }

  const invalidType = files.find(file => !ALLOWED_CREATE_PRODUCT_IMAGE_TYPES.includes(file.type));
  if (invalidType) {
    return {
      isValid: false,
      message: 'Your file has the wrong format. We only support PNG or JPEG',
    };
  }

  const invalidSize = files.find(file => file.size > MAX_CREATE_PRODUCT_IMAGE_SIZE);
  if (invalidSize) {
    return {
      isValid: false,
      message: 'Your file exceeds the maximum upload size: 5MB',
    };
  }

  return { isValid: true, message: '' };
};

export const buildCreateProductMultipartPayload = (product: CreateAdminProductPayload, images: File[]) => {
  const formData = new FormData();
  formData.append('product', JSON.stringify(product));

  images.forEach(file => {
    formData.append('images', file);
  });

  return formData;
};

const buildUploadImagePayload = (payload: UploadProductImagePayload) => {
  const formData = new FormData();
  formData.append('id', payload.id);
  formData.append('image', payload.image);

  if (payload.altText) {
    formData.append('altText', payload.altText);
  }

  if (typeof payload.isPrimary === 'boolean') {
    formData.append('isPrimary', String(payload.isPrimary));
  }

  return formData;
};

const buildQueryString = (params?: GetAllAdminProductParams) => {
  const searchParams = new URLSearchParams();

  if (!params) {
    return 'page=1&size=20';
  }

  searchParams.set('page', String(params.page ?? 1));
  searchParams.set('size', String(params.size ?? 20));

  if (params.search) searchParams.set('search', params.search);
  if (params.brandId) searchParams.set('brandId', params.brandId);
  if (params.categoryId) searchParams.set('categoryId', params.categoryId);
  if (params.subcategoryId) searchParams.set('subcategoryId', params.subcategoryId);
  if (params.status) searchParams.set('status', params.status);

  return searchParams.toString();
};

const normalizeGetAllParams = (params?: GetAllAdminProductParams): GetAllAdminProductParams => {
  if (!params) {
    return {
      page: 1,
      size: 20,
    };
  }

  const normalized: GetAllAdminProductParams = {
    page: params.page ?? 1,
    size: params.size ?? 20,
  };

  if (params.search) normalized.search = params.search;
  if (params.brandId) normalized.brandId = params.brandId;
  if (params.categoryId) normalized.categoryId = params.categoryId;
  if (params.subcategoryId) normalized.subcategoryId = params.subcategoryId;
  if (params.status) normalized.status = params.status;

  return normalized;
};

export interface UseAdminProductOptions {
  detailProductId?: string;
  getAllParams?: GetAllAdminProductParams;
}

export const useAdminProduct = (options?: UseAdminProductOptions) => {
  const normalizedGetAllParams = normalizeGetAllParams(options?.getAllParams);
  const queryString = buildQueryString(normalizedGetAllParams);

  const getAllAdminProduct = useSWRWrapper<PaginatedResponse<AdminProductListItem>>(
    `/api/v1/admin/products?${queryString}`,
    {
      body: normalizedGetAllParams as unknown as Record<string, unknown>,
      method: METHOD.GET,
      url: '/api/v1/admin/products',
    },
  );

  const getAdminProductById = useSWRWrapper<Record<string, unknown>>(
    options?.detailProductId ? `/api/v1/admin/products/${options.detailProductId}` : null,
    {
      method: METHOD.GET,
      noEndPoint: true,
      url: options?.detailProductId
        ? `/api/v1/admin/products/${options.detailProductId}`
        : '/api/v1/admin/products',
    },
  );

  const createProductMutation = useMutation('/api/v1/admin/products', {
    loading: true,
    method: METHOD.POST,
    notification: {
      content: 'Tạo sản phẩm thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/products',
  });

  const updateAdminProductMutation = useMutation('/api/v1/admin/products/{id}', {
    loading: true,
    method: METHOD.PATCH,
    notification: {
      content: 'Cập nhật sản phẩm thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/products/{id}',
  });

  const deleteAdminProductMutation = useMutation('/api/v1/admin/products/{id}', {
    loading: true,
    method: METHOD.DELETE,
    notification: {
      content: 'Xóa sản phẩm thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/products/{id}',
  });

  const uploadProductImageMutation = useMutation<AdminProductImage>('/api/v1/admin/products/{id}/images', {
    loading: true,
    method: METHOD.POST,
    notification: {
      content: 'Tải ảnh sản phẩm thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/products/{id}/images',
  });

  const removeProductImageMutation = useMutation('/api/v1/admin/products/{id}/images/{imageId}', {
    loading: true,
    method: METHOD.DELETE,
    notification: {
      content: 'Xóa ảnh sản phẩm thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/products/{id}/images/{imageId}',
  });

  const setPrimaryProductImageMutation = useMutation('/api/v1/admin/products/{id}/images/{imageId}/primary', {
    loading: true,
    method: METHOD.PATCH,
    notification: {
      content: 'Đặt ảnh chính thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/products/{id}/images/{imageId}/primary',
  });

  const triggerUploadProductImage = (payload: UploadProductImagePayload) => {
    return uploadProductImageMutation.trigger(buildUploadImagePayload(payload));
  };

  return {
    createProductMutation,
    deleteAdminProductMutation,
    getAdminProductById,
    getAllAdminProduct,
    removeProductImageMutation,
    setPrimaryProductImageMutation,
    triggerUploadProductImage,
    updateAdminProductMutation,
  };
};

export type UseAdminProductReturn = ReturnType<typeof useAdminProduct>;
export type AdminProductResponse<T = Record<string, unknown>> = RestResponse<T>;
