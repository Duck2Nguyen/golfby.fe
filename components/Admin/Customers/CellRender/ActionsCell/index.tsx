import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

import type { ICellRendererParams } from 'ag-grid-community';

import type { UserFormData } from '../../UserFormModal';

interface ActionsCellProps extends ICellRendererParams<UserFormData> {
  onDelete: (user: UserFormData) => void;
  onEdit: (user: UserFormData) => void;
  onView: (user: UserFormData) => void;
}

const ActionsCell = (props: ActionsCellProps) => {
  const user = props.data;
  if (!user) return null;

  return (
    <div className="flex h-full items-center justify-start gap-1">
      <button
        className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-sky-50 hover:text-sky-600"
        onClick={() => props.onView(user)}
        title="Xem chi tiết"
        type="button"
      >
        <Eye className="h-4 w-4" />
      </button>

      <button
        className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-primary hover:text-primary-light"
        onClick={() => props.onEdit(user)}
        title="Chỉnh sửa"
        type="button"
      >
        <Pencil className="h-4 w-4" />
      </button>

      <button
        className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500"
        onClick={() => props.onDelete(user)}
        title="Xóa"
        type="button"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ActionsCell;
