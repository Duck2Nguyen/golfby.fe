'use client';

import { Plus, Search } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

import type { CategoryWithSubcategories } from '@/hooks/useCategorires';

import { genCsrfToken } from '@/utils/csrf';

import { useCategorires } from '@/hooks/useCategorires';

import DataGrid from '@/components/DataGrid';

import { getColumnDefs } from './config';
import DeleteConfirmModal from './DeleteConfirmModal';
import CategoryFormModal, { type CategoryFormData } from './CategoryFormModal';

const ITEMS_PER_PAGE = 10;

const mapCategoryToFormData = (category: CategoryWithSubcategories): CategoryFormData => ({
  description: category.description || '',
  id: category.id,
  name: category.name,
  slug: category.slug,
});

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingCategory, setEditingCategory] = useState<CategoryFormData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<CategoryFormData | null>(null);

  const { createCategoryMutation, deleteCategoryMutation, getAllCategories, updateCategoryMutation } =
    useCategorires();

  const allCategories = useMemo(() => {
    return (getAllCategories.data?.data ?? []).map(mapCategoryToFormData);
  }, [getAllCategories.data?.data]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return allCategories;

    const query = searchQuery.toLowerCase();
    return allCategories.filter(category => category.name.toLowerCase().includes(query));
  }, [allCategories, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / ITEMS_PER_PAGE));

  const paginatedCategories = filteredCategories.slice(
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
    setEditingCategory(null);
    setShowFormModal(true);
  };

  const handleEdit = (category: CategoryFormData) => {
    setFormMode('edit');
    setEditingCategory(category);
    setShowFormModal(true);
  };

  const handleDelete = (category: CategoryFormData) => {
    setDeletingCategory(category);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmAction = async () => {
    if (!deletingCategory?.id) return;

    const csrfToken = await genCsrfToken();

    await deleteCategoryMutation.trigger({
      ...(csrfToken ? { csrfToken } : {}),
      id: deletingCategory.id,
    });

    await getAllCategories.mutate();

    setShowDeleteModal(false);
    setDeletingCategory(null);
  };

  const handleSubmitAction = async (data: CategoryFormData) => {
    const csrfToken = await genCsrfToken();

    if (formMode === 'create') {
      await createCategoryMutation.trigger({
        ...(csrfToken ? { csrfToken } : {}),
        description: data.description || undefined,
        name: data.name,
        slug: data.slug,
      });
    } else {
      if (!data.id) return;

      await updateCategoryMutation.trigger({
        ...(csrfToken ? { csrfToken } : {}),
        description: data.description || undefined,
        id: data.id,
        name: data.name,
        slug: data.slug,
      });
    }

    await getAllCategories.mutate();
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
                placeholder="Tìm theo tên danh mục..."
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
              Tạo danh mục
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
              loading={getAllCategories.isLoading}
              rowData={paginatedCategories}
              rowHeight={62}
              headerHeight={43}
            />
          </div>
        </div>
      </div>

      <CategoryFormModal
        initialData={editingCategory}
        isOpen={showFormModal}
        isSubmitting={createCategoryMutation.isMutating || updateCategoryMutation.isMutating}
        mode={formMode}
        onCloseAction={() => setShowFormModal(false)}
        onSubmitAction={handleSubmitAction}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        itemName={deletingCategory?.name || ''}
        onCloseAction={() => {
          setShowDeleteModal(false);
          setDeletingCategory(null);
        }}
        onConfirmAction={handleDeleteConfirmAction}
      />
    </>
  );
}
