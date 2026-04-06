'use client';

import { Plus, Search } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

import type { Brand } from '@/hooks/useBrands';

import {
  useBrands,
  buildCreateBrandFormDataPayload,
  buildUpdateBrandFormDataPayload,
} from '@/hooks/useBrands';

import DataGrid from '@/components/DataGrid';

import { getColumnDefs } from './config';
import DeleteConfirmModal from './DeleteConfirmModal';
import BrandFormModal, { type BrandFormData } from './BrandFormModal';

const ITEMS_PER_PAGE = 10;

const mapBrandToFormData = (brand: Brand): BrandFormData => ({
  description: brand.description || '',
  id: brand.id,
  imageUrl: brand.image?.url || brand.logoUrl || '',
  logoUrl: brand.logoUrl || '',
  name: brand.name,
  slug: brand.slug,
});

export default function Brands() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingBrand, setEditingBrand] = useState<BrandFormData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingBrand, setDeletingBrand] = useState<BrandFormData | null>(null);

  const { createBrandMutation, deleteBrandMutation, getAllBrands, updateBrandMutation } = useBrands();

  const allBrands = useMemo(() => {
    return (getAllBrands.data?.data ?? []).map(mapBrandToFormData);
  }, [getAllBrands.data?.data]);

  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return allBrands;

    const query = searchQuery.toLowerCase();
    return allBrands.filter(brand => brand.name.toLowerCase().includes(query));
  }, [allBrands, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredBrands.length / ITEMS_PER_PAGE));

  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleCreate = () => {
    setFormMode('create');
    setEditingBrand(null);
    setShowFormModal(true);
  };

  const handleEdit = (brand: BrandFormData) => {
    setFormMode('edit');
    setEditingBrand(brand);
    setShowFormModal(true);
  };

  const handleDelete = (brand: BrandFormData) => {
    setDeletingBrand(brand);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmAction = async () => {
    if (!deletingBrand?.id) return;

    await deleteBrandMutation.trigger({
      csrf: true,
      id: deletingBrand.id,
    });

    await getAllBrands.mutate();

    setShowDeleteModal(false);
    setDeletingBrand(null);
  };

  const handleSubmitAction = async (data: BrandFormData) => {
    if (formMode === 'create') {
      await createBrandMutation.trigger(
        buildCreateBrandFormDataPayload({
          csrf: true,
          description: data.description || undefined,
          file: data.imageFile,
          logoUrl: data.logoUrl || undefined,
          name: data.name,
          slug: data.slug,
        }),
      );
    } else {
      if (!data.id) return;

      await updateBrandMutation.trigger(
        buildUpdateBrandFormDataPayload({
          csrf: true,
          description: data.description || undefined,
          file: data.imageFile,
          id: data.id,
          logoUrl: data.logoUrl || undefined,
          name: data.name,
          slug: data.slug,
        }),
      );
    }

    await getAllBrands.mutate();
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
                placeholder="Tìm theo tên brand..."
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
              Tạo brand
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
              loading={getAllBrands.isLoading}
              rowData={paginatedBrands}
              rowHeight={62}
              headerHeight={43}
            />
          </div>
        </div>
      </div>

      <BrandFormModal
        initialData={editingBrand}
        isOpen={showFormModal}
        isSubmitting={createBrandMutation.isMutating || updateBrandMutation.isMutating}
        mode={formMode}
        onCloseAction={() => setShowFormModal(false)}
        onSubmitAction={handleSubmitAction}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        itemName={deletingBrand?.name || ''}
        onCloseAction={() => {
          setShowDeleteModal(false);
          setDeletingBrand(null);
        }}
        onConfirmAction={handleDeleteConfirmAction}
      />
    </>
  );
}
