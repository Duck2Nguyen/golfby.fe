import React from 'react';

import type { ICellRendererParams } from 'ag-grid-community';

import type { UserFormData } from '../../UserFormModal';

const StatusCell = (props: ICellRendererParams<UserFormData>) => {
  const user = props.data;
  if (!user) return null;

  return (
    <div className="flex h-full items-center">
      <span
        className={`inline-flex h-[2.6rem] items-center gap-1.5 rounded-full px-2.5 py-1 text-[1.2rem] font-500 ${
          user.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-600'
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            user.status === 'active' ? 'bg-green-500' : 'bg-orange-400'
          }`}
        />
        {user.status === 'active' ? 'Hoạt động' : 'Ngừng HĐ'}
      </span>
    </div>
  );
};

export default StatusCell;
