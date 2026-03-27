'use client';

import { useRef, useState, useEffect } from 'react';

import * as yup from 'yup';
import { Link } from '@heroui/link';
import { Form, Formik } from 'formik';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';
import { useRouter } from 'next/navigation';

import { genCsrfToken } from '@/utils/csrf';

import { useAuth } from '@/hooks/auth/useAuth';

import { Field } from '@/elements';

import AuthLayout from '@/components/AuthLayout';

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu mới')
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .matches(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
    .matches(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
    .matches(/[0-9]/, 'Mật khẩu phải có ít nhất 1 chữ số')
    .matches(/[^A-Za-z0-9]/, 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt'),
  confirmPassword: yup
    .string()
    .required('Vui lòng xác nhận mật khẩu')
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
});

interface ResetPasswordValues {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const router = useRouter();
  const [isCheckingLink, setIsCheckingLink] = useState(true);
  const [isCheckPassed, setIsCheckPassed] = useState(false);
  const [isParamsReady, setIsParamsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetLinkData, setResetLinkData] = useState({ token: '', userId: '' });
  const hasCheckedLinkRef = useRef(false);
  const { resetPasswordMutation, forgotPasswordCheckMutation } = useAuth();

  const { userId, token } = resetLinkData;
  const isLinkValid = Boolean(userId && token);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    setResetLinkData({
      token: searchParams.get('code')?.trim() || '',
      userId: searchParams.get('id')?.trim() || '',
    });
    setIsParamsReady(true);
  }, []);

  useEffect(() => {
    if (!isParamsReady || hasCheckedLinkRef.current) {
      return;
    }

    hasCheckedLinkRef.current = true;

    const checkForgotLink = async () => {
      try {
        if (!isLinkValid) {
          throw new Error('missing_link_data');
        }

        const csrfToken = await genCsrfToken();

        await forgotPasswordCheckMutation.trigger({
          id: userId,
          token,
          ...(csrfToken ? { csrfToken } : {}),
        });

        setIsCheckPassed(true);
      } catch {
        addToast({
          color: 'danger',
          description: 'Liên kết hết hạn, vui lòng tạo lại yêu cầu.',
        });
        router.replace('/forgot-password');
      } finally {
        setIsCheckingLink(false);
      }
    };

    checkForgotLink();
  }, [forgotPasswordCheckMutation, isLinkValid, isParamsReady, router, token, userId]);

  const initialValues: ResetPasswordValues = {
    password: '',
    confirmPassword: '',
  };

  const handleSubmit = async (values: ResetPasswordValues) => {
    if (!isLinkValid || !isCheckPassed) {
      addToast({
        color: 'danger',
        description: 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.',
      });

      return;
    }

    try {
      setIsSubmitting(true);
      const csrfToken = await genCsrfToken();
      await resetPasswordMutation.trigger({
        id: userId,
        token,
        password: values.password,
        ...(csrfToken ? { csrfToken } : {}),
      });
      addToast({
        color: 'success',
        description: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.',
      });
      router.push('/login');
    } catch (error: any) {
      console.log('Error resetting password:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingLink) {
    return (
      <AuthLayout title="Đặt Lại Mật Khẩu" subtitle="Đang kiểm tra liên kết đặt lại mật khẩu...">
        <div className="space-y-5">
          <Button className="w-full h-12 text-[1.6rem] font-600 rounded-xl mt-6" isLoading>
            Đang xác thực liên kết
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (!isCheckPassed) {
    return (
      <AuthLayout title="Đặt Lại Mật Khẩu" subtitle="Đang chuyển hướng...">
        <div className="space-y-5" />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Đặt Lại Mật Khẩu" subtitle="Vui lòng nhập mật khẩu mới của bạn.">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({ isValid }) => (
          <Form className="space-y-5">
            <Field.Password name="password" label="Mật Khẩu Mới" placeholder="Nhập mật khẩu mới" required />

            <Field.Password
              name="confirmPassword"
              label="Xác Nhận Mật Khẩu"
              placeholder="Nhập lại mật khẩu mới"
              required
            />

            <Button
              type="submit"
              color="primary"
              className="w-full h-12 text-[1.6rem] font-600 rounded-xl mt-6"
              isDisabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
            >
              Cập Nhật Mật Khẩu
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
