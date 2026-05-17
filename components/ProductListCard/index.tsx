import { Star, Heart, ShoppingCart } from 'lucide-react';

import Link from 'next/link';

import { ImageWithFallback } from '../figma/ImageWithFallback';

import type { Product } from '../mock-data';

interface ProductListCardProps {
  isAddingToCart?: boolean;
  isWishlisted?: boolean;
  isWishlistLoading?: boolean;
  onAddToCartAction?: (product: Product) => Promise<unknown> | void;
  onToggleWishlistAction?: (product: Product) => Promise<unknown> | void;
  product: Product;
}

export function ProductListCard({
  isAddingToCart = false,
  isWishlisted = false,
  isWishlistLoading = false,
  onAddToCartAction,
  onToggleWishlistAction,
  product,
}: ProductListCardProps) {
  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';

  const handleAddToCart = () => {
    if (!onAddToCartAction || isAddingToCart) {
      return;
    }

    void onAddToCartAction(product);
  };

  const handleToggleWishlist = () => {
    if (!onToggleWishlistAction || isWishlistLoading) {
      return;
    }

    void onToggleWishlistAction(product);
  };

  return (
    <div className="group flex overflow-hidden rounded-2xl border border-border/60 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-black/6">
      {/* Image */}
      <Link
        href={`/product/${product.id}`}
        className="relative w-[220px] shrink-0 overflow-hidden bg-[#fafafa]"
      >
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span
            className={`absolute left-3 top-3 rounded-lg px-3 py-1 text-[1.1rem] tracking-wide font-700 ${
              product.badge === 'new'
                ? 'bg-primary text-white uppercase'
                : product.badge === 'sale'
                  ? 'bg-[#FFE5E5] text-[#FF0000] italic'
                  : 'bg-accent text-white uppercase'
            }`}
          >
            {product.badge === 'sale' ? 'Sale' : product.badge === 'new' ? 'Mới' : 'Hot'}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <Link href={`/product/${product.id}`}>
            <p
              className="mb-1 text-[1.2rem] uppercase tracking-wide text-primary"
              style={{ fontWeight: 600 }}
            >
              {product.brand}
            </p>
            <h3
              className="line-clamp-2 text-[1.5rem] leading-snug text-foreground mb-2"
              style={{ fontWeight: 500 }}
            >
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="mb-3 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < product.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
            <span className="ml-1 text-[1.2rem] text-muted-foreground">({product.reviews} đánh giá)</span>
          </div>

          <p className="line-clamp-2 text-[1.3rem] leading-relaxed text-muted-foreground">
            Sản phẩm chính hãng, đảm bảo chất lượng. Phù hợp cho mọi trình độ golfer từ amateur đến
            professional.
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-4 flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              {product.price > 0 && product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[1.4rem] text-foreground line-through font-600">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.price > 0 ? (
                <span className="text-[1.4rem] text-[#FF0000] font-700">{formatPrice(product.price)}</span>
              ) : (
                <span className="text-[1.4rem] text-foreground font-700">Giá: Liên hệ</span>
              )}
            </div>
            {product.discount && product.discount > 0 && (
              <div className="inline-flex w-fit items-center justify-center px-2 py-0.5 rounded-[4px] bg-[#FFE5E5] text-[#FF0000] text-[1.2rem] font-500">
                (-{product.discount}%)
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleWishlist}
              type="button"
              disabled={!onToggleWishlistAction || isWishlistLoading}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
                isWishlisted
                  ? 'border-primary bg-primary text-white hover:bg-primary-dark'
                  : 'border-border text-foreground hover:border-primary hover:text-primary'
              }`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>
            <button
              onClick={handleAddToCart}
              type="button"
              disabled={!onAddToCartAction || isAddingToCart}
              className="flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-[1.3rem] text-white transition-colors hover:bg-primary-dark disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ fontWeight: 600 }}
            >
              <ShoppingCart className="h-4 w-4" />
              {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
