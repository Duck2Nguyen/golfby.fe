import { useMutation, useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

export enum ProductVariantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface ProductVariantItem {
  id?: string;
  barcode: string;
  costPrice: number;
  listPrice: number;
  salePrice: number;
  sku: string;
  status?: ProductVariantStatus;
  stock: number;
  variantId?: string;
}

export type PutProductVariantsPayload = ProductVariantItem[];

interface BulkUpdateVariantItemPayload {
  barcode?: string;
  costPrice?: number;
  listPrice?: number;
  salePrice?: number;
  sku?: string;
  status: ProductVariantStatus;
  stock?: number;
  variantId: string;
}

interface BulkUpdateVariantsPayload {
  items: BulkUpdateVariantItemPayload[];
}

export const fakeProductVariants: ProductVariantItem[] = [
  {
    barcode: '8938505974011',
    costPrice: 3500000,
    id: 'fake-variant-1',
    listPrice: 4500000,
    salePrice: 4200000,
    sku: 'DRV-A-VANG-S',
    stock: 18,
  },
  {
    barcode: '8938505974012',
    costPrice: 3500000,
    id: 'fake-variant-2',
    listPrice: 4500000,
    salePrice: 4150000,
    sku: 'DRV-A-XANH-S',
    stock: 14,
  },
  {
    barcode: '8938505974013',
    costPrice: 3500000,
    id: 'fake-variant-3',
    listPrice: 4500000,
    salePrice: 4250000,
    sku: 'DRV-A-VANG-M',
    stock: 9,
  },
  {
    barcode: '8938505974014',
    costPrice: 3500000,
    id: 'fake-variant-4',
    listPrice: 4500000,
    salePrice: 4190000,
    sku: 'DRV-A-XANH-M',
    stock: 12,
  },
  {
    barcode: '8938505974015',
    costPrice: 3500000,
    id: 'fake-variant-5',
    listPrice: 4500000,
    salePrice: 4300000,
    sku: 'DRV-A-VANG-L',
    stock: 7,
  },
  {
    barcode: '8938505974016',
    costPrice: 3500000,
    id: 'fake-variant-6',
    listPrice: 4500000,
    salePrice: 4220000,
    sku: 'DRV-A-XANH-L',
    stock: 10,
  },
];

const buildBulkUpdateVariantsPayload = (payload: PutProductVariantsPayload): BulkUpdateVariantsPayload => {
  const items = payload
    .map(item => {
      const variantId = item.variantId ?? item.id;
      if (!variantId) return null;

      return {
        barcode: item.barcode,
        costPrice: item.costPrice,
        listPrice: item.listPrice,
        salePrice: item.salePrice,
        sku: item.sku,
        status: ProductVariantStatus.ACTIVE,
        stock: item.stock,
        variantId,
      } satisfies BulkUpdateVariantItemPayload;
    })
    .filter((item): item is BulkUpdateVariantItemPayload => item !== null);

  return { items };
};

export interface UseVariantsOptions {
  fetchList?: boolean;
}

export const useVariants = (productId?: string, options?: UseVariantsOptions) => {
  const listEndpoint = productId ? `/api/v1/admin/products/${productId}/variants` : null;
  const bulkUpdateEndpoint = productId
    ? `/api/v1/admin/products/${productId}/variants/bulk`
    : '/api/v1/admin/products/{productId}/variants/bulk';

  const shouldFetchList = options?.fetchList ?? true;
  const listKey = shouldFetchList ? listEndpoint : null;

  const getAllVariants = useSWRWrapper<ProductVariantItem[]>(listKey, {
    method: METHOD.GET,
    url: listEndpoint ?? '/api/v1/admin/products/{productId}/variants',
  });

  const putVariantsMutation = useMutation<{ updated: number; variantIds: string[] }>(
    bulkUpdateEndpoint,
    {
      loading: true,
      method: METHOD.PATCH,
      notification: {
        content: 'Cập nhật danh sách variants thành công',
        title: 'Thành công',
      },
      url: bulkUpdateEndpoint,
    },
  );

  const putVariantsAction = (payload: PutProductVariantsPayload) => {
    return putVariantsMutation.trigger(
      buildBulkUpdateVariantsPayload(payload) as unknown as Record<string, unknown>,
    );
  };

  const getFakeVariants = () => fakeProductVariants;

  return {
    getAllVariants,
    getFakeVariants,
    putVariantsAction,
    putVariantsMutation,
  };
};

export type UseVariantsReturn = ReturnType<typeof useVariants>;
