'use client';

import { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import { Button } from '@heroui/button';
import { Spinner } from '@heroui/spinner';
import {
  ModuleRegistry,
  PaginationModule,
  ValidationModule,
  ClientSideRowModelModule,
} from 'ag-grid-community';

import type { ColDef } from 'ag-grid-community';

import { useAdminUsers } from '@/hooks/admin/useAdminUsers';

ModuleRegistry.registerModules([ClientSideRowModelModule, ValidationModule, PaginationModule]);

export default function Customers() {
  const [page] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: response, isLoading } = useAdminUsers(page, pageSize);
  const rowData = response?.data ?? [];
  const total = response?.total ?? 0;

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        width: 80,
        sortable: true,
        filter: true,
      },
      {
        field: 'firstName',
        headerName: 'Họ và Tên',
        flex: 1,
        sortable: true,
        filter: true,
        valueGetter: params => {
          const first = params.data?.firstName ?? '';
          const last = params.data?.lastName ?? '';
          return `${first} ${last}`.trim() || params.data?.email?.split('@')[0];
        },
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        sortable: true,
        filter: true,
      },
      {
        field: 'phoneNumber',
        headerName: 'Số điện thoại',
        width: 160,
        sortable: true,
        filter: true,
      },
      {
        field: 'userStatus',
        headerName: 'Trạng thái',
        width: 140,
        sortable: true,
        cellRenderer: (params: { value: string }) => {
          const isActive = params.value === 'ACTIVE' || !params.value;
          const label =
            params.value === 'ACTIVE' ? 'Hoạt động' : params.value === 'INACTIVE' ? 'Bị khóa' : 'Hoạt động';
          return (
            <span
              className={`rounded-full px-3 py-1 text-[1.2rem] font-600 ${
                isActive ? 'bg-primary-100 text-primary-600' : 'bg-red-50 text-red-500'
              }`}
            >
              {label}
            </span>
          );
        },
      },
      {
        field: 'createdAt',
        headerName: 'Ngày tham gia',
        width: 150,
        sortable: true,
        valueFormatter: params => {
          if (!params.value) return '—';
          return new Date(params.value).toLocaleDateString('vi-VN');
        },
      },
      {
        headerName: 'Hành động',
        width: 120,
        cellRenderer: () => (
          <Button
            className="h-[2.8rem] min-w-[7.5rem] text-[1.3rem] font-600"
            color="primary"
            size="sm"
            variant="flat"
          >
            Chi tiết
          </Button>
        ),
      },
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
    }),
    [],
  );

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[2.4rem] font-700 text-gray-900">Quản lý Khách hàng</h1>
          {total > 0 && <p className="mt-1 text-[1.4rem] text-gray-400">{total} khách hàng</p>}
        </div>
        <Button className="h-[4rem] text-[1.4rem] font-600" color="primary">
          + Thêm Khách hàng
        </Button>
      </div>

      {/* AG Grid */}
      <div className="ag-theme-alpine ag-theme-golfby relative flex-1 w-full overflow-hidden rounded-2xl">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <Spinner color="primary" size="lg" />
          </div>
        )}
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          domLayout="autoHeight"
          headerHeight={48}
          pagination
          paginationPageSize={pageSize}
          paginationPageSizeSelector={[10, 20, 50]}
          rowData={rowData}
          rowHeight={56}
          onPaginationChanged={e => {
            if (e.newPageSize) {
              setPageSize(e.api.paginationGetPageSize());
            }
          }}
        />
      </div>
    </div>
  );
}
