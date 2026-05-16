import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

import type { Voucher } from '@/hooks/useVoucher';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';

interface GetColumnDefsParams {
  currentPage: number;
  itemsPerPage: number;
  onDelete: (voucher: Voucher) => void;
  onEdit: (voucher: Voucher) => void;
}

export const getColumnDefs = ({
  currentPage,
  itemsPerPage,
  onDelete,
  onEdit,
}: GetColumnDefsParams): ColDef<Voucher>[] => {
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
      headerName: 'TÊN VOUCHER',
      minWidth: 200,
      sortable: false,
      valueGetter: params => params.data?.name || '',
    },
    {
      cellClass: 'text-[1.3rem] font-600 text-primary',
      colId: 'code',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'MÃ VOUCHER',
      minWidth: 150,
      sortable: false,
      valueGetter: params => params.data?.code || '',
    },
    {
      cellClass: 'text-[1.3rem] text-gray-500',
      colId: 'type',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'LOẠI',
      minWidth: 150,
      sortable: false,
      valueGetter: params => {
        const type = params.data?.type;
        if (type === 'PERCENT') return 'Phần trăm';
        if (type === 'FIXED_AMOUNT') return 'Số tiền cố định';
        if (type === 'FREE_SHIPPING') return 'Miễn phí vận chuyển';
        return type || '';
      },
    },
    {
      cellClass: 'text-[1.3rem] text-gray-500',
      colId: 'value',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'GIÁ TRỊ',
      minWidth: 150,
      sortable: false,
      valueGetter: params => {
        const data = params.data;
        if (!data) return '';
        if (data.type === 'PERCENT') return `${data.value}%`;
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.value);
      },
    },
    {
      cellRenderer: (params: ICellRendererParams<Voucher>) => {
        const data = params.data;
        if (!data) return null;

        const count = data.usageCount || 0;
        const limit = data.usageLimit || '∞';

        return `${count} / ${limit}`;
      },
      cellClass: 'text-[1.3rem] text-gray-500',
      colId: 'usage',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'ĐÃ DÙNG',
      minWidth: 120,
      sortable: false,
    },
    {
      cellRenderer: (params: ICellRendererParams<Voucher>) => {
        const data = params.data;
        if (!data) return null;

        return React.createElement(
          'span',
          {
            className: `inline-flex items-center rounded-full px-2 py-1 text-[1.2rem] font-500 ${
              data.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
            }`,
          },
          data.isActive ? 'Hoạt động' : 'Đã tắt',
        );
      },
      cellClass: 'text-[1.3rem]',
      colId: 'status',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'TRẠNG THÁI',
      minWidth: 130,
      sortable: false,
    },
    {
      cellRenderer: (params: ICellRendererParams<Voucher>) => {
        const data = params.data;
        if (!data) return null;

        if (!data.startsAt && !data.endsAt) return 'Không giới hạn';

        const start = data.startsAt ? new Date(data.startsAt).toLocaleDateString('vi-VN') : '';
        const end = data.endsAt ? new Date(data.endsAt).toLocaleDateString('vi-VN') : 'Không hết hạn';

        return `${start} - ${end}`;
      },
      cellClass: 'text-[1.3rem] text-gray-500',
      colId: 'period',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'THỜI GIAN',
      minWidth: 180,
      sortable: false,
    },
    {
      cellRenderer: (params: ICellRendererParams<Voucher>) => {
        const voucher = params.data;
        if (!voucher) return null;

        return React.createElement(
          'div',
          { className: 'flex h-full items-center justify-start gap-1' },
          React.createElement(
            'button',
            {
              className:
                'cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-primary hover:text-primary-light',
              onClick: () => onEdit(voucher),
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
              onClick: () => onDelete(voucher),
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
