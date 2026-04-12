export const CHECKOUT_SELECTED_CART_ITEM_IDS_KEY = 'checkout:selectedCartItemIds';
export const CHECKOUT_DIRECT_ITEMS_KEY = 'checkout:directItems';

export interface CheckoutItemSpec {
  label: string;
  value: string;
}

export interface DirectCheckoutItem {
  image?: string;
  name?: string;
  originalPrice?: number;
  price?: number;
  productId: string;
  quantity: number;
  specs?: CheckoutItemSpec[];
  variantId?: string;
}

const toOptionalString = (value: unknown) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
};

const toOptionalNonNegativeNumber = (value: unknown) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
};

export const normalizeSelectedCartItemIds = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(itemId => (typeof itemId === 'string' || typeof itemId === 'number' ? String(itemId) : ''))
    .map(itemId => itemId.trim())
    .filter(itemId => itemId.length > 0);
};

export const normalizeDirectCheckoutItems = (value: unknown): DirectCheckoutItem[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap(item => {
    if (typeof item !== 'object' || item === null) {
      return [];
    }

    const record = item as Record<string, unknown>;
    const productId = toOptionalString(record.productId);

    if (!productId) {
      return [];
    }

    const rawQuantity = Number(record.quantity);
    const quantity = Number.isInteger(rawQuantity) && rawQuantity > 0 ? rawQuantity : 1;

    const specs = Array.isArray(record.specs)
      ? record.specs
          .map(spec => {
            if (typeof spec !== 'object' || spec === null) {
              return null;
            }

            const specRecord = spec as Record<string, unknown>;
            const label = toOptionalString(specRecord.label);
            const specValue = toOptionalString(specRecord.value);

            if (!label || !specValue) {
              return null;
            }

            return {
              label,
              value: specValue,
            };
          })
          .filter((spec): spec is CheckoutItemSpec => Boolean(spec))
      : [];

    const variantId = toOptionalString(record.variantId);
    const name = toOptionalString(record.name);
    const image = toOptionalString(record.image);
    const price = toOptionalNonNegativeNumber(record.price);
    const originalPrice = toOptionalNonNegativeNumber(record.originalPrice);

    return [
      {
        ...(image ? { image } : {}),
        ...(name ? { name } : {}),
        ...(typeof originalPrice === 'number' ? { originalPrice } : {}),
        ...(typeof price === 'number' ? { price } : {}),
        productId,
        quantity,
        ...(specs.length > 0 ? { specs } : {}),
        ...(variantId ? { variantId } : {}),
      },
    ];
  });
};
