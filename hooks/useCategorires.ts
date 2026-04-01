import { useMutation, useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

export interface CategoryBase {
  createdAt?: string | null;
  description?: string | null;
  id: string;
  name: string;
  parentId?: string | null;
  slug: string;
  updatedAt?: string | null;
}

export interface CategoryDetail extends CategoryBase {
  products?: Record<string, unknown>[];
}

export interface UseCategoriresOptions {
  categoryId?: string;
}

export interface CreateCategoryPayload {
  csrf?: boolean;
  description?: string;
  name: string;
  parentId?: string;
  slug: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload> & {
  id: string;
};

export interface DeleteCategoryPayload {
  csrf?: boolean;
  id: string;
}

export const useCategorires = (options?: UseCategoriresOptions) => {
  const getAllCategories = useSWRWrapper<CategoryBase[]>('/api/v1/categories', {
    method: METHOD.GET,
    url: '/api/v1/categories',
  });

  const getCategoryById = useSWRWrapper<CategoryDetail>(
    options?.categoryId ? `/api/v1/categories/${options.categoryId}` : null,
    {
      method: METHOD.GET,
      noEndPoint: true,
      url: options?.categoryId ? `/api/v1/categories/${options.categoryId}` : '/api/v1/categories',
    },
  );

  const createCategoryMutation = useMutation<CategoryBase>('/api/v1/admin/categories', {
    loading: true,
    method: METHOD.POST,
    notification: {
      ignoreError: false,
      ignoreSuccess: true,
    },
    url: '/api/v1/admin/categories',
  });

  const updateCategoryMutation = useMutation<CategoryBase>('/api/v1/admin/categories/{id}', {
    loading: true,
    method: METHOD.PATCH,
    notification: {
      content: 'Cập nhật danh mục thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/categories/{id}',
  });

  const deleteCategoryMutation = useMutation<boolean>('/api/v1/admin/categories/{id}', {
    loading: true,
    method: METHOD.DELETE,
    notification: {
      content: 'Xóa danh mục thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/categories/{id}',
  });

  return {
    createCategoryMutation,
    deleteCategoryMutation,
    getAllCategories,
    getCategoryById,
    updateCategoryMutation,
  };
};

export const useCategories = useCategorires;
export type UseCategoriresReturn = ReturnType<typeof useCategorires>;
