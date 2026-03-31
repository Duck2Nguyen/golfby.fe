'use client';

import { Plus, Search } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

import type { Tag } from '@/hooks/useTags';

import { useTags } from '@/hooks/useTags';

import DataGrid from '@/components/DataGrid';

import { getColumnDefs } from './config';
import TagFormModal, { type TagFormData } from './TagFormModal';
import DeleteConfirmModal from '../Categories/DeleteConfirmModal';

const ITEMS_PER_PAGE = 10;

const mapTagToFormData = (tag: Tag): TagFormData => ({
  id: tag.id,
  name: tag.name,
  slug: tag.slug,
});

export default function Tags() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingTag, setEditingTag] = useState<TagFormData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTag, setDeletingTag] = useState<TagFormData | null>(null);

  const { createTagMutation, deleteTagMutation, getAllTags, updateTagMutation } = useTags();

  const allTags = useMemo(() => {
    return (getAllTags.data?.data ?? []).map(mapTagToFormData);
  }, [getAllTags.data?.data]);

  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return allTags;

    const query = searchQuery.toLowerCase();
    return allTags.filter(tag => tag.name.toLowerCase().includes(query));
  }, [allTags, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredTags.length / ITEMS_PER_PAGE));

  const paginatedTags = filteredTags.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleCreate = () => {
    setFormMode('create');
    setEditingTag(null);
    setShowFormModal(true);
  };

  const handleEdit = (tag: TagFormData) => {
    setFormMode('edit');
    setEditingTag(tag);
    setShowFormModal(true);
  };

  const handleDelete = (tag: TagFormData) => {
    setDeletingTag(tag);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmAction = async () => {
    if (!deletingTag?.id) return;

    await deleteTagMutation.trigger({
      csrf: true,
      id: deletingTag.id,
    });

    await getAllTags.mutate();

    setShowDeleteModal(false);
    setDeletingTag(null);
  };

  const handleSubmitAction = async (data: TagFormData) => {
    if (formMode === 'create') {
      await createTagMutation.trigger({
        csrf: true,
        name: data.name,
        slug: data.slug,
      });
    } else {
      if (!data.id) return;

      await updateTagMutation.trigger({
        csrf: true,
        id: data.id,
        name: data.name,
        slug: data.slug,
      });
    }

    await getAllTags.mutate();
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
                placeholder="Tìm theo tên tag..."
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
              Tạo tag
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
              loading={getAllTags.isLoading}
              rowData={paginatedTags}
              rowHeight={62}
              headerHeight={43}
            />
          </div>
        </div>
      </div>

      <TagFormModal
        initialData={editingTag}
        isOpen={showFormModal}
        isSubmitting={createTagMutation.isMutating || updateTagMutation.isMutating}
        mode={formMode}
        onCloseAction={() => setShowFormModal(false)}
        onSubmitAction={handleSubmitAction}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        itemName={deletingTag?.name || ''}
        onCloseAction={() => {
          setShowDeleteModal(false);
          setDeletingTag(null);
        }}
        onConfirmAction={handleDeleteConfirmAction}
      />
    </>
  );
}
