'use client';

import { useMemo } from 'react';
import { X } from 'lucide-react';

import * as yup from 'yup';
import { Form, Formik } from 'formik';

import { toSlug } from '@/utils/common';

import { Field } from '@/elements';

export interface BrandFormData {
  description?: string;
  id?: string;
  logoUrl?: string;
  name: string;
  slug: string;
}

interface BrandFormModalProps {
  initialData?: BrandFormData | null;
  isOpen: boolean;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
  onCloseAction: () => void;
  onSubmitAction: (data: BrandFormData) => Promise<void> | void;
}

const validationSchema = yup.object().shape({
  description: yup.string().trim().max(500, 'Mô tả không vượt quá 500 ký tự'),
  logoUrl: yup.string().trim().url('Logo URL không hợp lệ').nullable(),
  name: yup.string().trim().required('Vui lòng nhập tên thương hiệu'),
  slug: yup.string().trim().required('Vui lòng nhập slug'),
});

export default function BrandFormModal({
  initialData,
  isOpen,
  isSubmitting = false,
  mode,
  onCloseAction,
  onSubmitAction,
}: BrandFormModalProps) {
  const initialValues: BrandFormData = useMemo(
    () => ({
      description: initialData?.description || '',
      id: initialData?.id,
      logoUrl: initialData?.logoUrl || '',
      name: initialData?.name || '',
      slug: initialData?.slug || '',
    }),
    [initialData],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCloseAction}
        type="button"
      />

      <div className="relative mx-4 max-h-[90vh] w-full max-w-[52rem] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-[1.8rem] font-600 text-gray-900">
            {mode === 'create' ? 'Tạo thương hiệu mới' : 'Chỉnh sửa thương hiệu'}
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
              description: values.description?.trim() || undefined,
              logoUrl: values.logoUrl?.trim() || undefined,
              name: cleanedName,
              slug: cleanedSlug,
            });
          }}
          validateOnMount
          validationSchema={validationSchema}
        >
          {({ isValid }) => (
            <Form className="space-y-5 p-6">
              <Field.Text label="Tên thương hiệu" name="name" placeholder="Nhập tên thương hiệu" required />

              <Field.Text label="Slug" name="slug" placeholder="thuong-hieu" required />

              <Field.Text label="Logo URL" name="logoUrl" placeholder="https://example.com/logo.png" />

              <Field.Text label="Mô tả" name="description" placeholder="Mô tả ngắn về thương hiệu" />

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
                  {isSubmitting ? 'Đang xử lý...' : mode === 'create' ? 'Tạo thương hiệu' : 'Lưu thay đổi'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
