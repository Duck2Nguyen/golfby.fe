'use client';

import React, { useEffect, useState } from 'react';

import { Spinner } from '@heroui/spinner';
import { useRouter } from 'next/navigation';

import { useSession } from '@/hooks/auth';

import { ROLE } from '@/global/common';

import Header from '../Header';
import Sidebar from '../Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { initUser } = useSession();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    initUser()
      .then(res => {
        if (!res.success) {
          router.push('/login');
        } else if (res.user?.userRole !== ROLE.ADMIN && res.user?.role !== ROLE.ADMIN) {
          router.push('/');
        } else {
          setAuthorized(true);
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, []);

  if (!authorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
