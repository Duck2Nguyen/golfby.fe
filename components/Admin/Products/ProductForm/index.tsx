'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import {
  Eye,
  Tag,
  Info,
  Save,
  Store,
  Package,
  Grid3x3,
  ArrowLeft,
  ImageIcon,
  FolderTree,
  AlertCircle,
} from 'lucide-react';

import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { useFormik, FormikProvider } from 'formik';

import type { ProductVariantItem } from '@/hooks/useVariants';
import type {
  AdminProductDetail,
  CreateAdminProductPayload,
  TriggerUpdateAdminProductPayload,
} from '@/hooks/admin/useAdminProduct';

import { toSlug } from '@/utils/common';

import { useAdminProduct, buildCreateProductMultipartPayload } from '@/hooks/admin/useAdminProduct';

import { Field } from '@/elements';

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

import BrandPicker from '../BrandPicker';
import CkEditorField from '../CkEditorField';
import CollectionPicker from '../CollectionPicker';
import MultiUploadImage from '../MultiUploadImage';
import ProductOptionManager from '../ProductOptionManager';
import ProductVariantsTable from '../ProductVariantsTable';
import { productTagOptions, type ProductOption } from '../product-types';
import MultiSelectDropdown, { type MultiSelectItem } from '../MultiSelectDropdown';

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
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          {icon}
        </div>
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

interface ProductFormValues {
  brand: string;
  description: string;
  featured: boolean;
  imageFiles: File[];
  images: string[];
  name: string;
  productOptions: ProductOption[];
  selectedBrandIds: string[];
  selectedCollections: string[];
  selectedTags: string[];
  status: 'active' | 'archived' | 'draft';
  thumbnail: string;
}

const buildValidationSchema = (isEdit: boolean) => {
  const baseOptionSchema = yup.object({
    name: yup.string().trim().required(),
    values: yup.array().of(yup.string().trim()).min(1).required(),
  });

  const createProductOptionsSchema = yup
    .array()
    .of(baseOptionSchema)
    .min(1, 'Vui lòng tạo ít nhất 1 option cho sản phẩm')
    .test('valid-product-options', 'Mỗi option cần có tên và ít nhất 1 value', value => {
      if (!value || value.length === 0) return false;

      return value.every(option => {
        const hasName = (option.name ?? '').trim().length > 0;
        const hasValues = (option.values ?? []).filter(Boolean).length > 0;

        return hasName && hasValues;
      });
    });

  return yup.object({
    name: yup.string().trim().required('Vui lòng nhập tên sản phẩm'),
    selectedBrandIds: isEdit
      ? yup.array().of(yup.string())
      : yup
          .array()
          .of(yup.string())
          .min(1, 'Vui lòng chọn thương hiệu')
          .required('Vui lòng chọn thương hiệu'),
    selectedCollections: isEdit
      ? yup.array().of(yup.string())
      : yup.array().of(yup.string()).min(1, 'Vui lòng chọn collection').required('Vui lòng chọn collection'),
    productOptions: isEdit ? yup.array().of(baseOptionSchema) : createProductOptionsSchema,
  });
};

const collectErrorMessages = (input: unknown): string[] => {
  if (!input) return [];
  if (typeof input === 'string') return [input];
  if (Array.isArray(input)) {
    return input.flatMap(item => collectErrorMessages(item));
  }
  if (typeof input === 'object') {
    return Object.values(input as Record<string, unknown>).flatMap(value => collectErrorMessages(value));
  }

  return [];
};

const toNumberOrZero = (value: unknown): number => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const mapStatusToForm = (status?: AdminProductDetail['status']): ProductFormValues['status'] => {
  if (status === 'ACTIVE') return 'active';
  if (status === 'ARCHIVED') return 'archived';
  return 'draft';
};

const mapDetailImages = (images?: AdminProductDetail['images']) => {
  const items = (images ?? [])
    .map(image => ({
      isPrimary: Boolean(image.isPrimary),
      url: image.url?.trim() ?? '',
    }))
    .filter(image => Boolean(image.url));

  if (items.length === 0) {
    return {
      images: [] as string[],
      thumbnail: '',
    };
  }

  const primaryIndex = items.findIndex(image => image.isPrimary);
  const thumbnailIndex = primaryIndex >= 0 ? primaryIndex : 0;

  return {
    images: items.filter((_, index) => index !== thumbnailIndex).map(image => image.url),
    thumbnail: items[thumbnailIndex]?.url ?? '',
  };
};

const mapDetailOptionsToForm = (options?: AdminProductDetail['options']): ProductOption[] => {
  return (options ?? []).map(option => ({
    id: option.id,
    name: option.name,
    values: (option.values ?? []).map(value => value.value).filter(Boolean),
  }));
};

const mapDetailVariantsToTableRows = (variants?: AdminProductDetail['variants']): ProductVariantItem[] => {
  return (variants ?? []).map(variant => ({
    barcode: variant.barcode ?? '',
    costPrice: toNumberOrZero(variant.costPrice),
    id: variant.id,
    listPrice: toNumberOrZero(variant.listPrice),
    salePrice: toNumberOrZero(variant.salePrice),
    sku: variant.sku ?? '',
    stock: toNumberOrZero(variant.stock),
    variantId: variant.id,
  }));
};

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(productId);
  const {
    createProductMutation,
    getAdminProductById,
    triggerUpdateAdminProduct,
    updateAdminProductMutation,
  } = useAdminProduct({
    detailProductId: isEdit ? productId : undefined,
  });
  const hasLoggedDetailRef = useRef(false);
  const submitStatusRef = useRef<'active' | 'draft'>('active');

  const [tags, setTags] = useState<MultiSelectItem[]>(productTagOptions);
  const detailProduct = getAdminProductById.data?.data;

  useEffect(() => {
    hasLoggedDetailRef.current = false;
  }, [productId]);

  useEffect(() => {
    if (!isEdit || hasLoggedDetailRef.current) return;

    if (!detailProduct) return;

    console.log('[Admin Products] Product detail response:', detailProduct);
    hasLoggedDetailRef.current = true;
  }, [detailProduct, isEdit]);

  const mergedTagItems = useMemo<MultiSelectItem[]>(() => {
    const tagMap = new Map<string, MultiSelectItem>();

    tags.forEach(item => {
      tagMap.set(item.id, item);
    });

    (detailProduct?.tags ?? []).forEach(tag => {
      if (!tagMap.has(tag.id)) {
        tagMap.set(tag.id, {
          id: tag.id,
          label: tag.name,
        });
      }
    });

    return Array.from(tagMap.values());
  }, [detailProduct?.tags, tags]);

  const detailVariantRows = useMemo<ProductVariantItem[]>(() => {
    if (!isEdit) {
      return [];
    }

    return mapDetailVariantsToTableRows(detailProduct?.variants);
  }, [detailProduct?.variants, isEdit]);

  const validationSchema = useMemo(() => buildValidationSchema(isEdit), [isEdit]);

  const initialValues = useMemo<ProductFormValues>(() => {
    if (!isEdit || !detailProduct) {
      return {
        brand: '',
        description: '',
        featured: false,
        imageFiles: [],
        images: [],
        name: '',
        productOptions: [],
        selectedBrandIds: [],
        selectedCollections: [],
        selectedTags: [],
        status: 'draft',
        thumbnail: '',
      };
    }

    const mappedImages = mapDetailImages(detailProduct.images);

    return {
      brand: detailProduct.brand?.name ?? '',
      description: detailProduct.description ?? '',
      featured: false,
      imageFiles: [],
      images: mappedImages.images,
      name: detailProduct.name ?? '',
      productOptions: mapDetailOptionsToForm(detailProduct.options),
      selectedBrandIds: detailProduct.brandId ? [detailProduct.brandId] : [],
      selectedCollections: detailProduct.categoryId ? [detailProduct.categoryId] : [],
      selectedTags: (detailProduct.tags ?? []).map(tag => tag.id),
      status: mapStatusToForm(detailProduct.status),
      thumbnail: mappedImages.thumbnail,
    };
  }, [detailProduct, isEdit]);

  const formik = useFormik<ProductFormValues>({
    enableReinitialize: true,
    initialValues,
    onSubmit: async values => {
      const finalStatus = submitStatusRef.current || values.status;
      const normalizedName = values.name.trim();
      const normalizedDescription = values.description.trim();

      try {
        if (isEdit && productId) {
          const updatePayload: TriggerUpdateAdminProductPayload = {
            brandId: values.selectedBrandIds[0] ?? null,
            categoryId: values.selectedCollections[0] ?? null,
            costPrice: detailProduct?.costPrice != null ? String(detailProduct.costPrice) : undefined,
            csrf: true,
            currency: detailProduct?.currency ?? 'VND',
            description: normalizedDescription || undefined,
            id: productId,
            listPrice: detailProduct?.listPrice != null ? String(detailProduct.listPrice) : undefined,
            name: normalizedName,
            salePrice: detailProduct?.salePrice != null ? String(detailProduct.salePrice) : undefined,
            slug: toSlug(normalizedName) || detailProduct?.slug || `product-${Date.now()}`,
            status: mapStatusToApi(finalStatus),
            subcategoryId: detailProduct?.subcategoryId ?? null,
            // TODO: add productTagIds / productTagsNew when BE update-tags contract is ready.
            // TODO: add productOptions when BE supports options update on PATCH product.
          };

          await triggerUpdateAdminProduct(updatePayload);
        } else {
          const productPayload: CreateAdminProductPayload = {
            brandId: values.selectedBrandIds[0],
            categoryId: values.selectedCollections[0],
            costPrice: '0',
            currency: 'VND',
            description: normalizedDescription || undefined,
            listPrice: '0',
            name: normalizedName,
            productOptions: values.productOptions
              .filter(option => option.name.trim() && option.values.filter(Boolean).length > 0)
              .map(option => ({
                name: option.name.trim(),
                values: option.values.filter(Boolean).map(value => ({
                  value,
                })),
              })),
            salePrice: '0',
            slug: toSlug(normalizedName) || `product-${Date.now()}`,
            status: mapStatusToApi(finalStatus),
          };

          const formData = buildCreateProductMultipartPayload(productPayload, values.imageFiles);
          await createProductMutation.trigger(formData);
        }

        router.push('/admin/products');
      } catch {
        return;
      }
    },
    validationSchema,
  });

  const productOptionStats = useMemo(() => {
    const optionCount = formik.values.productOptions.length;
    const totalValues = formik.values.productOptions.reduce(
      (sum, option) => sum + option.values.filter(Boolean).length,
      0,
    );
    const combinationCount =
      optionCount === 0
        ? 0
        : formik.values.productOptions.reduce((acc, option) => {
            const valueCount = option.values.filter(Boolean).length;

            return acc * Math.max(1, valueCount);
          }, 1);

    return {
      combinationCount,
      optionCount,
      totalValues,
    };
  }, [formik.values.productOptions]);

  const showErrors = formik.submitCount > 0;
  const errorMessages = useMemo(() => {
    const messages = collectErrorMessages(formik.errors);
    return Array.from(new Set(messages));
  }, [formik.errors]);

  const statusOptions = useMemo(
    () => [
      { label: 'Bản nháp', value: 'draft' },
      { label: 'Đang bán', value: 'active' },
      { label: 'Lưu trữ', value: 'archived' },
    ],
    [],
  );

  const createOption = (prefix: string, label: string): MultiSelectItem => ({
    id: `${prefix}${Date.now()}`,
    label,
  });

  const mapStatusToApi = (uiStatus: 'active' | 'archived' | 'draft'): 'ACTIVE' | 'ARCHIVED' | 'DRAFT' => {
    if (uiStatus === 'active') return 'ACTIVE';
    if (uiStatus === 'archived') return 'ARCHIVED';
    return 'DRAFT';
  };

  const isSubmitting = createProductMutation.isMutating || updateAdminProductMutation.isMutating;

  const handleSubmitAction = async (submitStatus?: 'active' | 'draft') => {
    const finalStatus = submitStatus || formik.values.status;
    submitStatusRef.current = finalStatus === 'draft' ? 'draft' : 'active';

    await formik.setFieldValue('status', finalStatus, false);
    const nextErrors = await formik.validateForm();

    if (Object.keys(nextErrors).length > 0) {
      await formik.setFieldTouched('name', true, false);
      await formik.setFieldTouched('selectedBrandIds', true, false);
      await formik.setFieldTouched('selectedCollections', true, false);
      await formik.setFieldTouched('productOptions', true, false);

      window.scrollTo({ behavior: 'smooth', top: 0 });
      return;
    }

    await formik.submitForm();
  };

  return (
    <FormikProvider value={formik}>
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
              disabled={isSubmitting}
              onClick={() => handleSubmitAction('draft')}
              type="button"
            >
              <Eye className="h-4 w-4" />
              Lưu nháp
            </button>
            <button
              className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-5 text-[1.3rem] font-500 text-white transition-colors hover:bg-primary-dark"
              disabled={isSubmitting}
              onClick={() => handleSubmitAction('active')}
              type="button"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Đăng bán'}
            </button>
          </div>
        </div>

        {showErrors && errorMessages.length > 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <p className="text-[1.4rem] font-600 text-destructive">Vui lòng kiểm tra lại thông tin</p>
              <ul className="mt-1 space-y-0.5">
                {errorMessages.map(error => (
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
                <Field.Text
                  label="Tên sản phẩm"
                  labelClassName="mb-1.5 block text-[1.3rem] font-500 text-foreground"
                  name="name"
                  placeholder="VD: TaylorMade Qi35 Max Driver"
                  required
                />

                <div>
                  <label className="mb-1.5 block text-[1.3rem] font-500 text-foreground">
                    Mô tả sản phẩm
                  </label>
                  <CkEditorField
                    onChangeAction={value => formik.setFieldValue('description', value)}
                    value={formik.values.description}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection
              description="Ảnh đại diện và gallery sản phẩm"
              icon={<ImageIcon className="h-4 w-4 text-primary" />}
              title="Hình ảnh sản phẩm"
            >
              <MultiUploadImage
                images={formik.values.images}
                onImageFilesChangeAction={files => formik.setFieldValue('imageFiles', files)}
                onImagesChangeAction={nextImages => formik.setFieldValue('images', nextImages)}
                onThumbnailChangeAction={nextThumbnail => formik.setFieldValue('thumbnail', nextThumbnail)}
                thumbnail={formik.values.thumbnail}
              />
            </FormSection>

            <FormSection
              description="Tùy chọn phân loại như Shaft, Flex, Độ Loft..."
              icon={<Grid3x3 className="h-4 w-4 text-primary" />}
              title="Phân loại"
            >
              <ProductOptionManager
                onChangeAction={nextOptions => formik.setFieldValue('productOptions', nextOptions)}
                productOptions={formik.values.productOptions}
              />
              {showErrors && formik.errors.productOptions && (
                <p className="mt-2 text-[1.2rem] text-destructive">
                  {collectErrorMessages(formik.errors.productOptions)[0]}
                </p>
              )}
            </FormSection>

            <FormSection
              description="Chỉnh sửa trực tiếp toàn bộ variants và áp dụng nhanh giá trị cho cả cột"
              icon={<Package className="h-4 w-4 text-primary" />}
              title="Variants"
            >
              <ProductVariantsTable
                productId={productId}
                variantsFromDetail={isEdit ? detailVariantRows : undefined}
              />
            </FormSection>
          </div>

          <div className="space-y-6">
            <FormSection
              description="Thẻ giúp phân loại và tìm kiếm sản phẩm dễ dàng hơn"
              icon={<Tag className="h-4 w-4 text-primary" />}
              title="Tags"
            >
              <MultiSelectDropdown
                allowMultiple
                items={mergedTagItems}
                label="Tags"
                onAddNewAction={label => {
                  const newTag = createOption('tag', label);
                  setTags(prev => [...prev, newTag]);
                  formik.setFieldValue('selectedTags', [...formik.values.selectedTags, newTag.id]);
                }}
                onSelectionChangeAction={ids => formik.setFieldValue('selectedTags', ids)}
                placeholder="Tìm kiếm tags..."
                selectedIds={formik.values.selectedTags}
                showAddNew
              />
            </FormSection>

            <FormSection
              description="Bộ sưu tập mà sản phẩm thuộc về"
              icon={<FolderTree className="h-4 w-4 text-primary" />}
              title="Danh mục"
            >
              <CollectionPicker
                onSelectAction={ids => formik.setFieldValue('selectedCollections', ids)}
                selectedCollectionIds={formik.values.selectedCollections}
              />
              {showErrors && formik.errors.selectedCollections && (
                <p className="mt-1 text-[1.2rem] text-destructive">
                  {collectErrorMessages(formik.errors.selectedCollections)[0]}
                </p>
              )}
            </FormSection>

            <FormSection
              description="Thương hiệu sản phẩm"
              icon={<Store className="h-4 w-4 text-primary" />}
              title="Thương hiệu"
            >
              <BrandPicker
                onSelectAction={ids => formik.setFieldValue('selectedBrandIds', ids)}
                selectedBrandIds={formik.values.selectedBrandIds}
              />
              {showErrors && formik.errors.selectedBrandIds && (
                <p className="mt-1 text-[1.2rem] text-destructive">
                  {collectErrorMessages(formik.errors.selectedBrandIds)[0]}
                </p>
              )}
            </FormSection>

            <FormSection icon={<Tag className="h-4 w-4 text-primary" />} title="Trạng thái">
              <div className="space-y-4">
                <Field.Select label="Trạng thái sản phẩm" name="status" options={statusOptions} />

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-[1.3rem] font-500 text-foreground">Sản phẩm nổi bật</p>
                    <p className="text-[1.2rem] text-muted-foreground">Hiển thị trên trang chủ</p>
                  </div>

                  <button
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      formik.values.featured ? 'bg-primary' : 'bg-switch-background'
                    }`}
                    onClick={() => formik.setFieldValue('featured', !formik.values.featured)}
                    type="button"
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                        formik.values.featured ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </FormSection>

            <FormSection icon={<Package className="h-4 w-4 text-primary" />} title="Tổng quan">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border py-2">
                  <span className="text-[1.3rem] text-muted-foreground">Số option</span>
                  <span className="text-[1.4rem] font-600 text-foreground">
                    {productOptionStats.optionCount}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border py-2">
                  <span className="text-[1.3rem] text-muted-foreground">Tổng số value</span>
                  <span className="text-[1.4rem] font-600 text-foreground">
                    {productOptionStats.totalValues}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[1.3rem] text-muted-foreground">Số tổ hợp dự kiến</span>
                  <span className="text-[1.4rem] font-600 text-primary">
                    {productOptionStats.combinationCount}
                  </span>
                </div>
              </div>
            </FormSection>

            {formik.values.thumbnail && (
              <div className="overflow-hidden rounded-xl border border-border bg-white">
                <div className="border-b border-border px-5 py-3">
                  <h3 className="text-[1.4rem] font-600 text-foreground">Xem trước</h3>
                </div>
                <div className="p-4">
                  <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-muted">
                    <ImageWithFallback
                      alt="preview"
                      className="h-full w-full object-cover"
                      src={formik.values.thumbnail}
                    />
                  </div>
                  <p className="truncate text-[1.4rem] font-500 text-foreground">
                    {formik.values.name || 'Tên sản phẩm'}
                  </p>
                  <p className="mt-0.5 text-[1.2rem] text-primary">{formik.values.brand || 'Thương hiệu'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="fixed right-0 bottom-0 left-0 z-30 flex items-center justify-end gap-2 border-t border-border bg-white p-4 xl:hidden">
          <button
            className="h-10 rounded-lg border border-border px-5 text-[1.4rem] font-500 text-foreground transition-colors hover:bg-muted"
            disabled={isSubmitting}
            onClick={() => handleSubmitAction('draft')}
            type="button"
          >
            Lưu nháp
          </button>
          <button
            className="h-10 rounded-lg bg-primary px-6 text-[1.4rem] font-500 text-white transition-colors hover:bg-primary-dark"
            disabled={isSubmitting}
            onClick={() => handleSubmitAction('active')}
            type="button"
          >
            {isSubmitting ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Đăng bán'}
          </button>
        </div>

        <div className="h-20 xl:h-0" />
      </div>
    </FormikProvider>
  );
}
