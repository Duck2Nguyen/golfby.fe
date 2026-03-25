'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  X,
  Eye,
  Tag,
  Plus,
  Save,
  Info,
  Layers,
  Package,
  ArrowLeft,
  ImageIcon,
  AlertCircle,
} from 'lucide-react';

import { useRouter } from 'next/navigation';

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

import VariantRow from '../VariantRow';
import {
  brandOptions,
  mockProducts,
  categoryOptions,
  type AdminProduct,
  type ProductVariant,
} from '../product-types';

const generateId = () => `V${Date.now()}${Math.random().toString(36).slice(2, 6)}`;

const emptyVariant = (): ProductVariant => ({
  id: generateId(),
  image: '',
  name: '',
  price: 0,
  size: '',
  sku: '',
  stock: 0,
  weight: 0,
});

const formatPrice = (price: number) => `${new Intl.NumberFormat('vi-VN').format(price)}₫`;

function FormSection({
  children,
  description,
  icon,
  title,
}: {
  children: React.ReactNode;
  description?: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">{icon}</div>
        <div>
          <h3 className="text-[1.5rem] font-600 text-foreground">{title}</h3>
          {description && <p className="mt-0.5 text-[1.2rem] text-muted-foreground">{description}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

interface ProductFormProps {
  productId?: string;
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(productId);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [status, setStatus] = useState<'active' | 'archived' | 'draft'>('draft');
  const [featured, setFeatured] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([emptyVariant()]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (!isEdit || !productId) return;

    const product = mockProducts.find(item => item.id === productId);
    if (!product) return;

    setName(product.name);
    setBrand(product.brand);
    setCategory(product.category);
    setDescription(product.description);
    setThumbnail(product.thumbnail);
    setImages(product.images);
    setStatus(product.status);
    setFeatured(product.featured);
    setVariants(product.variants.length > 0 ? product.variants : [emptyVariant()]);
  }, [isEdit, productId]);

  const variantStats = useMemo(() => {
    const totalStock = variants.reduce((sum, item) => sum + (item.stock || 0), 0);
    const prices = variants.filter(item => item.price > 0).map(item => item.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    return {
      count: variants.length,
      maxPrice,
      minPrice,
      totalStock,
    };
  }, [variants]);

  const selectClass =
    'h-10 w-full cursor-pointer appearance-none rounded-lg bg-input-background px-4 text-[1.4rem] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20';

  const selectStyle = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
    backgroundPosition: 'right 12px center',
    backgroundRepeat: 'no-repeat' as const,
  };

  const inputClass =
    'h-10 w-full rounded-lg bg-input-background px-4 text-[1.4rem] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20';

  const inputErrorClass = (field: string) => {
    if (!showErrors || !errors[field]) return '';
    return 'ring-2 ring-destructive/30 focus:ring-destructive/50';
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) nextErrors.name = 'Vui lòng nhập tên sản phẩm';
    if (!brand) nextErrors.brand = 'Vui lòng chọn thương hiệu';
    if (!category) nextErrors.category = 'Vui lòng chọn danh mục';

    let hasVariantError = false;

    variants.forEach((variant, index) => {
      if (!variant.name.trim()) {
        nextErrors[`variant_${variant.id}_name`] = `Phân loại ${index + 1}: Thiếu tên`;
        hasVariantError = true;
      }

      if (!variant.sku.trim()) {
        nextErrors[`variant_${variant.id}_sku`] = `Phân loại ${index + 1}: Thiếu SKU`;
        hasVariantError = true;
      }

      if (!variant.price || variant.price <= 0) {
        nextErrors[`variant_${variant.id}_price`] = `Phân loại ${index + 1}: Giá phải > 0`;
        hasVariantError = true;
      }
    });

    if (hasVariantError) {
      nextErrors.variants = 'Một số phân loại chưa đầy đủ thông tin';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleVariantChange = (
    variantId: string,
    field: keyof ProductVariant,
    value: number | string,
  ) => {
    setVariants(prev => prev.map(item => (item.id === variantId ? { ...item, [field]: value } : item)));
  };

  const handleVariantRemove = (variantId: string) => {
    setVariants(prev => prev.filter(item => item.id !== variantId));
  };

  const handleAddVariant = () => {
    setVariants(prev => [...prev, emptyVariant()]);
  };

  const handleAddImage = () => {
    const imageUrl = newImageUrl.trim();

    if (!imageUrl) return;

    setImages(prev => [...prev, imageUrl]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, imageIndex) => imageIndex !== index));
  };

  const handleSubmitAction = (submitStatus?: 'active' | 'draft') => {
    setShowErrors(true);

    const finalStatus = submitStatus || status;
    setStatus(finalStatus);

    if (!validate()) {
      window.scrollTo({ behavior: 'smooth', top: 0 });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const currentProduct = productId ? mockProducts.find(item => item.id === productId) : undefined;

    const payload: AdminProduct = {
      brand,
      category,
      createdAt: currentProduct?.createdAt || today,
      description,
      featured,
      id: productId || `P${Date.now()}`,
      images,
      name,
      status: finalStatus,
      thumbnail: thumbnail || variants[0]?.image || '',
      updatedAt: today,
      variants,
    };

    console.log('Saving product', payload);
    router.push('/admin/products');
  };

  return (
    <div className="space-y-6">
      <div className="mb-2 flex items-center justify-between gap-3">
        <button
          className="flex items-center gap-2 text-[1.4rem] text-muted-foreground transition-colors hover:text-foreground"
          onClick={() => router.push('/admin/products')}
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </button>

        <div className="flex items-center gap-2">
          <button
            className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-4 text-[1.3rem] font-500 text-foreground transition-colors hover:bg-muted"
            onClick={() => handleSubmitAction('draft')}
            type="button"
          >
            <Eye className="h-4 w-4" />
            Lưu nháp
          </button>
          <button
            className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-5 text-[1.3rem] font-500 text-white transition-colors hover:bg-primary-dark"
            onClick={() => handleSubmitAction('active')}
            type="button"
          >
            <Save className="h-4 w-4" />
            {isEdit ? 'Cập nhật' : 'Đăng bán'}
          </button>
        </div>
      </div>

      {showErrors && Object.keys(errors).length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="text-[1.4rem] font-600 text-destructive">Vui lòng kiểm tra lại thông tin</p>
            <ul className="mt-1 space-y-0.5">
              {Object.values(errors).map(error => (
                <li className="text-[1.3rem] text-destructive/80" key={error}>
                  • {error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <FormSection icon={<Info className="h-4 w-4 text-primary" />} title="Thông tin cơ bản">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[1.3rem] font-500 text-foreground">
                  Tên sản phẩm <span className="text-destructive">*</span>
                </label>
                <input
                  className={`${inputClass} ${inputErrorClass('name')}`}
                  onChange={event => setName(event.target.value)}
                  placeholder="VD: TaylorMade Qi35 Max Driver"
                  type="text"
                  value={name}
                />
                {showErrors && errors.name && <p className="mt-1 text-[1.2rem] text-destructive">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[1.3rem] font-500 text-foreground">
                    Thương hiệu <span className="text-destructive">*</span>
                  </label>
                  <select
                    className={`${selectClass} ${inputErrorClass('brand')}`}
                    onChange={event => setBrand(event.target.value)}
                    style={selectStyle}
                    value={brand}
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brandOptions.map(item => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  {showErrors && errors.brand && (
                    <p className="mt-1 text-[1.2rem] text-destructive">{errors.brand}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-[1.3rem] font-500 text-foreground">
                    Danh mục <span className="text-destructive">*</span>
                  </label>
                  <select
                    className={`${selectClass} ${inputErrorClass('category')}`}
                    onChange={event => setCategory(event.target.value)}
                    style={selectStyle}
                    value={category}
                  >
                    <option value="">Chọn danh mục</option>
                    {categoryOptions.map(item => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  {showErrors && errors.category && (
                    <p className="mt-1 text-[1.2rem] text-destructive">{errors.category}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[1.3rem] font-500 text-foreground">Mô tả sản phẩm</label>
                <textarea
                  className="w-full resize-none rounded-lg bg-input-background px-4 py-3 text-[1.4rem] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  onChange={event => setDescription(event.target.value)}
                  placeholder="Mô tả chi tiết về sản phẩm..."
                  rows={4}
                  value={description}
                />
              </div>
            </div>
          </FormSection>

          <FormSection
            description="Ảnh đại diện và gallery sản phẩm"
            icon={<ImageIcon className="h-4 w-4 text-primary" />}
            title="Hình ảnh sản phẩm"
          >
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[1.3rem] font-500 text-foreground">Ảnh đại diện (URL)</label>
                <div className="flex gap-3">
                  <input
                    className={`${inputClass} flex-1`}
                    onChange={event => setThumbnail(event.target.value)}
                    placeholder="https://..."
                    type="text"
                    value={thumbnail}
                  />
                  {thumbnail && (
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                      <ImageWithFallback alt="thumbnail" className="h-full w-full object-cover" src={thumbnail} />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[1.3rem] font-500 text-foreground">Ảnh gallery</label>
                <div className="mb-3 flex gap-2">
                  <input
                    className={`${inputClass} flex-1`}
                    onChange={event => setNewImageUrl(event.target.value)}
                    onKeyDown={event => {
                      if (event.key !== 'Enter') return;
                      event.preventDefault();
                      handleAddImage();
                    }}
                    placeholder="Dán URL ảnh rồi Enter hoặc nhấn Thêm"
                    type="text"
                    value={newImageUrl}
                  />
                  <button
                    className="h-10 shrink-0 rounded-lg border border-border px-4 text-[1.3rem] font-500 text-foreground transition-colors hover:bg-muted"
                    onClick={handleAddImage}
                    type="button"
                  >
                    Thêm
                  </button>
                </div>

                {images.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {images.map((image, index) => (
                      <div
                        className="group relative h-20 w-20 overflow-hidden rounded-lg border border-border bg-muted"
                        key={image}
                      >
                        <ImageWithFallback alt={`gallery-${index + 1}`} className="h-full w-full object-cover" src={image} />
                        <button
                          className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => handleRemoveImage(index)}
                          type="button"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-border text-[1.3rem] text-muted-foreground">
                    Chưa có ảnh gallery
                  </div>
                )}
              </div>
            </div>
          </FormSection>

          <FormSection
            description={`${variants.length} phân loại - Mỗi phân loại có giá, khối lượng, ảnh, kích cỡ riêng`}
            icon={<Layers className="h-4 w-4 text-primary" />}
            title="Phân loại sản phẩm"
          >
            <div className="space-y-3">
              {showErrors && errors.variants && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-[1.3rem] text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {errors.variants}
                </div>
              )}

              {variants.map((variant, index) => (
                <VariantRow
                  canRemove={variants.length > 1}
                  index={index}
                  key={variant.id}
                  onChangeAction={handleVariantChange}
                  onRemoveAction={handleVariantRemove}
                  variant={variant}
                />
              ))}

              <button
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 text-[1.3rem] font-500 text-primary transition-all hover:border-primary/50 hover:bg-primary-light"
                onClick={handleAddVariant}
                type="button"
              >
                <Plus className="h-4 w-4" />
                Thêm phân loại mới
              </button>
            </div>
          </FormSection>
        </div>

        <div className="space-y-6">
          <FormSection icon={<Tag className="h-4 w-4 text-primary" />} title="Trạng thái">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[1.3rem] font-500 text-foreground">Trạng thái sản phẩm</label>
                <select
                  className={selectClass}
                  onChange={event => setStatus(event.target.value as 'active' | 'archived' | 'draft')}
                  style={selectStyle}
                  value={status}
                >
                  <option value="draft">Bản nháp</option>
                  <option value="active">Đang bán</option>
                  <option value="archived">Lưu trữ</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[1.3rem] font-500 text-foreground">Sản phẩm nổi bật</p>
                  <p className="text-[1.2rem] text-muted-foreground">Hiển thị trên trang chủ</p>
                </div>

                <button
                  className={`relative h-6 w-11 rounded-full transition-colors ${featured ? 'bg-primary' : 'bg-switch-background'}`}
                  onClick={() => setFeatured(prev => !prev)}
                  type="button"
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${featured ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>
            </div>
          </FormSection>

          <FormSection icon={<Package className="h-4 w-4 text-primary" />} title="Tổng quan">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border py-2">
                <span className="text-[1.3rem] text-muted-foreground">Số phân loại</span>
                <span className="text-[1.4rem] font-600 text-foreground">{variantStats.count}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border py-2">
                <span className="text-[1.3rem] text-muted-foreground">Tổng tồn kho</span>
                <span
                  className={`text-[1.4rem] font-600 ${
                    variantStats.totalStock === 0
                      ? 'text-destructive'
                      : variantStats.totalStock < 10
                        ? 'text-amber-600'
                        : 'text-foreground'
                  }`}
                >
                  {variantStats.totalStock}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border py-2">
                <span className="text-[1.3rem] text-muted-foreground">Giá thấp nhất</span>
                <span className="text-[1.4rem] font-600 text-primary">
                  {variantStats.minPrice > 0 ? formatPrice(variantStats.minPrice) : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[1.3rem] text-muted-foreground">Giá cao nhất</span>
                <span className="text-[1.4rem] font-600 text-primary">
                  {variantStats.maxPrice > 0 ? formatPrice(variantStats.maxPrice) : '—'}
                </span>
              </div>
            </div>
          </FormSection>

          {thumbnail && (
            <div className="overflow-hidden rounded-xl border border-border bg-white">
              <div className="border-b border-border px-5 py-3">
                <h3 className="text-[1.4rem] font-600 text-foreground">Xem trước</h3>
              </div>
              <div className="p-4">
                <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-muted">
                  <ImageWithFallback alt="preview" className="h-full w-full object-cover" src={thumbnail} />
                </div>
                <p className="truncate text-[1.4rem] font-500 text-foreground">{name || 'Tên sản phẩm'}</p>
                <p className="mt-0.5 text-[1.2rem] text-primary">{brand || 'Thương hiệu'}</p>
                {variantStats.minPrice > 0 && (
                  <p className="mt-2 text-[1.6rem] font-700 text-primary">
                    {variantStats.minPrice === variantStats.maxPrice
                      ? formatPrice(variantStats.minPrice)
                      : `${formatPrice(variantStats.minPrice)} - ${formatPrice(variantStats.maxPrice)}`}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed right-0 bottom-0 left-0 z-30 flex items-center justify-end gap-2 border-t border-border bg-white p-4 xl:hidden">
        <button
          className="h-10 rounded-lg border border-border px-5 text-[1.4rem] font-500 text-foreground transition-colors hover:bg-muted"
          onClick={() => handleSubmitAction('draft')}
          type="button"
        >
          Lưu nháp
        </button>
        <button
          className="h-10 rounded-lg bg-primary px-6 text-[1.4rem] font-500 text-white transition-colors hover:bg-primary-dark"
          onClick={() => handleSubmitAction('active')}
          type="button"
        >
          {isEdit ? 'Cập nhật' : 'Đăng bán'}
        </button>
      </div>

      <div className="h-20 xl:h-0" />
    </div>
  );
}
