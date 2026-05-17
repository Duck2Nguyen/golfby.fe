'use client';

import { useMemo } from 'react';
import { X } from 'lucide-react';

import * as yup from 'yup';
import { Form, Formik } from 'formik';

import type { Voucher } from '@/hooks/useVoucher';

import { Field } from '@/elements';

interface VoucherFormModalProps {
  initialData?: Voucher | null;
  isOpen: boolean;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
  onCloseAction: () => void;
  onSubmitAction: (data: any) => Promise<void> | void;
}

const validationSchema = yup.object().shape({
  name: yup.string().trim().required('Vui lòng nhập tên voucher'),
  code: yup.string().trim().required('Vui lòng nhập mã voucher'),
  type: yup
    .string()
    .oneOf(['PERCENT', 'FIXED_AMOUNT', 'FREE_SHIPPING'])
    .required('Vui lòng chọn loại giảm giá'),
  value: yup.number().min(0, 'Giá trị phải lớn hơn hoặc bằng 0').required('Vui lòng nhập giá trị'),
  isActive: yup.boolean(),
  minOrderTotal: yup.number().min(0, 'Giá trị đơn hàng tối thiểu không hợp lệ').nullable(),
  maxValue: yup.number().min(0, 'Giá trị giảm tối đa không hợp lệ').nullable(),
  usageLimit: yup.number().min(1, 'Giới hạn sử dụng phải lớn hơn 0').nullable(),
});

export default function VoucherFormModal({
  initialData,
  isOpen,
  isSubmitting = false,
  mode,
  onCloseAction,
  onSubmitAction,
}: VoucherFormModalProps) {
  const initialValues = useMemo(
    () => ({
      id: initialData?.id,
      name: initialData?.name || '',
      code: initialData?.code || '',
      type: initialData?.type || 'PERCENT',
      value: initialData?.value || 0,
      isActive: initialData?.isActive ?? true,
      minOrderTotal: initialData?.minOrderTotal || '',
      maxValue: initialData?.maxValue || '',
      usageLimit: initialData?.usageLimit || '',
      startsAt: initialData?.startsAt ? new Date(initialData.startsAt).toISOString().slice(0, 16) : '',
      endsAt: initialData?.endsAt ? new Date(initialData.endsAt).toISOString().slice(0, 16) : '',
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

      <div className="relative mx-4 max-h-[90vh] w-full max-w-[64rem] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-[1.8rem] font-600 text-gray-900">
            {mode === 'create' ? 'Tạo voucher mới' : 'Chỉnh sửa voucher'}
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
            const payload = {
              ...values,
              value: Number(values.value),
              minOrderTotal: values.minOrderTotal ? Number(values.minOrderTotal) : undefined,
              maxValue: values.maxValue ? Number(values.maxValue) : undefined,
              usageLimit: values.usageLimit ? Number(values.usageLimit) : undefined,
              startsAt: values.startsAt ? new Date(values.startsAt).toISOString() : undefined,
              endsAt: values.endsAt ? new Date(values.endsAt).toISOString() : undefined,
            };

            await onSubmitAction(payload);
          }}
          validateOnMount
          validationSchema={validationSchema}
        >
          {({ isValid, values, setFieldValue }) => (
            <Form className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-5">
                <Field.Text label="Tên voucher" name="name" placeholder="Ví dụ: Giảm giá mùa hè" required />
                <Field.Text
                  label="Mã voucher"
                  name="code"
                  placeholder="SUMMER2026"
                  required
                  className="uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Field.Select
                  label="Loại giảm giá *"
                  name="type"
                  required
                  options={[
                    { label: 'Phần trăm (%)', value: 'PERCENT' },
                    { label: 'Số tiền cố định (VNĐ)', value: 'FIXED_AMOUNT' },
                    { label: 'Miễn phí vận chuyển', value: 'FREE_SHIPPING' },
                  ]}
                />

                <Field.Text
                  label={`Giá trị ${values.type === 'PERCENT' ? '(%)' : '(VNĐ)'}`}
                  name="value"
                  placeholder="0"
                  type="number"
                  required
                  disabled={values.type === 'FREE_SHIPPING'}
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Field.Text
                  label="Đơn hàng tối thiểu (VNĐ)"
                  name="minOrderTotal"
                  placeholder="Để trống nếu không giới hạn"
                  type="number"
                />
                <Field.Text
                  label="Giảm tối đa (VNĐ)"
                  name="maxValue"
                  placeholder="Chỉ áp dụng cho Phần trăm"
                  type="number"
                  disabled={values.type !== 'PERCENT'}
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Field.Text label="Thời gian bắt đầu" name="startsAt" type="datetime-local" />
                <Field.Text label="Thời gian kết thúc" name="endsAt" type="datetime-local" />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Field.Text
                  label="Số lượng giới hạn"
                  name="usageLimit"
                  placeholder="Để trống nếu không giới hạn"
                  type="number"
                />

                <div className="flex items-center space-x-3 pt-8">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={values.isActive}
                    onChange={e => setFieldValue('isActive', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isActive" className="text-[1.3rem] font-500 text-gray-700 cursor-pointer">
                    Kích hoạt voucher này
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  className="h-10 rounded-lg border border-gray-200 px-5 text-[1.4rem] text-gray-900 transition-colors hover:bg-gray-100"
                  disabled={isSubmitting}
                  onClick={onCloseAction}
                  type="button"
                >
                  Hủy
                </button>
                <button
                  className="h-10 rounded-lg bg-primary px-5 text-[1.4rem] font-500 text-white transition-colors hover:bg-primary/90 disabled:opacity-70"
                  disabled={isSubmitting || !isValid}
                  type="submit"
                >
                  {isSubmitting ? 'Đang xử lý...' : mode === 'create' ? 'Tạo voucher' : 'Lưu thay đổi'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
