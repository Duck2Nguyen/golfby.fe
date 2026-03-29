import { useMemo } from 'react';

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
  productTagIds?: string[];
  salePrice?: string;
  slug: string;
  status?: Exclude<AdminProductStatus, 'DELETED'>;
  subcategoryId?: string;
}

export interface UpdateAdminProductPayload {
  brandId?: string | null;
  categoryId?: string | null;
  costPrice?: string;
  currency?: string;
  description?: string;
  listPrice?: string;
  name?: string;
  productTagIds?: string[];
  salePrice?: string;
  slug?: string;
  status?: Exclude<AdminProductStatus, 'DELETED'>;
  subcategoryId?: string | null;
  // TODO: add `productTagsNew` after BE update-tags contract is finalized.
  // TODO: add `productOptions` after BE supports options update via PATCH product API.
}

export interface TriggerUpdateAdminProductPayload extends UpdateAdminProductPayload {
  csrf?: boolean;
  id: string;
}

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

export interface AdminProductTag {
  createdAt?: string | null;
  id: string;
  name: string;
  slug: string;
  updatedAt?: string | null;
}

export interface AdminProductDetailBrand {
  createdAt?: string | null;
  description?: string | null;
  id: string;
  logoUrl?: string | null;
  name: string;
  slug?: string;
  updatedAt?: string | null;
}

export interface AdminProductDetailCategory {
  createdAt?: string | null;
  description?: string | null;
  id: string;
  name: string;
  parentId?: string | null;
  slug?: string;
  updatedAt?: string | null;
}

export interface AdminProductDetailSubcategory {
  categoryId?: string | null;
  createdAt?: string | null;
  description?: string | null;
  id: string;
  name: string;
  slug?: string;
  updatedAt?: string | null;
}

export interface AdminProductDetailOptionValue {
  id: string;
  optionId: string;
  value: string;
}

export interface AdminProductDetailOption {
  id: string;
  name: string;
  productId: string;
  values: AdminProductDetailOptionValue[];
}

export interface AdminProductVariantSelectedOptionValue {
  optionValue?: AdminProductDetailOptionValue | null;
  productOptionValueId: string;
  variantId: string;
}

export interface AdminProductDetailVariant {
  barcode?: string | null;
  costPrice?: string | number | null;
  createdAt?: string | null;
  deletedAt?: string | null;
  id: string;
  listPrice?: string | number | null;
  productId: string;
  salePrice?: string | number | null;
  selectedOptionValues?: AdminProductVariantSelectedOptionValue[];
  sku?: string | null;
  status?: AdminProductStatus;
  stock?: number | null;
  updatedAt?: string | null;
}

export interface AdminProductDetailImage extends AdminProductImage {
  createdAt?: string | null;
  productVariantId?: string | null;
}

export interface AdminProductDetail {
  brand?: AdminProductDetailBrand | null;
  brandId?: string | null;
  category?: AdminProductDetailCategory | null;
  categoryId?: string | null;
  costPrice?: string | number | null;
  createdAt?: string | null;
  currency?: string | null;
  description?: string | null;
  id: string;
  images?: AdminProductDetailImage[];
  listPrice?: string | number | null;
  name: string;
  options?: AdminProductDetailOption[];
  salePrice?: string | number | null;
  slug?: string;
  status?: AdminProductStatus;
  subcategory?: AdminProductDetailSubcategory | null;
  subcategoryId?: string | null;
  tags?: AdminProductTag[];
  updatedAt?: string | null;
  variants?: AdminProductDetailVariant[];
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
  csrf?: boolean;
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

export const buildUpdateAdminProductPayload = (
  payload: TriggerUpdateAdminProductPayload,
): TriggerUpdateAdminProductPayload => {
  const normalizedPayload: TriggerUpdateAdminProductPayload = {
    id: payload.id,
  };

  if (payload.csrf) normalizedPayload.csrf = true;
  if (payload.name !== undefined) normalizedPayload.name = payload.name;
  if (payload.slug !== undefined) normalizedPayload.slug = payload.slug;
  if (payload.description !== undefined) normalizedPayload.description = payload.description;
  if (payload.costPrice !== undefined) normalizedPayload.costPrice = payload.costPrice;
  if (payload.listPrice !== undefined) normalizedPayload.listPrice = payload.listPrice;
  if (payload.salePrice !== undefined) normalizedPayload.salePrice = payload.salePrice;
  if (payload.currency !== undefined) normalizedPayload.currency = payload.currency;
  if (payload.status !== undefined) normalizedPayload.status = payload.status;
  if (payload.brandId !== undefined) normalizedPayload.brandId = payload.brandId;
  if (payload.categoryId !== undefined) normalizedPayload.categoryId = payload.categoryId;
  if (payload.subcategoryId !== undefined) normalizedPayload.subcategoryId = payload.subcategoryId;
  if (payload.productTagIds !== undefined) normalizedPayload.productTagIds = payload.productTagIds;

  // TODO: add `productTagsNew` once BE update-tags API contract is stable.
  // TODO: add `productOptions` once BE supports options update in PATCH /admin/products/{id}.

  return normalizedPayload;
};

const buildUploadImagePayload = (payload: UploadProductImagePayload) => {
  const formData = new FormData();
  formData.append('id', payload.id);
  formData.append('image', payload.image);

  if (payload.csrf) {
    formData.append('csrf', 'true');
  }

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
  const requestNonce = useMemo(() => Date.now().toString(36), []);
  const normalizedGetAllParams = normalizeGetAllParams(options?.getAllParams);
  const queryString = buildQueryString(normalizedGetAllParams);
  const getAllKey = `admin-products:list:${queryString}:${requestNonce}`;
  const detailKey = options?.detailProductId
    ? `admin-products:detail:${options.detailProductId}:${requestNonce}`
    : null;

  const getAllAdminProduct = useSWRWrapper<PaginatedResponse<AdminProductListItem>>(getAllKey, {
    body: normalizedGetAllParams as unknown as Record<string, unknown>,
    dedupingInterval: 0,
    keepPreviousData: false,
    method: METHOD.GET,
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    url: '/api/v1/admin/products',
  });

  const getAdminProductById = useSWRWrapper<AdminProductDetail>(detailKey, {
    dedupingInterval: 0,
    keepPreviousData: false,
    method: METHOD.GET,
    noEndPoint: true,
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    url: options?.detailProductId
      ? `/api/v1/admin/products/${options.detailProductId}`
      : '/api/v1/admin/products',
  });

  const createProductMutation = useMutation<AdminProductDetail>('/api/v1/admin/products', {
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

  const triggerRemoveProductImage = (payload: RemoveProductImagePayload) => {
    return removeProductImageMutation.trigger({
      csrf: true,
      id: payload.id,
      imageId: payload.imageId,
    } as unknown as Record<string, unknown>);
  };

  const triggerUpdateAdminProduct = (payload: TriggerUpdateAdminProductPayload) => {
    return updateAdminProductMutation.trigger(
      buildUpdateAdminProductPayload(payload) as unknown as Record<string, unknown>,
    );
  };

  return {
    createProductMutation,
    deleteAdminProductMutation,
    getAdminProductById,
    getAllAdminProduct,
    removeProductImageMutation,
    setPrimaryProductImageMutation,
    triggerRemoveProductImage,
    triggerUploadProductImage,
    triggerUpdateAdminProduct,
    updateAdminProductMutation,
  };
};

export type UseAdminProductReturn = ReturnType<typeof useAdminProduct>;
export type AdminProductResponse<T = Record<string, unknown>> = RestResponse<T>;
