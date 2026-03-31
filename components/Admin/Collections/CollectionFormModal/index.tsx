'use client';

import { useMemo } from 'react';
import { X } from 'lucide-react';

import * as yup from 'yup';
import { Form, Formik } from 'formik';

import { toSlug } from '@/utils/common';

import { Field } from '@/elements';

export interface CollectionFormData {
  categoryIds: string[];
  description?: string;
  id?: string;
  name: string;
  parentId: string;
  slug: string;
}

export interface ParentCollectionOption {
  id: string;
  label: string;
}

export interface CategoryCatalogItem {
  id: string;
  label: string;
  name: string;
  slug: string;
}

export interface AssignedCategoryInfo {
  collectionId: string;
  collectionName: string;
}

interface CollectionFormModalProps {
  assignedCategoryMap: Map<string, AssignedCategoryInfo>;
  categoryCatalog: CategoryCatalogItem[];
  initialData?: CollectionFormData | null;
  isOpen: boolean;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
  onCloseAction: () => void;
  onSubmitAction: (data: CollectionFormData) => Promise<void> | void;
  parentOptions: ParentCollectionOption[];
}

const validationSchema = yup.object().shape({
  categoryIds: yup.array().of(yup.string().required()).default([]),
  description: yup.string().trim().max(500, 'Mô tả không vượt quá 500 ký tự'),
  name: yup.string().trim().required('Vui lòng nhập tên collection'),
  parentId: yup.string().default(''),
  slug: yup.string().trim().required('Vui lòng nhập slug'),
});

export default function CollectionFormModal({
  assignedCategoryMap,
  categoryCatalog,
  initialData,
  isOpen,
  isSubmitting = false,
  mode,
  onCloseAction,
  onSubmitAction,
  parentOptions,
}: CollectionFormModalProps) {
  const initialValues: CollectionFormData = useMemo(
    () => ({
      categoryIds: initialData?.categoryIds || [],
      description: initialData?.description || '',
      id: initialData?.id,
      name: initialData?.name || '',
      parentId: initialData?.parentId || '',
      slug: initialData?.slug || '',
    }),
    [initialData],
  );

  const isNewCollection = mode === 'create';
  const isExistingChildCollection = mode === 'edit' && Boolean(initialData?.parentId);
  const isExistingParentCollection = mode === 'edit' && !initialData?.parentId;

  const canSelectParent = isNewCollection || isExistingChildCollection;
  const canSelectCategories = isNewCollection || isExistingChildCollection;

  const availableParentOptions = useMemo(() => {
    return parentOptions.filter(option => option.id !== initialData?.id);
  }, [initialData?.id, parentOptions]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCloseAction}
        type="button"
      />

      <div className="relative mx-4 max-h-[90vh] w-full max-w-[62rem] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-[1.8rem] font-600 text-gray-900">
            {mode === 'create' ? 'Tạo collection mới' : 'Chỉnh sửa collection'}
          </h2>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
            onClick={onCloseAction}
            type="button"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={async values => {
            const cleanedName = values.name.trim();
            const cleanedSlug = values.slug.trim() || toSlug(cleanedName);

            await onSubmitAction({
              ...values,
              categoryIds: canSelectCategories ? values.categoryIds : initialValues.categoryIds,
              description: values.description?.trim() || undefined,
              name: cleanedName,
              parentId: canSelectParent ? values.parentId : initialValues.parentId,
              slug: cleanedSlug,
            });
          }}
          validateOnMount
          validationSchema={validationSchema}
        >
          {({ isValid, setFieldValue, values }) => (
            <Form className="space-y-5 p-6">
              <Field.Text label="Tên collection" name="name" placeholder="Nhập tên collection" required />

              <Field.Text label="Slug" name="slug" placeholder="collection-slug" required />

              <div className="space-y-2">
                <label className="text-[1.3rem] font-600 text-gray-700">Collection cha (parentId)</label>
                <select
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-[1.4rem] outline-none focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-500"
                  disabled={!canSelectParent || isSubmitting}
                  onChange={event => {
                    setFieldValue('parentId', event.target.value);
                  }}
                  value={values.parentId}
                >
                  <option value="">Không chọn (tạo collection cha)</option>
                  {availableParentOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {isExistingParentCollection && (
                <div className="rounded-lg bg-amber-50 px-3 py-2 text-[1.3rem] text-amber-700">
                  Collection đang là cha nên không được chỉnh parent/category.
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[1.3rem] font-600 text-gray-700">Gán categoryIds</label>
                {!canSelectCategories ? (
                  <div className="rounded-lg bg-gray-100 px-3 py-2 text-[1.3rem] text-gray-600">
                    Không thể gán category cho collection đang là cha.
                  </div>
                ) : (
                  <div className="max-h-56 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-3">
                    {categoryCatalog.length === 0 && (
                      <p className="text-[1.3rem] text-gray-500">Không có category để gán.</p>
                    )}

                    {categoryCatalog.map(option => {
                      const assigned = assignedCategoryMap.get(option.id);
                      const isOwnedByCurrent = assigned?.collectionId === initialData?.id;
                      const isAssignedToOther = Boolean(assigned) && !isOwnedByCurrent;

                      return (
                        <label
                          className={`flex items-center justify-between gap-2 text-[1.3rem] ${
                            isAssignedToOther ? 'text-gray-400' : 'text-gray-700'
                          }`}
                          key={option.id}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              checked={values.categoryIds.includes(option.id)}
                              disabled={isAssignedToOther || isSubmitting}
                              onChange={event => {
                                if (event.target.checked) {
                                  setFieldValue(
                                    'categoryIds',
                                    Array.from(new Set([...values.categoryIds, option.id])),
                                  );
                                  return;
                                }

                                setFieldValue(
                                  'categoryIds',
                                  values.categoryIds.filter(item => item !== option.id),
                                );
                              }}
                              type="checkbox"
                            />
                            <span>{option.label}</span>
                          </div>

                          {assigned && (
                            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[1.2rem] text-gray-500">
                              đang thuộc: {assigned.collectionName}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <Field.Text label="Mô tả" name="description" placeholder="Mô tả ngắn về collection" />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  className="h-10 rounded-lg border border-gray-200 px-5 text-[1.4rem] text-gray-900 transition-colors hover:bg-gray-100"
                  disabled={isSubmitting}
                  onClick={onCloseAction}
                  type="button"
                >
                  Hủy
                </button>
                <button
                  className="h-10 rounded-lg bg-primary px-5 text-[1.4rem] font-500 text-white transition-colors hover:bg-primary disabled:opacity-70"
                  disabled={isSubmitting || !isValid}
                  type="submit"
                >
                  {isSubmitting ? 'Đang xử lý...' : mode === 'create' ? 'Tạo collection' : 'Lưu thay đổi'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
