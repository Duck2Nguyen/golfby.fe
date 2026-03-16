'use client';

import React, { useEffect } from 'react';

import { Spinner } from '@heroui/spinner';
import { useRouter } from 'next/navigation';

import { useSession } from '@/hooks/auth';

type Props = {
  children: React.ReactNode;
};

const PrivateLayout = (props: Props) => {
  const { initUser, data } = useSession();
  const router = useRouter();

  useEffect(() => {
    initUser()
      .then(isAuth => {
        if (!isAuth) {
          router.push('/login');
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, []);
  console.log(data?.loading);

  if (data == null || data?.loading || !data.isAuthenticated) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return props.children;
};

export default PrivateLayout;
