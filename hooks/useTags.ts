import { useMutation, useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

export interface Tag {
  createdAt?: string | null;
  id: string;
  name: string;
  slug: string;
  updatedAt?: string | null;
}

export interface UseTagsOptions {
  tagId?: string;
}

export interface CreateTagPayload {
  csrf?: boolean;
  name: string;
  slug: string;
}

export type UpdateTagPayload = Partial<CreateTagPayload> & {
  id: string;
};

export const useTags = (options?: UseTagsOptions) => {
  const getAllTags = useSWRWrapper<Tag[]>('/api/v1/tags', {
    method: METHOD.GET,
    url: '/api/v1/tags',
  });

  const getTagById = useSWRWrapper<Tag>(options?.tagId ? `/api/v1/tags/${options.tagId}` : null, {
    method: METHOD.GET,
    noEndPoint: true,
    url: options?.tagId ? `/api/v1/tags/${options.tagId}` : '/api/v1/tags',
  });

  const createTagMutation = useMutation<Tag>('/api/v1/admin/tags', {
    loading: true,
    method: METHOD.POST,
    notification: {
      ignoreError: false,
      ignoreSuccess: true,
    },
    url: '/api/v1/admin/tags',
  });

  const updateTagMutation = useMutation<Tag>('/api/v1/admin/tags/{id}', {
    loading: true,
    method: METHOD.PATCH,
    notification: {
      content: 'Cập nhật tag thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/tags/{id}',
  });

  return {
    createTagMutation,
    getAllTags,
    getTagById,
    updateTagMutation,
  };
};

export type UseTagsReturn = ReturnType<typeof useTags>;
