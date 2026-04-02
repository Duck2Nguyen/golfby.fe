'use client';

import { useState } from 'react';
import {
  Star,
  Plus,
  Heart,
  Truck,
  Minus,
  Phone,
  Shield,
  RotateCcw,
  ShoppingCart,
  AlertTriangle,
  MessageCircle,
} from 'lucide-react';

interface ProductOption {
  label: string;
  values: string[];
}

interface ProductInfoProps {
  name: string;
  brand: string;
  sku: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  options: ProductOption[];
  inStock: boolean;
}

export default function ProductInfo({
  name,
  brand,
  sku,
  price,
  originalPrice,
  discount,
  rating,
  reviews,
  options,
  inStock,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    options.forEach(opt => {
      if (opt.values.length > 0) defaults[opt.label] = opt.values[0];
    });
    return defaults;
  });
  const [wishlisted, setWishlisted] = useState(false);
  const showRating = typeof rating === 'number' && typeof reviews === 'number' && reviews > 0;

  const formatPrice = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + ' VNĐ';

  return (
    <div className="space-y-5">
      {/* Brand & SKU */}
      <div className="flex items-center gap-3">
        <span className="text-[13px] text-primary uppercase tracking-wide font-600">
          Thương hiệu: {brand}
        </span>
        <span className="w-px h-3.5 bg-border" />
        <span className="text-[13px] text-muted-foreground">SKU: {sku}</span>
      </div>

      {/* Title */}
      <h1 className="text-[24px] text-foreground leading-tight font-700">{name}</h1>

      {/* Rating */}
      <div className="flex items-center gap-2">
        {showRating && (
          <>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < (rating ?? 0) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[13px] text-muted-foreground">({reviews} đánh giá)</span>
            <span className="w-px h-3.5 bg-border" />
          </>
        )}
        <span className={`text-[13px] font-500 ${inStock ? 'text-primary' : 'text-destructive'}`}>
          {inStock ? 'Còn hàng' : 'Hết hàng'}
        </span>
      </div>

      {/* Notice Banner */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[13px] text-amber-800 leading-relaxed">
          Sản phẩm phải thanh toán hoặc đặt cọc <span className="font-600">25%</span> trước khi giao/nhận
          hàng.
        </p>
      </div>

      {/* Price */}
      <div className="flex items-end gap-3">
        {price > 0 && originalPrice && (
          <span className="text-[16px] text-muted-foreground line-through">{formatPrice(originalPrice)}</span>
        )}
        {price > 0 ? (
          <span className="text-[28px] text-destructive font-700">{formatPrice(price)}</span>
        ) : (
          <span className="text-[28px] text-foreground font-700">Giá: Liên hệ</span>
        )}
        {price > 0 && discount && (
          <span className="text-[13px] text-destructive bg-destructive/10 px-2.5 py-1 rounded-lg font-600">
            -{discount}%
          </span>
        )}
      </div>

      <div className="h-px bg-border/60" />

      {/* Options */}
      <div className="space-y-4">
        {options.map(option => (
          <div key={option.label}>
            <label className="block text-[13px] text-foreground mb-2 font-600">{option.label}</label>
            <div className="flex flex-wrap gap-2">
              {option.values.map(value => (
                <button
                  key={value}
                  onClick={() =>
                    setSelectedOptions(prev => ({
                      ...prev,
                      [option.label]: value,
                    }))
                  }
                  className={`h-10 px-4 rounded-xl text-[13px] border-2 transition-all duration-200 font-500 ${
                    selectedOptions[option.label] === value
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-border bg-white text-foreground hover:border-primary/40'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-[13px] text-foreground mb-2 font-600">Số Lượng</label>
        <div className="flex items-center gap-0 border-2 border-border rounded-xl w-fit overflow-hidden">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="w-11 h-11 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-14 h-11 flex items-center justify-center text-[15px] border-x-2 border-border font-600">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(q => q + 1)}
            className="w-11 h-11 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Total Price */}
      <div className="flex items-center gap-2">
        <span className="text-[14px] text-muted-foreground">Tổng cộng:</span>
        <span className="text-[20px] text-primary font-700">
          {price > 0 ? formatPrice(price * quantity) : 'Liên hệ'}
        </span>
      </div>

      <div className="h-px bg-border/60" />

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <button className="flex-1 h-13 bg-primary hover:bg-primary-dark text-white rounded-xl text-[15px] flex items-center justify-center gap-2.5 transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] font-600">
            <ShoppingCart className="w-5 h-5" />
            Thêm Vào Giỏ Hàng
          </button>
          <button
            onClick={() => setWishlisted(!wishlisted)}
            className={`w-13 h-13 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
              wishlisted
                ? 'border-destructive bg-destructive/5 text-destructive'
                : 'border-border hover:border-primary hover:text-primary'
            }`}
          >
            <Heart className={`w-5 h-5 ${wishlisted ? 'fill-destructive' : ''}`} />
          </button>
        </div>

        <button className="w-full h-13 border-2 border-foreground bg-foreground hover:bg-foreground/90 text-white rounded-xl text-[15px] flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] font-600">
          Mua Ngay
        </button>

        {/* Contact Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="h-11 bg-[#0068FF] hover:bg-[#0068FF]/90 text-white rounded-xl text-[13px] flex items-center justify-center gap-2 transition-colors font-600">
            <MessageCircle className="w-4 h-4" />
            Liên Hệ Qua FB Messenger
          </button>
          <button className="h-11 bg-[#0068FF] hover:bg-[#0068FF]/90 text-white rounded-xl text-[13px] flex items-center justify-center gap-2 transition-colors font-600">
            <MessageCircle className="w-4 h-4" />
            Liên Hệ Qua Zalo
          </button>
        </div>
        <button className="w-full h-11 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-[13px] flex items-center justify-center gap-2 transition-colors font-600">
          <Phone className="w-4 h-4" />
          Liên Hệ Qua Hotline: +84 899 686 063
        </button>
      </div>

      <div className="h-px bg-border/60" />

      {/* Delivery Info */}
      <div className="space-y-3">
        {[
          {
            icon: Truck,
            title: 'Miễn phí giao hàng',
            desc: 'Cho đơn hàng từ 5.000.000 VNĐ',
          },
          {
            icon: RotateCcw,
            title: 'Đổi trả trong 7 ngày',
            desc: 'Lỗi hàng do nhà sản xuất',
          },
          {
            icon: Shield,
            title: 'Cam kết chính hãng',
            desc: '100% sản phẩm chính hãng',
          },
        ].map(item => (
          <div key={item.title} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[13px] text-foreground font-600">{item.title}</p>
              <p className="text-[12px] text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
