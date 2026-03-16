'use client';

import { Send } from 'lucide-react';

import * as Yup from 'yup';
import { Form, Field, Formik } from 'formik';

import InputField from '@/elements/InputField';

const newsletterSchema = Yup.object().shape({
  email: Yup.string().email('Email không đúng định dạng').required('Vui lòng nhập email'),
});

export function Newsletter() {
  const handleSubmit = (values: { email: string }, { resetForm }: any) => {
    // Fake API call
    console.log('Subscribe email:', values.email);
    alert('Đăng ký thành công!');
    resetForm();
  };

  return (
    <section className="bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <h3 className="mb-2 text-[2.2rem] text-white sm:text-[2.6rem]" style={{ fontWeight: 700 }}>
              Đăng ký nhận ưu đãi
            </h3>
            <p className="max-w-md text-[1.4rem] text-white/70">
              Nhận ngay voucher giảm 10% và cập nhật sản phẩm mới, chương trình khuyến mãi hấp dẫn
            </p>
          </div>

          <div className="w-full max-w-md md:w-auto">
            <Formik initialValues={{ email: '' }} validationSchema={newsletterSchema} onSubmit={handleSubmit}>
              {({ isSubmitting, isValid, dirty }) => (
                <Form className="flex w-full items-start">
                  <div className="flex-1">
                    <Field
                      name="email"
                      placeholder="Nhập email của bạn..."
                      component={InputField}
                      classNames={{
                        inputWrapper: [
                          'bg-white/15 border-white/20 hover:border-white/40',
                          'group-data-[focus=true]:bg-white/20 group-data-[focus=true]:border-white/50',
                          'rounded-r-none border-r-0',
                        ].join(' '),
                        input: 'text-white placeholder:text-white/50',
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || (!isValid && dirty)}
                    className="flex h-[4.8rem] shrink-0 items-center gap-2 rounded-r-xl bg-white px-6 text-[1.4rem] text-primary transition-colors hover:bg-primary-light disabled:opacity-50"
                    style={{ fontWeight: 600 }}
                  >
                    <Send className="h-4 w-4" />
                    Đăng ký
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
}
