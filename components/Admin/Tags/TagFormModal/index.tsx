'use client';

import { useMemo } from 'react';
import { X } from 'lucide-react';

import * as yup from 'yup';
import { Form, Formik } from 'formik';

import { toSlug } from '@/utils/common';

import { Field } from '@/elements';

export interface TagFormData {
  id?: string;
  name: string;
  slug: string;
}

interface TagFormModalProps {
  initialData?: TagFormData | null;
  isOpen: boolean;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
  onCloseAction: () => void;
  onSubmitAction: (data: TagFormData) => Promise<void> | void;
}

const validationSchema = yup.object().shape({
  name: yup.string().trim().required('Vui lòng nhập tên tag'),
});

export default function TagFormModal({
  initialData,
  isOpen,
  isSubmitting = false,
  mode,
  onCloseAction,
  onSubmitAction,
}: TagFormModalProps) {
  const initialValues: TagFormData = useMemo(
    () => ({
      id: initialData?.id,
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
            {mode === 'create' ? 'Tạo tag mới' : 'Chỉnh sửa tag'}
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
            const cleanedSlug = toSlug(cleanedName);

            await onSubmitAction({
              ...values,
              name: cleanedName,
              slug: cleanedSlug,
            });
          }}
          validateOnMount
          validationSchema={validationSchema}
        >
          {({ isValid, values }) => (
            <Form className="space-y-5 p-6">
              <Field.Text label="Tên tag" name="name" placeholder="Nhập tên tag" required />

              <div className="flex flex-col gap-2">
                <label className="mb-2 block text-[1.4rem] font-500 text-foreground">Slug</label>
                <input
                  className="h-10 w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-3 text-[1.4rem] text-gray-500"
                  disabled
                  placeholder="ten-tag"
                  type="text"
                  value={toSlug(values.name)}
                />
              </div>

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
                  {isSubmitting ? 'Đang xử lý...' : mode === 'create' ? 'Tạo tag' : 'Lưu thay đổi'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
