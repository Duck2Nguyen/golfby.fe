import React from 'react';
import { Shield, UserIcon } from 'lucide-react';

import type { ICellRendererParams } from 'ag-grid-community';

import type { UserFormData } from '../../UserFormModal';

const RoleCell = (props: ICellRendererParams<UserFormData>) => {
  const user = props.data;
  if (!user) return null;

  return (
    <div className="flex h-full items-center">
      <span
        className={`inline-flex h-[2.6rem] items-center gap-1 rounded-full px-2.5 py-1 text-[1.2rem] font-500 ${
          user.role === 'ADMIN' ? 'bg-violet-50 text-violet-700' : 'bg-blue-50 text-blue-700'
        }`}
      >
        {user.role === 'ADMIN' ? <Shield className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
        {user.role}
      </span>
    </div>
  );
};

export default RoleCell;
