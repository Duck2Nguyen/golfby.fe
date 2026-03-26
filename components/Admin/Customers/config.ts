import React from 'react';

import type { ColDef, ICellRendererParams } from 'ag-grid-community';

import NameCell from './CellRender/NameCell';
import RoleCell from './CellRender/RoleCell';
import StatusCell from './CellRender/StatusCell';
import ActionsCell from './CellRender/ActionsCell';

import type { UserFormData } from './UserFormModal';

interface GetColumnDefsParams {
  currentPage: number;
  getDisplayName: (user: UserFormData) => string;
  itemsPerPage: number;
  onDelete: (user: UserFormData) => void;
  onEdit: (user: UserFormData) => void;
}

export const getColumnDefs = ({
  currentPage,
  getDisplayName,
  itemsPerPage,
  onDelete,
  onEdit,
}: GetColumnDefsParams): ColDef<UserFormData>[] => {
  return [
    {
      cellClass: 'text-[1.3rem] text-gray-500',
      colId: 'index',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'STT',
      maxWidth: 80,
      minWidth: 72,
      sortable: false,
      valueGetter: params => {
        return (currentPage - 1) * itemsPerPage + (params.node?.rowIndex ?? 0) + 1;
      },
    },
    {
      cellRenderer: (params: ICellRendererParams<UserFormData>) => {
        return React.createElement(NameCell, {
          ...params,
          getDisplayName,
        });
      },
      colId: 'name',
      flex: 1,
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'HỌ VÀ TÊN',
      minWidth: 220,
      sortable: false,
    },
    {
      cellClass: 'text-[1.3rem] text-gray-500',
      colId: 'email',
      flex: 1,
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'EMAIL',
      minWidth: 220,
      sortable: false,
      valueGetter: params => params.data?.email || '',
    },
    {
      cellClass: 'text-[1.3rem] text-gray-500',
      colId: 'phone',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'SỐ ĐIỆN THOẠI',
      minWidth: 150,
      sortable: false,
      valueGetter: params => params.data?.phone || '',
    },
    {
      cellRenderer: RoleCell,
      colId: 'role',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'VAI TRÒ',
      minWidth: 130,
      sortable: false,
    },
    {
      cellRenderer: StatusCell,
      colId: 'status',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'TRẠNG THÁI',
      minWidth: 150,
      sortable: false,
    },
    {
      cellRenderer: (params: ICellRendererParams<UserFormData>) => {
        return React.createElement(ActionsCell, {
          ...params,
          onDelete,
          onEdit,
        });
      },
      colId: 'actions',
      headerClass: 'text-left text-[1.2rem] tracking-wider text-gray-500',
      headerName: 'THAO TÁC',
      maxWidth: 140,
      minWidth: 120,
      sortable: false,
    },
  ];
};
