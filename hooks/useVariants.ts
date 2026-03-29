import { useMutation } from '@/hooks/swr';

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
  barcode: string;
  costPrice: number;
  listPrice: number;
  salePrice: number;
  sku: string;
  status: ProductVariantStatus;
  stock: number;
  variantId: string;
}

interface BulkUpdateVariantsPayload {
  items: BulkUpdateVariantItemPayload[];
}

const buildBulkUpdateVariantsPayload = (payload: PutProductVariantsPayload): BulkUpdateVariantsPayload => {
  const items: BulkUpdateVariantItemPayload[] = [];

  payload.forEach(item => {
    const variantId = item.variantId ?? item.id;

    if (!variantId) {
      return;
    }

    items.push({
      barcode: item.barcode,
      costPrice: item.costPrice,
      listPrice: item.listPrice,
      salePrice: item.salePrice,
      sku: item.sku,
      status: ProductVariantStatus.ACTIVE,
      stock: item.stock,
      variantId,
    });
  });

  return { items };
};

export const useVariants = (productId?: string) => {
  const bulkUpdateEndpoint = productId
    ? `/api/v1/admin/products/${productId}/variants/bulk`
    : '/api/v1/admin/products/{productId}/variants/bulk';

  const putVariantsMutation = useMutation<{ updated: number; variantIds: string[] }>(bulkUpdateEndpoint, {
    loading: true,
    method: METHOD.PATCH,
    notification: {
      content: 'Cập nhật danh sách variants thành công',
      title: 'Thành công',
    },
    url: bulkUpdateEndpoint,
  });

  const putVariantsAction = (payload: PutProductVariantsPayload) => {
    return putVariantsMutation.trigger(
      buildBulkUpdateVariantsPayload(payload) as unknown as Record<string, unknown>,
    );
  };

  return {
    putVariantsAction,
    putVariantsMutation,
  };
};

export type UseVariantsReturn = ReturnType<typeof useVariants>;
