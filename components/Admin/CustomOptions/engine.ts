import { isChoiceType } from './types';

import type {
  CustomOption,
  CustomOptionGroup,
  PreviewSelections,
  PriceModifierType,
  CustomOptionChoice,
} from './types';

const resolveModifier = (type: PriceModifierType, value: number | undefined, basePrice: number): number => {
  const safeValue = value ?? 0;

  if (type === 'FIXED') return safeValue;
  if (type === 'PERCENT') return Math.round((basePrice * safeValue) / 100);
  return 0;
};

export const getSortedOptions = (group: CustomOptionGroup): CustomOption[] => {
  return [...group.options].sort((a, b) => a.sortOrder - b.sortOrder);
};

export const getSortedChoices = (option: CustomOption): CustomOptionChoice[] => {
  return [...option.choices].sort((a, b) => a.sortOrder - b.sortOrder);
};

const hasSelectionValue = (selection: PreviewSelections[string] | undefined): boolean => {
  if (selection === undefined) return false;
  if (Array.isArray(selection)) return selection.length > 0;
  return selection.trim().length > 0;
};

const isChoiceMatched = (selection: PreviewSelections[string] | undefined, choiceId: string): boolean => {
  if (selection === undefined) return false;

  if (Array.isArray(selection)) {
    return selection.includes(choiceId);
  }

  return selection === choiceId;
};

export const computeVisibleOptionMap = (
  group: CustomOptionGroup,
  selections: PreviewSelections,
): Record<string, boolean> => {
  const showTargets = new Set(
    group.conditions
      .filter(condition => condition.action === 'SHOW')
      .map(condition => condition.targetOptionId),
  );

  const visibleMap: Record<string, boolean> = {};

  for (const option of group.options) {
    visibleMap[option.id] = !showTargets.has(option.id);
  }

  for (const condition of group.conditions) {
    if (condition.action !== 'SHOW') continue;

    if (!isChoiceMatched(selections[condition.triggerOptionId], condition.triggerChoiceId)) continue;

    visibleMap[condition.targetOptionId] = true;
  }

  for (const condition of group.conditions) {
    if (condition.action !== 'HIDE') continue;

    if (!isChoiceMatched(selections[condition.triggerOptionId], condition.triggerChoiceId)) continue;

    visibleMap[condition.targetOptionId] = false;
  }

  return visibleMap;
};

export const calculateCustomSurcharge = (
  basePrice: number,
  group: CustomOptionGroup,
  selections: PreviewSelections,
  visibleMap: Record<string, boolean>,
): number => {
  return group.options.reduce((total, option) => {
    if (!visibleMap[option.id]) return total;

    const selection = selections[option.id];

    if (!hasSelectionValue(selection)) return total;

    let optionTotal = resolveModifier(option.priceModifierType, option.priceModifierValue, basePrice);

    if (isChoiceType(option.type) && option.choices.length > 0) {
      if (Array.isArray(selection)) {
        for (const selectedChoiceId of selection) {
          const choice = option.choices.find(item => item.id === selectedChoiceId);
          if (!choice) continue;
          optionTotal += resolveModifier(choice.priceModifierType, choice.priceModifierValue, basePrice);
        }
      } else {
        const choice = option.choices.find(item => item.id === selection);
        if (choice) {
          optionTotal += resolveModifier(choice.priceModifierType, choice.priceModifierValue, basePrice);
        }
      }
    }

    return total + optionTotal;
  }, 0);
};

export const cleanupSelectionsByVisibility = (
  selections: PreviewSelections,
  visibleMap: Record<string, boolean>,
): PreviewSelections => {
  const nextSelections: PreviewSelections = {};

  for (const [optionId, value] of Object.entries(selections)) {
    if (!visibleMap[optionId]) continue;
    nextSelections[optionId] = value;
  }

  return nextSelections;
};
