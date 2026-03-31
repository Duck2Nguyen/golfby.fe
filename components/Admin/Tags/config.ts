import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

import type { ColDef, ICellRendererParams } from 'ag-grid-community';

import type { TagFormData } from './TagFormModal';

interface GetColumnDefsParams {
  currentPage: number;
  itemsPerPage: number;
  onDelete: (tag: TagFormData) => void;
  onEdit: (tag: TagFormData) => void;
}

export const getColumnDefs = ({
  currentPage,
  itemsPerPage,
  onDelete,
  onEdit,
}: GetColumnDefsParams): ColDef<TagFormData>[] => {
  return [
    {
      cellClass: 'text-[1.3rem] text-gray-500',
      colId: 'index',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'STT',
      maxWidth: 80,
      minWidth: 72,
      sortable: false,
      valueGetter: params => {
        return (currentPage - 1) * itemsPerPage + (params.node?.rowIndex ?? 0) + 1;
      },
    },
    {
      cellClass: 'text-[1.4rem] font-500 text-gray-500',
      colId: 'name',
      flex: 1,
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'TÊN TAG',
      minWidth: 220,
      sortable: false,
      valueGetter: params => params.data?.name || '',
    },
    {
      cellClass: 'text-[1.3rem] text-gray-500',
      colId: 'slug',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'SLUG',
      minWidth: 220,
      sortable: false,
      valueGetter: params => params.data?.slug || '',
    },
    {
      cellRenderer: (params: ICellRendererParams<TagFormData>) => {
        const tag = params.data;
        if (!tag) return null;

        return React.createElement(
          'div',
          { className: 'flex h-full items-center justify-start gap-1' },
          React.createElement(
            'button',
            {
              className:
                'cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-primary hover:text-primary-light',
              onClick: () => onEdit(tag),
              title: 'Chỉnh sửa',
              type: 'button',
            },
            React.createElement(Pencil, { className: 'h-4 w-4' }),
          ),
          React.createElement(
            'button',
            {
              className:
                'cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500',
              onClick: () => onDelete(tag),
              title: 'Xóa',
              type: 'button',
            },
            React.createElement(Trash2, { className: 'h-4 w-4' }),
          ),
        );
      },
      colId: 'actions',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'THAO TÁC',
      maxWidth: 140,
      minWidth: 120,
      sortable: false,
    },
  ];
};
