import React from 'react';

import type { ICellRendererParams } from 'ag-grid-community';

import type { UserFormData } from '../../UserFormModal';

interface NameCellProps extends ICellRendererParams<UserFormData> {
  getDisplayName: (user: UserFormData) => string;
}

const NameCell = (props: NameCellProps) => {
  const user = props.data;
  if (!user) return null;

  const displayName = props.getDisplayName(user);

  return (
    <div className="flex h-full items-center gap-3">
      <span className="text-[1.4rem] font-500 text-gray-900">
        {displayName || user.email || 'Chưa cập nhật'}
      </span>
    </div>
  );
};

export default NameCell;
