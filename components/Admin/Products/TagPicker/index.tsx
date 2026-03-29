'use client';

import { useMemo } from 'react';

import type { Tag } from '@/hooks/useTags';

import { toSlug } from '@/utils/common';

import { useTags } from '@/hooks/useTags';

import MultiSelectDropdown, { type MultiSelectItem } from '../MultiSelectDropdown';

interface TagPickerProps {
  onSelectAction: (tagIds: string[]) => void;
  selectedTagIds: string[];
}

const mapTagToItem = (item: Tag): MultiSelectItem => ({
  id: item.id,
  label: item.name,
});

export default function TagPicker({ onSelectAction, selectedTagIds }: TagPickerProps) {
  const { createTagMutation, getAllTags } = useTags();

  const tagItems = useMemo<MultiSelectItem[]>(() => {
    const items = getAllTags.data?.data ?? [];
    return items.map(mapTagToItem);
  }, [getAllTags.data?.data]);

  const handleAddNewTag = async (label: string) => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return;

    const response = await createTagMutation.trigger({
      csrf: true,
      name: trimmedLabel,
      slug: toSlug(trimmedLabel),
    });

    const createdTag = response?.data;

    await getAllTags.mutate();

    if (createdTag?.id) {
      if (selectedTagIds.includes(createdTag.id)) {
        return;
      }

      onSelectAction([...selectedTagIds, createdTag.id]);
    }
  };

  return (
    <MultiSelectDropdown
      allowMultiple
      items={tagItems}
      label="Tags"
      onAddNewAction={handleAddNewTag}
      onSelectionChangeAction={onSelectAction}
      placeholder={getAllTags.isLoading ? 'Đang tải tags...' : 'Tìm kiếm tags...'}
      selectedIds={selectedTagIds}
      showAddNew
    />
  );
}
