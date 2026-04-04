import React from 'react';

import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import type { AdminOrderListItem } from '@/hooks/admin/useAdminOrders';

import ActionsCell from './CellRender/ActionsCell';
import CustomerCell from './CellRender/CustomerCell';
import { formatCurrency, formatDateTime } from './helpers';
import OrderNumberCell from './CellRender/OrderNumberCell';
import OrderStatusCell from './CellRender/OrderStatusCell';
import PaymentStatusCell from './CellRender/PaymentStatusCell';

interface GetColumnDefsParams {
  onView: (order: AdminOrderListItem) => void;
}

export const getColumnDefs = ({ onView }: GetColumnDefsParams): ColDef<AdminOrderListItem>[] => {
  return [
    {
      cellRenderer: OrderNumberCell,
      colId: 'orderNumber',
      flex: 1,
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'Mã đơn hàng',
      minWidth: 220,
      sortable: false,
    },
    {
      cellRenderer: CustomerCell,
      colId: 'customer',
      flex: 1,
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'Khách hàng',
      minWidth: 220,
      sortable: false,
    },
    {
      cellClass: 'text-[1.4rem] font-700 text-gray-900 leading-[100%]',
      colId: 'total',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'Tổng tiền',
      minWidth: 150,
      sortable: false,
      valueGetter: params => params.data?.total ?? 0,
      valueFormatter: params => formatCurrency(params.value),
    },
    {
      cellRenderer: OrderStatusCell,
      colId: 'status',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'Trạng thái',
      minWidth: 160,
      sortable: false,
    },
    {
      cellRenderer: PaymentStatusCell,
      colId: 'paymentStatus',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'Thanh toán',
      minWidth: 170,
      sortable: false,
    },
    {
      cellClass: 'text-[1.3rem] text-gray-700',
      colId: 'createdAt',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'Ngày đặt',
      minWidth: 170,
      sortable: false,
      valueGetter: params => formatDateTime(params.data?.createdAt),
    },
    {
      cellRenderer: (params: ICellRendererParams<AdminOrderListItem>) => {
        return React.createElement(ActionsCell, {
          ...params,
          onView,
        });
      },
      colId: 'actions',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'Thao tác',
      maxWidth: 120,
      minWidth: 100,
      sortable: false,
    },
  ];
};
