import React from 'react';

import type { ICellRendererParams } from 'ag-grid-community';
import type { AdminOrderListItem } from '@/hooks/admin/useAdminOrders';

import { getCustomerContact, getCustomerDisplayName } from '../../helpers';

export default function CustomerCell({ data }: ICellRendererParams<AdminOrderListItem>) {
  const order = data;

  if (!order) {
    return null;
  }

  return (
    <div className="flex h-full flex-col justify-center">
      <p className="text-[1.4rem] font-500 text-foreground h-fit leading-[2.1rem]">
        {getCustomerDisplayName(order)}
      </p>
      <p className="text-[1.2rem] text-gray-500 leading-[1.8rem] mt-0.5">{getCustomerContact(order)}</p>
    </div>
  );
}
