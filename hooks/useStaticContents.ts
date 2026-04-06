import { useMutation, useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

export const DEFAULT_STATIC_CONTENT_LOCALE = 'vi';

export const STATIC_CONTENT_SECTION_TYPES = {
  PRODUCT_IDS: 'product_ids',
} as const;

export type StaticContentKnownSectionType =
  (typeof STATIC_CONTENT_SECTION_TYPES)[keyof typeof STATIC_CONTENT_SECTION_TYPES];

export interface StaticContentHeroSlide {
  href?: string;
  imageUrl: string;
  title?: string;
}

export interface StaticContentProductShelfSection {
  categoryId?: string;
  collectionId?: string;
  id: string;
  productIds?: string[];
  title: string;
  type: StaticContentKnownSectionType | string;
}

export interface HomeStaticContentValue {
  hero?: StaticContentHeroSlide[];
  searchKeywords?: string[];
  sections?: StaticContentProductShelfSection[];
}

export type StaticContentValue = HomeStaticContentValue;

export interface StaticContentEntry {
  contentKey: string;
  createdAt?: string | null;
  id: string;
  locale: string;
  updatedAt?: string | null;
  value: StaticContentValue;
}

export interface UseStaticContentOptions {
  contentKey?: string;
  enabled?: boolean;
  locale?: string;
}

export interface UpdateAdminStaticContentPayload {
  contentKey: string;
  csrf?: boolean;
  locale?: string;
  value: StaticContentValue;
}

const buildStaticContentKey = (scope: 'admin' | 'public', contentKey: string, locale: string) =>
  `static-contents:${scope}:${contentKey}:${locale}`;

export const isProductIdsShelfSection = (section: StaticContentProductShelfSection) => {
  return section.type === STATIC_CONTENT_SECTION_TYPES.PRODUCT_IDS;
};

export const usePublicStaticContent = (options?: UseStaticContentOptions) => {
  const locale = options?.locale ?? DEFAULT_STATIC_CONTENT_LOCALE;
  const contentKey = options?.contentKey;
  const shouldFetch = Boolean(contentKey && (options?.enabled ?? true));

  return useSWRWrapper<StaticContentEntry>(
    shouldFetch && contentKey ? buildStaticContentKey('public', contentKey, locale) : null,
    {
      body: { locale },
      method: METHOD.GET,
      url: contentKey ? `/api/v1/static-contents/${contentKey}` : '/api/v1/static-contents',
    },
  );
};

export const useAdminStaticContent = (options?: UseStaticContentOptions) => {
  const locale = options?.locale ?? DEFAULT_STATIC_CONTENT_LOCALE;
  const contentKey = options?.contentKey;
  const shouldFetch = Boolean(contentKey && (options?.enabled ?? true));

  return useSWRWrapper<StaticContentEntry>(
    shouldFetch && contentKey ? buildStaticContentKey('admin', contentKey, locale) : null,
    {
      body: { locale },
      method: METHOD.GET,
      url: contentKey ? `/api/v1/admin/static-contents/${contentKey}` : '/api/v1/admin/static-contents',
    },
  );
};

export const useUpdateAdminStaticContent = () => {
  const updateAdminStaticContentMutation = useMutation<StaticContentEntry>(
    '/api/v1/admin/static-contents/{contentKey}?locale={locale}',
    {
      loading: true,
      method: METHOD.PATCH,
      notification: {
        content: 'Static content updated successfully',
        title: 'Success',
      },
      url: '/api/v1/admin/static-contents/{contentKey}?locale={locale}',
    },
  );

  const trigger = (payload: UpdateAdminStaticContentPayload) => {
    return updateAdminStaticContentMutation.trigger({
      ...payload,
      locale: payload.locale ?? DEFAULT_STATIC_CONTENT_LOCALE,
    });
  };

  return {
    ...updateAdminStaticContentMutation,
    trigger,
  };
};
