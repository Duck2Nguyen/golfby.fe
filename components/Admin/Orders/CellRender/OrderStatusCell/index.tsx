import React from 'react';

import type { ICellRendererParams } from 'ag-grid-community';
import type { AdminOrderListItem } from '@/hooks/admin/useAdminOrders';

import { getOrderStatusLabel, getOrderStatusClassName } from '../../helpers';

export default function OrderStatusCell({ data }: ICellRendererParams<AdminOrderListItem>) {
  const status = data?.status;

  return (
    <div className="flex h-full items-center">
      <span
        className={`rounded-full h-[2.8rem] flex items-center border px-3 py-1 text-[1.2rem] font-600 ${getOrderStatusClassName(status)}`}
      >
        {getOrderStatusLabel(status)}
      </span>
    </div>
  );
}
