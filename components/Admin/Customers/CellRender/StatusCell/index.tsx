import React from 'react';

import type { ICellRendererParams } from 'ag-grid-community';

import { USER_STATUS } from '@/global/common';

import type { UserFormData } from '../../UserFormModal';

const StatusCell = (props: ICellRendererParams<UserFormData>) => {
  const user = props.data;
  if (!user) return null;

  const statusMeta =
    user.status === USER_STATUS.ACTIVE
      ? {
          dot: 'bg-green-500',
          label: 'Hoạt động',
          wrapper: 'bg-green-50 text-green-700',
        }
      : user.status === USER_STATUS.PENDING
        ? {
            dot: 'bg-amber-500',
            label: 'Chờ duyệt',
            wrapper: 'bg-amber-50 text-amber-700',
          }
        : {
            dot: 'bg-orange-400',
            label: 'Ngừng HĐ',
            wrapper: 'bg-orange-50 text-orange-600',
          };

  return (
    <div className="flex h-full items-center">
      <span
        className={`inline-flex h-[2.6rem] items-center gap-1.5 rounded-full px-2.5 py-1 text-[1.2rem] font-500 ${statusMeta.wrapper}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`} />
        {statusMeta.label}
      </span>
    </div>
  );
};

export default StatusCell;
