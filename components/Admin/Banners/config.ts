import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

import type { StaticHomeCategory } from '@/hooks/useStaticData';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';

import { STATIC_HOME_CATEGORIES } from '@/hooks/useStaticData';

export interface BannerTableRow {
  category: StaticHomeCategory;
  collectionId?: string;
  direction?: 'horizontal' | 'vertical';
  href: string;
  id: string;
  imageUrl?: string;
  imageId: string;
  name?: string;
}

interface GetColumnDefsParams {
  currentPage: number;
  itemsPerPage: number;
  onDelete: (banner: BannerTableRow) => void;
  onEdit: (banner: BannerTableRow) => void;
}

const CATEGORY_LABELS: Record<StaticHomeCategory, string> = {
  [STATIC_HOME_CATEGORIES.BANNER]: 'BANNER',
  [STATIC_HOME_CATEGORIES.COLLECTION]: 'COLLECTION',
  [STATIC_HOME_CATEGORIES.PRODUCT_NEW]: 'PRODUCT_NEW',
};

const getExtraValue = (banner: BannerTableRow) => {
  if (banner.category === STATIC_HOME_CATEGORIES.PRODUCT_NEW) {
    return banner.name || '-';
  }

  if (banner.category === STATIC_HOME_CATEGORIES.COLLECTION) {
    return banner.collectionId || '-';
  }

  return '-';
};

export const getColumnDefs = ({
  currentPage,
  itemsPerPage,
  onDelete,
  onEdit,
}: GetColumnDefsParams): ColDef<BannerTableRow>[] => {
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
      cellClass: 'text-[1.3rem] font-500 text-gray-500',
      colId: 'category',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'CATEGORY',
      minWidth: 160,
      sortable: false,
      valueGetter: params => {
        const category = params.data?.category;
        return category ? CATEGORY_LABELS[category] : '';
      },
    },
    {
      cellClass: 'text-[1.3rem] text-gray-500',
      colId: 'href',
      flex: 1,
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'HREF',
      minWidth: 220,
      sortable: false,
      valueGetter: params => params.data?.href || '',
    },
    {
      cellClass: 'text-[1.3rem] text-gray-500',
      colId: 'imageUrl',
      flex: 2,
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'IMAGE URL',
      minWidth: 420,
      sortable: false,
      valueGetter: params => params.data?.imageUrl || '-',
    },
    {
      cellClass: 'text-[1.3rem] text-gray-500',
      colId: 'extra',
      flex: 1,
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'THÔNG TIN PHỤ',
      minWidth: 180,
      sortable: false,
      valueGetter: params => {
        const banner = params.data;
        if (!banner) {
          return '-';
        }

        return getExtraValue(banner);
      },
    },
    {
      cellClass: 'text-[1.3rem] text-gray-500',
      colId: 'direction',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'DIRECTION',
      minWidth: 140,
      sortable: false,
      valueGetter: params => params.data?.direction || '-',
    },
    {
      cellRenderer: (params: ICellRendererParams<BannerTableRow>) => {
        const banner = params.data;
        if (!banner) return null;

        return React.createElement(
          'div',
          { className: 'flex h-full items-center justify-start gap-1' },
          React.createElement(
            'button',
            {
              className:
                'cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-primary hover:text-primary-light',
              onClick: () => onEdit(banner),
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
              onClick: () => onDelete(banner),
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
