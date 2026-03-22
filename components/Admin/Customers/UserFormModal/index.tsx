'use client';

import { useMemo } from 'react';
import { X } from 'lucide-react';

import * as yup from 'yup';
import { Form, Formik } from 'formik';

import { Field } from '@/elements';

export interface UserFormData {
  email: string;
  firstName: string;
  id?: string;
  lastName: string;
  password?: string;
  phone: string;
  role: 'ADMIN' | 'USER';
  status: 'active' | 'inactive';
}

interface UserFormModalProps {
  initialData?: UserFormData | null;
  isOpen: boolean;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
  onCloseAction: () => void;
  onSubmitAction: (data: UserFormData) => Promise<void> | void;
}

export default function UserFormModal({
  initialData,
  isOpen,
  isSubmitting = false,
  mode,
  onCloseAction,
  onSubmitAction,
}: UserFormModalProps) {
  const isEditMode = mode === 'edit';
  const initialValues: UserFormData = useMemo(
    () => ({
      email: initialData?.email || '',
      firstName: initialData?.firstName || '',
      id: initialData?.id,
      lastName: initialData?.lastName || '',
      password: '',
      phone: initialData?.phone || '',
      role: initialData?.role || 'USER',
      status: initialData?.status || 'active',
    }),
    [initialData],
  );

  const validationSchema = useMemo(() => {
    if (isEditMode) {
      return yup.object().shape({
        role: yup.mixed<'ADMIN' | 'USER'>().oneOf(['ADMIN', 'USER']).required('Vui lòng chọn vai trò'),
        status: yup
          .mixed<'active' | 'inactive'>()
          .oneOf(['active', 'inactive'])
          .required('Vui lòng chọn trạng thái'),
      });
    }

    return yup.object().shape({
      email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
      firstName: yup.string().trim().required('Vui lòng nhập tên'),
      lastName: yup.string().trim().required('Vui lòng nhập họ'),
      password: yup.string().required('Vui lòng nhập mật khẩu').min(6, 'Mật khẩu tối thiểu 6 ký tự'),
      phone: yup.string().trim().required('Vui lòng nhập số điện thoại'),
      role: yup.mixed<'ADMIN' | 'USER'>().oneOf(['ADMIN', 'USER']).required('Vui lòng chọn vai trò'),
      status: yup
        .mixed<'active' | 'inactive'>()
        .oneOf(['active', 'inactive'])
        .required('Vui lòng chọn trạng thái'),
    });
  }, [isEditMode]);

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
            {mode === 'create' ? 'Tạo người dùng mới' : 'Chỉnh sửa người dùng'}
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
            await onSubmitAction(values);
          }}
          validateOnMount
          validationSchema={validationSchema}
        >
          {() => (
            <Form className="space-y-5 p-6">
              <div className="grid grid-cols-2 gap-4">
                <Field.Text
                  className={isEditMode ? 'pointer-events-none opacity-75' : undefined}
                  label="Họ"
                  name="lastName"
                  placeholder="Nhập họ"
                  readOnly={isEditMode}
                  required={!isEditMode}
                />
                <Field.Text
                  className={isEditMode ? 'pointer-events-none opacity-75' : undefined}
                  label="Tên"
                  name="firstName"
                  placeholder="Nhập tên"
                  readOnly={isEditMode}
                  required={!isEditMode}
                />
              </div>

              <Field.Text
                className={isEditMode ? 'pointer-events-none opacity-75' : undefined}
                label="Email"
                name="email"
                placeholder="email@example.com"
                readOnly={isEditMode}
                required={!isEditMode}
                type="email"
              />

              <Field.Text
                className={isEditMode ? 'pointer-events-none opacity-75' : undefined}
                label="Số điện thoại"
                name="phone"
                placeholder="0912 345 678"
                readOnly={isEditMode}
                required={!isEditMode}
                type="tel"
              />

              {!isEditMode && (
                <Field.Password label="Mật khẩu" name="password" placeholder="Nhập mật khẩu" required />
              )}

              <div className="grid grid-cols-2 gap-4">
                <Field.Select
                  label="Vai trò"
                  name="role"
                  options={[
                    { value: 'USER', label: 'USER' },
                    { value: 'ADMIN', label: 'ADMIN' },
                  ]}
                  required
                />

                <Field.Select
                  label="Trạng thái"
                  name="status"
                  options={[
                    { value: 'active', label: 'Hoạt động' },
                    { value: 'inactive', label: 'Ngừng hoạt động' },
                  ]}
                  required
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
                  className="h-10 rounded-lg bg-primary px-5 text-[1.4rem] font-500 text-white transition-colors hover:bg-primary"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? 'Đang xử lý...' : mode === 'create' ? 'Tạo người dùng' : 'Lưu thay đổi'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
