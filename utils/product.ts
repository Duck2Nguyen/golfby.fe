import type { Product } from '@/components/mock-data';

export const PRODUCT_IMAGE_FALLBACK = 'https://placehold.co/600x600?text=GolfBy';

export const toNumber = (value?: string | number | null) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const mapApiProductToCardData = (item: any): Product => {
  const salePrice = toNumber(item.salePrice);
  const listPrice = toNumber(item.listPrice);

  const price = salePrice > 0 ? salePrice : listPrice;
  const originalPrice = salePrice > 0 && listPrice > price ? listPrice : undefined;
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
