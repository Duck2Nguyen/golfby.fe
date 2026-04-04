'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';

import Link from 'next/link';

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface OrderSummaryItem {
  id: number | string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  specs?: Array<{ label: string; value: string }>;
}

interface OrderSummaryProps {
  items: OrderSummaryItem[];
  subtotal: number;
  couponDiscount: number;
  total: number;
  couponCode: string;
  couponApplied: boolean;
  canCheckout?: boolean;
  isCheckoutLoading?: boolean;
  onCouponCodeChangeAction: (value: string) => void;
  onApplyCouponAction: () => void;
  onCheckoutAction?: () => void;
}

export default function OrderSummary({
  items,
  subtotal,
  couponDiscount,
  total,
  couponCode,
  couponApplied,
  canCheckout = true,
  isCheckoutLoading = false,
  onCouponCodeChangeAction,
  onApplyCouponAction,
  onCheckoutAction,
}: OrderSummaryProps) {
  const [expandedItems, setExpandedItems] = useState<Array<number | string>>([]);

  const formatPrice = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + ' ₫';
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  const toggleItemExpand = (id: number | string) => {
    setExpandedItems(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  return (
    <div className="w-full lg:w-[420px] shrink-0">
      <div className="bg-white rounded-2xl border border-border/50 overflow-hidden sticky top-[140px]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-[#fafafa]">
          <h2 className="text-[16px] text-foreground font-700">Đơn Hàng ({totalItems})</h2>
          <Link href="/cart" className="text-[13px] text-primary font-500">
            Sửa đổi
          </Link>
        </div>

        {/* Items */}
        <div className="divide-y divide-border/40 max-h-[400px] overflow-y-auto">
          {items.map(item => {
            const isExpanded = expandedItems.includes(item.id);
            return (
              <div key={item.id} className="p-4 hover:bg-[#fafafa]">
                <div className="flex gap-3">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f3f3f3] border border-border/30">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-700">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.productId}`} className="block">
                      <p className="text-[13px] text-foreground line-clamp-2 mb-1 font-500 hover:text-primary transition-colors">
                        {item.name}
                      </p>
                    </Link>

                    {item.originalPrice && (
                      <p className="text-[11px] text-muted-foreground line-through mb-1">
                        {formatPrice(item.originalPrice * item.quantity)}
                      </p>
                    )}

                    {item.specs && item.specs.length > 0 && (
                      <button
                        onClick={() => toggleItemExpand(item.id)}
                        className="text-[11px] text-primary/70 hover:text-primary"
                      >
                        {isExpanded ? 'Ẩn' : 'Xem chi tiết'}
                      </button>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-[14px] text-foreground font-600">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>

                {isExpanded && item.specs && item.specs.length > 0 && (
                  <div className="mt-3 ml-[76px] p-3 bg-[#f8f8f8] rounded-lg space-y-1">
                    {item.specs.map(spec => (
                      <div key={spec.label} className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">{spec.label}</span>
                        <span className="text-foreground font-500">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Coupon */}
        <div className="px-5 py-4 border-t border-border/40 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={e => onCouponCodeChangeAction(e.target.value.toUpperCase())}
              placeholder="Mã giảm giá"
              disabled={couponApplied}
              className="flex-1 h-11 px-4 rounded-xl border border-border bg-[#f8f8f8] text-[13px] outline-none focus:border-primary disabled:opacity-60"
            />
            <button
              onClick={onApplyCouponAction}
              disabled={!couponCode.trim() || couponApplied}
              className="h-11 px-5 rounded-xl border-2 border-border text-[13px] text-foreground hover:border-primary hover:text-primary disabled:opacity-40 font-600"
            >
              OK
            </button>
          </div>
          {couponApplied && <p className="text-[12px] text-primary">Giảm 5%</p>}
        </div>

        {/* Price */}
        <div className="px-5 py-3 border-t border-border/40 space-y-2 text-[14px]">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tổng phụ</span>
            <span className="font-600">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Vận chuyển</span>
            <span className="text-primary font-600">MIỄN PHÍ</span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mã giảm giá</span>
              <span className="text-primary font-600">-{formatPrice(couponDiscount)}</span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="px-5 py-4 border-t border-border/40 bg-[#fafafa]">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[16px] font-700">TỔNG</span>
            <span className="text-[24px] text-primary font-700">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Button */}
        <div className="px-5 pb-5">
          <button
            onClick={onCheckoutAction}
            disabled={!canCheckout || isCheckoutLoading}
            className="w-full h-14 bg-primary text-white text-[1.4rem] rounded-xl font-600 hover:bg-primary-dark flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Lock className="w-4 h-4" />
            {isCheckoutLoading ? 'Đang xử lý...' : 'Thanh toán'}
          </button>
        </div>
      </div>
    </div>
  );
}
