import type { PaginatedResponse } from '@/interfaces/response';

import { useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

export const PRODUCT_LIST_SORT_BY_VALUES = ['createdAt', 'name', 'price'] as const;
export type ProductListSortBy = (typeof PRODUCT_LIST_SORT_BY_VALUES)[number];

export const PRODUCT_LIST_SORT_ORDER_VALUES = ['asc', 'desc'] as const;
export type ProductListSortOrder = (typeof PRODUCT_LIST_SORT_ORDER_VALUES)[number];

export interface GetAllProductsParams {
  brandId?: string;
  categoryId?: string;
  collectionId?: string;
  maxPrice?: number;
  minPrice?: number;
  page?: number;
  search?: string;
  size?: number;
  sortBy?: ProductListSortBy;
  sortOrder?: ProductListSortOrder;
}

export const TOP_PRODUCTS_BY_VALUES = ['bestsellers', 'newest'] as const;
export type TopProductsBy = (typeof TOP_PRODUCTS_BY_VALUES)[number];

export interface GetTopProductsParams {
  by?: TopProductsBy;
  limit?: number;
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
  if (typeof params?.minPrice === 'number') searchParams.set('minPrice', String(params.minPrice));
  if (typeof params?.maxPrice === 'number') searchParams.set('maxPrice', String(params.maxPrice));
  if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);

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
  if (typeof params?.minPrice === 'number') normalized.minPrice = params.minPrice;
  if (typeof params?.maxPrice === 'number') normalized.maxPrice = params.maxPrice;
  if (params?.sortBy) normalized.sortBy = params.sortBy;
  if (params?.sortOrder) normalized.sortOrder = params.sortOrder;

  return normalized;
};

const normalizeTopProductsLimit = (limit?: number) => {
  if (typeof limit !== 'number' || Number.isNaN(limit)) {
    return 10;
  }

  const parsedLimit = Math.trunc(limit);

  if (parsedLimit < 1) {
    return 1;
  }

  if (parsedLimit > 50) {
    return 50;
  }

  return parsedLimit;
};

const normalizeGetTopParams = (params?: GetTopProductsParams): Required<GetTopProductsParams> => {
  return {
    by: params?.by ?? 'bestsellers',
    limit: normalizeTopProductsLimit(params?.limit),
  };
};

const buildTopQueryString = (params: Required<GetTopProductsParams>) => {
  const searchParams = new URLSearchParams();

  searchParams.set('by', params.by);
  searchParams.set('limit', String(params.limit));

  return searchParams.toString();
};

export interface UseProductsOptions {
  enabled?: boolean;
  getAllParams?: GetAllProductsParams;
  getTopParams?: GetTopProductsParams;
}

export const useProducts = (options?: UseProductsOptions) => {
  const shouldFetchGetAll = options?.enabled ?? true;
  const normalizedGetAllParams = normalizeGetAllParams(options?.getAllParams);
  const queryString = buildQueryString(normalizedGetAllParams);
  const getAllKey = shouldFetchGetAll ? `products:list:${queryString}` : null;

  const shouldFetchTop = Boolean(options?.getTopParams);
  const normalizedGetTopParams = normalizeGetTopParams(options?.getTopParams);
  const topQueryString = buildTopQueryString(normalizedGetTopParams);
  const getTopKey = shouldFetchTop ? `products:top:${topQueryString}` : null;

  const getAllProducts = useSWRWrapper<PaginatedResponse<ProductListItem>>(getAllKey, {
    body: normalizedGetAllParams as unknown as Record<string, unknown>,
    method: METHOD.GET,
    url: '/api/v1/products',
  });

  const getTopProducts = useSWRWrapper<ProductListItem[]>(getTopKey, {
    body: normalizedGetTopParams as unknown as Record<string, unknown>,
    method: METHOD.GET,
    url: '/api/v1/products/top',
  });

  return {
    getAllProducts,
    getTopProducts,
  };
};

export type UseProductsReturn = ReturnType<typeof useProducts>;
