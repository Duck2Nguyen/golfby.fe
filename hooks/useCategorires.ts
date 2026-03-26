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

export interface Subcategory extends CategoryBase {
  category?: CategoryBase;
  categoryId: string;
}

export interface CategoryWithSubcategories extends CategoryBase {
  subcategories: Subcategory[];
}

export interface CategoryDetail extends CategoryWithSubcategories {
  products?: Record<string, unknown>[];
}

export interface UseCategoriresOptions {
  categoryId?: string;
  subcategoryId?: string;
  subcategoriesByCategoryId?: string;
}

export interface CreateCategoryPayload {
  csrfToken?: string;
  description?: string;
  name: string;
  parentId?: string;
  slug: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload> & {
  id: string;
};

export interface DeleteCategoryPayload {
  csrfToken?: string;
  id: string;
}

export interface CreateSubcategoryPayload {
  categoryId: string;
  csrfToken?: string;
  description?: string;
  name: string;
  slug: string;
}

export type UpdateSubcategoryPayload = Partial<CreateSubcategoryPayload> & {
  id: string;
};

export interface DeleteSubcategoryPayload {
  csrfToken?: string;
  id: string;
}

export const useCategorires = (options?: UseCategoriresOptions) => {
  const getAllCategories = useSWRWrapper<CategoryWithSubcategories[]>('/api/v1/categories', {
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

  const subcategoryQuery = options?.subcategoriesByCategoryId
    ? `?categoryId=${options.subcategoriesByCategoryId}`
    : '';

  const getAllSubcategories = useSWRWrapper<Subcategory[]>(`/api/v1/subcategories${subcategoryQuery}`, {
    body: options?.subcategoriesByCategoryId
      ? ({ categoryId: options.subcategoriesByCategoryId } as unknown as Record<string, unknown>)
      : undefined,
    method: METHOD.GET,
    url: '/api/v1/subcategories',
  });

  const getSubcategoryById = useSWRWrapper<Subcategory>(
    options?.subcategoryId ? `/api/v1/subcategories/${options.subcategoryId}` : null,
    {
      method: METHOD.GET,
      noEndPoint: true,
      url: options?.subcategoryId
        ? `/api/v1/subcategories/${options.subcategoryId}`
        : '/api/v1/subcategories',
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

  const createSubcategoryMutation = useMutation<Subcategory>('/api/v1/admin/subcategories', {
    loading: true,
    method: METHOD.POST,
    notification: {
      content: 'Tạo danh mục con thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/subcategories',
  });

  const updateSubcategoryMutation = useMutation<Subcategory>('/api/v1/admin/subcategories/{id}', {
    loading: true,
    method: METHOD.PATCH,
    notification: {
      content: 'Cập nhật danh mục con thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/subcategories/{id}',
  });

  const deleteSubcategoryMutation = useMutation<boolean>('/api/v1/admin/subcategories/{id}', {
    loading: true,
    method: METHOD.DELETE,
    notification: {
      content: 'Xóa danh mục con thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/subcategories/{id}',
  });

  return {
    createCategoryMutation,
    createSubcategoryMutation,
    deleteCategoryMutation,
    deleteSubcategoryMutation,
    getAllCategories,
    getAllSubcategories,
    getCategoryById,
    getSubcategoryById,
    updateCategoryMutation,
    updateSubcategoryMutation,
  };
};

export const useCategories = useCategorires;
export type UseCategoriresReturn = ReturnType<typeof useCategorires>;
