'use client';

import { useState, useEffect } from 'react';

import * as yup from 'yup';
import { Link } from '@heroui/link';
import { Form, Formik } from 'formik';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';
import { Divider } from '@heroui/divider';
import { Checkbox } from '@heroui/checkbox';

import { getKey, setKey, removeKey } from '@/utils/localStorage';

import { useSession } from '@/hooks/auth';

import { Field } from '@/elements';

import AuthLayout from '@/components/AuthLayout';

const LOGIN_REMEMBER_EMAIL_KEY = 'login.remember.email';
const LOGIN_REMEMBER_STATUS_KEY = 'login.remember.status';

const validationSchema = yup.object().shape({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập địa chỉ email'),
  password: yup.string().required('Vui lòng nhập mật khẩu'),
});

interface LoginValues {
  email: string;
  password: string;
  remember: boolean;
}

export default function Login() {
  const { login } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<LoginValues>({
    email: '',
    password: '',
    remember: false,
  });

  useEffect(() => {
    const remember = getKey<boolean>(LOGIN_REMEMBER_STATUS_KEY) ?? false;
    const email = remember ? (getKey<string>(LOGIN_REMEMBER_EMAIL_KEY) ?? '') : '';

    setInitialValues({ email, password: '', remember });
  }, []);

  const handleSubmit = async (values: LoginValues) => {
    try {
      setIsLoading(true);

      if (values.remember) {
        setKey(LOGIN_REMEMBER_EMAIL_KEY, values.email);
        setKey(LOGIN_REMEMBER_STATUS_KEY, true);
      } else {
        removeKey(LOGIN_REMEMBER_EMAIL_KEY);
        removeKey(LOGIN_REMEMBER_STATUS_KEY);
      }

      await login({ email: values.email, password: values.password });
    } catch (error: any) {
      setIsLoading(false);
      const errorMsg = error?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.';
      addToast({ color: 'danger', description: errorMsg });
    }
  };

  return (
    <AuthLayout title="Đăng Nhập" subtitle="Chào mừng bạn quay lại! Đăng nhập để tiếp tục mua sắm.">
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({ isValid, isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-5">
            <Field.Text
              name="email"
              label="Địa Chỉ Email"
              placeholder="Nhập địa chỉ email"
              type="text"
              required
            />

            <Field.Password name="password" label="Mật Khẩu" placeholder="Nhập mật khẩu" required />

            <div className="flex items-center justify-between">
              <Checkbox
                isSelected={values.remember}
                onValueChange={isSelected => setFieldValue('remember', isSelected)}
                classNames={{
                  base: 'items-center gap-3 p-0 m-0 max-w-full opacity-100',
                  wrapper:
                    'mt-0.5 shrink-0 border-2 border-neutral-300 bg-white opacity-100 shadow-none before:border-transparent group-data-[hover=true]:before:bg-transparent group-data-[selected=true]:bg-primary group-data-[selected=true]:border-primary group-data-[selected=true]:before:bg-transparent',
                  label:
                    'text-[1.35rem] text-foreground/85 font-500 leading-snug group-data-[hover=true]:text-foreground transition-colors',
                }}
                radius="md"
              >
                Ghi nhớ đăng nhập
              </Checkbox>
              <Link
                href="/forgot-password"
                className="text-[1.3rem] text-primary hover:text-primary-dark font-500 transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="submit"
              color="primary"
              className="w-full h-12 text-[1.6rem] font-600 rounded-xl mt-6"
              isDisabled={!isValid || isLoading}
              isLoading={isLoading}
            >
              Đăng Nhập
            </Button>
          </Form>
        )}
      </Formik>

      <div className="flex items-center gap-4 my-8">
        <Divider className="flex-1" />
        <span className="text-[1.3rem] text-muted-foreground whitespace-nowrap">hoặc đăng nhập bằng</span>
        <Divider className="flex-1" />
      </div>

      <p className="text-center text-[1.4rem] text-muted-foreground mt-8">
        Chưa có tài khoản?{' '}
        <Link href="/register" className="text-primary hover:text-primary-dark font-600 transition-colors">
          Tạo tài khoản mới
        </Link>
      </p>
    </AuthLayout>
  );
}
