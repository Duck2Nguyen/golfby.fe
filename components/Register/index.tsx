'use client';

import * as yup from 'yup';
import { Link } from '@heroui/link';
import { Form, Formik } from 'formik';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { Checkbox } from '@heroui/checkbox';

import { Field } from '@/elements';

import AuthLayout from '@/components/AuthLayout';

const validationSchema = yup.object().shape({
  firstName: yup.string().required('Vui lòng nhập tên'),
  lastName: yup.string().required('Vui lòng nhập họ'),
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập địa chỉ email'),
  password: yup.string().min(8, 'Mật khẩu tối thiểu 8 ký tự').required('Vui lòng nhập mật khẩu'),
  agree: yup.boolean().oneOf([true], 'Vui lòng đồng ý với điều khoản dịch vụ'),
});

export default function Register() {
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    newsletter: false,
    agree: false,
  };

  const handleSubmit = (values: any) => {
    console.log('Submit', values);
  };

  const calculateStrength = (password: string) => {
    if (password.length >= 12) return 4;
    if (password.length >= 8) return 3;
    if (password.length >= 5) return 2;
    if (password.length >= 1) return 1;
    return 0;
  };

  return (
    <AuthLayout title="Tạo Tài Khoản" subtitle="Đăng ký để nhận ưu đãi và trải nghiệm mua sắm tốt nhất.">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({ isValid, values, setFieldValue }) => {
          const strength = calculateStrength(values.password);

          return (
            <Form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Field.Text name="firstName" label="Tên" placeholder="Nhập tên" />
                <Field.Text name="lastName" label="Họ" placeholder="Nhập họ" />
              </div>

              <Field.Text
                name="email"
                label="Địa Chỉ Email"
                placeholder="Nhập địa chỉ email"
                type="text"
                required
              />

              <Field.Password name="password" label="Mật Khẩu" placeholder="Tối thiểu 8 ký tự" required />

              {/* Password Strength Indicator */}
              {values.password.length > 0 && (
                <div className="space-y-2">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map(level => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= strength
                            ? strength <= 1
                              ? 'bg-destructive'
                              : strength <= 2
                                ? 'bg-amber-400'
                                : strength <= 3
                                  ? 'bg-primary/70'
                                  : 'bg-primary'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[1.2rem] text-muted-foreground">
                    {values.password.length < 5
                      ? 'Yếu — Nên dùng tối thiểu 8 ký tự'
                      : values.password.length < 8
                        ? 'Trung bình — Thêm ký tự đặc biệt'
                        : values.password.length < 12
                          ? 'Khá tốt — Có thể dùng được'
                          : 'Mạnh — Mật khẩu an toàn'}
                  </p>
                </div>
              )}

              <div className="space-y-3 pt-1">
                <Checkbox
                  isSelected={values.newsletter}
                  onValueChange={isSelected => setFieldValue('newsletter', isSelected)}
                  classNames={{
                    base: 'items-center gap-2 p-0 m-0 max-w-full',
                    wrapper:
                      'mt-1 shrink-0 bg-white border-2 border-border/80 before:border-transparent group-data-[hover=true]:before:bg-transparent',
                    label:
                      'text-[1.2rem] text-muted-foreground font-400 leading-snug group-data-[hover=true]:text-foreground transition-colors',
                  }}
                  radius="md"
                >
                  Tôi Chấp Nhận Bản Tin, Ưu Đãi Và Thông Tin Mới Nhất Của GolfStore Qua Email
                </Checkbox>
                <Checkbox
                  isSelected={values.agree}
                  onValueChange={isSelected => setFieldValue('agree', isSelected)}
                  classNames={{
                    base: 'items-center gap-2 p-0 m-0 max-w-full mt-2',
                    wrapper:
                      'mt-1 shrink-0 bg-white border-2 border-border/80 before:border-transparent group-data-[hover=true]:before:bg-transparent',
                    label:
                      'text-[1.2rem] text-muted-foreground font-400 leading-snug group-data-[hover=true]:text-foreground transition-colors',
                  }}
                  radius="md"
                >
                  Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật
                </Checkbox>
              </div>

              <Button
                type="submit"
                color="primary"
                className="w-full h-12 text-[1.6rem] font-600 rounded-xl mt-6"
                isDisabled={!isValid || !values.agree}
              >
                Tạo Tài Khoản
              </Button>
            </Form>
          );
        }}
      </Formik>

      <div className="flex items-center gap-4 my-8">
        <Divider className="flex-1" />
        <span className="text-[1.3rem] text-muted-foreground whitespace-nowrap">hoặc đăng ký bằng</span>
        <Divider className="flex-1" />
      </div>

      <div className="flex gap-3">
        <Button
          variant="bordered"
          className="flex-1 h-12 rounded-xl border-border/80 hover:bg-muted font-500 text-[1.4rem]"
        >
          <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>
        <Button
          variant="bordered"
          className="flex-1 h-12 rounded-xl border-border/80 hover:bg-muted font-500 text-[1.4rem]"
        >
          <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </Button>
      </div>

      <p className="text-center text-[1.4rem] text-muted-foreground mt-8">
        Đã có tài khoản?{' '}
        <Link href="/login" className="text-primary hover:text-primary-dark font-600 transition-colors">
          Đăng nhập
        </Link>
      </p>
    </AuthLayout>
  );
}
