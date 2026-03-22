'use client';

import { useRef, useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Menu,
  Heart,
  Phone,
  Search,
  MapPin,
  LogOut,
  ChevronDown,
  ShoppingCart,
} from 'lucide-react';

import * as Yup from 'yup';
import Link from 'next/link';
import { Form, Field, Formik } from 'formik';

import { useSession } from '@/hooks/auth';

import InputField from '@/elements/InputField';

import { SearchSuggestion } from '../SearchSuggestion';

const searchSchema = Yup.object().shape({
  query: Yup.string(),
});

interface DropdownColumn {
  title: string;
  items: { label: string; href: string }[];
}

interface NavItem {
  label: string;
  href: string;
  highlight?: boolean;
  dropdown?: DropdownColumn[];
}

const navItems: NavItem[] = [
  {
    label: 'Gậy Golf',
    href: '/category/gay-golf',
    dropdown: [
      {
        title: 'Gậy Custom (Thửa)',
        items: [
          { label: 'Custom Driver', href: '/category/gay-golf?type=custom-driver' },
          { label: 'Custom Fairway/Gỗ', href: '/category/gay-golf?type=custom-fairway' },
          { label: 'Custom Hybrid/Rescue', href: '/category/gay-golf?type=custom-hybrid' },
          { label: 'Custom Iron', href: '/category/gay-golf?type=custom-iron' },
          { label: 'Custom Driving Iron', href: '/category/gay-golf?type=custom-driving-iron' },
          { label: 'Custom Wedge', href: '/category/gay-golf?type=custom-wedge' },
          { label: 'Custom Putter', href: '/category/gay-golf?type=custom-putter' },
        ],
      },
      {
        title: 'Gậy',
        items: [
          { label: 'Fullset', href: '/category/gay-golf?type=fullset' },
          { label: 'Driver', href: '/category/gay-golf?type=driver' },
          { label: 'Fairway/Gỗ', href: '/category/gay-golf?type=fairway' },
          { label: 'Hybrid/Rescue', href: '/category/gay-golf?type=hybrid' },
          { label: 'Sắt', href: '/category/gay-golf?type=sat' },
          { label: 'Wedge', href: '/category/gay-golf?type=wedge' },
          { label: 'Putter', href: '/category/gay-golf?type=putter' },
          { label: 'Tất Cả', href: '/category/gay-golf' },
        ],
      },
      {
        title: 'Theo Hãng',
        items: [
          { label: 'Titleist', href: '/category/gay-golf?brand=titleist' },
          { label: 'TaylorMade', href: '/category/gay-golf?brand=taylormade' },
          { label: 'Ping', href: '/category/gay-golf?brand=ping' },
          { label: 'Callaway', href: '/category/gay-golf?brand=callaway' },
          { label: 'Mizuno', href: '/category/gay-golf?brand=mizuno' },
          { label: 'XXIO', href: '/category/gay-golf?brand=xxio' },
          { label: 'Tất Cả', href: '/category/gay-golf' },
        ],
      },
    ],
  },
  {
    label: 'Shaft Gậy',
    href: '/category/shaft-gay',
    dropdown: [
      {
        title: '',
        items: [
          { label: 'Driver', href: '/category/shaft-gay?type=driver' },
          { label: 'Fairway/Gỗ', href: '/category/shaft-gay?type=fairway' },
          { label: 'Sắt', href: '/category/shaft-gay?type=sat' },
        ],
      },
    ],
  },
  {
    label: 'Bóng Golf',
    href: '/category/bong-golf',
    dropdown: [
      {
        title: '',
        items: [
          { label: 'Titleist', href: '/category/bong-golf?brand=titleist' },
          { label: 'TaylorMade', href: '/category/bong-golf?brand=taylormade' },
          { label: 'Callaway', href: '/category/bong-golf?brand=callaway' },
          { label: 'Bridgestone', href: '/category/bong-golf?brand=bridgestone' },
        ],
      },
    ],
  },
  {
    label: 'Phụ Kiện',
    href: '/category/phu-kien',
    dropdown: [
      {
        title: 'Phụ Kiện',
        items: [
          { label: 'Túi Golf', href: '/category/phu-kien?type=tui' },
          { label: 'Găng Tay', href: '/category/phu-kien?type=gang-tay' },
          { label: 'Mũ Golf', href: '/category/phu-kien?type=mu' },
          { label: 'Kính Golf', href: '/category/phu-kien?type=kinh' },
          { label: 'Tất Cả', href: '/category/phu-kien' },
        ],
      },
      {
        title: 'Thiết Bị',
        items: [
          { label: 'Máy Đo Khoảng Cách', href: '/category/phu-kien?type=rangefinder' },
          { label: 'Đồng Hồ GPS', href: '/category/phu-kien?type=gps' },
          { label: 'Xe Đẩy Golf', href: '/category/phu-kien?type=xe-day' },
          { label: 'Tất Cả', href: '/category/phu-kien' },
        ],
      },
    ],
  },
  {
    label: 'Thời Trang Golf',
    href: '/category/thoi-trang',
    dropdown: [
      {
        title: 'Nam',
        items: [
          { label: 'Áo Polo', href: '/category/thoi-trang?type=ao-polo-nam' },
          { label: 'Quần Golf', href: '/category/thoi-trang?type=quan-nam' },
          { label: 'Giày Golf', href: '/category/thoi-trang?type=giay-nam' },
          { label: 'Tất Cả', href: '/category/thoi-trang?gender=nam' },
        ],
      },
      {
        title: 'Nữ',
        items: [
          { label: 'Áo Polo', href: '/category/thoi-trang?type=ao-polo-nu' },
          { label: 'Váy Golf', href: '/category/thoi-trang?type=vay' },
          { label: 'Giày Golf', href: '/category/thoi-trang?type=giay-nu' },
          { label: 'Tất Cả', href: '/category/thoi-trang?gender=nu' },
        ],
      },
    ],
  },
  { label: 'Khuyến Mãi', highlight: true, href: '/category/khuyen-mai' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { logout, data } = useSession();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9">
          <div className="flex items-center gap-5 text-[1.3rem]">
            <a href="#" className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
              <Phone className="w-3.5 h-3.5" />
              <span>1900 1234</span>
            </a>
            <a href="#" className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
              <Mail className="w-3.5 h-3.5" />
              <span>info@golfstore.vn</span>
            </a>
          </div>
          <div className="hidden md:flex items-center gap-5 text-[1.3rem]">
            <a href="#" className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
              <MapPin className="w-3.5 h-3.5" />
              <span>Hệ thống cửa hàng</span>
            </a>
            <span className="w-px h-3.5 bg-white/30" />
            <a href="#" className="hover:text-white/80 transition-colors">
              Tin tức
            </a>
            <span className="w-px h-3.5 bg-white/30" />
            <a href="#" className="hover:text-white/80 transition-colors">
              Liên hệ
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[7.2rem] gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white text-[1.8rem]" style={{ fontWeight: 700 }}>
                G
              </span>
            </div>
            <div className="hidden sm:block">
              <div
                className="text-primary text-[2.0rem] tracking-tight"
                style={{ fontWeight: 700, lineHeight: 1.1 }}
              >
                GolfStore
              </div>
              <div className="text-muted-foreground text-[1.1rem] tracking-widest uppercase">
                Premium Equipment
              </div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden flex-1 max-w-xl md:block relative" ref={searchRef}>
            <Formik
              initialValues={{ query: '' }}
              validationSchema={searchSchema}
              onSubmit={values => {
                console.log('Search:', values.query);
                setSearchOpen(false);
              }}
            >
              {({ setFieldTouched }) => (
                <Form className="relative">
                  <Field
                    name="query"
                    placeholder="Tìm kiếm sản phẩm golf..."
                    component={InputField}
                    onFocus={() => setSearchOpen(true)}
                    classNames={{
                      inputWrapper: [
                        '!bg-[#f5f5f5] !border-transparent',
                        searchOpen
                          ? '!rounded-t-xl !rounded-b-none !border-primary !bg-white ring-2 ring-primary/20'
                          : '!rounded-xl',
                        '!pr-12 !h-11',
                      ].join(' '),
                      input: '!text-[1.5rem]',
                    }}
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-primary transition-colors hover:bg-primary-dark"
                  >
                    <Search className="h-4 w-4 text-white" />
                  </button>
                </Form>
              )}
            </Formik>
            {searchOpen && <SearchSuggestion onClose={() => setSearchOpen(false)} />}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/wishlist"
              className="hidden sm:flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl hover:bg-muted transition-colors group"
            >
              <Heart className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-[1.1rem] text-muted-foreground group-hover:text-primary transition-colors">
                Yêu thích
              </span>
            </Link>
            <Link
              href="/cart"
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl hover:bg-muted transition-colors group"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span
                  className="absolute -top-1.5 -right-2 bg-destructive text-white text-[1.0rem] w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ fontWeight: 600 }}
                >
                  3
                </span>
              </div>
              <span className="text-[1.1rem] text-muted-foreground group-hover:text-primary transition-colors">
                Giỏ hàng
              </span>
            </Link>

            {/* User Dropdown */}
            {data?.isAuthenticated ? (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl hover:bg-muted cursor-pointer transition-colors group"
                >
                  <User className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-[1.1rem] text-muted-foreground group-hover:text-primary transition-colors">
                    Tài khoản
                  </span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-[120%] mt-1 w-48 bg-white rounded-xl border border-border/80 shadow-[0_0_20px_rgba(0,0,0,0.1)] py-2 z-50">
                    <Link
                      href="/address"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[1.4rem] text-foreground hover:bg-muted hover:text-primary transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      <MapPin className="w-4 h-4" />
                      Địa chỉ
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[1.4rem] text-foreground hover:bg-muted hover:text-destructive transition-colors disabled:opacity-60"
                      style={{ fontWeight: 500 }}
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl hover:bg-muted transition-colors group"
              >
                <User className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-[1.1rem] text-muted-foreground group-hover:text-primary transition-colors">
                  Đăng nhập
                </span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden ml-2 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-border hidden lg:block">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-0">
            {navItems.map(item => (
              <li key={item.label} className="relative group/nav">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 px-5 h-12 text-[1.5rem] transition-colors relative ${
                    item.highlight
                      ? 'text-destructive hover:text-destructive'
                      : 'text-foreground hover:text-primary'
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {item.label}
                  {item.dropdown && (
                    <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover/nav:opacity-100 transition-all duration-200 group-hover/nav:rotate-180" />
                  )}
                  <span className="absolute bottom-0 left-5 right-5 h-0.5 bg-primary scale-x-0 group-hover/nav:scale-x-100 transition-transform origin-left rounded-full" />
                </Link>

                {/* Dropdown */}
                {item.dropdown && (
                  <div className="absolute left-0 top-full pt-0 invisible opacity-0 group-hover/nav:visible group-hover/nav:opacity-100 transition-all duration-200 z-50">
                    <div
                      className={`bg-white rounded-b-xl border border-t-0 border-border shadow-xl ${
                        item.dropdown.length > 1 ? 'min-w-[64rem]' : 'min-w-[20rem]'
                      }`}
                    >
                      {/* Mega menu (multi-column) */}
                      {item.dropdown.length > 1 ? (
                        <div
                          className="grid gap-0 p-6"
                          style={{ gridTemplateColumns: `repeat(${item.dropdown.length}, 1fr)` }}
                        >
                          {item.dropdown.map(col => (
                            <div
                              key={col.title}
                              className="pr-6 last:pr-0 border-r border-border/50 last:border-r-0 pl-6 first:pl-0"
                            >
                              {col.title && (
                                <h4
                                  className="text-[1.4rem] text-foreground mb-3 pb-2 border-b border-border/50 whitespace-nowrap"
                                  style={{ fontWeight: 700 }}
                                >
                                  {col.title}
                                </h4>
                              )}
                              <ul className="space-y-0.5">
                                {col.items.map(subItem => (
                                  <li key={subItem.label}>
                                    <Link
                                      href={subItem.href}
                                      className="block py-1.5 text-[1.4rem] text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                                      style={{ fontWeight: 400 }}
                                    >
                                      {subItem.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Simple dropdown (single column) */
                        <div className="py-2">
                          {item.dropdown[0].items.map(subItem => (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className="block px-5 py-2.5 text-[1.4rem] text-foreground hover:bg-muted hover:text-primary transition-colors"
                              style={{ fontWeight: 400 }}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-border shadow-lg">
          <div className="px-4 py-3">
            <Formik
              initialValues={{ query: '' }}
              validationSchema={searchSchema}
              onSubmit={values => {
                console.log('Mobile Search:', values.query);
                setMobileMenuOpen(false);
              }}
            >
              <Form className="relative mb-3">
                <Field
                  name="query"
                  placeholder="Tìm kiếm..."
                  component={InputField}
                  classNames={{
                    inputWrapper: '!bg-muted !border-none !h-10 !pr-10 !rounded-lg',
                    input: '!text-[1.4rem]',
                  }}
                />
                <button type="submit" className="absolute right-3 top-1/2 z-10 -translate-y-1/2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </button>
              </Form>
            </Formik>
            <ul className="space-y-1">
              {navItems.map(item => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`block px-3 py-2.5 rounded-lg text-[1.5rem] ${
                      item.highlight
                        ? 'text-destructive'
                        : 'text-foreground hover:bg-muted hover:text-primary'
                    } transition-colors`}
                    style={{ fontWeight: 500 }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
