'use client';

import { X } from 'lucide-react';
import { useRef, useState, useEffect, type ChangeEvent } from 'react';

import * as yup from 'yup';
import { Form, Formik } from 'formik';

import type { StaticHomeCategory } from '@/hooks/useStaticData';

import { STATIC_HOME_CATEGORIES, STATIC_HOME_COLLECTION_DIRECTIONS } from '@/hooks/useStaticData';

import { Field } from '@/elements';

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

type StaticHomeCollectionDirection =
  (typeof STATIC_HOME_COLLECTION_DIRECTIONS)[keyof typeof STATIC_HOME_COLLECTION_DIRECTIONS];

export interface BannerCollectionOption {
  id: string;
  label: string;
}

export interface BannerFormData {
  category: StaticHomeCategory;
  collectionId: string;
  direction: '' | StaticHomeCollectionDirection;
  href: string;
  id?: string;
  imageFile: File | null;
  imageUrl?: string;
  name: string;
}

interface BannerFormModalProps {
  collectionOptions: BannerCollectionOption[];
  initialData?: BannerFormData | null;
  isOpen: boolean;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
  onCloseAction: () => void;
  onSubmitAction: (data: BannerFormData) => Promise<void> | void;
}

const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg'];

const validationSchema = yup.object().shape({
  category: yup
    .mixed<StaticHomeCategory>()
    .oneOf(Object.values(STATIC_HOME_CATEGORIES) as StaticHomeCategory[])
    .required('Vui lòng chọn category'),
  collectionId: yup.string().when('category', {
    is: STATIC_HOME_CATEGORIES.COLLECTION,
    otherwise: schema => schema.optional(),
    then: schema => schema.trim().required('Vui lòng chọn collection cha'),
  }),
  direction: yup.string().when('category', {
    is: STATIC_HOME_CATEGORIES.COLLECTION,
    otherwise: schema => schema.optional(),
    then: schema =>
      schema.oneOf(Object.values(STATIC_HOME_COLLECTION_DIRECTIONS)).required('Vui lòng chọn direction'),
  }),
  href: yup.string().trim().required('Vui lòng nhập href'),
  imageFile: yup.mixed<File>().nullable().required('Vui lòng upload ảnh'),
  name: yup.string().when('category', {
    is: STATIC_HOME_CATEGORIES.PRODUCT_NEW,
    otherwise: schema => schema.optional(),
    then: schema => schema.trim().required('Vui lòng nhập name'),
  }),
});

export default function BannerFormModal({
  collectionOptions,
  initialData,
  isOpen,
  isSubmitting = false,
  mode,
  onCloseAction,
  onSubmitAction,
}: BannerFormModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImageError, setSelectedImageError] = useState('');
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = useState('');

  const initialImagePreviewUrl = initialData?.imageUrl || '';

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

  const initialValues: BannerFormData = {
    category: initialData?.category ?? STATIC_HOME_CATEGORIES.BANNER,
    collectionId: initialData?.collectionId ?? '',
    direction: initialData?.direction ?? '',
    href: initialData?.href ?? '',
    id: initialData?.id,
    imageFile: null,
    imageUrl: initialData?.imageUrl,
    name: initialData?.name ?? '',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCloseAction}
        type="button"
      />

      <div className="relative mx-4 max-h-[90vh] w-full max-w-[56rem] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-[1.8rem] font-600 text-gray-900">
            {mode === 'create' ? 'Tạo banner mới' : 'Chỉnh sửa banner'}
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
            await onSubmitAction({
              ...values,
              collectionId: values.collectionId.trim(),
              href: values.href.trim(),
              imageFile: selectedImageFile,
              name: values.name.trim(),
            });
          }}
          validateOnMount
          validationSchema={validationSchema}
        >
          {({ errors, isValid, setFieldValue, touched, values }) => {
            const showCollectionFields = values.category === STATIC_HOME_CATEGORIES.COLLECTION;
            const showProductNewFields = values.category === STATIC_HOME_CATEGORIES.PRODUCT_NEW;

            const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
              const nextFile = event.target.files?.[0];

              if (!nextFile) {
                setSelectedImageFile(null);
                setSelectedImageError('');
                setFieldValue('imageFile', null);
                setSelectedImagePreviewUrl(initialImagePreviewUrl);
                return;
              }

              if (!ALLOWED_IMAGE_TYPES.includes(nextFile.type)) {
                setSelectedImageError('Chỉ hỗ trợ ảnh PNG hoặc JPEG.');
                setSelectedImageFile(null);
                setFieldValue('imageFile', null);
                setSelectedImagePreviewUrl(initialImagePreviewUrl);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
                return;
              }

              if (nextFile.size > MAX_IMAGE_FILE_SIZE) {
                setSelectedImageError('Ảnh vượt quá dung lượng tối đa 5MB.');
                setSelectedImageFile(null);
                setFieldValue('imageFile', null);
                setSelectedImagePreviewUrl(initialImagePreviewUrl);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
                return;
              }

              setSelectedImageError('');
              setSelectedImageFile(nextFile);
              setFieldValue('imageFile', nextFile);
            };

            return (
              <Form className="space-y-5 p-6">
                <div className="space-y-2">
                  <label className="text-[1.3rem] font-600 text-gray-700">Category</label>
                  <select
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-[1.4rem] outline-none focus:border-emerald-500"
                    onChange={event => {
                      const nextCategory = event.target.value as StaticHomeCategory;
                      setFieldValue('category', nextCategory);

                      if (nextCategory !== STATIC_HOME_CATEGORIES.PRODUCT_NEW) {
                        setFieldValue('name', '');
                      }

                      if (nextCategory !== STATIC_HOME_CATEGORIES.COLLECTION) {
                        setFieldValue('collectionId', '');
                        setFieldValue('direction', '');
                      }
                    }}
                    value={values.category}
                  >
                    <option value={STATIC_HOME_CATEGORIES.BANNER}>BANNER</option>
                    <option value={STATIC_HOME_CATEGORIES.PRODUCT_NEW}>PRODUCT_NEW</option>
                    <option value={STATIC_HOME_CATEGORIES.COLLECTION}>COLLECTION</option>
                  </select>
                  {touched.category && errors.category ? (
                    <p className="text-[1.2rem] text-red-500">{errors.category}</p>
                  ) : null}
                </div>

                <Field.Text label="Href" name="href" placeholder="/collections/ping" required />

                {showProductNewFields ? (
                  <Field.Text label="Name" name="name" placeholder="ABC" required />
                ) : null}

                {showCollectionFields ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-[1.3rem] font-600 text-gray-700">Collection cha</label>
                      <select
                        className="h-10 w-full rounded-lg border border-gray-200 px-3 text-[1.4rem] outline-none focus:border-emerald-500"
                        onChange={event => {
                          setFieldValue('collectionId', event.target.value);
                        }}
                        value={values.collectionId}
                      >
                        <option value="">Chọn collection cha</option>
                        {collectionOptions.map(option => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {touched.collectionId && errors.collectionId ? (
                        <p className="text-[1.2rem] text-red-500">{errors.collectionId}</p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[1.3rem] font-600 text-gray-700">Direction</label>
                      <select
                        className="h-10 w-full rounded-lg border border-gray-200 px-3 text-[1.4rem] outline-none focus:border-emerald-500"
                        onChange={event => {
                          setFieldValue('direction', event.target.value);
                        }}
                        value={values.direction}
                      >
                        <option value="">Chọn direction</option>
                        <option value={STATIC_HOME_COLLECTION_DIRECTIONS.VERTICAL}>vertical</option>
                        <option value={STATIC_HOME_COLLECTION_DIRECTIONS.HORIZONTAL}>horizontal</option>
                      </select>
                      {touched.direction && errors.direction ? (
                        <p className="text-[1.2rem] text-red-500">{errors.direction}</p>
                      ) : null}
                    </div>
                  </>
                ) : null}

                <div className="space-y-2">
                  <label className="block text-[1.4rem] font-500 text-gray-900">Upload ảnh (bắt buộc)</label>

                  <input
                    accept="image/png,image/jpeg"
                    className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-[1.3rem] text-gray-700 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary-light file:px-3 file:py-1.5 file:text-[1.2rem] file:font-500 file:text-primary hover:border-gray-300"
                    onChange={handleImageInputChange}
                    ref={fileInputRef}
                    type="file"
                  />

                  <p className="text-[1.2rem] text-gray-500">Hỗ trợ PNG/JPEG, tối đa 5MB.</p>

                  {selectedImageFile ? (
                    <p className="text-[1.2rem] text-gray-600">File đã chọn: {selectedImageFile.name}</p>
                  ) : null}

                  {selectedImagePreviewUrl ? (
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                      <p className="mb-2 text-[1.2rem] text-gray-500">
                        {selectedImageFile ? 'Preview ảnh mới' : 'Preview ảnh hiện tại'}
                      </p>
                      <div className="h-[16rem] w-full overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                        <ImageWithFallback
                          alt="Banner preview"
                          className="h-full w-full object-contain"
                          src={selectedImagePreviewUrl}
                        />
                      </div>
                    </div>
                  ) : null}

                  {selectedImageError ? (
                    <p className="text-[1.2rem] text-red-500">{selectedImageError}</p>
                  ) : null}

                  {touched.imageFile && errors.imageFile ? (
                    <p className="text-[1.2rem] text-red-500">{errors.imageFile as string}</p>
                  ) : null}
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
                    disabled={isSubmitting || !isValid || Boolean(selectedImageError)}
                    type="submit"
                  >
                    {isSubmitting ? 'Đang xử lý...' : mode === 'create' ? 'Tạo banner' : 'Lưu thay đổi'}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
