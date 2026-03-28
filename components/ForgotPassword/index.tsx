'use client';

import { useState } from 'react';

import * as yup from 'yup';
import { Link } from '@heroui/link';
import { Form, Formik } from 'formik';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';

import { useAuth } from '@/hooks/auth/useAuth';

import { Field } from '@/elements';

import AuthLayout from '@/components/AuthLayout';

const validationSchema = yup.object().shape({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập địa chỉ email'),
});

interface ForgotPasswordValues {
  email: string;
}

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPasswordMutation } = useAuth();

  const initialValues: ForgotPasswordValues = { email: '' };

  const handleSubmit = async (values: ForgotPasswordValues) => {
    try {
      setIsLoading(true);

      await forgotPasswordMutation.trigger({
        csrf: true,
        email: values.email.trim(),
      });
      addToast({
        color: 'success',
        description: 'Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.',
      });
    } catch (error: any) {
      const errorMsg = error?.message || 'Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại.';
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Quên Mật Khẩu"
      subtitle="Nhập email của bạn, chúng tôi sẽ gửi liên kết để đặt lại mật khẩu."
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({ isValid }) => (
          <Form className="space-y-5">
            <Field.Text
              name="email"
              label="Địa Chỉ Email"
              placeholder="Nhập địa chỉ email"
              type="text"
              required
            />

            <Button
              type="submit"
              color="primary"
              className="w-full h-12 text-[1.6rem] font-600 rounded-xl mt-6"
              isDisabled={!isValid || isLoading}
              isLoading={isLoading}
            >
              Xác nhận
            </Button>
          </Form>
        )}
      </Formik>

      <p className="text-center text-[1.4rem] text-muted-foreground mt-8">
        Quay lại{' '}
        <Link href="/login" className="text-primary hover:text-primary-dark font-600 transition-colors">
          Đăng nhập
        </Link>
      </p>
    </AuthLayout>
  );
}
