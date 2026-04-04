import React from 'react';
import { Eye } from 'lucide-react';

import type { ICellRendererParams } from 'ag-grid-community';
import type { AdminOrderListItem } from '@/hooks/admin/useAdminOrders';

interface ActionsCellProps extends ICellRendererParams<AdminOrderListItem> {
  onView: (order: AdminOrderListItem) => void;
}

export default function ActionsCell(props: ActionsCellProps) {
  const order = props.data;

  if (!order) {
    return null;
  }

  return (
    <div className="flex h-full items-center">
      <button
        className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-sky-50 hover:text-sky-600"
        onClick={() => props.onView(order)}
        title="Xem chi tiết"
        type="button"
      >
        <Eye className="h-4 w-4" />
      </button>
    </div>
  );
}
