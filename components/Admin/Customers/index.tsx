'use client';

import { useMemo, useState, useEffect } from 'react';
import { Plus, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';

import type { UserInfo } from '@/interfaces/model';

import { useAdminUsers, useCreateAdminUser, useUpdateAdminUser } from '@/hooks/admin/useAdminUsers';

import { ROLE, USER_STATUS } from '@/global/common';

import DataGrid from '@/components/DataGrid';

import { getColumnDefs } from './config';
import UserDetailModal from './UserDetailModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import UserFormModal, { type UserFormData } from './UserFormModal';

const ITEMS_PER_PAGE = 8;

const toUserFormData = (user: UserInfo): UserFormData => {
  const roleRaw = user.userRole || user.role || ROLE.USER;
  const statusRaw = user.userStatus || USER_STATUS.ACTIVE;

  const normalizedRole = roleRaw === ROLE.ADMIN ? ROLE.ADMIN : ROLE.USER;
  const normalizedStatus =
    statusRaw === USER_STATUS.PENDING
      ? USER_STATUS.PENDING
      : statusRaw === USER_STATUS.DEACTIVATED
        ? USER_STATUS.DEACTIVATED
        : USER_STATUS.ACTIVE;

  return {
    email: user.email || '',
    firstName: user.firstName || '',
    id: user.id,
    lastName: user.lastName || '',
    phone: user.phoneNumber || '',
    role: normalizedRole,
    status: normalizedStatus,
  };
};

const getDisplayName = (user: UserFormData) => {
  const displayName = `${user.lastName} ${user.firstName}`.trim();
  return displayName || user.email || 'Chưa cập nhật';
};

export default function Customers() {
  const [users, setUsers] = useState<UserFormData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | ROLE>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | USER_STATUS>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingUser, setEditingUser] = useState<UserFormData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<UserFormData | null>(null);

  const { data: response, isLoading, mutate } = useAdminUsers(1, 500);
  const { isMutating: isCreatingUser, trigger: createUser } = useCreateAdminUser();
  const { isMutating: isUpdatingUser, trigger: updateUser } = useUpdateAdminUser();

  useEffect(() => {
    if (!response?.data?.items) return;
    setUsers(response.data.items.map(toUserFormData));
  }, [response]);

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        user =>
          getDisplayName(user).toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.phone.includes(query),
      );
    }

    if (roleFilter !== 'ALL') {
      result = result.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(user => user.status === statusFilter);
    }

    return result;
  }, [users, searchQuery, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
      return;
    }

    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const stats = useMemo(() => {
    const total = response?.data?.totalCount ?? users.length;
    const admins = users.filter(user => user.role === ROLE.ADMIN).length;
    const active = users.filter(user => user.status === USER_STATUS.ACTIVE).length;
    const deactivated = users.filter(user => user.status === USER_STATUS.DEACTIVATED).length;
    return { active, admins, deactivated, total };
  }, [response?.data?.totalCount, users]);

  const handleCreate = () => {
    setFormMode('create');
    setEditingUser(null);
    setShowFormModal(true);
  };

  const handleEdit = (user: UserFormData) => {
    setFormMode('edit');
    setEditingUser(user);
    setShowFormModal(true);
  };

  const handleDelete = (user: UserFormData) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const handleView = (user: UserFormData) => {
    if (!user.id) {
      return;
    }

    setViewingUserId(user.id);
    setShowDetailModal(true);
  };

  const handleFormSubmitAction = async (data: UserFormData) => {
    if (formMode === 'create') {
      await createUser({
        csrf: true,
        email: data.email.trim(),
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        password: data.password || '',
        phone: data.phone.trim(),
        role: data.role,
        status: data.status,
      });

      await mutate();
    } else {
      if (!editingUser?.id) return;

      const nextStatus = data.status;
      const prevStatus = editingUser.status;
      if (nextStatus === prevStatus) {
        setShowFormModal(false);
        return;
      }

      const payload: {
        csrf?: boolean;
        id: string;
        status: USER_STATUS;
      } = {
        csrf: true,
        id: editingUser.id,
        status: nextStatus,
      };

      await updateUser(payload);
      await mutate();
    }

    setShowFormModal(false);
  };

  const handleDeleteConfirmAction = () => {
    if (deletingUser) {
      setUsers(prev => prev.filter(user => user.id !== deletingUser.id));
    }
    setShowDeleteModal(false);
    setDeletingUser(null);
  };

  const columnDefs = useMemo(
    () =>
      getColumnDefs({
        currentPage,
        getDisplayName,
        itemsPerPage: ITEMS_PER_PAGE,
        onDelete: handleDelete,
        onEdit: handleEdit,
        onView: handleView,
      }),
    [currentPage, handleDelete, handleEdit, handleView],
  );

  return (
    <>
      <div className="space-y-6 h-full flex flex-col">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-1 text-[1.3rem] text-gray-500">Tổng người dùng</p>
            <p className="text-[2.8rem] font-700 text-gray-900">{stats.total}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-1 text-[1.3rem] text-gray-500">Admin</p>
            <p className="text-[2.8rem] font-700 text-primary">{stats.admins}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-1 text-[1.3rem] text-gray-500">Hoạt động</p>
            <p className="text-[2.8rem] font-700 text-green-600">{stats.active}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-1 text-[1.3rem] text-gray-500">Ngừng hoạt động</p>
            <p className="text-[2.8rem] font-700 text-orange-500">{stats.deactivated}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white flex-1 flex flex-col">
          <div className="flex flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative max-w-[32rem] flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  className="h-9 w-full rounded-lg bg-gray-100 py-0 pr-4 pl-9 text-[1.3rem] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  onChange={event => {
                    setSearchQuery(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Tìm theo tên, email, SĐT..."
                  type="text"
                  value={searchQuery}
                />
              </div>

              <select
                className="h-9 cursor-pointer appearance-none rounded-lg bg-gray-100 py-0 pr-8 pl-3 text-[1.3rem] focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                onChange={event => {
                  setRoleFilter(event.target.value as 'ALL' | ROLE);
                  setCurrentPage(1);
                }}
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                  backgroundPosition: 'right 8px center',
                  backgroundRepeat: 'no-repeat',
                }}
                value={roleFilter}
              >
                <option value="ALL">Tất cả vai trò</option>
                <option value={ROLE.ADMIN}>{ROLE.ADMIN}</option>
                <option value={ROLE.USER}>{ROLE.USER}</option>
              </select>

              <select
                className="hidden h-9 cursor-pointer appearance-none rounded-lg bg-gray-100 py-0 pr-8 pl-3 text-[1.3rem] focus:outline-none focus:ring-2 focus:ring-emerald-600/20 sm:block"
                onChange={event => {
                  setStatusFilter(event.target.value as 'ALL' | USER_STATUS);
                  setCurrentPage(1);
                }}
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                  backgroundPosition: 'right 8px center',
                  backgroundRepeat: 'no-repeat',
                }}
                value={statusFilter}
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value={USER_STATUS.ACTIVE}>Hoạt động</option>
                <option value={USER_STATUS.PENDING}>Chờ duyệt</option>
                <option value={USER_STATUS.DEACTIVATED}>Ngừng hoạt động</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-[1.3rem] text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                type="button"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Xuất Excel</span>
              </button>

              <button
                className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-[1.3rem] font-500 text-white transition-colors hover:bg-primary"
                onClick={handleCreate}
                type="button"
              >
                <Plus className="h-4 w-4" />
                Tạo user
              </button>
            </div>
          </div>

          <div className="relative overflow-x-auto flex-1 py-2 px-5">
            <DataGrid
              className="w-full h-full"
              columnDefs={columnDefs}
              defaultColDef={{
                cellClass: 'text-[1.3rem] text-gray-500',
                suppressHeaderMenuButton: true,
              }}
              loading={isLoading}
              rowData={paginatedUsers}
              rowHeight={62}
              headerHeight={43}
            />
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 pb-4">
              <p className="text-[1.3rem] text-gray-500">
                Hiển thị{' '}
                <span className="font-500 text-gray-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>
                {' - '}
                <span className="font-500 text-gray-900">
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}
                </span>{' '}
                trong tổng <span className="font-500 text-gray-900">{filteredUsers.length}</span> người dùng
              </p>

              <div className="flex items-center gap-1">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                  <button
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-[1.3rem] transition-colors ${
                      currentPage === page
                        ? 'bg-primary font-500 text-white'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    type="button"
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  type="button"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <UserFormModal
        initialData={editingUser}
        isOpen={showFormModal}
        isSubmitting={isCreatingUser || isUpdatingUser}
        mode={formMode}
        onCloseAction={() => setShowFormModal(false)}
        onSubmitAction={handleFormSubmitAction}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        itemName={deletingUser ? getDisplayName(deletingUser) : ''}
        onCloseAction={() => {
          setShowDeleteModal(false);
          setDeletingUser(null);
        }}
        onConfirmAction={handleDeleteConfirmAction}
      />

      <UserDetailModal
        isOpen={showDetailModal}
        onCloseAction={() => {
          setShowDetailModal(false);
          setViewingUserId(null);
        }}
        userId={viewingUserId}
      />
    </>
  );
}
