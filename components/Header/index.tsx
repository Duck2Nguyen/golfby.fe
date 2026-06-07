'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import {
  X,
  User,
  Menu,
  Heart,
  Search,
  MapPin,
  LogOut,
  ReceiptText,
  ChevronDown,
  ChevronRight,
  ShoppingCart,
} from 'lucide-react';

import * as Yup from 'yup';
import Link from 'next/link';
import { Form, Field, Formik } from 'formik';
import { useRouter, usePathname } from 'next/navigation';

import { getKey, setKey } from '@/utils/localStorage';

import { useSession } from '@/hooks/auth';
import { useCarts } from '@/hooks/useCarts';
import { useWishlists } from '@/hooks/useWishlists';
import { useBrands, type Brand } from '@/hooks/useBrands';
import { useCollections, type CollectionTreeNode } from '@/hooks/useCollections';

import InputField from '@/elements/InputField';

import { SearchSuggestion } from '../SearchSuggestion';

const searchSchema = Yup.object().shape({
  query: Yup.string(),
});

const SEARCH_HISTORY_KEY = 'golfby-search-history';
const MAX_SEARCH_HISTORY_ITEMS = 8;

interface DropdownColumn {
  title: string;
  href?: string;
  items: { label: string; href: string }[];
}

interface NavItem {
  label: string;
  href: string;
  highlight?: boolean;
  separatorAfter?: boolean;
  dropdown?: DropdownColumn[];
}

const PROMOTION_NAV_ITEM: NavItem = { label: 'Khuyến Mãi', highlight: true, href: '/collection/khuyen-mai' };
const TERMS_NAV_ITEM: NavItem = { label: 'Điều Khoản', href: '/dieu-khoan-va-dieu-kien' };
const BRAND_NAV_ITEM_LABEL = 'Thương hiệu';
const BRAND_NAV_ITEM_HREF = '/collection';

const buildCollectionHref = (...slugSegments: string[]) => {
  const normalizedSegments = slugSegments.filter(Boolean);

  if (normalizedSegments.length === 0) {
    return '/collection';
  }

  return `/collection/${normalizedSegments.join('/')}`;
};

const buildBrandHref = (slug: string) => {
  const query = new URLSearchParams({ brand: slug });

  return `/collection?${query.toString()}`;
};

const buildCollectionBrandHref = (pathSlugs: string[], brandSlug: string) => {
  const query = new URLSearchParams({ brand: brandSlug });

  return `${buildCollectionHref(...pathSlugs)}?${query.toString()}`;
};

interface CollectionPathNode {
  collection: CollectionTreeNode;
  pathSlugs: string[];
}

const flattenCollectionNodesWithPath = (
  nodes: CollectionTreeNode[],
  parentPathSlugs: string[] = [],
): CollectionPathNode[] => {
  return nodes.flatMap(node => {
    const currentPathSlugs = [...parentPathSlugs, node.slug];

    return [
      {
        collection: node,
        pathSlugs: currentPathSlugs,
      },
      ...flattenCollectionNodesWithPath(node.children ?? [], currentPathSlugs),
    ];
  });
};

const buildDropdownItems = (collection: CollectionTreeNode, pathSlugs: string[]): DropdownColumn['items'] => {
  const items: { label: string; href: string }[] = [];
  const seenHrefs = new Set<string>();

  // Add categories first
  for (const category of collection.categories ?? []) {
    const categoryHref = buildCollectionHref(...pathSlugs, category.slug);

    if (!seenHrefs.has(categoryHref)) {
      items.push({
        href: categoryHref,
        label: category.name,
      });
      seenHrefs.add(categoryHref);
    }
  }

  // Add "Tất Cả" at the end
  const collectionHref = buildCollectionHref(...pathSlugs);
  if (!seenHrefs.has(collectionHref)) {
    items.push({
      href: collectionHref,
      label: 'Tất Cả',
    });
  }

  return items;
};

const buildBrandDropdownItems = (
  brands: CollectionTreeNode['brands'],
  pathSlugs: string[],
): DropdownColumn['items'] => {
  const items: DropdownColumn['items'] = [];
  const seenHrefs = new Set<string>();

  for (const brand of brands ?? []) {
    if (!brand?.name || !brand.slug) {
      continue;
    }

    const brandHref = buildCollectionBrandHref(pathSlugs, brand.slug);

    if (seenHrefs.has(brandHref)) {
      continue;
    }

    items.push({
      href: brandHref,
      label: brand.name,
    });
    seenHrefs.add(brandHref);
  }

  const collectionHref = buildCollectionHref(...pathSlugs);

  if (!seenHrefs.has(collectionHref)) {
    items.push({
      href: collectionHref,
      label: 'Tất Cả',
    });
  }

  return items;
};

const buildBrandNavItem = (brands: Brand[]): NavItem => {
  const items: DropdownColumn['items'] = [];
  const seenHrefs = new Set<string>();

  for (const brand of brands) {
    if (!brand.name || !brand.slug) {
      continue;
    }

    const brandHref = buildBrandHref(brand.slug);

    if (seenHrefs.has(brandHref)) {
      continue;
    }

    items.push({
      href: brandHref,
      label: brand.name,
    });
    seenHrefs.add(brandHref);
  }

  if (!seenHrefs.has(BRAND_NAV_ITEM_HREF)) {
    items.push({
      href: BRAND_NAV_ITEM_HREF,
      label: 'Tất Cả',
    });
  }

  return {
    ...(items.length > 0 && {
      dropdown: [
        {
          href: BRAND_NAV_ITEM_HREF,
          items,
          title: '',
        },
      ],
    }),
    href: BRAND_NAV_ITEM_HREF,
    label: BRAND_NAV_ITEM_LABEL,
    separatorAfter: true,
  };
};

const sortRootCollectionsByOrder = (collections: CollectionTreeNode[]) => {
  return [...collections].sort((a, b) => {
    const aOrder = typeof a.sortOrder === 'number' ? a.sortOrder : Number.MAX_SAFE_INTEGER;
    const bOrder = typeof b.sortOrder === 'number' ? b.sortOrder : Number.MAX_SAFE_INTEGER;

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    return a.name.localeCompare(b.name, 'vi');
  });
};

const buildNavItemsFromCollections = (collections: CollectionTreeNode[]): NavItem[] => {
  const roots = collections.filter(collection => !collection.parentId);
  const rootCollections = roots.length > 0 ? sortRootCollectionsByOrder(roots) : collections;

  return rootCollections
    .filter(collection => Boolean(collection.name && collection.slug))
    .map(root => {
      const rootHref = buildCollectionHref(root.slug);
      const hasNestedData =
        (root.categories?.length ?? 0) > 0 ||
        (root.children?.length ?? 0) > 0 ||
        (root.brands?.length ?? 0) > 0;

      if (!hasNestedData) {
        return {
          href: rootHref,
          label: root.name,
        };
      }

      const hasChildren = (root.children?.length ?? 0) > 0;
      const dropdownCollections = hasChildren
        ? flattenCollectionNodesWithPath(root.children ?? [], [root.slug])
        : [{ collection: root, pathSlugs: [root.slug] }];

      const dropdown = dropdownCollections
        .map(item => ({
          href: buildCollectionHref(...item.pathSlugs),
          items: buildDropdownItems(item.collection, item.pathSlugs),
          title: item.collection.name,
        }))
        .filter(column => column.items.length > 0);

      const brandDropdownItems = buildBrandDropdownItems(root.brands, [root.slug]);

      if (brandDropdownItems.length > 0) {
        dropdown.push({
          href: rootHref,
          items: brandDropdownItems,
          title: 'Theo Hãng',
        });
      }

      return {
        ...(dropdown.length > 0 && { dropdown }),
        href: rootHref,
        label: root.name,
      };
    });
};

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileNav, setExpandedMobileNav] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const mobileUserMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { logout, data } = useSession();
  const { getAllBrands } = useBrands();
  const { getMyCart } = useCarts();
  const { getAllCollections } = useCollections();
  const brands = getAllBrands.data?.data;
  const collectionTree = getAllCollections.data?.data;

  const navItems = useMemo(() => {
    const brandNavItem = buildBrandNavItem(brands ?? []);
    const mappedNavItems = buildNavItemsFromCollections(collectionTree ?? []);

    if (mappedNavItems.length === 0) {
      return [brandNavItem];
    }

    return [brandNavItem, ...mappedNavItems, TERMS_NAV_ITEM, PROMOTION_NAV_ITEM];
  }, [brands, collectionTree]);

  const { getMyWishlist } = useWishlists();
  const cartItems = getMyCart.data?.data ?? [];
  const cartCount = cartItems.length ?? 0;
  const wishlistItems = getMyWishlist.data?.data ?? [];
  const wishlistCount = wishlistItems.length ?? 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const isInsideDesktopUserMenu = userMenuRef.current?.contains(target);
      const isInsideMobileUserMenu = mobileUserMenuRef.current?.contains(target);

      if (!isInsideDesktopUserMenu && !isInsideMobileUserMenu) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setExpandedMobileNav(null);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setExpandedMobileNav(null);
  };

  const submitSearch = (query: string) => {
    const trimmedQuery = query.trim();
    const nextSearchParams = new URLSearchParams();

    if (trimmedQuery) {
      nextSearchParams.set('search', trimmedQuery);

      const existingHistory = getKey<string[]>(SEARCH_HISTORY_KEY) ?? [];
      const nextHistory = [trimmedQuery, ...existingHistory.filter(item => item !== trimmedQuery)].slice(
        0,
        MAX_SEARCH_HISTORY_ITEMS,
      );

      setKey(SEARCH_HISTORY_KEY, nextHistory);
    }

    const nextQuery = nextSearchParams.toString();

    router.push(nextQuery ? `/collection?${nextQuery}` : '/collection');
    setSearchOpen(false);
  };

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top Bar */}
      {/* <div className="bg-primary text-primary-foreground">
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
      </div> */}

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
                submitSearch(values.query);
              }}
            >
              {({ setFieldValue, values }) => (
                <>
                  <Form autoComplete="off" className="relative">
                    <Field
                      name="query"
                      placeholder="Tìm kiếm sản phẩm golf..."
                      component={InputField}
                      autoComplete="new-password"
                      spellCheck={false}
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
                  {searchOpen && (
                    <SearchSuggestion
                      onClose={() => setSearchOpen(false)}
                      onSearchTextChange={value => {
                        void setFieldValue('query', value);
                      }}
                      onSubmitSearch={submitSearch}
                      searchText={values.query}
                    />
                  )}
                </>
              )}
            </Formik>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/wishlist"
              className="relative hidden sm:flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl hover:bg-muted transition-colors group"
            >
              <div className="relative">
                <Heart className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                {wishlistCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2 bg-destructive text-white text-[1.0rem] w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ fontWeight: 600 }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </div>
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
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2 bg-destructive text-white text-[1.0rem] w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ fontWeight: 600 }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden text-[1.1rem] text-muted-foreground transition-colors group-hover:text-primary sm:block">
                Giỏ hàng
              </span>
            </Link>

            {data?.isAuthenticated ? (
              <div className="relative sm:hidden" ref={mobileUserMenuRef}>
                <button
                  type="button"
                  aria-label="Tài khoản"
                  aria-expanded={userMenuOpen}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setUserMenuOpen(current => !current);
                  }}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    userMenuOpen
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-primary'
                  }`}
                >
                  <User className="h-5 w-5" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-[calc(100%+0.7rem)] z-50 w-[22rem] overflow-hidden rounded-xl border border-border/80 bg-white p-1.5 shadow-[0_14px_32px_rgba(15,23,42,0.14)]">
                    <div className="px-2.5 pb-1.5 pt-1">
                      <p className="text-[1.3rem] font-700 text-foreground">Tài khoản của bạn</p>
                      <p className="text-[1.1rem] text-muted-foreground">Quản lý thông tin và đơn hàng</p>
                    </div>
                    <Link
                      href="/address"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[1.3rem] font-500 text-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <MapPin className="h-3.5 w-3.5" />
                      </span>
                      Địa chỉ
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[1.3rem] font-500 text-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <ReceiptText className="h-3.5 w-3.5" />
                      </span>
                      Lịch sử đơn hàng
                    </Link>
                    <div className="my-1 border-t border-border/70" />
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[1.3rem] font-500 text-foreground transition-colors hover:bg-destructive/5 hover:text-destructive"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                        <LogOut className="h-3.5 w-3.5" />
                      </span>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                aria-label="Đăng nhập"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-primary sm:hidden"
              >
                <User className="h-5 w-5" />
              </Link>
            )}

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
                    <Link
                      href="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[1.4rem] text-foreground hover:bg-muted hover:text-primary transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      <ReceiptText className="w-4 h-4" />
                      Lịch sử đơn hàng
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
              onClick={() => {
                setUserMenuOpen(false);
                setMobileMenuOpen(current => !current);
              }}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
              className="ml-0 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-muted lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="border-b border-border hidden lg:block bg-primary">
        <div className="max-w-[180rem] mx-auto px-4 flex justify-center">
          <ul className="flex items-center gap-0">
            {navItems.map(item => [
              <li key={item.href} className="relative group/nav min-w-0">
                <Link
                  href={item.href}
                  className={`relative flex h-12 max-w-[16rem] min-w-0 items-center gap-1 overflow-hidden px-5 text-[1.5rem] transition-colors ${
                    item.highlight ? 'text-white hover:text-white/80' : 'text-white hover:text-white/80'
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  <span className="min-w-0 flex-1 truncate whitespace-nowrap">{item.label}</span>
                  {item.dropdown && (
                    <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-50 group-hover/nav:opacity-100 transition-all duration-200 group-hover/nav:rotate-180" />
                  )}
                  <span className="absolute bottom-0 left-5 right-5 h-0.5 bg-primary scale-x-0 group-hover/nav:scale-x-100 transition-transform origin-left rounded-full" />
                </Link>

                {/* Dropdown */}
                {item.dropdown && (
                  <div className="absolute left-0 top-full pt-0 invisible opacity-0 group-hover/nav:visible group-hover/nav:opacity-100 transition-all duration-200 z-50">
                    <div
                      className={`bg-white rounded-b-xl border border-t-0 border-border shadow-xl ${
                        item.dropdown.length > 1 ? 'min-w-[54rem]' : 'min-w-[20rem]'
                      }`}
                    >
                      {/* Mega menu (multi-column) */}
                      {item.dropdown.length > 1 ? (
                        <div
                          className="grid gap-0 px-6 py-4"
                          style={{ gridTemplateColumns: `repeat(${item.dropdown.length}, 1fr)` }}
                        >
                          {item.dropdown.map((col, colIndex) => (
                            <div
                              key={`${col.title || 'column'}-${colIndex}`}
                              className="pr-6 last:pr-0 pl-6 first:pl-0"
                            >
                              {col.title && (
                                <h4
                                  className="text-[1.4rem] text-foreground pb-2 whitespace-nowrap"
                                  style={{ fontWeight: 700 }}
                                >
                                  {col.title}
                                </h4>
                              )}
                              <ul className="space-y-0.5">
                                {col.items.map(subItem => (
                                  <li key={subItem.href}>
                                    <Link
                                      href={subItem.href}
                                      className={`block py-1.5 text-[1.4rem] ${
                                        item.href === BRAND_NAV_ITEM_HREF
                                          ? 'text-foreground'
                                          : 'text-muted-foreground'
                                      } hover:text-primary transition-colors whitespace-nowrap`}
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
                        <div className="px-6 py-4">
                          {item.dropdown[0].title && (
                            <h4
                              className="text-[1.4rem] text-foreground pb-2 whitespace-nowrap"
                              style={{ fontWeight: 700 }}
                            >
                              {item.dropdown[0].title}
                            </h4>
                          )}
                          <ul className="space-y-0.5">
                            {item.dropdown[0].items.map(subItem => (
                              <li key={subItem.href}>
                                <Link
                                  href={subItem.href}
                                  className={`block py-[6px] text-[1.4rem] ${
                                    item.href === BRAND_NAV_ITEM_HREF
                                      ? 'text-foreground'
                                      : 'text-muted-foreground'
                                  } hover:text-primary transition-colors whitespace-nowrap`}
                                  style={{ fontWeight: 400 }}
                                >
                                  {subItem.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </li>,
              item.separatorAfter ? (
                <li
                  key={`${item.href}-separator`}
                  aria-hidden="true"
                  className="px-1 text-white/40 text-[1.5rem]"
                  style={{ fontWeight: 400 }}
                >
                  |
                </li>
              ) : null,
            ])}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[7.2rem] z-40 lg:hidden">
          <button
            type="button"
            aria-label="Đóng menu"
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]"
          />
          <div className="relative flex h-full w-full flex-col overflow-hidden border-t border-border/70 bg-[#f7f8f6] shadow-2xl sm:max-w-[42rem]">
            <div className="border-b border-border/70 bg-white px-4 pb-4 pt-3">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[1.7rem] font-700 text-foreground">Danh mục sản phẩm</p>
                  <p className="text-[1.2rem] text-muted-foreground">Khám phá thiết bị golf theo nhu cầu</p>
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[1.1rem] font-600 text-primary">
                  GolfStore
                </span>
              </div>
              <Formik
                initialValues={{ query: '' }}
                validationSchema={searchSchema}
                onSubmit={values => {
                  submitSearch(values.query);
                  closeMobileMenu();
                }}
              >
                <Form autoComplete="off" className="relative">
                  <Field
                    name="query"
                    placeholder="Tìm kiếm sản phẩm golf..."
                    component={InputField}
                    autoComplete="new-password"
                    spellCheck={false}
                    classNames={{
                      inputWrapper:
                        '!bg-[#f5f6f4] !border !border-border/70 !h-11 !pr-11 !rounded-xl focus-within:!border-primary',
                      input: '!text-[1.4rem]',
                    }}
                  />
                  <button
                    type="submit"
                    aria-label="Tìm kiếm"
                    className="absolute right-1.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-primary text-white"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </Form>
              </Formik>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-3">
              <ul className="space-y-2">
                {navItems.map(item => (
                  <li
                    key={item.href}
                    className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
                      expandedMobileNav === item.href
                        ? 'border-primary/30 shadow-[0_8px_24px_rgba(35,83,24,0.08)]'
                        : 'border-border/70'
                    }`}
                  >
                    <div className="flex min-h-12 items-center">
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={`flex min-w-0 flex-1 items-center px-4 py-3 text-[1.5rem] font-600 transition-colors ${
                          item.highlight ? 'text-destructive' : 'text-foreground hover:text-primary'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                      </Link>
                      {item.dropdown && (
                        <button
                          type="button"
                          aria-label={`${expandedMobileNav === item.href ? 'Thu gọn' : 'Mở rộng'} ${item.label}`}
                          aria-expanded={expandedMobileNav === item.href}
                          onClick={() =>
                            setExpandedMobileNav(current => (current === item.href ? null : item.href))
                          }
                          className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              expandedMobileNav === item.href ? 'rotate-180 text-primary' : ''
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {item.dropdown && expandedMobileNav === item.href && (
                      <div className="border-t border-border/60 bg-[#fafbf9] px-3 py-3">
                        <div className="space-y-2">
                          {item.dropdown.map((column, columnIndex) => (
                            <div
                              key={`${column.title || 'column'}-${columnIndex}`}
                              className="rounded-xl border border-border/60 bg-white px-3 py-2.5"
                            >
                              {column.title && (
                                <Link
                                  href={column.href ?? item.href}
                                  onClick={closeMobileMenu}
                                  className="mb-1.5 flex items-center justify-between gap-3 text-[1.4rem] font-700 text-foreground transition-colors hover:text-primary"
                                >
                                  <span>{column.title}</span>
                                  <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
                                </Link>
                              )}
                              <ul className={column.title ? 'border-t border-border/50 pt-1.5' : ''}>
                                {column.items.map(subItem => (
                                  <li key={subItem.href}>
                                    <Link
                                      href={subItem.href}
                                      onClick={closeMobileMenu}
                                      className="flex items-center justify-between gap-3 rounded-lg px-1 py-2 text-[1.35rem] text-muted-foreground transition-colors hover:bg-primary/5 hover:px-2 hover:text-primary"
                                    >
                                      <span>{subItem.label}</span>
                                      <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border/70 bg-white p-3">
              {data?.isAuthenticated ? (
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    href="/address"
                    onClick={closeMobileMenu}
                    className="flex flex-col items-center gap-1.5 rounded-xl bg-muted/70 px-2 py-2.5 text-[1.2rem] font-600 text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <MapPin className="h-4 w-4" />
                    Địa chỉ
                  </Link>
                  <Link
                    href="/orders"
                    onClick={closeMobileMenu}
                    className="flex flex-col items-center gap-1.5 rounded-xl bg-muted/70 px-2 py-2.5 text-[1.2rem] font-600 text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <ReceiptText className="h-4 w-4" />
                    Đơn hàng
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      logout();
                    }}
                    className="flex flex-col items-center gap-1.5 rounded-xl bg-muted/70 px-2 py-2.5 text-[1.2rem] font-600 text-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-[1.4rem] font-700 text-white shadow-[0_8px_20px_rgba(55,130,38,0.22)] transition-colors hover:bg-primary-dark"
                >
                  <User className="h-4 w-4" />
                  Đăng nhập tài khoản
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
