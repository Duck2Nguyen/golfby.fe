'use client';

import { Link } from '@heroui/link';
import { usePathname } from 'next/navigation';

const MENU_ITEMS = [
  {
    key: 'dashboard',
    label: 'Bảng điều khiển',
    href: '/admin/dashboard',
    icon: (
      <svg
        className="h-[2rem] w-[2rem]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: 'customers',
    label: 'Khách hàng',
    href: '/admin/customers',
    icon: (
      <svg
        className="h-[2rem] w-[2rem]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: 'products',
    label: 'Sản phẩm',
    href: '/admin/products',
    icon: (
      <svg
        className="h-[2rem] w-[2rem]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: 'orders',
    label: 'Đơn hàng',
    href: '/admin/orders',
    icon: (
      <svg
        className="h-[2rem] w-[2rem]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[26rem] flex-shrink-0 flex-col border-r border-gray-100 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-6">
        <div className="flex h-[3.6rem] w-[3.6rem] items-center justify-center rounded-xl bg-primary-500">
          <span className="text-[1.8rem] font-700 text-white">G</span>
        </div>
        <div>
          <p className="text-[1.6rem] font-700 leading-none text-gray-900">GolfStore</p>
          <p className="text-[1.1rem] font-500 text-primary-500 uppercase tracking-wider">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-6">
        {MENU_ITEMS.map(item => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.key}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[1.5rem] font-500 transition-all duration-200 ${
                isActive
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              href={item.href}
            >
              <span className={isActive ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <div className="flex h-[3.6rem] w-[3.6rem] items-center justify-center rounded-full bg-primary-500/20 text-[1.4rem] font-700 text-primary-500">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[1.3rem] font-600 text-gray-800">Admin</p>
            <p className="truncate text-[1.1rem] text-gray-400">admin@golfstore.vn</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
