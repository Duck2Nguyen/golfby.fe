'use client';

import { useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import Link from 'next/link';

import type { Product } from '@/components/mock-data';

import { useSWRWrapper } from '@/hooks/swr';
import { useWishlistToggle } from '@/hooks/useWishlistToggle';
import { useAddToCartFromList } from '@/hooks/useAddToCartFromList';

import { METHOD } from '@/global/common';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import ProductInfo from '@/components/ProductDetail/ProductInfo';
import ProductGallery from '@/components/ProductDetail/ProductGallery';
import { ProductTabs, PaymentPolicyTab, ShippingPolicyTab } from '@/components/ProductDetail/ProductTabs';

interface ApiProductBrand {
  name?: string | null;
}

interface ApiProductCategory {
  id: string;
  name: string;
  slug?: string | null;
}

interface ApiProductImage {
  key?: string | null;
  url?: string | null;
}

interface ApiProductOptionValue {
  id: string;
  optionId?: string;
  value: string;
}

interface ApiProductOption {
  id: string;
  name: string;
  values?: ApiProductOptionValue[];
}

interface ApiProductVariantSelectedOptionValue {
  optionValue?: ApiProductOptionValue | null;
  productOptionValueId: string;
}

interface ApiProductVariant {
  id: string;
  listPrice?: string | number | null;
  salePrice?: string | number | null;
  selectedOptionValues?: ApiProductVariantSelectedOptionValue[];
  sku?: string | null;
  stock?: number | null;
}

interface ApiCustomOptionCondition {
  action: 'SHOW' | 'HIDE';
  id: string;
  targetOptionId: string;
  triggerChoiceId: string;
  triggerOptionId: string;
}

interface ApiCustomOptionChoice {
  id: string;
  imageUrl?: string | null;
  label: string;
  presignedImageUrl?: string | null;
  priceModifierType?: 'NONE' | 'FIXED' | 'PERCENT' | null;
  priceModifierValue?: number | string | null;
  value: string;
}

interface ApiCustomOption {
  conditionsAsTarget?: ApiCustomOptionCondition[];
  id: string;
  isRequired?: boolean | null;
  label: string;
  placeholder?: string | null;
  sortOrder?: number | null;
  type: 'RADIO' | 'DROPDOWN' | 'IMAGE_SWATCH' | 'CHECKBOX' | 'TEXT' | 'TEXTAREA' | 'NUMBER';
  choices?: ApiCustomOptionChoice[];
}

interface ApiCustomOptionGroup {
  id: string;
  name: string;
  options?: ApiCustomOption[];
}

interface ApiProductCustomOptionGroupLink {
  customOptionGroupId: string;
  group?: ApiCustomOptionGroup;
  productId: string;
  sortOrder?: number | null;
}

interface ApiProductListItem {
  brand?: ApiProductBrand | null;
  id: string;
  images?: ApiProductImage[];
  listPrice?: string | null;
  name: string;
  salePrice?: string | null;
}

interface ApiProductDetail extends ApiProductListItem {
  category?: ApiProductCategory | null;
  categoryId?: string | null;
  customOptionGroups?: ApiProductCustomOptionGroupLink[];
  description?: string | null;
  options?: ApiProductOption[];
  variants?: ApiProductVariant[];
}

const PRODUCT_IMAGE_FALLBACK = 'https://placehold.co/600x600?text=GolfBy';
const RELATED_PRODUCTS_LIMIT = 8;
const PRODUCT_DETAIL_CACHE_MS = 60 * 1000;

const toNumber = (value?: string | number | null) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const mapApiProductToCardData = (item: ApiProductListItem): Product => {
  const salePrice = toNumber(item.salePrice);
  const listPrice = toNumber(item.listPrice);

  const price = salePrice > 0 ? salePrice : listPrice;
  const originalPrice = salePrice > 0 && listPrice > salePrice ? listPrice : undefined;
  const discount =
    originalPrice && originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined;

  return {
    brand: item.brand?.name ?? 'GolfBy',
    ...(discount ? { badge: 'sale' } : {}),
    ...(discount ? { discount } : {}),
    id: item.id,
    image: item.images?.[0]?.url || item.images?.[0]?.key || PRODUCT_IMAGE_FALLBACK,
    name: item.name,
    ...(originalPrice ? { originalPrice } : {}),
    price,
    rating: 0,
    reviews: 0,
  };
};

const mapApiProductToDetailData = (item: ApiProductDetail): ProductDetailViewData => {
  const images =
    (item.images ?? [])
      .map(image => image.url || image.key)
      .filter((image): image is string => Boolean(image)) || [];

  const options =
    (item.options ?? [])
      .map(option => ({
        id: option.id,
        label: option.name,
        values: (option.values ?? [])
          .map(value => ({
            id: value.id,
            value: value.value,
          }))
          .filter(value => Boolean(value.value)),
      }))
      .filter(option => option.values.length > 0) || [];

  const optionValueLookup = new Map<string, { optionId?: string; optionLabel: string; value: string }>();

  options.forEach(option => {
    option.values.forEach(value => {
      if (!value.id) {
        return;
      }

      optionValueLookup.set(value.id, {
        optionId: option.id,
        optionLabel: option.label,
        value: value.value,
      });
    });
  });

  const variants =
    (item.variants ?? []).map(variant => {
      const listPrice = toNumber(variant.listPrice);
      const salePrice = toNumber(variant.salePrice);

      const selections: ProductDetailVariantSelection[] = (variant.selectedOptionValues ?? []).flatMap(
        selected => {
          const fallbackOptionValue = optionValueLookup.get(selected.productOptionValueId);
          const optionValue = selected.optionValue?.value ?? fallbackOptionValue?.value ?? null;

          if (!optionValue && !selected.productOptionValueId) {
            return [];
          }

          return [
            {
              optionId: selected.optionValue?.optionId ?? fallbackOptionValue?.optionId ?? null,
              optionLabel: fallbackOptionValue?.optionLabel ?? null,
              optionValue,
              optionValueId: selected.productOptionValueId ?? selected.optionValue?.id ?? null,
            },
          ];
        },
      );

      return {
        id: variant.id,
        ...(listPrice > 0 ? { listPrice } : {}),
        ...(salePrice > 0 ? { salePrice } : {}),
        selections,
        sku: variant.sku ?? null,
        stock: variant.stock ?? null,
      };
    }) || [];

  const customOptions =
    (item.customOptionGroups ?? [])
      .sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0))
      .flatMap(link => {
        return (link.group?.options ?? [])
          .sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0))
          .map(option => ({
            choices: (option.choices ?? []).map(choice => ({
              id: choice.id,
              imageUrl: choice.presignedImageUrl || choice.imageUrl || undefined,
              label: choice.label,
              priceModifierType: choice.priceModifierType ?? 'NONE',
              priceModifierValue: toNumber(choice.priceModifierValue),
              value: choice.value,
            })),
            conditionsAsTarget: (option.conditionsAsTarget ?? []).map(condition => ({
              action: condition.action,
              id: condition.id,
              targetOptionId: condition.targetOptionId,
              triggerChoiceId: condition.triggerChoiceId,
              triggerOptionId: condition.triggerOptionId,
            })),
            groupId: link.customOptionGroupId,
            groupName: link.group?.name ?? '',
            id: option.id,
            isRequired: Boolean(option.isRequired),
            label: option.label,
            placeholder: option.placeholder ?? '',
            type: option.type,
          }));
      }) || [];

  const hasVariants = variants.length > 0;
  const inStock = hasVariants ? variants.some(variant => (variant.stock ?? 0) > 0) : true;

  const sku =
    variants.find(variant => Boolean(variant.sku))?.sku || `SP-${item.id.slice(0, 8).toUpperCase()}`;

  return {
    category: item.category?.name ?? 'Sản phẩm',
    categorySlug: item.category?.slug ?? undefined,
    descriptionHtml:
      item.description?.trim() ||
      `<p>Sản phẩm chính hãng ${item.brand?.name ?? 'GolfBy'}, thông tin mô tả đang được cập nhật.</p>`,
    images: images.length > 0 ? images : [PRODUCT_IMAGE_FALLBACK],
    inStock,
    options,
    sku,
    customOptions,
    variants,
  };
};

export interface ProductDetailOption {
  id?: string;
  label: string;
  values: {
    id?: string;
    value: string;
  }[];
}

export interface ProductDetailVariantSelection {
  optionId?: string | null;
  optionLabel?: string | null;
  optionValue?: string | null;
  optionValueId?: string | null;
}

export interface ProductDetailVariant {
  id: string;
  listPrice?: number;
  salePrice?: number;
  selections: ProductDetailVariantSelection[];
  sku?: string | null;
  stock?: number | null;
}

export interface ProductDetailCustomOptionCondition {
  action: 'SHOW' | 'HIDE';
  id: string;
  targetOptionId: string;
  triggerChoiceId: string;
  triggerOptionId: string;
}

export interface ProductDetailCustomOptionChoice {
  id: string;
  imageUrl?: string;
  label: string;
  priceModifierType: 'NONE' | 'FIXED' | 'PERCENT';
  priceModifierValue: number;
  value: string;
}

export interface ProductDetailCustomOption {
  choices: ProductDetailCustomOptionChoice[];
  conditionsAsTarget: ProductDetailCustomOptionCondition[];
  groupId: string;
  groupName: string;
  id: string;
  isRequired: boolean;
  label: string;
  placeholder: string;
  type: 'RADIO' | 'DROPDOWN' | 'IMAGE_SWATCH' | 'CHECKBOX' | 'TEXT' | 'TEXTAREA' | 'NUMBER';
}

export interface ProductDetailViewData {
  category: string;
  categorySlug?: string;
  customOptions: ProductDetailCustomOption[];
  descriptionHtml: string;
  images: string[];
  inStock: boolean;
  options: ProductDetailOption[];
  sku: string;
  variants: ProductDetailVariant[];
}

interface ProductDetailClientProps {
  productId: string;
}

export default function ProductDetailPageClient({ productId }: ProductDetailClientProps) {
  const relatedScrollRef = useRef<HTMLDivElement>(null);
  const encodedProductId = useMemo(() => encodeURIComponent(productId), [productId]);
  const { addToCartFromList, addingProductId } = useAddToCartFromList();
  const { isWishlisted, togglingProductId, toggleWishlist } = useWishlistToggle();

  const {
    data: productDetailResponse,
    error: productDetailError,
    isLoading: isProductDetailLoading,
  } = useSWRWrapper<ApiProductDetail>(productId ? `products:detail:${encodedProductId}` : null, {
    dedupingInterval: PRODUCT_DETAIL_CACHE_MS,
    method: METHOD.GET,
    refreshInterval: PRODUCT_DETAIL_CACHE_MS,
    url: `/api/v1/products/${encodedProductId}`,
  });

  const productDetail = productDetailResponse?.data;

  const { data: relatedProductsResponse } = useSWRWrapper<ApiProductListItem[]>(
    productDetail ? `products:similar:${encodedProductId}:limit:${RELATED_PRODUCTS_LIMIT}` : null,
    {
      dedupingInterval: PRODUCT_DETAIL_CACHE_MS,
      method: METHOD.GET,
      refreshInterval: PRODUCT_DETAIL_CACHE_MS,
      url: `/api/v1/products/${encodedProductId}/similar?limit=${RELATED_PRODUCTS_LIMIT}`,
    },
  );

  const displayRelated = useMemo(() => {
    const sourceItems = (relatedProductsResponse?.data ?? []).filter(item => item.id !== productDetail?.id);

    return sourceItems.slice(0, RELATED_PRODUCTS_LIMIT).map(mapApiProductToCardData);
  }, [productDetail?.id, relatedProductsResponse?.data]);

  const product = useMemo(() => {
    if (!productDetail) {
      return null;
    }

    return mapApiProductToCardData(productDetail);
  }, [productDetail]);

  const detail = useMemo(() => {
    if (!productDetail) {
      return null;
    }

    return mapApiProductToDetailData(productDetail);
  }, [productDetail]);

  if (isProductDetailLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-20 text-center text-[1.4rem] text-muted-foreground">
          Đang tải sản phẩm...
        </main>
        <Footer />
      </div>
    );
  }

  if (productDetailError || !product || !detail) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="mb-3 text-[2.4rem] text-foreground font-700">Không tìm thấy sản phẩm</h1>
          <p className="mb-6 text-[1.4rem] text-muted-foreground">
            Sản phẩm không tồn tại hoặc đã được gỡ khỏi hệ thống.
          </p>
          <Link href="/collection" className="text-[1.4rem] text-primary" style={{ fontWeight: 600 }}>
            Quay về trang sản phẩm
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryHref = detail.categorySlug ? `/collection/${detail.categorySlug}` : '/collection';
  const descriptionMarkup =
    detail.descriptionHtml?.trim() || '<p>Thông tin mô tả sản phẩm đang được cập nhật.</p>';

  const scrollRelated = (direction: 'left' | 'right') => {
    if (relatedScrollRef.current) {
      const scrollAmount = 300;
      relatedScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const tabs = [
    {
      label: 'Thông tin chung',
      content: (
        <div className="max-w-3xl text-[1.6rem] leading-[2.8rem] text-muted-foreground [&_a]:text-primary [&_figure]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_li]:mb-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_strong]:text-foreground [&_strong]:font-700 [&_ul]:list-disc [&_ul]:pl-6">
          <div dangerouslySetInnerHTML={{ __html: descriptionMarkup }} />
        </div>
      ),
    },
    { label: 'Chính sách giao hàng và trả hàng', content: <ShippingPolicyTab /> },
    { label: 'Chính sách thanh toán', content: <PaymentPolicyTab /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 py-4 text-[13px] overflow-x-auto">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
          >
            Trang Chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
          <Link
            href={categoryHref}
            className="text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
          >
            {detail.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
          <span className="text-foreground truncate max-w-[300px] font-500">{product.name}</span>
        </nav>

        {/* Product Section - Gallery + Info */}
        <section className="flex flex-col lg:flex-row gap-8 lg:gap-12 pb-12">
          {/* Gallery */}
          <div className="w-full lg:w-[55%] lg:max-w-[580px]">
            <ProductGallery discount={product.discount} images={detail.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <ProductInfo
              productId={String(product.id)}
              name={product.name}
              image={product.image}
              brand={product.brand}
              sku={detail.sku}
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              options={detail.options}
              customOptions={detail.customOptions}
              variants={detail.variants}
              inStock={detail.inStock}
            />
          </div>
        </section>

        <div className="h-px bg-border/60" />

        {/* Product Tabs */}
        <section className="py-2">
          <ProductTabs tabs={tabs} />
        </section>

        <div className="h-px bg-border/60" />

        {/* Related Products */}
        <section className="py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[22px] text-foreground font-700">Sản Phẩm Liên Quan</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollRelated('left')}
                className="w-10 h-10 rounded-full border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollRelated('right')}
                className="w-10 h-10 rounded-full border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={relatedScrollRef}
            className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none' }}
          >
            {displayRelated.map(rp => (
              <div key={rp.id} className="shrink-0 w-[260px] snap-start">
                <ProductCard
                  isAddingToCart={addingProductId === String(rp.id)}
                  isWishlisted={isWishlisted(String(rp.id))}
                  isWishlistLoading={togglingProductId === String(rp.id)}
                  onAddToCartAction={currentProduct =>
                    addToCartFromList({
                      productId: String(currentProduct.id),
                      productName: currentProduct.name,
                    })
                  }
                  onToggleWishlistAction={currentProduct =>
                    toggleWishlist({
                      productId: String(currentProduct.id),
                      productName: currentProduct.name,
                    })
                  }
                  product={rp}
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
