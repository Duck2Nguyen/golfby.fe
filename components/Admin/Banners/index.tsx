'use client';

import { Plus, Search } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

import type { CollectionTreeNode } from '@/hooks/useCollections';
import type { StaticHomeItem, StaticHomeValue, StaticHomeCategory } from '@/hooks/useStaticData';

import { useCollections } from '@/hooks/useCollections';
import {
  useAdminStaticHomeList,
  STATIC_HOME_CATEGORIES,
  useCreateAdminStaticHome,
  useDeleteAdminStaticHome,
  useUpdateAdminStaticHome,
  useUploadAdminStaticContentImage,
  STATIC_HOME_COLLECTION_DIRECTIONS,
} from '@/hooks/useStaticData';

import DataGrid from '@/components/DataGrid';

import DeleteConfirmModal from './DeleteConfirmModal';
import { getColumnDefs, type BannerTableRow } from './config';
import BannerFormModal, { type BannerFormData, type BannerCollectionOption } from './BannerFormModal';

const ITEMS_PER_PAGE = 10;
const BANNER_UPLOAD_PATH = 'home/banner';

const readString = (value: unknown): string => {
  return typeof value === 'string' ? value : '';
};

const mapItemToRow = (item: StaticHomeItem): BannerTableRow => {
  const value = item.value as unknown as Record<string, unknown>;
  const baseRow: BannerTableRow = {
    category: item.category,
    href: readString(value.href),
    id: item.id,
    imageUrl: readString(value.imageUrl),
    imageId: readString(value.imageId),
  };

  if (item.category === STATIC_HOME_CATEGORIES.PRODUCT_NEW) {
    return {
      ...baseRow,
      name: readString(value.name),
    };
  }

  if (item.category === STATIC_HOME_CATEGORIES.COLLECTION) {
    const direction = readString(value.direction);

    return {
      ...baseRow,
      collectionId: readString(value.collectionId),
      direction:
        direction === STATIC_HOME_COLLECTION_DIRECTIONS.HORIZONTAL
          ? STATIC_HOME_COLLECTION_DIRECTIONS.HORIZONTAL
          : STATIC_HOME_COLLECTION_DIRECTIONS.VERTICAL,
    };
  }

  return baseRow;
};

const mapRowToFormData = (banner: BannerTableRow): BannerFormData => {
  return {
    category: banner.category,
    collectionId: banner.collectionId || '',
    direction: banner.direction || '',
    href: banner.href,
    id: banner.id,
    imageFile: null,
    imageUrl: banner.imageUrl,
    name: banner.name || '',
  };
};

const buildParentCollectionOptions = (nodes: CollectionTreeNode[]): BannerCollectionOption[] => {
  return nodes
    .filter(node => !node.parentId)
    .map(node => ({
      id: node.id,
      label: node.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'vi'));
};

const buildStaticHomeValueFromForm = (
  category: StaticHomeCategory,
  data: BannerFormData,
  imageId: string,
) => {
  if (category === STATIC_HOME_CATEGORIES.PRODUCT_NEW) {
    return {
      href: data.href,
      imageId,
      name: data.name,
    } as StaticHomeValue;
  }

  if (category === STATIC_HOME_CATEGORIES.COLLECTION) {
    return {
      collectionId: data.collectionId,
      direction: data.direction || STATIC_HOME_COLLECTION_DIRECTIONS.VERTICAL,
      href: data.href,
      imageId,
    } as StaticHomeValue;
  }

  return {
    href: data.href,
    imageId,
  } as StaticHomeValue;
};

export default function Banners() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingBanner, setEditingBanner] = useState<BannerFormData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingBanner, setDeletingBanner] = useState<BannerTableRow | null>(null);

  const { getAllCollections } = useCollections();

  const adminStaticHomeList = useAdminStaticHomeList();
  const createAdminStaticHomeMutation = useCreateAdminStaticHome();
  const updateAdminStaticHomeMutation = useUpdateAdminStaticHome();
  const deleteAdminStaticHomeMutation = useDeleteAdminStaticHome();
  const uploadAdminStaticContentImageMutation = useUploadAdminStaticContentImage();

  const allBanners = useMemo(() => {
    const items = adminStaticHomeList.data?.data ?? [];
    return items.map(mapItemToRow);
  }, [adminStaticHomeList.data?.data]);

  const parentCollectionOptions = useMemo(() => {
    return buildParentCollectionOptions(getAllCollections.data?.data ?? []);
  }, [getAllCollections.data?.data]);

  const filteredBanners = useMemo(() => {
    if (!searchQuery.trim()) return allBanners;

    const query = searchQuery.toLowerCase();
    return allBanners.filter(banner => {
      return (
        banner.category.toLowerCase().includes(query) ||
        banner.href.toLowerCase().includes(query) ||
        banner.imageUrl?.toLowerCase().includes(query) ||
        banner.name?.toLowerCase().includes(query) ||
        banner.collectionId?.toLowerCase().includes(query)
      );
    });
  }, [allBanners, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredBanners.length / ITEMS_PER_PAGE));

  const paginatedBanners = filteredBanners.slice(
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
    setEditingBanner(null);
    setShowFormModal(true);
  };

  const handleEdit = (banner: BannerTableRow) => {
    setFormMode('edit');
    setEditingBanner(mapRowToFormData(banner));
    setShowFormModal(true);
  };

  const handleDelete = (banner: BannerTableRow) => {
    setDeletingBanner(banner);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmAction = async () => {
    if (!deletingBanner?.id) return;

    await deleteAdminStaticHomeMutation.trigger({
      csrf: true,
      id: deletingBanner.id,
    });

    await adminStaticHomeList.mutate();

    setShowDeleteModal(false);
    setDeletingBanner(null);
  };

  const handleSubmitAction = async (data: BannerFormData) => {
    if (!data.imageFile) {
      return;
    }

    const uploadResponse = await uploadAdminStaticContentImageMutation.trigger({
      csrf: true,
      image: data.imageFile,
      path: BANNER_UPLOAD_PATH,
    });

    const imageId = uploadResponse?.data.key || '';
    const value = buildStaticHomeValueFromForm(data.category, data, imageId);

    if (formMode === 'create') {
      await createAdminStaticHomeMutation.trigger({
        category: data.category,
        csrf: true,
        value,
      });
    } else {
      if (!data.id) return;

      await updateAdminStaticHomeMutation.trigger({
        category: data.category,
        csrf: true,
        id: data.id,
        value,
      });
    }

    await adminStaticHomeList.mutate();
    setShowFormModal(false);
    setEditingBanner(null);
  };

  const columnDefs = useMemo(
    () =>
      getColumnDefs({
        currentPage,
        itemsPerPage: ITEMS_PER_PAGE,
        onDelete: handleDelete,
        onEdit: handleEdit,
      }),
    [currentPage],
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
                placeholder="Tìm theo category, href, image url..."
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
              Tạo banner
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
              loading={adminStaticHomeList.isLoading}
              rowData={paginatedBanners}
              rowHeight={62}
              headerHeight={43}
            />
          </div>
        </div>
      </div>

      <BannerFormModal
        collectionOptions={parentCollectionOptions}
        initialData={editingBanner}
        isOpen={showFormModal}
        isSubmitting={
          createAdminStaticHomeMutation.isMutating ||
          updateAdminStaticHomeMutation.isMutating ||
          uploadAdminStaticContentImageMutation.isMutating
        }
        mode={formMode}
        onCloseAction={() => {
          setShowFormModal(false);
          setEditingBanner(null);
        }}
        onSubmitAction={handleSubmitAction}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        itemName={deletingBanner?.href || ''}
        onCloseAction={() => {
          setShowDeleteModal(false);
          setDeletingBanner(null);
        }}
        onConfirmAction={handleDeleteConfirmAction}
      />
    </>
  );
}
