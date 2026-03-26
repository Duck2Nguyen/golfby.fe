'use client';

import { useMemo } from 'react';

import type { Brand } from '@/hooks/useBrands';

import { toSlug } from '@/utils/common';
import { genCsrfToken } from '@/utils/csrf';

import { useBrands } from '@/hooks/useBrands';

import MultiSelectDropdown, { type MultiSelectItem } from '../MultiSelectDropdown';

interface BrandPickerProps {
  onSelectAction: (brandIds: string[]) => void;
  selectedBrandIds: string[];
}

const mapBrandToItem = (item: Brand): MultiSelectItem => ({
  id: item.id,
  label: item.name,
});

export default function BrandPicker({ onSelectAction, selectedBrandIds }: BrandPickerProps) {
  const { createBrandMutation, getAllBrands } = useBrands();

  const brandItems = useMemo<MultiSelectItem[]>(() => {
    const items = getAllBrands.data?.data ?? [];
    return items.map(mapBrandToItem);
  }, [getAllBrands.data?.data]);

  const handleAddNewBrand = async (label: string) => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return;

    const csrfToken = await genCsrfToken();

    const response = await createBrandMutation.trigger({
      ...(csrfToken ? { csrfToken } : {}),
      name: trimmedLabel,
      slug: toSlug(trimmedLabel),
    });

    const createdBrand = response?.data;

    await getAllBrands.mutate();

    if (createdBrand?.id) {
      onSelectAction([createdBrand.id]);
    }
  };

  return (
    <MultiSelectDropdown
      allowMultiple={false}
      items={brandItems}
      label="Brand"
      onAddNewAction={handleAddNewBrand}
      onSelectionChangeAction={onSelectAction}
      placeholder={getAllBrands.isLoading ? 'Đang tải brands...' : 'Chọn brand...'}
      selectedIds={selectedBrandIds}
      showAddNew
    />
  );
}
