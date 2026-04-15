import { useMutation, useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

export type AdminCustomOptionType =
  | 'TEXT'
  | 'TEXTAREA'
  | 'NUMBER'
  | 'DROPDOWN'
  | 'RADIO'
  | 'CHECKBOX'
  | 'COLOR_SWATCH'
  | 'IMAGE_SWATCH'
  | 'FILE_UPLOAD'
  | 'DATE';

export type AdminPriceModifierType = 'NONE' | 'FIXED' | 'PERCENT';

export type AdminConditionAction = 'SHOW' | 'HIDE';

export interface AdminCustomOptionChoice {
  colorHex?: string | null;
  id: string;
  imageUrl?: string | null;
  presignedImageUrl?: string | null;
  isDefault?: boolean | null;
  label: string;
  linkedVariantId?: string | null;
  optionId: string;
  priceModifierType?: AdminPriceModifierType | null;
  priceModifierValue?: number | string | null;
  sortOrder?: number | null;
  value: string;
}

export interface AdminCustomOptionCondition {
  action: AdminConditionAction;
  id: string;
  targetOptionId: string;
  triggerChoiceId: string;
  triggerOptionId: string;
}

export interface AdminCustomOption {
  choices?: AdminCustomOptionChoice[];
  conditionsAsTarget?: AdminCustomOptionCondition[];
  groupId: string;
  id: string;
  isRequired?: boolean | null;
  label: string;
  placeholder?: string | null;
  priceModifierType?: AdminPriceModifierType | null;
  priceModifierValue?: number | string | null;
  sortOrder?: number | null;
  type: AdminCustomOptionType;
  validationRules?: Record<string, unknown> | null;
}

export interface AdminCustomOptionGroup {
  createdAt?: string | null;
  id: string;
  name: string;
  options?: AdminCustomOption[];
  sortOrder?: number;
  updatedAt?: string | null;
}

export interface CreateAdminCustomOptionGroupPayload {
  csrf?: boolean;
  name: string;
}

export interface UpdateAdminCustomOptionGroupPayload {
  csrf?: boolean;
  groupId: string;
  name?: string;
}

export interface DeleteAdminCustomOptionGroupPayload {
  csrf?: boolean;
  groupId: string;
}

export interface CreateAdminCustomOptionPayload {
  csrf?: boolean;
  groupId: string;
  isRequired?: boolean;
  label: string;
  placeholder?: string;
  priceModifierType?: AdminPriceModifierType;
  priceModifierValue?: number;
  sortOrder?: number;
  type: AdminCustomOptionType;
  validationRules?: Record<string, unknown>;
}

export interface UpdateAdminCustomOptionPayload {
  csrf?: boolean;
  isRequired?: boolean;
  label?: string;
  optionId: string;
  placeholder?: string;
  priceModifierType?: AdminPriceModifierType;
  priceModifierValue?: number;
  sortOrder?: number;
  type?: AdminCustomOptionType;
  validationRules?: Record<string, unknown>;
}

export interface DeleteAdminCustomOptionPayload {
  csrf?: boolean;
  optionId: string;
}

export interface CreateAdminCustomOptionChoicePayload {
  colorHex?: string;
  csrf?: boolean;
  imageUrl?: string;
  isDefault?: boolean;
  label: string;
  linkedVariantId?: string;
  optionId: string;
  priceModifierType?: AdminPriceModifierType;
  priceModifierValue?: number;
  sortOrder?: number;
  value: string;
}

export interface UpdateAdminCustomOptionChoicePayload {
  choiceId: string;
  colorHex?: string;
  csrf?: boolean;
  imageUrl?: string;
  isDefault?: boolean;
  label?: string;
  linkedVariantId?: string;
  priceModifierType?: AdminPriceModifierType;
  priceModifierValue?: number;
  sortOrder?: number;
  value?: string;
}

export interface DeleteAdminCustomOptionChoicePayload {
  choiceId: string;
  csrf?: boolean;
}

export interface CreateAdminCustomOptionConditionPayload {
  action: AdminConditionAction;
  csrf?: boolean;
  targetOptionId: string;
  triggerChoiceId: string;
  triggerOptionId: string;
}

export interface DeleteAdminCustomOptionConditionPayload {
  conditionId: string;
  csrf?: boolean;
}

export const useAdminCustomOptionGroups = () => {
  return useSWRWrapper<AdminCustomOptionGroup[]>('/api/v1/admin/custom-options/groups', {
    method: METHOD.GET,
    revalidateOnFocus: false,
    url: '/api/v1/admin/custom-options/groups',
  });
};

export const useAdminCustomOptionGroupDetail = (groupId?: string, enabled: boolean = true) => {
  const shouldFetch = Boolean(groupId && enabled);

  return useSWRWrapper<AdminCustomOptionGroup>(
    shouldFetch ? `/api/v1/admin/custom-options/groups/${groupId}` : null,
    {
      method: METHOD.GET,
      revalidateOnFocus: false,
      url: groupId ? `/api/v1/admin/custom-options/groups/${groupId}` : '/api/v1/admin/custom-options/groups',
    },
  );
};

export const useCreateAdminCustomOptionGroup = () => {
  return useMutation<AdminCustomOptionGroup>('/api/v1/admin/custom-options/groups', {
    loading: true,
    method: METHOD.POST,
    notification: {
      content: 'Tạo nhóm custom option thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/custom-options/groups',
  });
};

export const useUpdateAdminCustomOptionGroup = () => {
  return useMutation<AdminCustomOptionGroup>('/api/v1/admin/custom-options/groups/{groupId}', {
    loading: true,
    method: METHOD.PATCH,
    notification: {
      content: 'Cập nhật nhóm custom option thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/custom-options/groups/{groupId}',
  });
};

export const useDeleteAdminCustomOptionGroup = () => {
  return useMutation<boolean>('/api/v1/admin/custom-options/groups/{groupId}', {
    loading: true,
    method: METHOD.DELETE,
    notification: {
      content: 'Xóa nhóm custom option thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/custom-options/groups/{groupId}',
  });
};

export const useCreateAdminCustomOption = () => {
  return useMutation<AdminCustomOption>('/api/v1/admin/custom-options/options', {
    loading: true,
    method: METHOD.POST,
    notification: {
      content: 'Tạo tùy chọn thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/custom-options/options',
  });
};

export const useUpdateAdminCustomOption = () => {
  return useMutation<AdminCustomOption>('/api/v1/admin/custom-options/options/{optionId}', {
    loading: true,
    method: METHOD.PATCH,
    notification: {
      content: 'Cập nhật tùy chọn thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/custom-options/options/{optionId}',
  });
};

export const useDeleteAdminCustomOption = () => {
  return useMutation<boolean>('/api/v1/admin/custom-options/options/{optionId}', {
    loading: true,
    method: METHOD.DELETE,
    notification: {
      content: 'Xóa tùy chọn thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/custom-options/options/{optionId}',
  });
};

export const useCreateAdminCustomOptionChoice = () => {
  return useMutation<AdminCustomOptionChoice>('/api/v1/admin/custom-options/choices', {
    loading: true,
    method: METHOD.POST,
    url: '/api/v1/admin/custom-options/choices',
  });
};

export const useUpdateAdminCustomOptionChoice = () => {
  return useMutation<AdminCustomOptionChoice>('/api/v1/admin/custom-options/choices/{choiceId}', {
    loading: true,
    method: METHOD.PATCH,
    url: '/api/v1/admin/custom-options/choices/{choiceId}',
  });
};

export const useDeleteAdminCustomOptionChoice = () => {
  return useMutation<boolean>('/api/v1/admin/custom-options/choices/{choiceId}', {
    loading: true,
    method: METHOD.DELETE,
    url: '/api/v1/admin/custom-options/choices/{choiceId}',
  });
};

export const useCreateAdminCustomOptionCondition = () => {
  return useMutation<AdminCustomOptionCondition>('/api/v1/admin/custom-options/conditions', {
    loading: true,
    method: METHOD.POST,
    notification: {
      content: 'Tạo điều kiện thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/custom-options/conditions',
  });
};

export const useDeleteAdminCustomOptionCondition = () => {
  return useMutation<boolean>('/api/v1/admin/custom-options/conditions/{conditionId}', {
    loading: true,
    method: METHOD.DELETE,
    notification: {
      content: 'Xóa điều kiện thành công',
      title: 'Thành công',
    },
    url: '/api/v1/admin/custom-options/conditions/{conditionId}',
  });
};
