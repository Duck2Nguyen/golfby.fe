'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import {
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
import { addToast } from '@heroui/toast';
import { useRouter } from 'next/navigation';
import { useFormik, FormikProvider } from 'formik';

import type { ProductVariantItem } from '@/hooks/useVariants';
import type {
  AdminProductDetail,
  AdminProductOptionPayload,
  CreateAdminProductPayload,
  AdminProductOptionUpdatePayload,
  TriggerUpdateAdminProductPayload,
} from '@/hooks/admin/useAdminProduct';

import { toSlug } from '@/utils/common';

import { useAdminProduct, buildCreateProductMultipartPayload } from '@/hooks/admin/useAdminProduct';
import {
  useAdminCustomOptionGroupsByProduct,
  useAssignAdminCustomOptionGroupToProduct,
  useUnassignAdminCustomOptionGroupFromProduct,
} from '@/hooks/admin/useAdminCustomOptions';

import { Field } from '@/elements';

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

import TagPicker from '../TagPicker';
import BrandPicker from '../BrandPicker';
import CkEditorField from '../CkEditorField';
import CollectionPicker from '../CollectionPicker';
import MultiUploadImage from '../MultiUploadImage';
import ProductOptionManager from '../ProductOptionManager';
import ProductVariantsTable from '../ProductVariantsTable';
import CustomOptionGroupPicker from '../CustomOptionGroupPicker';

import type { ProductOptionForm } from '../product-types';

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
  productOptions: ProductOptionForm[];
  selectedBrandIds: string[];
  selectedCollections: string[];
  selectedTags: string[];
  status: 'active' | 'archived' | 'draft';
  thumbnail: string;
}

const buildValidationSchema = (isEdit: boolean) => {
  const baseOptionValueSchema = yup.object({
    clientId: yup.string().required(),
    id: yup.string().optional(),
    value: yup.string().trim().required(),
  });

  const baseOptionSchema = yup.object({
    id: yup.string().required(),
    name: yup.string().trim().required(),
    values: yup.array().of(baseOptionValueSchema).min(1).required(),
  });

  const createProductOptionsSchema = yup
    .array()
    .of(baseOptionSchema)
    .min(1, 'Vui lòng tạo ít nhất 1 option cho sản phẩm')
    .test('valid-product-options', 'Mỗi option cần có tên và ít nhất 1 value', value => {
      if (!value || value.length === 0) return false;

      return value.every(option => {
        const hasName = (option.name ?? '').trim().length > 0;
        const hasValues =
          (option.values ?? []).filter(optionValue => (optionValue?.value ?? '').trim().length > 0).length >
          0;

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
    // Temporarily allow submit without selecting collection.
    selectedCollections: yup.array().of(yup.string()),
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

const mapDetailOptionsToForm = (options?: AdminProductDetail['options']): ProductOptionForm[] => {
  return (options ?? []).map(option => ({
    id: option.id,
    name: option.name,
    values: (option.values ?? [])
      .map(value => ({
        clientId: value.id,
        id: value.id,
        value: value.value,
      }))
      .filter(value => Boolean(value.value?.trim())),
  }));
};

interface ProductOptionPatchPayload {
  productOptionsDelete: string[];
  productOptionsNew: AdminProductOptionPayload[];
  productOptionsUpdate: AdminProductOptionUpdatePayload[];
}

const buildProductOptionsPatchPayload = (
  currentOptions: ProductOptionForm[],
  originalOptions?: AdminProductDetail['options'],
): ProductOptionPatchPayload => {
  const productOptionsDelete: string[] = [];
  const productOptionsNew: AdminProductOptionPayload[] = [];
  const productOptionsUpdate: AdminProductOptionUpdatePayload[] = [];

  const originalList = originalOptions ?? [];
  const originalById = new Map(originalList.map(option => [option.id, option]));
  const currentOptionIds = new Set(currentOptions.map(option => option.id));

  for (const originalOption of originalList) {
    if (!currentOptionIds.has(originalOption.id)) {
      productOptionsDelete.push(originalOption.id);
    }
  }

  for (const option of currentOptions) {
    const normalizedName = option.name.trim();
    const normalizedValues = option.values
      .map(value => ({
        id: value.id,
        value: value.value.trim(),
      }))
      .filter(value => Boolean(value.value));

    if (!normalizedName || normalizedValues.length === 0) {
      continue;
    }

    const original = originalById.get(option.id);
    if (!original) {
      productOptionsNew.push({
        name: normalizedName,
        values: normalizedValues.map(value => ({
          value: value.value,
        })),
      });

      continue;
    }

    const originalValueById = new Map((original.values ?? []).map(value => [value.id, value.value]));
    const currentValueIds = new Set(
      normalizedValues.map(value => value.id).filter((id): id is string => Boolean(id)),
    );
    const removedValueIds = (original.values ?? [])
      .filter(value => !currentValueIds.has(value.id))
      .map(value => value.id);

    const changedOrAddedValues = normalizedValues.reduce<
      NonNullable<AdminProductOptionUpdatePayload['values']>
    >((accumulator, value) => {
      if (!value.id) {
        accumulator.push({ value: value.value });
        return accumulator;
      }

      const originalValue = originalValueById.get(value.id);
      if (originalValue === undefined || originalValue !== value.value) {
        accumulator.push({
          id: value.id,
          value: value.value,
        });
      }

      return accumulator;
    }, []);

    const optionPatch: AdminProductOptionUpdatePayload = {
      optionId: original.id,
    };

    if (normalizedName !== original.name.trim()) {
      optionPatch.name = normalizedName;
    }
    if (changedOrAddedValues.length > 0) {
      optionPatch.values = changedOrAddedValues;
    }
    if (removedValueIds.length > 0) {
      optionPatch.removedValueIds = removedValueIds;
    }

    if (optionPatch.name || optionPatch.values || optionPatch.removedValueIds) {
      productOptionsUpdate.push(optionPatch);
    }
  }

  return {
    productOptionsDelete,
    productOptionsNew,
    productOptionsUpdate,
  };
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
    removeProductImageMutation,
    triggerRemoveProductImage,
    triggerUploadProductImage,
    triggerUpdateAdminProduct,
    updateAdminProductMutation,
  } = useAdminProduct({
    detailProductId: isEdit ? productId : undefined,
  });
  const hasLoggedDetailRef = useRef(false);
  const hasSyncedInitialAssignedGroupRef = useRef(false);

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isUpdatingCustomOptionGroup, setIsUpdatingCustomOptionGroup] = useState(false);
  const [selectedCustomOptionGroupId, setSelectedCustomOptionGroupId] = useState('');
  const detailProduct = getAdminProductById.data?.data;
  const assignedCustomOptionGroups = useAdminCustomOptionGroupsByProduct(productId, isEdit);
  const assignCustomOptionGroupToProductMutation = useAssignAdminCustomOptionGroupToProduct();
  const unassignCustomOptionGroupFromProductMutation = useUnassignAdminCustomOptionGroupFromProduct();

  useEffect(() => {
    hasLoggedDetailRef.current = false;
    hasSyncedInitialAssignedGroupRef.current = false;
    setSelectedCustomOptionGroupId('');
  }, [productId]);

  useEffect(() => {
    if (!isEdit || hasSyncedInitialAssignedGroupRef.current) return;

    if (!assignedCustomOptionGroups.data) return;

    const assignedGroupList = assignedCustomOptionGroups.data.data ?? [];
    setSelectedCustomOptionGroupId(assignedGroupList[0]?.customOptionGroupId ?? '');
    hasSyncedInitialAssignedGroupRef.current = true;
  }, [assignedCustomOptionGroups.data, isEdit]);

  useEffect(() => {
    if (!isEdit || hasLoggedDetailRef.current) return;

    if (!detailProduct) return;

    console.log('[Admin Products] Product detail response:', detailProduct);
    hasLoggedDetailRef.current = true;
  }, [detailProduct, isEdit]);

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
      const finalStatus = values.status;
      const normalizedName = values.name.trim();
      const normalizedDescription = values.description.trim();

      try {
        if (isEdit && productId) {
          const optionPatch = buildProductOptionsPatchPayload(values.productOptions, detailProduct?.options);
          const hasOptionPatch =
            optionPatch.productOptionsDelete.length > 0 ||
            optionPatch.productOptionsNew.length > 0 ||
            optionPatch.productOptionsUpdate.length > 0;

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
            productTagIds: values.selectedTags,
            salePrice: detailProduct?.salePrice != null ? String(detailProduct.salePrice) : undefined,
            slug: toSlug(normalizedName) || detailProduct?.slug || `product-${Date.now()}`,
            status: mapStatusToApi(finalStatus),
            subcategoryId: detailProduct?.subcategoryId ?? null,
            // TODO: add productTagsNew when BE update-tags contract is ready.
            ...(hasOptionPatch
              ? {
                  productOptionsDelete: optionPatch.productOptionsDelete,
                  productOptionsNew: optionPatch.productOptionsNew,
                  productOptionsUpdate: optionPatch.productOptionsUpdate,
                }
              : {}),
          };

          await triggerUpdateAdminProduct(updatePayload);

          // Refresh latest detail after update and keep user on edit page.
          await getAdminProductById.mutate();

          return;
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
              .map(option => ({
                name: option.name.trim(),
                values: option.values
                  .map(value => value.value.trim())
                  .filter(Boolean)
                  .map(value => ({
                    value,
                  })),
              }))
              .filter(option => option.name && option.values.length > 0),
            productTagIds: values.selectedTags,
            salePrice: '0',
            slug: toSlug(normalizedName) || `product-${Date.now()}`,
            status: mapStatusToApi(finalStatus),
          };

          const formData = buildCreateProductMultipartPayload(productPayload, values.imageFiles);
          const createdProductResponse = await createProductMutation.trigger(formData);
          const createdProductId = createdProductResponse?.data?.id;

          if (createdProductId) {
            if (selectedCustomOptionGroupId) {
              await assignCustomOptionGroupToProductMutation.trigger({
                csrf: true,
                customOptionGroupId: selectedCustomOptionGroupId,
                productId: createdProductId,
                sortOrder: 0,
              });
            }

            router.push(`/admin/products/edit/${createdProductId}`);

            return;
          }

          router.push('/admin/products');

          return;
        }
      } catch (error) {
        console.error('[Admin Products][ProductForm] Submit failed:', error);
        return;
      }
    },
    validationSchema,
  });

  const productOptionStats = useMemo(() => {
    const optionCount = formik.values.productOptions.length;
    const totalValues = formik.values.productOptions.reduce(
      (sum, option) => sum + option.values.filter(value => Boolean(value.value.trim())).length,
      0,
    );
    const combinationCount =
      optionCount === 0
        ? 0
        : formik.values.productOptions.reduce((acc, option) => {
            const valueCount = option.values.filter(value => Boolean(value.value.trim())).length;

            return acc * Math.max(1, valueCount);
          }, 1);

    return {
      combinationCount,
      optionCount,
      totalValues,
    };
  }, [formik.values.productOptions]);

  const showErrors = hasAttemptedSubmit || formik.submitCount > 0;
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

  const mapStatusToApi = (uiStatus: 'active' | 'archived' | 'draft'): 'ACTIVE' | 'ARCHIVED' | 'DRAFT' => {
    if (uiStatus === 'active') return 'ACTIVE';
    if (uiStatus === 'archived') return 'ARCHIVED';
    return 'DRAFT';
  };

  const isSubmitting = createProductMutation.isMutating || updateAdminProductMutation.isMutating;

  const handleSubmitAction = async () => {
    setHasAttemptedSubmit(true);
    const nextErrors = await formik.validateForm();

    if (Object.keys(nextErrors).length > 0) {
      console.error('[Admin Products][Formik] Validation errors:', nextErrors);

      const firstErrorMessage =
        collectErrorMessages(nextErrors)[0] ?? 'Vui lòng kiểm tra lại các trường bắt buộc.';

      addToast({
        color: 'danger',
        description: firstErrorMessage,
      });

      await formik.setFieldTouched('name', true, false);
      await formik.setFieldTouched('selectedBrandIds', true, false);
      await formik.setFieldTouched('selectedCollections', true, false);
      await formik.setFieldTouched('productOptions', true, false);

      window.scrollTo({ behavior: 'smooth', top: 0 });
      return;
    }

    await formik.submitForm();
  };

  const handleCustomOptionGroupSelection = async (nextGroupIds: string[]) => {
    const nextGroupId = nextGroupIds[0] ?? '';
    const currentGroupId = selectedCustomOptionGroupId;

    if (nextGroupId === currentGroupId) {
      return;
    }

    if (!isEdit || !productId) {
      setSelectedCustomOptionGroupId(nextGroupId);

      return;
    }

    setIsUpdatingCustomOptionGroup(true);

    try {
      if (currentGroupId) {
        await unassignCustomOptionGroupFromProductMutation.trigger({
          csrf: true,
          groupId: currentGroupId,
          productId,
        });
      }

      if (nextGroupId) {
        await assignCustomOptionGroupToProductMutation.trigger({
          csrf: true,
          customOptionGroupId: nextGroupId,
          productId,
          sortOrder: 0,
        });
      }

      setSelectedCustomOptionGroupId(nextGroupId);
      await assignedCustomOptionGroups.mutate();
    } catch (error) {
      console.error('[Admin Products][CustomOptionGroup] Update assignment failed:', error);
      addToast({
        color: 'danger',
        description: 'Không thể cập nhật nhóm custom option cho sản phẩm.',
      });
    } finally {
      setIsUpdatingCustomOptionGroup(false);
    }
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
              className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-5 text-[1.3rem] font-500 text-white transition-colors hover:bg-primary-dark"
              disabled={isSubmitting}
              onClick={handleSubmitAction}
              type="button"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo mới'}
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
                existingImages={detailProduct?.images}
                imageFiles={formik.values.imageFiles}
                images={formik.values.images}
                isEdit={isEdit}
                isDeleteLoading={removeProductImageMutation.isMutating}
                onDeleteExistingImageAction={async imageId => {
                  if (!productId) return;

                  await triggerRemoveProductImage({
                    id: productId,
                    imageId,
                  });

                  await getAdminProductById.mutate();
                }}
                onImageFilesChangeAction={files => formik.setFieldValue('imageFiles', files)}
                onUploadExistingImageAction={async file => {
                  if (!productId) return;

                  await triggerUploadProductImage({
                    csrf: true,
                    id: productId,
                    image: file,
                  });

                  await getAdminProductById.mutate();
                }}
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

            {isEdit && (
              <FormSection
                description="Chỉnh sửa trực tiếp toàn bộ variants và áp dụng nhanh giá trị cho cả cột"
                icon={<Package className="h-4 w-4 text-primary" />}
                title="Variants"
              >
                <ProductVariantsTable
                  onSaveSuccessAction={async () => {
                    await getAdminProductById.mutate();
                  }}
                  productId={productId}
                  variantsFromDetail={detailVariantRows}
                />
              </FormSection>
            )}
          </div>

          <div className="space-y-6">
            <FormSection
              description="Thẻ giúp phân loại và tìm kiếm sản phẩm dễ dàng hơn"
              icon={<Tag className="h-4 w-4 text-primary" />}
              title="Tags"
            >
              <TagPicker
                onSelectAction={ids => formik.setFieldValue('selectedTags', ids)}
                selectedTagIds={formik.values.selectedTags}
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
              description="Gán 1 nhóm custom option cho sản phẩm"
              icon={<Grid3x3 className="h-4 w-4 text-primary" />}
              title="Nhóm custom option"
            >
              <CustomOptionGroupPicker
                onSelectAction={handleCustomOptionGroupSelection}
                selectedGroupIds={selectedCustomOptionGroupId ? [selectedCustomOptionGroupId] : []}
              />

              <p className="mt-2 text-[1.2rem] text-muted-foreground">
                {isEdit
                  ? isUpdatingCustomOptionGroup
                    ? 'Đang cập nhật nhóm custom option...'
                    : 'Khi đổi nhóm: hệ thống sẽ gỡ nhóm cũ và gán nhóm mới ngay.'
                  : 'Nhóm đã chọn sẽ được gán tự động sau khi tạo sản phẩm thành công.'}
              </p>
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
            className="h-10 rounded-lg bg-primary px-6 text-[1.4rem] font-500 text-white transition-colors hover:bg-primary-dark"
            disabled={isSubmitting}
            onClick={handleSubmitAction}
            type="button"
          >
            {isSubmitting ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo mới'}
          </button>
        </div>

        <div className="h-20 xl:h-0" />
      </div>
    </FormikProvider>
  );
}
