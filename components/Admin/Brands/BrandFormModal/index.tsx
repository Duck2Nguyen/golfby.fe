'use client';

import { X } from 'lucide-react';
import { useRef, useMemo, useState, useEffect, type ChangeEvent } from 'react';

import * as yup from 'yup';
import { Form, Formik } from 'formik';

import { toSlug } from '@/utils/common';

import { Field } from '@/elements';

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

export interface BrandFormData {
  description?: string;
  id?: string;
  imageFile?: File | null;
  imageUrl?: string;
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
  name: yup.string().trim().required('Vui lòng nhập tên thương hiệu'),
  slug: yup.string().trim().required('Vui lòng nhập slug'),
});

const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg'];

export default function BrandFormModal({
  initialData,
  isOpen,
  isSubmitting = false,
  mode,
  onCloseAction,
  onSubmitAction,
}: BrandFormModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImageError, setSelectedImageError] = useState('');
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = useState('');

  const initialImagePreviewUrl = initialData?.imageUrl || initialData?.logoUrl || '';

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSelectedImageFile(null);
    setSelectedImageError('');
    setSelectedImagePreviewUrl(initialImagePreviewUrl);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [initialImagePreviewUrl, isOpen]);

  useEffect(() => {
    let objectUrl = '';

    if (selectedImageFile) {
      objectUrl = URL.createObjectURL(selectedImageFile);
      setSelectedImagePreviewUrl(objectUrl);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [selectedImageFile]);

  const clearSelectedImageFile = () => {
    setSelectedImageFile(null);
    setSelectedImageError('');
    setSelectedImagePreviewUrl(initialImagePreviewUrl);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];

    if (!nextFile) {
      clearSelectedImageFile();
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(nextFile.type)) {
      setSelectedImageError('Chỉ hỗ trợ ảnh PNG hoặc JPEG.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    if (nextFile.size > MAX_IMAGE_FILE_SIZE) {
      setSelectedImageError('Ảnh vượt quá dung lượng tối đa 5MB.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setSelectedImageError('');
    setSelectedImageFile(nextFile);
  };

  const initialValues: BrandFormData = useMemo(
    () => ({
      description: initialData?.description || '',
      id: initialData?.id,
      imageFile: null,
      imageUrl: initialData?.imageUrl || initialData?.logoUrl || '',
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
              imageFile: selectedImageFile,
              imageUrl: initialImagePreviewUrl || undefined,
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

              <div className="space-y-2">
                <label className="block text-[1.4rem] font-500 text-gray-900">Logo image</label>

                <input
                  accept="image/png,image/jpeg"
                  className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-[1.3rem] text-gray-700 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary-light file:px-3 file:py-1.5 file:text-[1.2rem] file:font-500 file:text-primary hover:border-gray-300"
                  onChange={handleImageInputChange}
                  ref={fileInputRef}
                  type="file"
                />

                <p className="text-[1.2rem] text-gray-500">Hỗ trợ PNG/JPEG, tối đa 5MB.</p>

                {selectedImageError ? (
                  <p className="text-[1.2rem] text-danger">{selectedImageError}</p>
                ) : null}

                {selectedImagePreviewUrl ? (
                  <div className="flex items-center gap-3">
                    <div className="h-[6.4rem] w-[6.4rem] overflow-hidden rounded-lg border border-gray-200 bg-white p-1">
                      <ImageWithFallback
                        alt="Brand logo preview"
                        className="h-full w-full object-contain"
                        src={selectedImagePreviewUrl}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[1.2rem] text-gray-700">
                        {selectedImageFile ? selectedImageFile.name : 'Logo hiện tại'}
                      </p>

                      {selectedImageFile ? (
                        <button
                          className="mt-1 text-[1.2rem] text-gray-500 underline hover:text-gray-700"
                          onClick={clearSelectedImageFile}
                          type="button"
                        >
                          Bỏ ảnh mới chọn
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>

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
