'use client';

import { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

import { Link } from '@heroui/link';
import { Checkbox } from '@heroui/checkbox';

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

export interface CartItem {
  id: number | string;
  productId: number | string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  specs?: { label: string; value: string }[];
}

interface CartItemRowProps {
  isSelected: boolean;
  item: CartItem;
  onSelectChange: (id: number | string, isSelected: boolean) => void;
  onQuantityChange: (id: number | string, qty: number) => void;
  onRemove: (id: number | string) => void;
}

export default function CartItemRow({
  isSelected,
  item,
  onSelectChange,
  onQuantityChange,
  onRemove,
}: CartItemRowProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const formatPrice = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + '₫';
  const subtotal = item.price * item.quantity;

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(item.id), 300);
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-border/50 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-black/4 hover:border-border ${
        isRemoving ? 'opacity-0 scale-95 -translate-x-4' : 'opacity-100'
      }`}
    >
      <div className="flex gap-5">
        <div className="pt-1 flex items-center">
          <Checkbox
            aria-label={`Chọn sản phẩm ${item.name}`}
            isSelected={isSelected}
            onValueChange={selected => onSelectChange(item.id, selected)}
            classNames={{
              base: 'm-0 p-0',
              wrapper:
                'border-2 border-border/70 before:border-transparent group-data-[hover=true]:before:bg-transparent',
            }}
            radius="sm"
          />
        </div>

        {/* Product Image */}
        <Link
          href={`/product/${item.productId}`}
          className="shrink-0 w-[120px] h-[120px] rounded-xl overflow-hidden bg-[#f8f8f8] border border-border/30 hover:shadow-md transition-shadow"
        >
          <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </Link>

        {/* Product Info + Controls */}
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Info */}
          <div className="flex-1 min-w-0">
            <Link href={`/product/${item.productId}`} className="block group/link">
              <p className="text-[11px] text-primary uppercase tracking-wider mb-1 font-600">{item.brand}</p>
              <h3 className="text-[15px] text-foreground leading-snug mb-2.5 line-clamp-2 group-hover/link:text-primary transition-colors font-600">
                {item.name}
              </h3>
            </Link>

            {/* Specs */}
            {item.specs?.length ? (
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {item.specs.map(spec => (
                  <span key={spec.label} className="text-[12px] text-muted-foreground">
                    <span className="text-foreground/70 font-500">{spec.label}:</span> {spec.value}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* Price + Quantity + Subtotal */}
          <div className="flex items-center gap-6 sm:gap-8 shrink-0">
            {/* Price */}
            <div className="hidden md:flex flex-col items-end gap-0.5 min-w-[110px]">
              <span className="text-[15px] text-foreground font-600">{formatPrice(item.price)}</span>
              {item.originalPrice && (
                <span className="text-[12px] text-muted-foreground line-through">
                  {formatPrice(item.originalPrice)}
                </span>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center border border-border rounded-xl overflow-hidden bg-[#fafafa]">
              <button
                onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                className="w-9 h-9 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-30"
                disabled={item.quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 h-9 flex items-center justify-center text-[14px] border-x border-border bg-white font-600">
                {item.quantity}
              </span>
              <button
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                className="w-9 h-9 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Subtotal */}
            <div className="min-w-[120px] text-right">
              <span className="text-[16px] text-primary font-700">{formatPrice(subtotal)}</span>
            </div>

            {/* Remove - desktop */}
            <button
              onClick={handleRemove}
              className="hidden md:flex w-9 h-9 rounded-full border border-border/70 items-center justify-center text-muted-foreground/60 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all duration-200"
              title="Xóa sản phẩm"
              aria-label="Xóa sản phẩm"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: Price shown below on small screens */}
      <div className="flex md:hidden items-center justify-between mt-3 pt-3 border-t border-border/40">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-foreground font-500">{formatPrice(item.price)}</span>
          {item.originalPrice && (
            <span className="text-[11px] text-muted-foreground line-through">
              {formatPrice(item.originalPrice)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[14px] text-primary font-700">{formatPrice(subtotal)}</span>
          <button
            onClick={handleRemove}
            className="inline-flex items-center gap-1.5 text-[12px] text-destructive hover:text-destructive/80 transition-colors font-600"
            title="Xóa sản phẩm"
            aria-label="Xóa sản phẩm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
