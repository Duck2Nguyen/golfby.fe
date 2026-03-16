import { Star, Heart, ShoppingCart } from 'lucide-react';

import Link from 'next/link';

import { ImageWithFallback } from '../figma/ImageWithFallback';

import type { Product } from '../mock-data';

export function ProductListCard({ product }: { product: Product }) {
  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + '₫';

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
            className={`absolute left-3 top-3 rounded-lg px-3 py-1 text-[1.1rem] uppercase tracking-wide text-white ${
              product.badge === 'new'
                ? 'bg-primary'
                : product.badge === 'sale'
                  ? 'bg-destructive'
                  : 'bg-accent'
            }`}
            style={{ fontWeight: 700 }}
          >
            {product.badge === 'sale' && product.discount
              ? `-${product.discount}%`
              : product.badge === 'new'
                ? 'Mới'
                : 'Hot'}
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
          <div className="flex items-end gap-2">
            <span className="text-[1.8rem] text-primary" style={{ fontWeight: 700 }}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[1.4rem] text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discount && (
              <span
                className="rounded-md bg-destructive/10 px-2 py-0.5 text-[1.2rem] text-destructive"
                style={{ fontWeight: 600 }}
              >
                -{product.discount}%
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border transition-colors hover:border-primary text-foreground hover:text-primary">
              <Heart className="h-4 w-4" />
            </button>
            <button
              className="flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-[1.3rem] text-white transition-colors hover:bg-primary-dark"
              style={{ fontWeight: 600 }}
            >
              <ShoppingCart className="h-4 w-4" />
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
