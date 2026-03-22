'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  Plus,
  Pencil,
  Search,
  Shield,
  Trash2,
  Download,
  UserIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { Spinner } from '@heroui/spinner';

import type { UserInfo } from '@/interfaces/model';

import { genCsrfToken } from '@/utils/csrf';

import { useAdminUsers, useCreateAdminUser, useUpdateAdminUser } from '@/hooks/admin/useAdminUsers';

import DeleteConfirmModal from './DeleteConfirmModal';
import UserFormModal, { type UserFormData } from './UserFormModal';

const ITEMS_PER_PAGE = 8;

const toUserFormData = (user: UserInfo): UserFormData => {
  const roleRaw = user.userRole || user.role || 'USER';
  const statusRaw = user.userStatus || 'ACTIVE';

  return {
    email: user.email || '',
    firstName: user.firstName || '',
    id: user.id,
    lastName: user.lastName || '',
    phone: user.phoneNumber || '',
    role: roleRaw === 'ADMIN' ? 'ADMIN' : 'USER',
    status: statusRaw.toUpperCase() === 'INACTIVE' ? 'inactive' : 'active',
  };
};

const getDisplayName = (user: UserFormData) => {
  const displayName = `${user.lastName} ${user.firstName}`.trim();
  return displayName || user.email || 'Chưa cập nhật';
};

const getNameInitials = (user: UserFormData) => {
  const initials = [user.lastName?.[0], user.firstName?.[0]].filter(Boolean).join('').toUpperCase();
  return initials || 'U';
};

export default function Backup() {
  const [users, setUsers] = useState<UserFormData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'USER'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'active' | 'inactive'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'email' | 'name' | 'role' | 'status'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingUser, setEditingUser] = useState<UserFormData | null>(null);
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

    result.sort((userA, userB) => {
      const valueA = sortField === 'name' ? getDisplayName(userA) : userA[sortField] || '';
      const valueB = sortField === 'name' ? getDisplayName(userB) : userB[sortField] || '';
      const compare = valueA.localeCompare(valueB);
      return sortDir === 'asc' ? compare : -compare;
    });

    return result;
  }, [users, searchQuery, roleFilter, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const stats = useMemo(() => {
    const total = response?.data?.totalCount ?? users.length;
    const admins = users.filter(user => user.role === 'ADMIN').length;
    const active = users.filter(user => user.status === 'active').length;
    const inactive = users.filter(user => user.status === 'inactive').length;
    return { active, admins, inactive, total };
  }, [response?.data?.totalCount, users]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortField(field);
    setSortDir('asc');
  };

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

  const handleFormSubmitAction = async (data: UserFormData) => {
    if (formMode === 'create') {
      const csrfToken = await genCsrfToken();

      await createUser({
        ...(csrfToken ? { csrfToken } : {}),
        email: data.email.trim(),
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        password: data.password || '',
        phone: data.phone.trim(),
        role: data.role,
        status: data.status === 'active' ? 'ACTIVE' : 'INACTIVE',
      });

      await mutate();
    } else {
      if (!editingUser?.id) return;

      const csrfToken = await genCsrfToken();
      const payload: {
        csrfToken?: string;
        id: string;
        role?: 'ADMIN' | 'USER';
        status?: 'ACTIVE' | 'INACTIVE';
      } = {
        id: editingUser.id,
      };

      if (data.role !== editingUser.role) {
        payload.role = data.role;
      }

      const nextStatus = data.status === 'active' ? 'ACTIVE' : 'INACTIVE';
      const prevStatus = editingUser.status === 'active' ? 'ACTIVE' : 'INACTIVE';
      if (nextStatus !== prevStatus) {
        payload.status = nextStatus;
      }

      if (csrfToken) {
        payload.csrfToken = csrfToken;
      }

      if (payload.role || payload.status) {
        await updateUser(payload);
        await mutate();
      }
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

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) {
      return <span className="ml-1 opacity-0 group-hover:opacity-40">&#8597;</span>;
    }

    return <span className="ml-1 text-primary-light">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-1 text-[1.3rem] text-gray-500">Tổng người dùng</p>
            <p className="text-[2.8rem] font-700 text-gray-900">{stats.total}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-1 text-[1.3rem] text-gray-500">Admin</p>
            <p className="text-[2.8rem] font-700 text-primary-light">{stats.admins}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-1 text-[1.3rem] text-gray-500">Hoạt động</p>
            <p className="text-[2.8rem] font-700 text-green-600">{stats.active}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-1 text-[1.3rem] text-gray-500">Ngừng hoạt động</p>
            <p className="text-[2.8rem] font-700 text-orange-500">{stats.inactive}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-col justify-between gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center">
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
                  setRoleFilter(event.target.value as 'ALL' | 'ADMIN' | 'USER');
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
                <option value="ADMIN">ADMIN</option>
                <option value="USER">USER</option>
              </select>

              <select
                className="hidden h-9 cursor-pointer appearance-none rounded-lg bg-gray-100 py-0 pr-8 pl-3 text-[1.3rem] focus:outline-none focus:ring-2 focus:ring-emerald-600/20 sm:block"
                onChange={event => {
                  setStatusFilter(event.target.value as 'ALL' | 'active' | 'inactive');
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
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngừng hoạt động</option>
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

          <div className="relative overflow-x-auto">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                <Spinner color="primary" size="lg" />
              </div>
            )}

            <table className="w-full">
              <thead>
                <tr className="bg-gray-100/60">
                  <th
                    className="px-5 py-3 text-left text-[1.2rem] tracking-wider text-gray-500"
                    style={{ fontWeight: 600, minWidth: '60px' }}
                  >
                    #
                  </th>

                  <th
                    className="group cursor-pointer select-none px-5 py-3 text-left text-[1.2rem] tracking-wider text-gray-500"
                    onClick={() => handleSort('name')}
                    style={{ fontWeight: 600, minWidth: '180px' }}
                  >
                    HỌ VÀ TÊN
                    <SortIcon field="name" />
                  </th>

                  <th
                    className="group cursor-pointer select-none px-5 py-3 text-left text-[1.2rem] tracking-wider text-gray-500"
                    onClick={() => handleSort('email')}
                    style={{ fontWeight: 600, minWidth: '200px' }}
                  >
                    EMAIL
                    <SortIcon field="email" />
                  </th>

                  <th
                    className="px-5 py-3 text-left text-[1.2rem] tracking-wider text-gray-500"
                    style={{ fontWeight: 600, minWidth: '130px' }}
                  >
                    SỐ ĐIỆN THOẠI
                  </th>

                  <th
                    className="group cursor-pointer select-none px-5 py-3 text-left text-[1.2rem] tracking-wider text-gray-500"
                    onClick={() => handleSort('role')}
                    style={{ fontWeight: 600, minWidth: '100px' }}
                  >
                    VAI TRÒ
                    <SortIcon field="role" />
                  </th>

                  <th
                    className="group cursor-pointer select-none px-5 py-3 text-left text-[1.2rem] tracking-wider text-gray-500"
                    onClick={() => handleSort('status')}
                    style={{ fontWeight: 600, minWidth: '120px' }}
                  >
                    TRẠNG THÁI
                    <SortIcon field="status" />
                  </th>

                  <th
                    className="px-5 py-3 text-right text-[1.2rem] tracking-wider text-gray-500"
                    style={{ fontWeight: 600, minWidth: '120px' }}
                  >
                    THAO TÁC
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td className="py-12 text-center text-[1.4rem] text-gray-500" colSpan={7}>
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user, index) => (
                    <tr
                      className="border-t border-gray-200 transition-colors hover:bg-gray-100/50"
                      key={user.id || `${user.email}-${index}`}
                    >
                      <td className="px-5 py-3.5 text-[1.3rem] text-gray-500">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-light">
                            <span className="text-[1.1rem] font-600 text-primary">
                              {getNameInitials(user)}
                            </span>
                          </div>
                          <span className="text-[1.4rem] font-500 text-gray-900">{getDisplayName(user)}</span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-[1.3rem] text-gray-500">{user.email}</td>

                      <td className="px-5 py-3.5 text-[1.3rem] text-gray-500">{user.phone || '—'}</td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[1.2rem] font-500 ${
                            user.role === 'ADMIN'
                              ? 'bg-violet-50 text-violet-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {user.role === 'ADMIN' ? (
                            <Shield className="h-3 w-3" />
                          ) : (
                            <UserIcon className="h-3 w-3" />
                          )}
                          {user.role}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[1.2rem] font-500 ${
                            user.status === 'active'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-orange-50 text-orange-600'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              user.status === 'active' ? 'bg-green-500' : 'bg-orange-400'
                            }`}
                          />
                          {user.status === 'active' ? 'Hoạt động' : 'Ngừng HĐ'}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-primary hover:text-primary-light"
                            onClick={() => handleEdit(user)}
                            title="Chỉnh sửa"
                            type="button"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500"
                            onClick={() => handleDelete(user)}
                            title="Xóa"
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4">
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
    </>
  );
}
