import type { PaginatedResponse } from '@/interfaces/response';

import { useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

export interface GetAllProductsParams {
  brandId?: string;
  categoryId?: string;
  collectionId?: string;
  page?: number;
  search?: string;
  size?: number;
}

export interface ProductListBrand {
  id: string;
  name: string;
}

export interface ProductListImage {
  id: string;
  isPrimary?: boolean;
  key: string;
  url?: string;
}

export interface ProductListItem {
  brand?: ProductListBrand | null;
  brandId?: string | null;
  categoryId?: string | null;
  collectionId?: string | null;
  costPrice?: string | null;
  createdAt?: string | null;
  currency?: string | null;
  description?: string | null;
  id: string;
  images?: ProductListImage[];
  listPrice?: string | null;
  name: string;
  salePrice?: string | null;
  slug?: string;
  status?: 'ACTIVE' | 'ARCHIVED' | 'DELETED' | 'DRAFT' | null;
  updatedAt?: string | null;
}

const buildQueryString = (params?: GetAllProductsParams) => {
  const searchParams = new URLSearchParams();

  searchParams.set('page', String(params?.page ?? 1));
  searchParams.set('size', String(params?.size ?? 20));

  if (params?.search) searchParams.set('search', params.search);
  if (params?.brandId) searchParams.set('brandId', params.brandId);
  if (params?.collectionId) searchParams.set('collectionId', params.collectionId);
  if (params?.categoryId) searchParams.set('categoryId', params.categoryId);

  return searchParams.toString();
};

const normalizeGetAllParams = (params?: GetAllProductsParams): GetAllProductsParams => {
  const normalized: GetAllProductsParams = {
    page: params?.page ?? 1,
    size: params?.size ?? 20,
  };

  if (params?.search) normalized.search = params.search;
  if (params?.brandId) normalized.brandId = params.brandId;
  if (params?.collectionId) normalized.collectionId = params.collectionId;
  if (params?.categoryId) normalized.categoryId = params.categoryId;

  return normalized;
};

export interface UseProductsOptions {
  enabled?: boolean;
  getAllParams?: GetAllProductsParams;
}

export const useProducts = (options?: UseProductsOptions) => {
  const shouldFetchGetAll = options?.enabled ?? true;
  const normalizedGetAllParams = normalizeGetAllParams(options?.getAllParams);
  const queryString = buildQueryString(normalizedGetAllParams);
  const getAllKey = shouldFetchGetAll ? `products:list:${queryString}` : null;

  const getAllProducts = useSWRWrapper<PaginatedResponse<ProductListItem>>(getAllKey, {
    body: normalizedGetAllParams as unknown as Record<string, unknown>,
    method: METHOD.GET,
    url: '/api/v1/products',
  });

  return {
    getAllProducts,
  };
};

export type UseProductsReturn = ReturnType<typeof useProducts>;
