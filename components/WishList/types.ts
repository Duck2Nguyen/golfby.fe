export interface WishlistDisplayItem {
  addedAtLabel: string;
  brand: string;
  id: string;
  image: string;
  name: string;
  originalPrice?: number;
  price: number;
  productId: string;
}

export type ViewMode = 'list' | '2col' | '3col' | '4col';
