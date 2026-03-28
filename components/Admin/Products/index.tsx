'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  Eye,
  Plus,
  Star,
  Pencil,
  Search,
  Trash2,
  Archive,
  Package,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { Link } from '@heroui/link';
import { useRouter } from 'next/navigation';

import { useBrands } from '@/hooks/useBrands';
import { useCategorires } from '@/hooks/useCategorires';
import { useAdminProduct, type AdminProductListItem } from '@/hooks/admin/useAdminProduct';

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import DeleteConfirmModal from '@/components/Admin/Customers/DeleteConfirmModal';

const PAGE_SIZE_OPTIONS = [6, 10, 20, 50] as const;

type UiProductStatus = 'active' | 'archived' | 'draft';

interface ProductTableRow {
  brand: string;
  category: string;
  featured: boolean;
  id: string;
  name: string;
  priceRange: string;
  productOptionsCount: number;
  status: UiProductStatus;
  thumbnail: string;
  totalStock: number;
}

const mapApiStatusToUi = (status?: string): UiProductStatus => {
  if (status === 'ACTIVE') return 'active';
  if (status === 'ARCHIVED') return 'archived';
  return 'draft';
};

const mapUiStatusToApi = (status: 'ALL' | UiProductStatus): 'ACTIVE' | 'ARCHIVED' | 'DRAFT' | undefined => {
  if (status === 'ALL') return undefined;
  if (status === 'active') return 'ACTIVE';
  if (status === 'archived') return 'ARCHIVED';
  return 'DRAFT';
};

const toNumber = (value: number | string | null | undefined) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getProductThumbnail = (images?: AdminProductListItem['images']) => {
  if (!images || images.length === 0) return '';
  return images.find(image => image.isPrimary)?.url || images[0]?.url || '';
};

const getProductPriceRange = (item: AdminProductListItem) => {
  const listPrice = toNumber(item.listPrice);
  const salePrice = toNumber(item.salePrice);
  const minPrice = Math.min(...[listPrice, salePrice].filter(price => price > 0));
  const maxPrice = Math.max(...[listPrice, salePrice].filter(price => price > 0));

  if (!Number.isFinite(minPrice) || minPrice <= 0) return '—';
  if (!Number.isFinite(maxPrice) || maxPrice <= 0) return formatPrice(minPrice);
  if (minPrice === maxPrice) return formatPrice(minPrice);

  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
};

const formatPrice = (price: number) => `${new Intl.NumberFormat('vi-VN').format(price)}₫`;

const statusConfig: Record<UiProductStatus, { className: string; dotClassName: string; label: string }> = {
  active: {
    className: 'bg-green-50 text-green-700',
    dotClassName: 'bg-green-500',
    label: 'Đang bán',
  },
  archived: {
    className: 'bg-gray-100 text-gray-600',
    dotClassName: 'bg-gray-400',
    label: 'Lưu trữ',
  },
  draft: {
    className: 'bg-amber-50 text-amber-700',
    dotClassName: 'bg-amber-500',
    label: 'Nháp',
  },
};

export default function Products() {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | UiProductStatus>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(10);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<ProductTableRow | null>(null);

  const { getAllBrands } = useBrands();
  const { getAllCategories } = useCategorires();

  const listParams = useMemo(
    () => ({
      ...(brandFilter !== 'ALL' ? { brandId: brandFilter } : {}),
      ...(categoryFilter !== 'ALL' ? { categoryId: categoryFilter } : {}),
      ...(searchQuery ? { search: searchQuery } : {}),
      ...(mapUiStatusToApi(statusFilter) ? { status: mapUiStatusToApi(statusFilter) } : {}),
      page: currentPage,
      size: pageSize,
    }),
    [brandFilter, categoryFilter, currentPage, pageSize, searchQuery, statusFilter],
  );

  const { deleteAdminProductMutation, getAllAdminProduct } = useAdminProduct({
    getAllParams: listParams,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const apiProducts = getAllAdminProduct.data?.data?.items ?? [];
  const totalCount = getAllAdminProduct.data?.data?.totalCount ?? 0;

  const products = useMemo<ProductTableRow[]>(() => {
    return apiProducts.map(item => {
      return {
        brand: item.brand?.name || '—',
        category: item.category?.name || '—',
        featured: false,
        id: item.id,
        name: item.name,
        priceRange: getProductPriceRange(item),
        productOptionsCount: item.productOptions?.length ?? 0,
        status: mapApiStatusToUi(item.status),
        thumbnail: getProductThumbnail(item.images),
        totalStock: 0,
      };
    });
  }, [apiProducts]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const stats = useMemo(() => {
    const active = products.filter(product => product.status === 'active').length;
    const draft = products.filter(product => product.status === 'draft').length;
    const totalStock = products.reduce((sum, product) => sum + product.totalStock, 0);

    return {
      active,
      draft,
      total: totalCount,
      totalStock,
    };
  }, [products, totalCount]);

  const pageNumbers = useMemo(() => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  }, [currentPage, totalPages]);

  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  const selectClass =
    'h-9 cursor-pointer appearance-none rounded-lg bg-muted px-3 pr-8 text-[1.3rem] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20';

  const selectStyle = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
    backgroundPosition: 'right 8px center',
    backgroundRepeat: 'no-repeat' as const,
  };

  const handleDelete = (product: ProductTableRow) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmAction = async () => {
    if (deletingProduct) {
      await deleteAdminProductMutation.trigger({
        csrf: true,
        id: deletingProduct.id,
      });

      await getAllAdminProduct.mutate();
    }

    setShowDeleteModal(false);
    setDeletingProduct(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[1.3rem] text-muted-foreground">Tổng sản phẩm</p>
                <p className="text-[2.4rem] font-700 text-foreground">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-[1.3rem] text-muted-foreground">Đang bán</p>
                <p className="text-[2.4rem] font-700 text-green-600">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <Archive className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-[1.3rem] text-muted-foreground">Bản nháp</p>
                <p className="text-[2.4rem] font-700 text-amber-600">{stats.draft}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-[1.3rem] text-muted-foreground">Tổng tồn kho</p>
                <p className="text-[2.4rem] font-700 text-purple-600">{stats.totalStock}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <div className="border-b border-border px-5 py-4">
            <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
              <div className="flex flex-1 flex-wrap items-center gap-3">
                <div className="relative min-w-[20rem] max-w-[32rem] flex-1">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    className="h-9 w-full rounded-lg bg-muted py-0 pr-4 pl-9 text-[1.3rem] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    onChange={event => {
                      setSearchInput(event.target.value);
                    }}
                    placeholder="Tìm tên, mã SP, SKU..."
                    type="text"
                    value={searchInput}
                  />
                </div>

                <select
                  className={selectClass}
                  onChange={event => {
                    setCategoryFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  style={selectStyle}
                  value={categoryFilter}
                >
                  <option value="ALL">Tất cả danh mục</option>
                  {(getAllCategories.data?.data ?? []).map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>

                <select
                  className={`${selectClass} hidden sm:block`}
                  onChange={event => {
                    setBrandFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  style={selectStyle}
                  value={brandFilter}
                >
                  <option value="ALL">Tất cả thương hiệu</option>
                  {(getAllBrands.data?.data ?? []).map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>

                <select
                  className={`${selectClass} hidden md:block`}
                  onChange={event => {
                    setStatusFilter(event.target.value as 'ALL' | 'active' | 'archived' | 'draft');
                    setCurrentPage(1);
                  }}
                  style={selectStyle}
                  value={statusFilter}
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="active">Đang bán</option>
                  <option value="draft">Nháp</option>
                  <option value="archived">Lưu trữ</option>
                </select>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-[1.3rem] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  type="button"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Xuất Excel</span>
                </button>

                <select
                  className={selectClass}
                  onChange={event => {
                    const nextSize = Number(event.target.value) as (typeof PAGE_SIZE_OPTIONS)[number];
                    setPageSize(nextSize);
                    setCurrentPage(1);
                  }}
                  style={selectStyle}
                  value={pageSize}
                >
                  {PAGE_SIZE_OPTIONS.map(option => (
                    <option key={option} value={option}>
                      {option} / trang
                    </option>
                  ))}
                </select>

                <Link
                  className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-[1.3rem] font-500 text-white transition-colors hover:bg-primary-dark"
                  href="/admin/products/create"
                >
                  <Plus className="h-4 w-4" />
                  Thêm sản phẩm
                </Link>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="min-w-[25rem] px-5 py-3 text-left text-[1.2rem] font-600 tracking-wider text-muted-foreground">
                    SẢN PHẨM
                  </th>
                  <th className="hidden min-w-[12rem] px-5 py-3 text-left text-[1.2rem] font-600 tracking-wider text-muted-foreground md:table-cell">
                    DANH MỤC
                  </th>
                  <th className="min-w-[12rem] px-5 py-3 text-left text-[1.2rem] font-600 tracking-wider text-muted-foreground">
                    GIÁ
                  </th>
                  <th className="hidden min-w-[10rem] px-5 py-3 text-center text-[1.2rem] font-600 tracking-wider text-muted-foreground sm:table-cell">
                    PHÂN LOẠI
                  </th>
                  <th className="hidden min-w-[10rem] px-5 py-3 text-center text-[1.2rem] font-600 tracking-wider text-muted-foreground lg:table-cell">
                    TỒN KHO
                  </th>
                  <th className="min-w-[12rem] px-5 py-3 text-left text-[1.2rem] font-600 tracking-wider text-muted-foreground">
                    TRẠNG THÁI
                  </th>
                  <th className="min-w-[14rem] px-5 py-3 text-right text-[1.2rem] font-600 tracking-wider text-muted-foreground">
                    THAO TÁC
                  </th>
                </tr>
              </thead>
              <tbody>
                {getAllAdminProduct.isLoading ? (
                  <tr>
                    <td className="py-16 text-center text-[1.4rem] text-muted-foreground" colSpan={7}>
                      Đang tải dữ liệu sản phẩm...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td className="py-16 text-center text-[1.4rem] text-muted-foreground" colSpan={7}>
                      <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                      Không tìm thấy sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  products.map(product => {
                    const status = statusConfig[product.status];
                    const totalStock = product.totalStock;

                    return (
                      <tr
                        className="border-t border-border transition-colors hover:bg-muted/30"
                        key={product.id}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                              <ImageWithFallback
                                alt={product.name}
                                className="h-full w-full object-cover"
                                src={product.thumbnail}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="max-w-[22rem] truncate text-[1.4rem] font-500 text-foreground">
                                {product.name}
                              </p>
                              <div className="mt-0.5 flex items-center gap-2">
                                <span className="text-[1.1rem] text-muted-foreground">{product.id}</span>
                                <span className="text-[1.1rem] text-muted-foreground">•</span>
                                <span className="text-[1.1rem] font-500 text-primary">{product.brand}</span>
                                {product.featured && (
                                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="hidden px-5 py-3.5 md:table-cell">
                          <span className="text-[1.3rem] text-muted-foreground">{product.category}</span>
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="text-[1.3rem] font-500 text-foreground">{product.priceRange}</span>
                        </td>

                        <td className="hidden px-5 py-3.5 text-center sm:table-cell">
                          <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-2.5 py-1 text-[1.2rem] font-500 text-blue-700">
                            {product.productOptionsCount} loại
                          </span>
                        </td>

                        <td className="hidden px-5 py-3.5 text-center lg:table-cell">
                          <span
                            className={`text-[1.3rem] font-500 ${
                              totalStock === 0
                                ? 'text-destructive'
                                : totalStock < 10
                                  ? 'text-amber-600'
                                  : 'text-foreground'
                            }`}
                          >
                            {totalStock}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[1.2rem] font-500 ${status.className}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${status.dotClassName}`} />
                            {status.label}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary-light hover:text-primary"
                              onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                              title="Sửa"
                              type="button"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive"
                              onClick={() => handleDelete(product)}
                              title="Xóa"
                              type="button"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-5 py-4">
              <p className="text-[1.3rem] text-muted-foreground">
                Hiển thị <span className="font-500 text-foreground">{startItem}</span>
                {' - '}
                <span className="font-500 text-foreground">{endItem}</span>
                {' / '}
                {totalCount} sản phẩm
              </p>

              <div className="flex items-center gap-1">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {pageNumbers.map(page => (
                  <button
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-[1.3rem] transition-colors ${
                      currentPage === page
                        ? 'bg-primary font-500 text-white'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    type="button"
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
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

      <DeleteConfirmModal
        confirmLabel="Xóa sản phẩm"
        isOpen={showDeleteModal}
        itemName={deletingProduct?.name}
        onCloseAction={() => {
          setShowDeleteModal(false);
          setDeletingProduct(null);
        }}
        onConfirmAction={handleDeleteConfirmAction}
        title="Xác nhận xóa sản phẩm"
      />
    </>
  );
}
