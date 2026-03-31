'use client';

import { Plus, Search } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

import type { CollectionTreeNode } from '@/hooks/useCollections';
import type { CategoryWithSubcategories } from '@/hooks/useCategorires';

import { useCollections } from '@/hooks/useCollections';
import { useCategorires } from '@/hooks/useCategorires';

import DataGrid from '@/components/DataGrid';

import { getColumnDefs, type CollectionTableRow } from './config';
import DeleteConfirmModal from '../Categories/DeleteConfirmModal';
import CollectionFormModal, {
  type CollectionFormData,
  type CategoryCatalogItem,
  type AssignedCategoryInfo,
  type ParentCollectionOption,
} from './CollectionFormModal';

const ITEMS_PER_PAGE = 10;

const flattenCollectionsToRows = (
  nodes: CollectionTreeNode[],
  parentName = '',
  depth = 0,
): CollectionTableRow[] => {
  return nodes.flatMap(node => {
    const current: CollectionTableRow = {
      categoryCount: node.categories.length,
      categoryIds: node.categories.map(category => category.id),
      depth,
      description: node.description || '',
      displayName: `${'-- '.repeat(depth)}${node.name}`,
      id: node.id,
      name: node.name,
      parentId: node.parentId || null,
      parentName,
      slug: node.slug,
      typeLabel: depth === 0 ? 'Cha' : 'Con',
    };

    return [current, ...flattenCollectionsToRows(node.children, node.name, depth + 1)];
  });
};

const flattenRootCollections = (nodes: CollectionTreeNode[]): ParentCollectionOption[] => {
  return nodes
    .filter(node => !node.parentId)
    .map(node => ({
      id: node.id,
      label: `Cha: ${node.name}`,
    }));
};

const buildAssignedCategoryMap = (nodes: CollectionTreeNode[]): Map<string, AssignedCategoryInfo> => {
  const map = new Map<string, AssignedCategoryInfo>();

  const walk = (items: CollectionTreeNode[]) => {
    for (const item of items) {
      for (const category of item.categories) {
        map.set(category.id, {
          collectionId: item.id,
          collectionName: item.name,
        });
      }

      walk(item.children);
    }
  };

  walk(nodes);
  return map;
};

const buildCategoryCatalogFromTree = (nodes: CollectionTreeNode[]): CategoryCatalogItem[] => {
  const map = new Map<string, CategoryCatalogItem>();

  const walk = (items: CollectionTreeNode[]) => {
    for (const item of items) {
      for (const category of item.categories) {
        map.set(category.id, {
          id: category.id,
          label: category.name,
          name: category.name,
          slug: category.slug,
        });
      }

      walk(item.children);
    }
  };

  walk(nodes);

  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, 'vi'));
};

const buildCategoryCatalogFromCategories = (
  categories: CategoryWithSubcategories[],
): CategoryCatalogItem[] => {
  const map = new Map<string, CategoryCatalogItem>();

  for (const category of categories) {
    map.set(category.id, {
      id: category.id,
      label: category.name,
      name: category.name,
      slug: category.slug,
    });

    for (const subcategory of category.subcategories) {
      map.set(subcategory.id, {
        id: subcategory.id,
        label: `${category.name} / ${subcategory.name}`,
        name: subcategory.name,
        slug: subcategory.slug,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, 'vi'));
};

const mapCollectionToFormData = (collection: CollectionTableRow): CollectionFormData => ({
  categoryIds: collection.categoryIds,
  description: collection.description || '',
  id: collection.id,
  name: collection.name,
  parentId: collection.parentId || '',
  slug: collection.slug,
});

export default function Collections() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingCollection, setEditingCollection] = useState<CollectionTableRow | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCollection, setDeletingCollection] = useState<CollectionTableRow | null>(null);

  const { getAllCategories } = useCategorires();
  const { createCollectionMutation, deleteCollectionMutation, getAllCollections, updateCollectionMutation } =
    useCollections();

  const treeData = useMemo(() => {
    return getAllCollections.data?.data ?? [];
  }, [getAllCollections.data?.data]);

  const allCollections = useMemo(() => flattenCollectionsToRows(treeData), [treeData]);

  const parentOptions = useMemo(() => flattenRootCollections(treeData), [treeData]);

  const assignedCategoryMap = useMemo(() => buildAssignedCategoryMap(treeData), [treeData]);

  const categoryCatalog = useMemo(() => {
    const categoryData = getAllCategories.data?.data ?? [];
    if (categoryData.length > 0) {
      return buildCategoryCatalogFromCategories(categoryData);
    }

    return buildCategoryCatalogFromTree(treeData);
  }, [getAllCategories.data?.data, treeData]);

  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim()) return allCollections;

    const query = searchQuery.toLowerCase();
    return allCollections.filter(collection => {
      return (
        collection.name.toLowerCase().includes(query) ||
        collection.slug.toLowerCase().includes(query) ||
        collection.description?.toLowerCase().includes(query)
      );
    });
  }, [allCollections, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredCollections.length / ITEMS_PER_PAGE));

  const paginatedCollections = filteredCollections.slice(
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
    setEditingCollection(null);
    setShowFormModal(true);
  };

  const handleEdit = (collection: CollectionTableRow) => {
    setFormMode('edit');
    setEditingCollection(collection);
    setShowFormModal(true);
  };

  const handleDelete = (collection: CollectionTableRow) => {
    setDeletingCollection(collection);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmAction = async () => {
    if (!deletingCollection?.id) return;

    await deleteCollectionMutation.trigger({
      csrf: true,
      id: deletingCollection.id,
    });

    await getAllCollections.mutate();

    setShowDeleteModal(false);
    setDeletingCollection(null);
  };

  const handleSubmitAction = async (data: CollectionFormData) => {
    if (formMode === 'create') {
      await createCollectionMutation.trigger({
        categoryIds: data.categoryIds.length > 0 ? data.categoryIds : undefined,
        csrf: true,
        description: data.description || undefined,
        name: data.name,
        parentId: data.parentId || undefined,
        slug: data.slug,
      });
    } else {
      if (!data.id || !editingCollection) return;

      const isExistingChildCollection = Boolean(editingCollection.parentId);
      const canSelectParent = isExistingChildCollection;
      const canSelectCategories = isExistingChildCollection;

      const removedCategoryIds = canSelectCategories
        ? editingCollection.categoryIds.filter(categoryId => !data.categoryIds.includes(categoryId))
        : [];

      await updateCollectionMutation.trigger({
        ...(canSelectCategories && data.categoryIds.length > 0 ? { categoryIds: data.categoryIds } : {}),
        ...(canSelectCategories && removedCategoryIds.length > 0 ? { removedCategoryIds } : {}),
        ...(canSelectParent ? { parentId: data.parentId || null } : {}),
        csrf: true,
        description: data.description || undefined,
        id: data.id,
        name: data.name,
        slug: data.slug,
      });
    }

    await getAllCollections.mutate();
    setShowFormModal(false);
    setEditingCollection(null);
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
                placeholder="Tìm theo tên hoặc slug collection..."
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
              Tạo collection
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
              loading={getAllCollections.isLoading}
              rowData={paginatedCollections}
              rowHeight={62}
              headerHeight={43}
            />
          </div>
        </div>
      </div>

      <CollectionFormModal
        assignedCategoryMap={assignedCategoryMap}
        categoryCatalog={categoryCatalog}
        initialData={editingCollection ? mapCollectionToFormData(editingCollection) : null}
        isOpen={showFormModal}
        isSubmitting={createCollectionMutation.isMutating || updateCollectionMutation.isMutating}
        mode={formMode}
        onCloseAction={() => {
          setShowFormModal(false);
          setEditingCollection(null);
        }}
        onSubmitAction={handleSubmitAction}
        parentOptions={parentOptions}
      />

      <DeleteConfirmModal
        confirmLabel="Xóa collection"
        isOpen={showDeleteModal}
        itemName={deletingCollection?.name || ''}
        onCloseAction={() => {
          setShowDeleteModal(false);
          setDeletingCollection(null);
        }}
        onConfirmAction={handleDeleteConfirmAction}
        title="Xác nhận xóa collection"
      />
    </>
  );
}
