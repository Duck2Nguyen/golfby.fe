import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

import type { ColDef, ICellRendererParams } from 'ag-grid-community';

import type { CategoryFormData } from './CategoryFormModal';

interface GetColumnDefsParams {
  currentPage: number;
  itemsPerPage: number;
  onDelete: (category: CategoryFormData) => void;
  onEdit: (category: CategoryFormData) => void;
}

export const getColumnDefs = ({
  currentPage,
  itemsPerPage,
  onDelete,
  onEdit,
}: GetColumnDefsParams): ColDef<CategoryFormData>[] => {
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
      headerName: 'TÊN DANH MỤC',
      minWidth: 220,
      sortable: false,
      valueGetter: params => params.data?.name || '',
    },
    {
      cellClass: 'text-[1.3rem] text-gray-500',
      colId: 'slug',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'SLUG',
      minWidth: 200,
      sortable: false,
      valueGetter: params => params.data?.slug || '',
    },
    {
      cellClass: 'text-[1.3rem] text-gray-500',
      colId: 'description',
      flex: 1,
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'MÔ TẢ',
      minWidth: 280,
      sortable: false,
      valueGetter: params => params.data?.description || '-',
    },
    {
      cellRenderer: (params: ICellRendererParams<CategoryFormData>) => {
        const category = params.data;
        if (!category) return null;

        return React.createElement(
          'div',
          { className: 'flex h-full items-center justify-start gap-1' },
          React.createElement(
            'button',
            {
              className:
                'cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-primary hover:text-primary-light',
              onClick: () => onEdit(category),
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
              onClick: () => onDelete(category),
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
