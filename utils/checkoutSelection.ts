export const CHECKOUT_SELECTED_CART_ITEM_IDS_KEY = 'checkout:selectedCartItemIds';

export const normalizeSelectedCartItemIds = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(itemId => (typeof itemId === 'string' || typeof itemId === 'number' ? String(itemId) : ''))
    .map(itemId => itemId.trim())
    .filter(itemId => itemId.length > 0);
};
