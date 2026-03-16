'use client';

import { useState } from 'react';
import { Tag, Ticket, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

import Link from 'next/link';

interface OrderSummaryProps {
  subtotal: number;
  itemCount: number;
}

export default function OrderSummary({ subtotal, itemCount }: OrderSummaryProps) {
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const formatPrice = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + '₫';

  const discount = couponApplied ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal - discount;

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setCouponApplied(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border/50 overflow-hidden sticky top-[140px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4">
        <h3 className="text-[16px] text-white font-700">Tóm Tắt Đơn Hàng</h3>
        <p className="text-[13px] text-white/70 mt-0.5">{itemCount} sản phẩm trong giỏ</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-muted-foreground">Tổng phụ</span>
          <span className="text-[15px] text-foreground font-600">{formatPrice(subtotal)}</span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-muted-foreground">Phí vận chuyển</span>
          <span className="text-[13px] text-primary font-600">Miễn phí</span>
        </div>

        {/* Discount */}
        {couponApplied && (
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-primary flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Giảm giá (5%)
            </span>
            <span className="text-[15px] text-primary font-600">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="h-px bg-border/60" />

        {/* Coupon */}
        <div>
          <label className="flex items-center gap-2 text-[13px] text-foreground mb-2.5 font-600">
            <Ticket className="w-4 h-4 text-primary" />
            Mã phiếu giảm giá
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Nhập mã phiếu giảm giá"
              className="flex-1 h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[13px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:bg-white transition-all disabled:opacity-50"
              disabled={couponApplied}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={!couponCode.trim() || couponApplied}
              className="h-11 px-5 rounded-xl text-[13px] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-primary/10 text-primary hover:bg-primary hover:text-white font-600"
            >
              {couponApplied ? 'Đã áp dụng' : 'Áp Dụng'}
            </button>
          </div>
          {couponApplied && (
            <p className="text-[12px] text-primary mt-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Mã giảm giá đã được áp dụng thành công!
            </p>
          )}
          <p className="text-[11px] text-muted-foreground/70 mt-2 leading-relaxed">
            Mã phiếu giảm giá sẽ được áp dụng khi trong trạng thái thanh toán.
          </p>
        </div>

        <div className="h-px bg-border/60" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-[16px] text-foreground font-700">TỔNG CỘNG</span>
          <span className="text-[22px] text-primary font-700">{formatPrice(total)}</span>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={e => setAgreedToTerms(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                agreedToTerms
                  ? 'bg-primary border-primary'
                  : 'bg-white border-gray-300 group-hover:border-primary/50'
              }`}
            >
              {agreedToTerms && (
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-[12px] text-muted-foreground leading-relaxed select-none group-hover:text-foreground transition-colors">
            Tôi đồng ý với{' '}
            <a href="#" className="text-primary underline underline-offset-2 hover:text-primary-dark">
              Điều Khoản
            </a>{' '}
            và{' '}
            <a href="#" className="text-primary underline underline-offset-2 hover:text-primary-dark">
              Điều Kiện
            </a>{' '}
            mua hàng
          </span>
        </label>

        {/* Action Buttons */}
        <div className="space-y-3 pt-1">
          <Link
            href={agreedToTerms && itemCount > 0 ? '/checkout' : '#'}
            onClick={e => {
              if (!agreedToTerms || itemCount === 0) e.preventDefault();
            }}
            className={`w-full h-13 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-dark text-white rounded-xl text-[15px] flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-primary/25 active:scale-[0.98] font-600 ${
              !agreedToTerms || itemCount === 0 ? 'opacity-40 cursor-not-allowed hover:shadow-md' : ''
            }`}
          >
            Tiến Hành Thanh Toán
            <ArrowRight className="w-4.5 h-4.5" />
          </Link>

          <Link
            href="/"
            className="w-full h-12 border-2 border-border hover:border-primary rounded-xl text-[14px] text-foreground hover:text-primary flex items-center justify-center gap-2 transition-all duration-200 font-600"
          >
            <ShoppingBag className="w-4 h-4" />
            Tiếp Tục Mua Sắm
          </Link>
        </div>
      </div>
    </div>
  );
}
