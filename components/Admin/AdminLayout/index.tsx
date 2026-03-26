'use client';

import React, { useMemo, useState, useEffect } from 'react';

import { Spinner } from '@heroui/spinner';
import { useRouter, usePathname } from 'next/navigation';

import { useSession } from '@/hooks/auth';

import { ROLE } from '@/global/common';

import Header from '../Header';
import Sidebar from '../Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { initUser } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle = useMemo(() => {
    if (pathname?.startsWith('/admin/customers')) return 'Quản lý người dùng';
    if (pathname?.startsWith('/admin/products/brands')) return 'Quản lý thương hiệu';
    if (pathname?.startsWith('/admin/products/categories')) return 'Quản lý danh mục';
    if (pathname?.startsWith('/admin/products/create')) return 'Thêm sản phẩm';
    if (pathname?.startsWith('/admin/products/edit')) return 'Chỉnh sửa sản phẩm';
    if (pathname?.startsWith('/admin/products')) return 'Quản lý sản phẩm';
    if (pathname?.startsWith('/admin/dashboard')) return 'Dashboard';
    return 'Admin';
  }, [pathname]);

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
    <div className="flex min-h-screen bg-[#f5f6fa]">
      <Sidebar isOpen={sidebarOpen} onCloseAction={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onToggleSidebarAction={() => setSidebarOpen(prev => !prev)} title={pageTitle} />
        <main className="flex-1 p-6">{children}</main>
      </div>

      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          type="button"
        />
      )}
    </div>
  );
}
