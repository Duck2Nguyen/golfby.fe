import { Trash2, ShoppingCart } from 'lucide-react';

import { Link } from '@heroui/link';

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

import type { WishlistDisplayItem } from '../types';

interface WishlistListItemProps {
  isRemoving: boolean;
  item: WishlistDisplayItem;
  onRemove: (productId: string) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
};

export default function WishlistListItem({ isRemoving, item, onRemove }: WishlistListItemProps) {
  return (
    <div className="group bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-lg transition-all duration-200 flex">
      <Link
        href={`/product/${item.productId}`}
        className="relative w-40 sm:w-52 shrink-0 overflow-hidden bg-[#fafafa]"
      >
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[12px] text-primary uppercase tracking-wide mb-1 font-600">{item.brand}</p>
          <Link href={`/product/${item.productId}`}>
            <h3 className="text-[15px] text-foreground mb-2 hover:text-primary transition-colors font-600">
              {item.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            {item.originalPrice && (
              <span className="text-[14px] text-muted-foreground line-through">
                {formatPrice(item.originalPrice)}
              </span>
            )}
            <span className="text-[18px] text-primary font-700">{formatPrice(item.price)}</span>
          </div>
          <p className="text-[12px] text-muted-foreground mt-2">Đã thêm {item.addedAtLabel}</p>
        </div>

        <div className="flex sm:flex-col gap-2 shrink-0">
          <button className="flex items-center justify-center gap-2 px-5 h-10 bg-primary hover:bg-primary/90 text-white rounded-xl text-[13px] transition-colors font-600">
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Thêm vào giỏ</span>
          </button>
          <button
            onClick={() => onRemove(item.productId)}
            disabled={isRemoving}
            className="flex items-center justify-center gap-2 px-5 h-10 border border-border text-muted-foreground hover:text-destructive hover:border-destructive rounded-xl text-[13px] transition-all duration-200 font-500 disabled:opacity-70"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
}
