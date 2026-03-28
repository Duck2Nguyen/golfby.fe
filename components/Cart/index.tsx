'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ShieldCheck, ChevronRight, ShoppingCart, MessageSquare } from 'lucide-react';

import { Link } from '@heroui/link';
import { Spinner } from '@heroui/spinner';

import { useCarts, type CartItem as ApiCartItem } from '@/hooks/useCarts';

import type { CartItem } from '@/components/Cart/CartItemRow';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import CartItemRow from '@/components/Cart/CartItemRow';
import OrderSummary from '@/components/Cart/OrderSummary';
import { ProductCard } from '@/components/ProductCard';
import { accessoryProducts, ballProducts, clubProducts } from '@/components/mock-data';

const bestSellers = [...clubProducts, ...ballProducts, ...accessoryProducts].slice(0, 6);

const toNumber = (value?: string | null) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: string | string[] }).message;
    if (Array.isArray(message)) {
      return message[0] || 'Không thể tải giỏ hàng.';
    }

    return message || 'Không thể tải giỏ hàng.';
  }

  return 'Không thể tải giỏ hàng.';
};

export default function Cart() {
  const [note, setNote] = useState('');
  const [isClearing, setIsClearing] = useState(false);
  const relatedScrollRef = useRef<HTMLDivElement>(null);

  const { getMyCart, removeCartItemMutation, updateCartItemMutation } = useCarts();
  const { data, error, isLoading, mutate } = getMyCart;

  const cartApiItems = useMemo<ApiCartItem[]>(
    () => (Array.isArray(data?.data) ? data.data : []),
    [data?.data],
  );

  const cartItems = useMemo<CartItem[]>(() => {
    return cartApiItems
      .filter(item => Boolean(item.product))
      .map(item => {
        const product = item.product!;
        const variant = item.variant;

        const productListPrice = toNumber(product.listPrice);
        const productSalePrice = toNumber(product.salePrice);
        const variantListPrice = toNumber(variant?.listPrice);
        const variantSalePrice = toNumber(variant?.salePrice);

        const listPrice = variantListPrice > 0 ? variantListPrice : productListPrice;
        const salePrice = variantSalePrice > 0 ? variantSalePrice : productSalePrice;
        const hasSalePrice = salePrice > 0;

        const firstImage = product.images?.[0];
        const specs = [
          variant?.sku ? { label: 'SKU', value: variant.sku } : null,
          variant?.barcode ? { label: 'Barcode', value: variant.barcode } : null,
        ].filter((spec): spec is { label: string; value: string } => Boolean(spec));

        return {
          brand: 'GolfBy',
          id: item.id,
          image: firstImage?.url || firstImage?.key || 'https://placehold.co/600x600?text=GolfBy',
          name: product.name,
          originalPrice: hasSalePrice && listPrice > salePrice ? listPrice : undefined,
          price: hasSalePrice ? salePrice : listPrice,
          productId: item.productId,
          quantity: item.quantity,
          specs,
        };
      });
  }, [cartApiItems]);

  const handleQuantityChange = useCallback(
    async (id: number | string, qty: number) => {
      await updateCartItemMutation.trigger({
        csrf: true,
        itemId: String(id),
        quantity: Math.max(1, qty),
      });
      await mutate();
    },
    [mutate, updateCartItemMutation],
  );

  const handleRemove = useCallback(
    async (id: number | string) => {
      await removeCartItemMutation.trigger({
        csrf: true,
        itemId: String(id),
      });
      await mutate();
    },
    [mutate, removeCartItemMutation],
  );

  const handleClearAll = useCallback(async () => {
    if (cartApiItems.length === 0 || isClearing) {
      return;
    }

    setIsClearing(true);
    try {
      await Promise.allSettled(
        cartApiItems.map(item =>
          removeCartItemMutation.trigger({
            csrf: true,
            itemId: item.id,
          }),
        ),
      );
      await mutate();
    } finally {
      setIsClearing(false);
    }
  }, [cartApiItems, isClearing, mutate, removeCartItemMutation]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const scrollRelated = (direction: 'left' | 'right') => {
    if (relatedScrollRef.current) {
      relatedScrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Header />

      <main className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center gap-1.5 py-4 text-[13px]">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
          <span className="text-foreground font-500">Giỏ Hàng Của Bạn</span>
        </nav>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[28px] text-foreground font-700">Giỏ Hàng Của Bạn</h1>
            <p className="text-[14px] text-muted-foreground mt-1">
              {isLoading
                ? 'Đang tải giỏ hàng...'
                : itemCount > 0
                  ? `Bạn đang có ${itemCount} sản phẩm trong giỏ hàng`
                  : 'Giỏ hàng của bạn đang trống'}
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={() => void handleClearAll()}
              disabled={isClearing || removeCartItemMutation.isMutating}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-200 font-500 disabled:opacity-60"
            >
              <ShoppingCart className="w-4 h-4" />
              {isClearing ? 'Đang xóa...' : 'Xóa tất cả'}
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="py-20 flex items-center justify-center">
            <Spinner label="Đang tải dữ liệu" size="lg" />
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-danger/10 flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-danger/70" />
            </div>
            <h2 className="text-[20px] text-foreground mb-2 font-600">Không tải được giỏ hàng</h2>
            <p className="text-[14px] text-muted-foreground mb-6 max-w-sm mx-auto">
              {getErrorMessage(error)}
            </p>
            <button
              onClick={() => void mutate()}
              className="inline-flex items-center gap-2 h-12 px-8 bg-primary hover:bg-primary-dark text-white rounded-xl text-[15px] transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-primary/20 font-600"
            >
              Thử lại
            </button>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8 pb-12">
            <div className="flex-1 min-w-0 space-y-8">
              <div className="hidden md:grid grid-cols-[1fr_110px_120px_120px] gap-6 px-5 text-[12px] text-muted-foreground uppercase tracking-wider font-600">
                <span>Sản Phẩm</span>
                <span className="text-right">Giá</span>
                <span className="text-center">Số Lượng</span>
                <span className="text-right">Tổng Cộng</span>
              </div>

              <div className="space-y-4">
                {cartItems.map(item => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                  />
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-border/50 p-6 space-y-4">
                <label className="flex items-center gap-2 text-[14px] text-foreground font-600">
                  <MessageSquare className="w-4.5 h-4.5 text-primary" />Ý Kiến Để Lại
                </label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Hướng dẫn đặc biệt dành cho người bán..."
                  rows={3}
                  className="w-full p-4 rounded-xl border border-border bg-[#fafafa] text-[14px] text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:bg-white resize-none transition-all disabled:opacity-50"
                />
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-primary/60" />
                  <span>Đảm bảo mua sắm an toàn</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[380px] shrink-0">
              <OrderSummary subtotal={subtotal} itemCount={itemCount} />
            </div>
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/5 flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-primary/40" />
            </div>
            <h2 className="text-[20px] text-foreground mb-2 font-600">Giỏ hàng trống</h2>
            <p className="text-[14px] text-muted-foreground mb-6 max-w-sm mx-auto">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá cửa hàng để tìm sản phẩm yêu thích!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 h-12 px-8 bg-primary hover:bg-primary-dark text-white rounded-xl text-[15px] transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-primary/20 font-600"
            >
              <ShoppingCart className="w-5 h-5" />
              Khám Phá Cửa Hàng
            </Link>
          </div>
        )}

        <div className="h-px bg-border/60" />

        <section className="py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[22px] text-foreground font-700">Sản Phẩm Bán Chạy</h2>
              <p className="text-[14px] text-muted-foreground mt-1">Có thể bạn cũng quan tâm</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollRelated('left')}
                className="w-10 h-10 rounded-full border border-border bg-white hover:border-primary hover:text-primary flex items-center justify-center transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollRelated('right')}
                className="w-10 h-10 rounded-full border border-border bg-white hover:border-primary hover:text-primary flex items-center justify-center transition-colors shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={relatedScrollRef}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none' }}
          >
            {bestSellers.map(product => (
              <div key={product.id} className="shrink-0 w-[240px] snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
