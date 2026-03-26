'use client';

import { useMemo } from 'react';

import type { CategoryBase } from '@/hooks/useCategorires';

import { toSlug } from '@/utils/common';
import { genCsrfToken } from '@/utils/csrf';

import { useCategorires } from '@/hooks/useCategorires';

import MultiSelectDropdown, { type MultiSelectItem } from '../MultiSelectDropdown';

interface CollectionPickerProps {
  onSelectAction: (collectionIds: string[]) => void;
  selectedCollectionIds: string[];
}

const mapCategoryToItem = (item: CategoryBase): MultiSelectItem => ({
  id: item.id,
  label: item.name,
});

export default function CollectionPicker({ onSelectAction, selectedCollectionIds }: CollectionPickerProps) {
  const { createCategoryMutation, getAllCategories } = useCategorires();

  const collectionItems = useMemo<MultiSelectItem[]>(() => {
    const items = getAllCategories.data?.data ?? [];
    return items.map(mapCategoryToItem);
  }, [getAllCategories.data?.data]);

  const handleAddNewCollection = async (label: string) => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return;

    const csrfToken = await genCsrfToken();

    const response = await createCategoryMutation.trigger({
      ...(csrfToken ? { csrfToken } : {}),
      name: trimmedLabel,
      slug: toSlug(trimmedLabel),
    });

    const createdCategory = response?.data;

    await getAllCategories.mutate();

    if (createdCategory?.id) {
      if (selectedCollectionIds.includes(createdCategory.id)) {
        return;
      }

      onSelectAction([...selectedCollectionIds, createdCategory.id]);
    }
  };

  return (
    <MultiSelectDropdown
      allowMultiple
      items={collectionItems}
      label="Collections"
      onAddNewAction={handleAddNewCollection}
      onSelectionChangeAction={onSelectAction}
      placeholder={getAllCategories.isLoading ? 'Đang tải collections...' : 'Tìm kiếm collections...'}
      selectedIds={selectedCollectionIds}
      showAddNew
    />
  );
}
