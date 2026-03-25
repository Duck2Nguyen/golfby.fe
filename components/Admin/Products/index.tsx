'use client';

import { useMemo, useState } from 'react';
import {
  Eye,
  Copy,
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

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import DeleteConfirmModal from '@/components/Admin/Customers/DeleteConfirmModal';

import { brandOptions, mockProducts, categoryOptions, type AdminProduct } from './product-types';

const ITEMS_PER_PAGE = 6;

const formatPrice = (price: number) => `${new Intl.NumberFormat('vi-VN').format(price)}₫`;

const statusConfig: Record<
  AdminProduct['status'],
  { className: string; dotClassName: string; label: string }
> = {
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
  const [products, setProducts] = useState<AdminProduct[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'active' | 'archived' | 'draft'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<AdminProduct | null>(null);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.id.toLowerCase().includes(query) ||
          product.variants.some(variant => variant.sku.toLowerCase().includes(query)),
      );
    }

    if (categoryFilter !== 'ALL') {
      result = result.filter(product => product.category === categoryFilter);
    }

    if (brandFilter !== 'ALL') {
      result = result.filter(product => product.brand === brandFilter);
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(product => product.status === statusFilter);
    }

    return result;
  }, [products, searchQuery, categoryFilter, brandFilter, statusFilter]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter(product => product.status === 'active').length;
    const draft = products.filter(product => product.status === 'draft').length;
    const totalStock = products.reduce(
      (sum, product) => sum + product.variants.reduce((variantSum, variant) => variantSum + variant.stock, 0),
      0,
    );

    return {
      active,
      draft,
      total,
      totalStock,
    };
  }, [products]);

  const getPriceRange = (product: AdminProduct) => {
    if (product.variants.length === 0) return '—';

    const prices = product.variants.map(variant => variant.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    if (min === max) return formatPrice(min);

    return `${formatPrice(min)} - ${formatPrice(max)}`;
  };

  const getTotalStock = (product: AdminProduct) =>
    product.variants.reduce((sum, variant) => sum + variant.stock, 0);

  const selectClass =
    'h-9 cursor-pointer appearance-none rounded-lg bg-muted px-3 pr-8 text-[1.3rem] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20';

  const selectStyle = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
    backgroundPosition: 'right 8px center',
    backgroundRepeat: 'no-repeat' as const,
  };

  const handleDelete = (product: AdminProduct) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmAction = () => {
    if (deletingProduct) {
      setProducts(prev => prev.filter(product => product.id !== deletingProduct.id));
    }

    setShowDeleteModal(false);
    setDeletingProduct(null);
  };

  const handleDuplicate = (product: AdminProduct) => {
    const now = Date.now();
    const date = new Date().toISOString().split('T')[0];

    const clonedProduct: AdminProduct = {
      ...product,
      createdAt: date,
      id: `P${now}`,
      name: `${product.name} (Copy)`,
      status: 'draft',
      updatedAt: date,
      variants: product.variants.map(variant => ({
        ...variant,
        id: `V${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
      })),
    };

    setProducts(prev => [clonedProduct, ...prev]);
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
                      setSearchQuery(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Tìm tên, mã SP, SKU..."
                    type="text"
                    value={searchQuery}
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
                  {categoryOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
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
                  {brandOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
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
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td className="py-16 text-center text-[1.4rem] text-muted-foreground" colSpan={7}>
                      <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                      Không tìm thấy sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map(product => {
                    const status = statusConfig[product.status];
                    const totalStock = getTotalStock(product);

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
                          <span className="text-[1.3rem] font-500 text-foreground">
                            {getPriceRange(product)}
                          </span>
                        </td>

                        <td className="hidden px-5 py-3.5 text-center sm:table-cell">
                          <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-2.5 py-1 text-[1.2rem] font-500 text-blue-700">
                            {product.variants.length} loại
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
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-blue-50 hover:text-blue-600"
                              onClick={() => handleDuplicate(product)}
                              title="Nhân bản"
                              type="button"
                            >
                              <Copy className="h-4 w-4" />
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
                Hiển thị{' '}
                <span className="font-500 text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>
                {' - '}
                <span className="font-500 text-foreground">
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}
                </span>
                {' / '}
                {filteredProducts.length} sản phẩm
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

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
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
