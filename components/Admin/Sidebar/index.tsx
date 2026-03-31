'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Tag,
  Image,
  Users,
  LogOut,
  Package,
  Settings,
  BarChart3,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ShoppingCart,
  ChevronsRight,
  MessageSquare,
  LayoutDashboard,
} from 'lucide-react';

import { Link } from '@heroui/link';
import { usePathname } from 'next/navigation';

interface SidebarChild {
  exact?: boolean;
  href: string;
  label: string;
}

interface SidebarItem {
  children?: SidebarChild[];
  href?: string;
  icon: React.ElementType;
  key: string;
  label: string;
}

const MENU_ITEMS: SidebarItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    key: 'customers',
    label: 'Quản lý người dùng',
    href: '/admin/customers',
    icon: Users,
  },
  {
    key: 'products',
    label: 'Sản phẩm',
    icon: Package,
    children: [
      { exact: true, href: '/admin/products', label: 'Danh sách sản phẩm' },
      { href: '/admin/products/create', label: 'Thêm sản phẩm' },
      { href: '/admin/products/brands', label: 'Quản lý thương hiệu' },
      { href: '/admin/products/categories', label: 'Quản lý danh mục' },
      { exact: true, href: '/admin/products/collections', label: 'Quản lý collection' },
      { href: '/admin/products/collections-preview', label: 'Preview collection tree' },
      { href: '/admin/products/tags', label: 'Quản lý tag' },
    ],
  },
  {
    key: 'orders',
    label: 'Đơn hàng',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    key: 'promotions',
    label: 'Khuyến mãi',
    href: '/admin/promotions',
    icon: Tag,
  },
  {
    key: 'reviews',
    label: 'Đánh giá',
    href: '/admin/reviews',
    icon: MessageSquare,
  },
  {
    key: 'media',
    label: 'Banner & Media',
    href: '/admin/media',
    icon: Image,
  },
  {
    key: 'analytics',
    label: 'Thống kê',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    key: 'settings',
    label: 'Cài đặt',
    href: '/admin/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export default function Sidebar({ isOpen, onCloseAction }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['products']);

  useEffect(() => {
    onCloseAction();
  }, [pathname, onCloseAction]);

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => (prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key]));
  };

  const normalizePath = (path?: string) => {
    if (!path) return '';
    const normalized = path.replace(/\/+$/, '');
    return normalized || '/';
  };

  const isActive = (href?: string, exact = false) => {
    if (!href || !pathname) return false;

    const currentPath = normalizePath(pathname);
    const targetPath = normalizePath(href);

    if (exact) {
      return currentPath === targetPath;
    }

    return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
  };

  const isGroupActive = (item: SidebarItem) => {
    if (!item.children) return false;
    return item.children.some(child => isActive(child.href, child.exact));
  };

  return (
    <aside
      className={`fixed top-0 z-50 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 lg:sticky ${
        collapsed ? 'w-[7.2rem]' : 'w-[26rem]'
      } ${isOpen ? 'left-0' : '-left-[26rem] lg:left-0'}`}
    >
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-5">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary">
          <span className="text-[1.3rem] font-700 text-white">GS</span>
        </div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="truncate text-[1.5rem] font-600 text-gray-900">Golf Store</p>
              <p className="text-[1.1rem] text-gray-400">Admin Panel</p>
            </div>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 lg:hidden"
              onClick={onCloseAction}
              type="button"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {MENU_ITEMS.map(item => {
          const Icon = item.icon;
          const hasChildren = Boolean(item.children);
          const expanded = expandedGroups.includes(item.key);
          const active = isActive(item.href) || isGroupActive(item);

          if (hasChildren) {
            return (
              <div key={item.key}>
                <button
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[1.4rem] transition-colors duration-150 ${
                    active
                      ? 'bg-primary-light text-primary'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                  onClick={() => toggleGroup(item.key)}
                  type="button"
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate text-left">{item.label}</span>
                      {expanded ? (
                        <ChevronDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 flex-shrink-0" />
                      )}
                    </>
                  )}
                </button>

                {!collapsed && expanded && (
                  <div className="mt-1 ml-5 space-y-0.5 border-l-2 border-gray-200 pl-4">
                    {item.children?.map(child => {
                      const childActive = isActive(child.href, child.exact);
                      return (
                        <Link
                          key={child.href}
                          className={`block rounded-lg px-3 py-2 text-[1.3rem] transition-colors duration-150 ${
                            childActive
                              ? 'bg-primary-light font-500 text-primary'
                              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                          }`}
                          href={child.href}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.key}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[1.4rem] transition-colors duration-150 ${
                active
                  ? 'bg-primary-light font-500 text-primary'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`}
              href={item.href as string}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-gray-200 p-3">
        <button
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[1.4rem] text-gray-500 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-800"
          onClick={() => setCollapsed(prev => !prev)}
          type="button"
        >
          {collapsed ? (
            <ChevronsRight className="h-5 w-5 flex-shrink-0" />
          ) : (
            <ChevronsLeft className="h-5 w-5 flex-shrink-0" />
          )}
          {!collapsed && <span>Thu gọn</span>}
        </button>

        <Link
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[1.4rem] text-gray-500 transition-colors duration-150 hover:bg-red-50 hover:text-red-500"
          href="/"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Về trang chủ</span>}
        </Link>
      </div>
    </aside>
  );
}
