import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

import type { ColDef, ICellRendererParams } from 'ag-grid-community';

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

import type { BrandFormData } from './BrandFormModal';

interface GetColumnDefsParams {
  currentPage: number;
  itemsPerPage: number;
  onDelete: (brand: BrandFormData) => void;
  onEdit: (brand: BrandFormData) => void;
}

export const getColumnDefs = ({
  currentPage,
  itemsPerPage,
  onDelete,
  onEdit,
}: GetColumnDefsParams): ColDef<BrandFormData>[] => {
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
      headerName: 'TÊN THƯƠNG HIỆU',
      minWidth: 220,
      sortable: false,
      valueGetter: params => params.data?.name || '',
    },
    {
      cellClass: 'text-[1.3rem] text-gray-500',
      colId: 'slug',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'SLUG',
      minWidth: 180,
      sortable: false,
      valueGetter: params => params.data?.slug || '',
    },
    {
      cellClass: 'text-[1.3rem] text-gray-500',
      colId: 'description',
      flex: 1,
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'MÔ TẢ',
      minWidth: 260,
      sortable: false,
      valueGetter: params => params.data?.description || '-',
    },
    {
      cellRenderer: (params: ICellRendererParams<BrandFormData>) => {
        const imageUrl = params.data?.imageUrl || params.data?.logoUrl;

        if (!imageUrl) {
          return React.createElement('span', { className: 'text-[1.3rem] text-gray-500' }, '-');
        }

        return React.createElement(
          'div',
          { className: 'flex h-full items-center' },
          React.createElement(ImageWithFallback, {
            alt: params.data?.name || 'Brand logo',
            className: 'h-9 w-9 rounded-md border border-gray-200 bg-white p-1 object-contain',
            src: imageUrl,
          }),
        );
      },
      colId: 'logo',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'LOGO',
      minWidth: 120,
      sortable: false,
    },
    {
      cellRenderer: (params: ICellRendererParams<BrandFormData>) => {
        const brand = params.data;
        if (!brand) return null;

        return React.createElement(
          'div',
          { className: 'flex h-full items-center justify-start gap-1' },
          React.createElement(
            'button',
            {
              className:
                'cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-primary hover:text-primary-light',
              onClick: () => onEdit(brand),
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
              onClick: () => onDelete(brand),
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
