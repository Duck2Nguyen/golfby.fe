'use client';

import { useMemo } from 'react';

import { useAdminCustomOptionGroups } from '@/hooks/admin/useAdminCustomOptions';

import MultiSelectDropdown, { type MultiSelectItem } from '../MultiSelectDropdown';

interface CustomOptionGroupPickerProps {
  onSelectAction: (groupIds: string[]) => void;
  selectedGroupIds: string[];
}

export default function CustomOptionGroupPicker({
  onSelectAction,
  selectedGroupIds,
}: CustomOptionGroupPickerProps) {
  const getAllAdminCustomOptionGroups = useAdminCustomOptionGroups();

  const customOptionGroupItems = useMemo<MultiSelectItem[]>(() => {
    const items = getAllAdminCustomOptionGroups.data?.data ?? [];

    return items.map(item => ({
      id: item.id,
      label: item.name,
    }));
  }, [getAllAdminCustomOptionGroups.data?.data]);

  return (
    <MultiSelectDropdown
      allowMultiple={false}
      items={customOptionGroupItems}
      label="Nhóm custom option"
      onSelectionChangeAction={onSelectAction}
      placeholder={
        getAllAdminCustomOptionGroups.isLoading ? 'Đang tải nhóm custom option...' : 'Chọn nhóm custom option'
      }
      selectedIds={selectedGroupIds}
      showAddNew={false}
    />
  );
}
