import type {
  StaticContentEntry,
  StaticContentValue,
  UseStaticContentOptions,
} from '@/hooks/useStaticContents';

import { useMutation, useSWRWrapper } from '@/hooks/swr';
import {
  useAdminStaticContent,
  usePublicStaticContent,
  isProductIdsShelfSection,
  useUpdateAdminStaticContent,
  STATIC_CONTENT_SECTION_TYPES,
  DEFAULT_STATIC_CONTENT_LOCALE,
} from '@/hooks/useStaticContents';

import { METHOD } from '@/global/common';

export { isProductIdsShelfSection, STATIC_CONTENT_SECTION_TYPES, DEFAULT_STATIC_CONTENT_LOCALE };

export type {
  StaticContentEntry,
  StaticContentValue,
  HomeStaticContentValue,
  StaticContentHeroSlide,
  UseStaticContentOptions,
  StaticContentKnownSectionType,
  UpdateAdminStaticContentPayload,
  StaticContentProductShelfSection,
} from '@/hooks/useStaticContents';

export interface CreateAdminStaticContentPayload {
  contentKey: string;
  csrf?: boolean;
  locale?: string;
  value: StaticContentValue;
}

export interface UploadAdminStaticContentImagePayload {
  csrf?: boolean;
  image: File;
  path?: string;
}

export interface UploadAdminStaticContentImageResponse {
  imageUrl: string;
  key: string;
}

export const STATIC_HOME_CATEGORIES = {
  BANNER: 'BANNER',
  COLLECTION: 'COLLECTION',
  PRODUCT_NEW: 'PRODUCT_NEW',
} as const;

export const STATIC_HOME_COLLECTION_DIRECTIONS = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
} as const;

export type StaticHomeCategory = (typeof STATIC_HOME_CATEGORIES)[keyof typeof STATIC_HOME_CATEGORIES];

export interface BannerStaticHomeValue {
  href: string;
  imageId: string;
  imageUrl?: string;
}

export interface ProductNewStaticHomeValue {
  href: string;
  imageId: string;
  imageUrl?: string;
  name: string;
}

export interface CollectionStaticHomeValue {
  collectionId: string;
  direction: (typeof STATIC_HOME_COLLECTION_DIRECTIONS)[keyof typeof STATIC_HOME_COLLECTION_DIRECTIONS];
  href: string;
  imageId: string;
  imageUrl?: string;
}

export type StaticHomeValue = BannerStaticHomeValue | ProductNewStaticHomeValue | CollectionStaticHomeValue;

export interface StaticHomeItem {
  category: StaticHomeCategory;
  createdAt?: string | null;
  id: string;
  updatedAt?: string | null;
  value: StaticHomeValue;
}

export interface CreateAdminStaticHomePayload {
  category: StaticHomeCategory;
  csrf?: boolean;
  value: StaticHomeValue;
}

export interface UpdateAdminStaticHomePayload {
  category?: StaticHomeCategory;
  csrf?: boolean;
  id: string;
  value?: StaticHomeValue;
}

export interface DeleteAdminStaticHomePayload {
  csrf?: boolean;
  id: string;
}

export interface UseAdminStaticHomeDetailOptions {
  enabled?: boolean;
  id?: string;
}

export interface UseStaticDataOptions {
  adminStaticContent?: UseStaticContentOptions;
  adminStaticHomeDetail?: UseAdminStaticHomeDetailOptions;
  enableAdminStaticHomeList?: boolean;
  publicStaticContent?: UseStaticContentOptions;
}

const buildStaticHomeListKey = () => 'admin-static-home:list';

const buildStaticHomeDetailKey = (id: string) => `admin-static-home:detail:${id}`;

const normalizeUploadStaticContentImagePath = (path?: string) => {
  const normalizedPath = path
    ?.trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/{2,}/g, '/');
  return normalizedPath || undefined;
};

export const buildUploadAdminStaticContentImagePayload = (
  payload: UploadAdminStaticContentImagePayload,
): FormData => {
  const formData = new FormData();

  formData.append('image', payload.image);

  const normalizedPath = normalizeUploadStaticContentImagePath(payload.path);
  if (normalizedPath) {
    formData.append('path', normalizedPath);
  }

  if (payload.csrf) {
    formData.append('csrf', 'true');
  }

  return formData;
};

export const useCreateAdminStaticContent = () => {
  const createAdminStaticContentMutation = useMutation<StaticContentEntry>('/api/v1/admin/static-contents', {
    loading: true,
    method: METHOD.POST,
    notification: {
      content: 'Static content created successfully',
      title: 'Success',
    },
    url: '/api/v1/admin/static-contents',
  });

  const trigger = (payload: CreateAdminStaticContentPayload) => {
    return createAdminStaticContentMutation.trigger({
      ...payload,
      locale: payload.locale ?? DEFAULT_STATIC_CONTENT_LOCALE,
    });
  };

  return {
    ...createAdminStaticContentMutation,
    trigger,
  };
};

export const useUploadAdminStaticContentImage = () => {
  const uploadAdminStaticContentImageMutation = useMutation<UploadAdminStaticContentImageResponse>(
    '/api/v1/admin/static-contents/upload-image',
    {
      loading: true,
      method: METHOD.POST,
      url: '/api/v1/admin/static-contents/upload-image',
    },
  );

  const trigger = (payload: UploadAdminStaticContentImagePayload) => {
    return uploadAdminStaticContentImageMutation.trigger(buildUploadAdminStaticContentImagePayload(payload));
  };

  return {
    ...uploadAdminStaticContentImageMutation,
    trigger,
  };
};

export const useAdminStaticHomeList = (enabled: boolean = true) => {
  return useSWRWrapper<StaticHomeItem[]>(enabled ? buildStaticHomeListKey() : null, {
    method: METHOD.GET,
    url: '/api/v1/admin/static-home',
  });
};

export const useAdminStaticHomeDetail = (options?: UseAdminStaticHomeDetailOptions) => {
  const shouldFetch = Boolean(options?.id && (options?.enabled ?? true));

  return useSWRWrapper<StaticHomeItem>(
    shouldFetch && options?.id ? buildStaticHomeDetailKey(options.id) : null,
    {
      method: METHOD.GET,
      url: options?.id ? `/api/v1/admin/static-home/${options.id}` : '/api/v1/admin/static-home',
    },
  );
};

export const useCreateAdminStaticHome = () => {
  return useMutation<StaticHomeItem>('/api/v1/admin/static-home', {
    loading: true,
    method: METHOD.POST,
    notification: {
      content: 'Tạo banner thành công',
      title: 'Success',
    },
    url: '/api/v1/admin/static-home',
  });
};

export const useUpdateAdminStaticHome = () => {
  return useMutation<StaticHomeItem>('/api/v1/admin/static-home/{id}', {
    loading: true,
    method: METHOD.PATCH,
    notification: {
      content: 'Cập nhật banner thành công',
      title: 'Success',
    },
    url: '/api/v1/admin/static-home/{id}',
  });
};

export const useDeleteAdminStaticHome = () => {
  return useMutation<boolean>('/api/v1/admin/static-home/{id}', {
    loading: true,
    method: METHOD.DELETE,
    notification: {
      content: 'Xóa banner thành công',
      title: 'Success',
    },
    url: '/api/v1/admin/static-home/{id}',
  });
};

export const useStaticData = (options?: UseStaticDataOptions) => {
  const publicStaticContent = usePublicStaticContent(options?.publicStaticContent);
  const adminStaticContent = useAdminStaticContent(options?.adminStaticContent);
  const adminStaticHomeList = useAdminStaticHomeList(options?.enableAdminStaticHomeList ?? false);
  const adminStaticHomeDetail = useAdminStaticHomeDetail(options?.adminStaticHomeDetail);

  const createAdminStaticContentMutation = useCreateAdminStaticContent();
  const updateAdminStaticContentMutation = useUpdateAdminStaticContent();
  const uploadAdminStaticContentImageMutation = useUploadAdminStaticContentImage();

  const createAdminStaticHomeMutation = useCreateAdminStaticHome();
  const updateAdminStaticHomeMutation = useUpdateAdminStaticHome();
  const deleteAdminStaticHomeMutation = useDeleteAdminStaticHome();

  return {
    adminStaticContent,
    adminStaticHomeDetail,
    adminStaticHomeList,
    createAdminStaticContentMutation,
    createAdminStaticHomeMutation,
    deleteAdminStaticHomeMutation,
    publicStaticContent,
    updateAdminStaticContentMutation,
    updateAdminStaticHomeMutation,
    uploadAdminStaticContentImageMutation,
  };
};
