import React from 'react';

import type { ICellRendererParams } from 'ag-grid-community';
import type { AdminOrderListItem } from '@/hooks/admin/useAdminOrders';

import { getPaymentStatusLabel, getPaymentStatusClassName } from '../../helpers';

export default function PaymentStatusCell({ data }: ICellRendererParams<AdminOrderListItem>) {
  const paymentStatus = data?.paymentStatus;

  return (
    <div className="flex h-full items-center">
      <span
        className={`flex items-center h-[2.8rem] rounded-full border px-3 py-1 text-[1.2rem] font-600 ${getPaymentStatusClassName(paymentStatus)}`}
      >
        {getPaymentStatusLabel(paymentStatus)}
      </span>
    </div>
  );
}
