'use client';

import { useMemo, useState, useEffect } from 'react';
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

import { addToast } from '@heroui/toast';
import { useRouter } from 'next/navigation';

import { useCarts } from '@/hooks/useCarts';
import { useWishlistToggle } from '@/hooks/useWishlistToggle';

interface ProductOptionValue {
  id?: string;
  value: string;
}

interface ProductOption {
  id?: string;
  label: string;
  values: ProductOptionValue[];
}

interface ProductVariantSelection {
  optionId?: string | null;
  optionLabel?: string | null;
  optionValue?: string | null;
  optionValueId?: string | null;
}

interface ProductVariant {
  id: string;
  listPrice?: number;
  salePrice?: number;
  selections: ProductVariantSelection[];
  sku?: string | null;
  stock?: number | null;
}

interface ProductInfoProps {
  productId: string;
  name: string;
  brand: string;
  sku: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  options: ProductOption[];
  variants: ProductVariant[];
  inStock: boolean;
}

export default function ProductInfo({
  productId,
  name,
  brand,
  sku,
  price,
  originalPrice,
  discount,
  rating,
  reviews,
  options,
  variants,
  inStock,
}: ProductInfoProps) {
  const router = useRouter();
  const { addToCartMutation, getMyCart } = useCarts();
  const { isWishlisted, togglingProductId, toggleWishlist } = useWishlistToggle();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, { value: string; valueId?: string }>>(
    {},
  );
  const showRating = typeof rating === 'number' && typeof reviews === 'number' && reviews > 0;

  const toNumber = (value?: number | null) => {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const getOptionKey = (option: ProductOption) => option.id ?? option.label;

  useEffect(() => {
    if (options.length === 0 || variants.length === 0) {
      return;
    }

    setSelectedOptions(current => {
      const next: Record<string, { value: string; valueId?: string }> = {};

      options.forEach(option => {
        if (option.values.length === 0) {
          return;
        }

        const optionKey = getOptionKey(option);
        const currentSelection = current[optionKey];

        const hasValidCurrentSelection =
          currentSelection &&
          option.values.some(value => {
            if (currentSelection.valueId && value.id) {
              return currentSelection.valueId === value.id;
            }

            return currentSelection.value === value.value;
          });

        if (hasValidCurrentSelection) {
          next[optionKey] = currentSelection;
          return;
        }

        const firstValue = option.values[0];
        next[optionKey] = {
          value: firstValue.value,
          ...(firstValue.id ? { valueId: firstValue.id } : {}),
        };
      });

      const currentKeys = Object.keys(current);
      const nextKeys = Object.keys(next);

      const hasSameSelection =
        currentKeys.length === nextKeys.length &&
        nextKeys.every(key => {
          const currentSelection = current[key];
          const nextSelection = next[key];

          if (!currentSelection || !nextSelection) {
            return false;
          }

          return (
            currentSelection.value === nextSelection.value &&
            currentSelection.valueId === nextSelection.valueId
          );
        });

      return hasSameSelection ? current : next;
    });
  }, [options, variants.length]);

  const selectedVariant = useMemo(() => {
    if (variants.length === 0 || options.length === 0) {
      return null;
    }

    const matchedVariant = variants.find(variant => {
      if (variant.selections.length === 0) {
        return false;
      }

      return options.every(option => {
        const optionKey = getOptionKey(option);
        const selected = selectedOptions[optionKey];

        if (!selected) {
          return false;
        }

        const matchedSelection = variant.selections.find(selection => {
          if (selection.optionId && option.id) {
            return selection.optionId === option.id;
          }

          if (selection.optionLabel) {
            return selection.optionLabel === option.label;
          }

          return false;
        });

        if (!matchedSelection) {
          return false;
        }

        if (selected.valueId && matchedSelection.optionValueId) {
          return selected.valueId === matchedSelection.optionValueId;
        }

        return matchedSelection.optionValue === selected.value;
      });
    });

    if (matchedVariant) {
      return matchedVariant;
    }

    return null;
  }, [options, selectedOptions, variants]);

  const variantListPrice = toNumber(selectedVariant?.listPrice);
  const variantSalePrice = toNumber(selectedVariant?.salePrice);
  const hasVariantPricing = Boolean(selectedVariant && (variantListPrice > 0 || variantSalePrice > 0));

  const displayPrice = hasVariantPricing
    ? variantSalePrice > 0
      ? variantSalePrice
      : variantListPrice
    : price;

  const displayOriginalPrice = hasVariantPricing
    ? variantSalePrice > 0 && variantListPrice > variantSalePrice
      ? variantListPrice
      : undefined
    : originalPrice;

  const displayDiscount =
    displayPrice > 0 && displayOriginalPrice && displayOriginalPrice > displayPrice
      ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
      : discount;

  const displaySku = selectedVariant?.sku || sku;
  const displayInStock =
    variants.length > 0
      ? selectedVariant
        ? (selectedVariant.stock ?? 0) > 0
        : variants.some(variant => (variant.stock ?? 0) > 0)
      : inStock;

  const hasVariants = variants.length > 0;
  const selectedVariantId = selectedVariant?.id;
  const isActionLoading = addToCartMutation.isMutating;
  const wishlisted = isWishlisted(productId);
  const isWishlistLoading = togglingProductId === productId;

  const validatePurchaseState = () => {
    if (!displayInStock) {
      addToast({
        color: 'warning',
        description: 'Biến thể đã chọn đang hết hàng.',
      });
      return false;
    }

    if (hasVariants && !selectedVariantId) {
      addToast({
        color: 'warning',
        description: 'Vui lòng chọn đầy đủ thuộc tính sản phẩm.',
      });
      return false;
    }

    if (selectedVariant && typeof selectedVariant.stock === 'number' && selectedVariant.stock >= 0) {
      if (quantity > selectedVariant.stock) {
        addToast({
          color: 'warning',
          description: `Số lượng tồn không đủ. Chỉ còn ${selectedVariant.stock} sản phẩm.`,
        });
        return false;
      }
    }

    return true;
  };

  const addCurrentSelectionToCart = async () => {
    if (!validatePurchaseState()) {
      return false;
    }

    try {
      await addToCartMutation.trigger({
        csrf: true,
        productId,
        quantity,
        ...(selectedVariantId ? { variantId: selectedVariantId } : {}),
      });
      await getMyCart.mutate();
      return true;
    } catch (error) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? Array.isArray((error as { message?: string | string[] }).message)
            ? (error as { message?: string[] }).message?.[0]
            : (error as { message?: string }).message
          : undefined;

      addToast({
        color: 'danger',
        description: message || 'Không thể thêm sản phẩm vào giỏ hàng.',
      });

      return false;
    }
  };

  const handleAddToCart = async () => {
    await addCurrentSelectionToCart();
  };

  const handleBuyNow = async () => {
    const added = await addCurrentSelectionToCart();

    if (!added) {
      return;
    }

    router.push('/checkout');
  };

  const handleToggleWishlist = async () => {
    await toggleWishlist({
      productId,
      productName: name,
    });
  };

  const formatPrice = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + ' VNĐ';

  return (
    <div className="space-y-5">
      {/* Brand & SKU */}
      <div className="flex items-center gap-3">
        <span className="text-[13px] text-primary uppercase tracking-wide font-600">
          Thương hiệu: {brand}
        </span>
        <span className="w-px h-3.5 bg-border" />
        <span className="text-[13px] text-muted-foreground">SKU: {displaySku}</span>
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
        <span className={`text-[13px] font-500 ${displayInStock ? 'text-primary' : 'text-destructive'}`}>
          {displayInStock ? 'Còn hàng' : 'Hết hàng'}
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
        {displayPrice > 0 && displayOriginalPrice && (
          <span className="text-[16px] text-muted-foreground line-through">
            {formatPrice(displayOriginalPrice)}
          </span>
        )}
        {displayPrice > 0 ? (
          <span className="text-[28px] text-destructive font-700">{formatPrice(displayPrice)}</span>
        ) : (
          <span className="text-[28px] text-foreground font-700">Giá: Liên hệ</span>
        )}
        {displayPrice > 0 && displayDiscount && (
          <span className="text-[13px] text-destructive bg-destructive/10 px-2.5 py-1 rounded-lg font-600">
            -{displayDiscount}%
          </span>
        )}
      </div>

      <div className="h-px bg-border/60" />

      {/* Options */}
      <div className="space-y-4">
        {options.map(option => (
          <div key={option.id ?? option.label}>
            <label className="block text-[13px] text-foreground mb-2 font-600">{option.label}</label>
            <div className="flex flex-wrap gap-2">
              {option.values.map(value => {
                const optionKey = getOptionKey(option);
                const selectedValue = selectedOptions[optionKey];
                const isSelected =
                  selectedValue?.valueId && value.id
                    ? selectedValue.valueId === value.id
                    : selectedValue?.value === value.value;

                return (
                  <button
                    key={value.id ?? value.value}
                    onClick={() => {
                      setSelectedOptions(prev => ({
                        ...prev,
                        [optionKey]: {
                          value: value.value,
                          ...(value.id ? { valueId: value.id } : {}),
                        },
                      }));
                    }}
                    className={`h-10 px-4 rounded-xl text-[13px] border-2 transition-all duration-200 font-500 ${
                      isSelected
                        ? 'border-primary bg-primary-light text-primary'
                        : 'border-border bg-white text-foreground hover:border-primary/40'
                    }`}
                  >
                    {value.value}
                  </button>
                );
              })}
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
          {displayPrice > 0 ? formatPrice(displayPrice * quantity) : 'Liên hệ'}
        </span>
      </div>

      <div className="h-px bg-border/60" />

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <button
            onClick={() => {
              void handleAddToCart();
            }}
            disabled={isActionLoading || !displayInStock}
            className="flex-1 h-13 bg-primary hover:bg-primary-dark text-white rounded-xl text-[15px] flex items-center justify-center gap-2.5 transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] font-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShoppingCart className="w-5 h-5" />
            Thêm Vào Giỏ Hàng
          </button>
          <button
            onClick={() => {
              if (isWishlistLoading) {
                return;
              }

              void handleToggleWishlist();
            }}
            disabled={isWishlistLoading}
            className={`w-13 h-13 rounded-xl border-2 flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 ${
              wishlisted
                ? 'border-destructive bg-destructive/5 text-destructive'
                : 'border-border hover:border-primary hover:text-primary'
            }`}
          >
            <Heart className={`w-5 h-5 ${wishlisted ? 'fill-destructive' : ''}`} />
          </button>
        </div>

        <button
          onClick={() => {
            void handleBuyNow();
          }}
          disabled={isActionLoading || !displayInStock}
          className="w-full h-13 border-2 border-foreground bg-foreground hover:bg-foreground/90 text-white rounded-xl text-[15px] flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] font-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
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
