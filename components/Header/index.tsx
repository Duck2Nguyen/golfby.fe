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
  ShoppingCart,
} from 'lucide-react';

import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Form, Field, Formik } from 'formik';

import { useSession } from '@/hooks/auth';
import { useCarts } from '@/hooks/useCarts';
import { useBrands, type Brand } from '@/hooks/useBrands';
import { useCollections, type CollectionTreeNode } from '@/hooks/useCollections';

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
  separatorAfter?: boolean;
  dropdown?: DropdownColumn[];
}

const PROMOTION_NAV_ITEM: NavItem = { label: 'Khuyến Mãi', highlight: true, href: '/collection/khuyen-mai' };
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

const buildNavItemsFromCollections = (collections: CollectionTreeNode[]): NavItem[] => {
  const roots = collections.filter(collection => !collection.parentId);
  const rootCollections = roots.length > 0 ? roots : collections;

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
          items: buildDropdownItems(item.collection, item.pathSlugs),
          title: item.collection.name,
        }))
        .filter(column => column.items.length > 0);

      const brandDropdownItems = buildBrandDropdownItems(root.brands, [root.slug]);

      if (brandDropdownItems.length > 0) {
        dropdown.push({
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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

    return [brandNavItem, ...mappedNavItems, PROMOTION_NAV_ITEM];
  }, [brands, collectionTree]);

  const cartItems = getMyCart.data?.data ?? [];
  const cartCount = cartItems.length ?? 0;

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

  const submitSearch = (query: string) => {
    const trimmedQuery = query.trim();
    const nextSearchParams = new URLSearchParams();

    if (trimmedQuery) {
      nextSearchParams.set('search', trimmedQuery);
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
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2 bg-destructive text-white text-[1.0rem] w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ fontWeight: 600 }}
                  >
                    {cartCount}
                  </span>
                )}
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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden ml-2 p-2 rounded-lg hover:bg-muted transition-colors"
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
        <div className="lg:hidden bg-white border-b border-border shadow-lg">
          <div className="px-4 py-3">
            <Formik
              initialValues={{ query: '' }}
              validationSchema={searchSchema}
              onSubmit={values => {
                submitSearch(values.query);
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
                <li key={item.href}>
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
