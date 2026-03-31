import { useMutation, useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

export interface CollectionCategory {
  collectionId?: string | null;
  createdAt?: string | null;
  description?: string | null;
  id: string;
  name: string;
  slug: string;
  updatedAt?: string | null;
}

export interface CollectionBase {
  createdAt?: string | null;
  description?: string | null;
  id: string;
  name: string;
  parentId?: string | null;
  slug: string;
  updatedAt?: string | null;
}

export interface CollectionTreeNode extends CollectionBase {
  categories: CollectionCategory[];
  children: CollectionTreeNode[];
}

export interface CollectionProduct {
  brandId?: string | null;
  categoryId?: string | null;
  collectionId?: string | null;
  costPrice?: string | null;
  createdAt?: string | null;
  currency?: string | null;
  description?: string | null;
  id: string;
  listPrice?: string | null;
  name: string;
  salePrice?: string | null;
  slug: string;
  status?: 'ACTIVE' | 'ARCHIVED' | 'DELETED' | 'DRAFT' | null;
  updatedAt?: string | null;
}

export interface CollectionDetail extends CollectionTreeNode {
  products: CollectionProduct[];
}

export interface CollectionWithCategories extends CollectionBase {
  categories: CollectionCategory[];
}

export interface UseCollectionsOptions {
  collectionId?: string;
}

export interface CreateCollectionPayload {
  categoryIds?: string[];
  csrf?: boolean;
  description?: string;
  name: string;
  parentId?: string | null;
  slug: string;
}

export type UpdateCollectionPayload = Partial<CreateCollectionPayload> & {
  id: string;
  removedCategoryIds?: string[];
};

export interface DeleteCollectionPayload {
  csrf?: boolean;
  id: string;
}

export const useCollections = (options?: UseCollectionsOptions) => {
  const getAllCollections = useSWRWrapper<CollectionTreeNode[]>('/api/v1/collections', {
    method: METHOD.GET,
    url: '/api/v1/collections',
  });

  const getCollectionById = useSWRWrapper<CollectionDetail>(
    options?.collectionId ? `/api/v1/collections/${options.collectionId}` : null,
    {
      method: METHOD.GET,
      noEndPoint: true,
      url: options?.collectionId ? `/api/v1/collections/${options.collectionId}` : '/api/v1/collections',
    },
  );

  const createCollectionMutation = useMutation<CollectionWithCategories>('/api/v1/admin/collections', {
    loading: true,
    method: METHOD.POST,
    notification: {
      ignoreError: false,
      ignoreSuccess: true,
    },
    url: '/api/v1/admin/collections',
  });

  const updateCollectionMutation = useMutation<CollectionWithCategories>('/api/v1/admin/collections/{id}', {
    loading: true,
    method: METHOD.PATCH,
    notification: {
      content: 'Cập nhật collection thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/collections/{id}',
  });

  const deleteCollectionMutation = useMutation<boolean>('/api/v1/admin/collections/{id}', {
    loading: true,
    method: METHOD.DELETE,
    notification: {
      content: 'Xóa collection thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/collections/{id}',
  });

  return {
    createCollectionMutation,
    deleteCollectionMutation,
    getAllCollections,
    getCollectionById,
    updateCollectionMutation,
  };
};

export type UseCollectionsReturn = ReturnType<typeof useCollections>;
