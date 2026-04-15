export type PriceModifierType = 'NONE' | 'FIXED' | 'PERCENT';

export type CustomOptionType =
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

export type ConditionAction = 'SHOW' | 'HIDE';

export interface CustomOptionChoice {
  id: string;
  imageUrl?: string;
  label: string;
  priceModifierType: PriceModifierType;
  priceModifierValue?: number;
  sortOrder: number;
  value: string;
}

export interface CustomOption {
  choices: CustomOptionChoice[];
  id: string;
  isRequired: boolean;
  label: string;
  placeholder?: string;
  priceModifierType: PriceModifierType;
  priceModifierValue?: number;
  sortOrder: number;
  type: CustomOptionType;
}

export interface CustomCondition {
  action: ConditionAction;
  id: string;
  targetOptionId: string;
  triggerChoiceId: string;
  triggerOptionId: string;
}

export interface CustomOptionGroup {
  conditions: CustomCondition[];
  id: string;
  name: string;
  options: CustomOption[];
  sortOrder: number;
}

export type PreviewSelectionValue = string | string[];

export type PreviewSelections = Record<string, PreviewSelectionValue | undefined>;

export const OPTION_TYPES_WITH_CHOICES: CustomOptionType[] = [
  'DROPDOWN',
  'RADIO',
  'CHECKBOX',
  'COLOR_SWATCH',
  'IMAGE_SWATCH',
];

export const CUSTOM_OPTION_TYPE_OPTIONS: Array<{
  label: string;
  value: CustomOptionType;
}> = [
  { label: 'Chọn đơn (hàng ngang)', value: 'RADIO' },
  { label: 'Dropdown chữ', value: 'DROPDOWN' },
  { label: 'Dropdown ảnh', value: 'IMAGE_SWATCH' },
];

export const PRICE_MODIFIER_OPTIONS: Array<{
  label: string;
  value: PriceModifierType;
}> = [
  { label: 'Không', value: 'NONE' },
  { label: 'Cố định', value: 'FIXED' },
  { label: 'Phần trăm', value: 'PERCENT' },
];

export const CONDITION_ACTION_OPTIONS: Array<{
  label: string;
  value: ConditionAction;
}> = [
  { label: 'Hiện', value: 'SHOW' },
  { label: 'Ẩn', value: 'HIDE' },
];

export const isChoiceType = (type: CustomOptionType): boolean => {
  return OPTION_TYPES_WITH_CHOICES.includes(type);
};
