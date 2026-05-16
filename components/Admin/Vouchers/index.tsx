'use client';

import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';

import {
  type Voucher,
  useAdminVouchers,
  useCreateVoucher,
  useUpdateVoucher,
  useDeleteVoucher,
} from '@/hooks/useVoucher';

import DataGrid from '@/components/DataGrid';

import { getColumnDefs } from './config';
import VoucherFormModal from './VoucherFormModal';
import DeleteConfirmModal from '../Categories/DeleteConfirmModal';

const ITEMS_PER_PAGE = 10;

export default function Vouchers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingVoucher, setDeletingVoucher] = useState<Voucher | null>(null);

  const {
    data: vouchersData,
    isLoading,
    mutate,
  } = useAdminVouchers({
    page: currentPage,
    size: ITEMS_PER_PAGE,
    search: searchQuery,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const createVoucherMutation = useCreateVoucher();
  const updateVoucherMutation = useUpdateVoucher();
  const deleteVoucherMutation = useDeleteVoucher();

  const vouchersList = useMemo(() => vouchersData?.data?.items ?? [], [vouchersData?.data?.items]);
  const totalCount = useMemo(() => vouchersData?.data?.totalCount ?? 0, [vouchersData?.data?.totalCount]);
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  const handleCreate = () => {
    setFormMode('create');
    setEditingVoucher(null);
    setShowFormModal(true);
  };

  const handleEdit = (voucher: Voucher) => {
    setFormMode('edit');
    setEditingVoucher(voucher);
    setShowFormModal(true);
  };

  const handleDelete = (voucher: Voucher) => {
    setDeletingVoucher(voucher);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmAction = async () => {
    if (!deletingVoucher?.id) return;

    await deleteVoucherMutation.trigger({
      id: deletingVoucher.id,
      csrf: true,
    });

    await mutate();
    setShowDeleteModal(false);
    setDeletingVoucher(null);
  };

  const handleSubmitAction = async (data: any) => {
    if (formMode === 'create') {
      await createVoucherMutation.trigger({
        ...data,
        csrf: true,
      });
    } else {
      if (!data.id) return;
      await updateVoucherMutation.trigger({
        ...data,
        csrf: true,
      });
    }

    await mutate();
    setShowFormModal(false);
  };

  const columnDefs = useMemo(
    () =>
      getColumnDefs({
        currentPage,
        itemsPerPage: ITEMS_PER_PAGE,
        onDelete: handleDelete,
        onEdit: handleEdit,
      }),
    [currentPage, handleDelete, handleEdit],
  );

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white flex-1 flex flex-col">
          <div className="flex flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center">
            <div className="relative max-w-[36rem] flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                className="h-9 w-full rounded-lg bg-gray-100 py-0 pr-4 pl-9 text-[1.3rem] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                onChange={event => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm kiếm voucher..."
                type="text"
                value={searchQuery}
              />
            </div>

            <button
              className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-[1.3rem] font-500 text-white transition-colors hover:bg-primary"
              onClick={handleCreate}
              type="button"
            >
              <Plus className="h-4 w-4" />
              Tạo voucher
            </button>
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
              rowData={vouchersList}
              rowHeight={62}
              headerHeight={43}
            />
          </div>
        </div>
      </div>

      <VoucherFormModal
        initialData={editingVoucher}
        isOpen={showFormModal}
        isSubmitting={createVoucherMutation.isMutating || updateVoucherMutation.isMutating}
        mode={formMode}
        onCloseAction={() => setShowFormModal(false)}
        onSubmitAction={handleSubmitAction}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        itemName={deletingVoucher?.name || 'Voucher này'}
        onCloseAction={() => {
          setShowDeleteModal(false);
          setDeletingVoucher(null);
        }}
        onConfirmAction={handleDeleteConfirmAction}
      />
    </>
  );
}
