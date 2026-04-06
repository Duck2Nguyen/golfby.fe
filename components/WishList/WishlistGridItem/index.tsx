import { Trash2, ShoppingCart } from 'lucide-react';

import { Link } from '@heroui/link';

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

import type { WishlistDisplayItem } from '../types';

interface WishlistGridItemProps {
  isAddingToCart: boolean;
  isRemoving: boolean;
  item: WishlistDisplayItem;
  onAddToCartAction: (item: WishlistDisplayItem) => Promise<void> | void;
  onRemove: (productId: string) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
};

export default function WishlistGridItem({
  isAddingToCart,
  isRemoving,
  item,
  onAddToCartAction,
  onRemove,
}: WishlistGridItemProps) {
  return (
    <div className="group bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-xl hover:shadow-black/8 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      <Link
        href={`/product/${item.productId}`}
        className="block relative aspect-square overflow-hidden bg-[#fafafa]"
      >
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <button
          onClick={event => {
            event.preventDefault();
            onRemove(item.productId);
          }}
          disabled={isRemoving}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-destructive hover:bg-destructive hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-70"
          title="Xóa khỏi danh sách"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={event => {
              event.preventDefault();
              event.stopPropagation();

              if (isAddingToCart) {
                return;
              }

              void onAddToCartAction(item);
            }}
            type="button"
            disabled={isAddingToCart}
            className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-[13px] flex items-center justify-center gap-2 transition-colors shadow-lg font-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <ShoppingCart className="w-4 h-4" />
            {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ'}
          </button>
        </div>
      </Link>

      <Link href={`/product/${item.productId}`} className="p-4 flex-1 flex flex-col">
        <p className="text-[12px] text-primary uppercase tracking-wide mb-1 font-600">{item.brand}</p>
        <h3 className="text-[14px] text-foreground mb-2 line-clamp-2 leading-snug min-h-[2.5em] flex-1 font-500">
          {item.name}
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          {item.originalPrice && (
            <span className="text-[13px] text-muted-foreground line-through">
              {formatPrice(item.originalPrice)}
            </span>
          )}
          <span className="text-[17px] text-primary font-700">{formatPrice(item.price)}</span>
        </div>
      </Link>
    </div>
  );
}
