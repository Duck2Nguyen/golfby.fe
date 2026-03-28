'use client';

import { useState, useEffect } from 'react';

import { Link } from '@heroui/link';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';
import { applyActionCode } from 'firebase/auth';

import { auth } from '@/lib/firebase';

import AuthLayout from '@/components/AuthLayout';

type VerifyStatus = 'loading' | 'success' | 'error';

export default function VerifyEmail() {
  const [status, setStatus] = useState<VerifyStatus>('loading');

  useEffect(() => {
    const verify = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const directCode = searchParams.get('code')?.trim();
      const code = directCode || searchParams.get('oobCode')?.trim() || '';

      if (!code) {
        setStatus('error');
        addToast({
          color: 'danger',
          description: 'Liên kết xác thực không hợp lệ hoặc thiếu mã xác thực.',
        });

        return;
      }

      try {
        await applyActionCode(auth, code);
        setStatus('success');
      } catch {
        setStatus('error');
        addToast({
          color: 'danger',
          description: 'Liên kết xác thực không hợp lệ hoặc đã hết hạn.',
        });
      }
    };

    verify();
  }, []);

  if (status === 'loading') {
    return (
      <AuthLayout title="Xác Thực Email" subtitle="Hệ thống đang xác thực email của bạn...">
        <div className="space-y-5">
          <Button className="w-full h-12 text-[1.6rem] font-600 rounded-xl mt-6" isLoading>
            Đang xác thực
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (status === 'error') {
    return (
      <AuthLayout
        title="Xác Thực Thất Bại"
        subtitle="Liên kết xác thực đã hết hạn hoặc không đúng. Vui lòng yêu cầu gửi lại email xác thực."
      >
        <div className="space-y-5">
          <Button
            as={Link}
            href="/login"
            color="primary"
            className="w-full h-12 text-[1.6rem] font-600 rounded-xl mt-6"
          >
            Về Trang Đăng Nhập
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Xác Thực Thành Công"
      subtitle="Email của bạn đã được xác thực thành công. Bây giờ bạn có thể đăng nhập."
    >
      <div className="space-y-5">
        <Button
          as={Link}
          href="/login"
          color="primary"
          className="w-full h-12 text-[1.6rem] font-600 rounded-xl mt-6"
        >
          Đăng Nhập
        </Button>
      </div>
    </AuthLayout>
  );
}
