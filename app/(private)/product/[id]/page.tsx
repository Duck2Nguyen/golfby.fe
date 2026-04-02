import { notFound } from 'next/navigation';

import type { Product } from '@/components/mock-data';
import type { RestResponse, PaginatedResponse } from '@/interfaces/response';

import ProductDetailPageClient, {
  type ProductDetailViewData,
} from '@/components/ProductDetail/ProductDetailClient';

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
  value: string;
}

interface ApiProductOption {
  name: string;
  values?: ApiProductOptionValue[];
}

interface ApiProductVariant {
  sku?: string | null;
  stock?: number | null;
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
  brandId?: string | null;
  category?: ApiProductCategory | null;
  categoryId?: string | null;
  collectionId?: string | null;
  description?: string | null;
  options?: ApiProductOption[];
  variants?: ApiProductVariant[];
}

const API_BASE_URL = process.env.BASE_API_URL ?? 'http://localhost:8000';
const PRODUCT_IMAGE_FALLBACK = 'https://placehold.co/600x600?text=GolfBy';
const RELATED_PRODUCTS_LIMIT = 8;

const toNumber = (value?: string | null) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const fetchApi = async <T,>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    cache: 'no-store',
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`Request failed: ${endpoint} (${response.status})`);
  }

  const payload = (await response.json()) as RestResponse<T>;
  return payload.data;
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
        label: option.name,
        values: (option.values ?? [])
          .map(value => value.value)
          .filter((value): value is string => Boolean(value)),
      }))
      .filter(option => option.values.length > 0) || [];

  const hasVariants = (item.variants?.length ?? 0) > 0;
  const inStock = hasVariants ? (item.variants ?? []).some(variant => (variant.stock ?? 0) > 0) : true;

  const sku =
    (item.variants ?? []).find(variant => Boolean(variant.sku))?.sku ||
    `SP-${item.id.slice(0, 8).toUpperCase()}`;

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
  };
};

const getRelatedProducts = async (product: ApiProductDetail): Promise<Product[]> => {
  const query = new URLSearchParams({
    page: '1',
    size: String(RELATED_PRODUCTS_LIMIT + 1),
  });

  if (product.categoryId) {
    query.set('categoryId', product.categoryId);
  }

  const related = await fetchApi<PaginatedResponse<ApiProductListItem>>(
    `/api/v1/products?${query.toString()}`,
  );
  let relatedItems = (related.items ?? []).filter(item => item.id !== product.id);

  if (relatedItems.length === 0 && product.categoryId) {
    const fallbackQuery = new URLSearchParams({
      page: '1',
      size: String(RELATED_PRODUCTS_LIMIT + 1),
    });

    const fallback = await fetchApi<PaginatedResponse<ApiProductListItem>>(
      `/api/v1/products?${fallbackQuery.toString()}`,
    );
    relatedItems = (fallback.items ?? []).filter(item => item.id !== product.id);
  }

  return relatedItems.slice(0, RELATED_PRODUCTS_LIMIT).map(mapApiProductToCardData);
};

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const productDetail = await fetchApi<ApiProductDetail>(`/api/v1/products/${encodeURIComponent(id)}`);

  const product = mapApiProductToCardData(productDetail);
  const detail = mapApiProductToDetailData(productDetail);
  const displayRelated = await getRelatedProducts(productDetail);

  return <ProductDetailPageClient detail={detail} displayRelated={displayRelated} product={product} />;
}
