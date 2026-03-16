'use client';

import { useState } from 'react';

import { Chip } from '@heroui/chip';
import { Spinner } from '@heroui/spinner';
import { Button } from '@heroui/button';
import { Pagination } from '@heroui/pagination';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table';

import type { UserInfo } from '@/interfaces/model';

import { useAdminUsers } from '@/hooks/admin/useAdminUsers';

const COLUMNS = [
  { key: 'name', label: 'Họ và Tên' },
  { key: 'email', label: 'Email' },
  { key: 'phoneNumber', label: 'Số điện thoại' },
  { key: 'userStatus', label: 'Trạng thái' },
  { key: 'createdAt', label: 'Ngày tham gia' },
  { key: 'actions', label: 'Hành động' },
];

function StatusChip({ status }: { status?: string }) {
  const isActive = status === 'ACTIVE' || !status;
  const label = status === 'ACTIVE' ? 'Hoạt động' : status === 'INACTIVE' ? 'Bị khóa' : 'Hoạt động';
  return (
    <Chip
      classNames={{
        base: isActive ? 'bg-primary-100' : 'bg-red-50',
        content: `text-[1.2rem] font-600 ${isActive ? 'text-primary-600' : 'text-red-500'}`,
      }}
      size="sm"
      variant="flat"
    >
      {label}
    </Chip>
  );
}

function renderCell(user: UserInfo, columnKey: string) {
  switch (columnKey) {
    case 'name': {
      const full = [user.firstName, user.lastName].filter(Boolean).join(' ');
      return (
        <div className="flex flex-col">
          <span className="text-[1.4rem] font-600 text-gray-900">
            {full || user.email?.split('@')[0] || '—'}
          </span>
        </div>
      );
    }
    case 'email':
      return <span className="text-[1.4rem] text-gray-600">{user.email || '—'}</span>;
    case 'phoneNumber':
      return <span className="text-[1.4rem] text-gray-600">{user.phoneNumber || '—'}</span>;
    case 'userStatus':
      return <StatusChip status={user.userStatus} />;
    case 'createdAt':
      return (
        <span className="text-[1.4rem] text-gray-500">
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—'}
        </span>
      );
    case 'actions':
      return (
        <Button
          className="h-[3.2rem] min-w-[7rem] text-[1.3rem] font-600"
          color="primary"
          size="sm"
          variant="flat"
        >
          Chi tiết
        </Button>
      );
    default:
      return null;
  }
}

export default function Customers() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: response, isLoading } = useAdminUsers(page, pageSize);

  const users: UserInfo[] = response?.data ?? [];
  const total = response?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[2.4rem] font-700 text-gray-900">Quản lý Khách hàng</h1>
          <p className="mt-1 text-[1.4rem] text-gray-400">{total} khách hàng</p>
        </div>
        <Button className="h-[4rem] text-[1.4rem] font-600" color="primary">
          + Thêm Khách hàng
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <Table
          aria-label="Bảng khách hàng"
          classNames={{
            th: 'bg-gray-50 text-[1.3rem] font-600 text-gray-500 uppercase tracking-wide py-4 px-5',
            td: 'py-4 px-5 border-b border-gray-50',
            tr: 'hover:bg-gray-50/50 transition-colors',
          }}
          removeWrapper
        >
          <TableHeader columns={COLUMNS}>
            {col => <TableColumn key={col.key}>{col.label}</TableColumn>}
          </TableHeader>
          <TableBody
            emptyContent={
              isLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner color="primary" />
                </div>
              ) : (
                <span className="text-[1.4rem] text-gray-400">Không có dữ liệu</span>
              )
            }
            isLoading={isLoading}
            items={users}
            loadingContent={
              <div className="flex justify-center py-12">
                <Spinner color="primary" />
              </div>
            }
          >
            {user => (
              <TableRow key={user.id}>
                {columnKey => <TableCell>{renderCell(user, String(columnKey))}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            color="primary"
            page={page}
            showControls
            total={totalPages}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
