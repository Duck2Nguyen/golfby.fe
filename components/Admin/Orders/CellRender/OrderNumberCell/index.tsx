import React from 'react';

import type { ICellRendererParams } from 'ag-grid-community';
import type { AdminOrderListItem } from '@/hooks/admin/useAdminOrders';

export default function OrderNumberCell({ data }: ICellRendererParams<AdminOrderListItem>) {
  const order = data;

  if (!order) {
    return null;
  }

  const lineCount = order.lines?.length ?? 0;

  return (
    <div className="flex h-full flex-col justify-center">
      <p className="text-[1.4rem] font-600 text-foreground h-fit leading-[2.1rem]">
        {order.orderNumber || order.id}
      </p>
      <p className="text-[1.2rem] text-gray-500 leading-[1.8rem] mt-0.5">{lineCount} sản phẩm</p>
    </div>
  );
}
