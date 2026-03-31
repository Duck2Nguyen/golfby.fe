import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

import type { ColDef, ICellRendererParams } from 'ag-grid-community';

export interface CollectionTableRow {
  categoryCount: number;
  categoryIds: string[];
  depth: number;
  description?: string;
  displayName: string;
  id: string;
  name: string;
  parentId?: string | null;
  parentName?: string;
  slug: string;
  typeLabel: 'Cha' | 'Con';
}

interface GetColumnDefsParams {
  currentPage: number;
  itemsPerPage: number;
  onDelete: (collection: CollectionTableRow) => void;
  onEdit: (collection: CollectionTableRow) => void;
}

export const getColumnDefs = ({
  currentPage,
  itemsPerPage,
  onDelete,
  onEdit,
}: GetColumnDefsParams): ColDef<CollectionTableRow>[] => {
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
      cellRenderer: (params: ICellRendererParams<CollectionTableRow>) => {
        const collection = params.data;
        if (!collection) return null;

        return React.createElement(
          'div',
          { className: 'flex h-full items-center gap-2' },
          React.createElement(
            'span',
            {
              className:
                collection.typeLabel === 'Cha'
                  ? 'rounded-md bg-emerald-50 px-2 py-0.5 text-[1.1rem] font-600 text-emerald-700'
                  : 'rounded-md bg-sky-50 px-2 py-0.5 text-[1.1rem] font-600 text-sky-700',
            },
            collection.typeLabel,
          ),
          React.createElement(
            'span',
            {
              className: 'text-[1.4rem] font-500 text-gray-500',
              title: collection.name,
            },
            collection.displayName,
          ),
        );
      },
      colId: 'name',
      flex: 1,
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'TÊN COLLECTION',
      minWidth: 280,
      sortable: false,
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
      colId: 'parentName',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'COLLECTION CHA',
      minWidth: 200,
      sortable: false,
      valueGetter: params => params.data?.parentName || '-',
    },
    {
      cellClass: 'text-[1.3rem] text-gray-500',
      colId: 'categoryCount',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'SỐ CATEGORY',
      maxWidth: 140,
      minWidth: 120,
      sortable: false,
      valueGetter: params => params.data?.categoryCount ?? 0,
    },
    {
      cellClass: 'text-[1.3rem] text-gray-500',
      colId: 'description',
      flex: 1,
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'MÔ TẢ',
      minWidth: 240,
      sortable: false,
      valueGetter: params => params.data?.description || '-',
    },
    {
      cellRenderer: (params: ICellRendererParams<CollectionTableRow>) => {
        const collection = params.data;
        if (!collection) return null;

        return React.createElement(
          'div',
          { className: 'flex h-full items-center justify-start gap-1' },
          React.createElement(
            'button',
            {
              className:
                'cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-primary hover:text-primary-light',
              onClick: () => onEdit(collection),
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
              onClick: () => onDelete(collection),
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
