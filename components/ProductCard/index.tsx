import { Eye, Heart, ShoppingCart } from 'lucide-react';

import Link from 'next/link';

import { ImageWithFallback } from '../figma/ImageWithFallback';

import type { Product } from '../mock-data';

export function ProductCard({ product }: { product: Product }) {
  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + '₫';

  return (
    <div className="group bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-xl hover:shadow-black/8 transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <Link
        href={`/product/${product.id}`}
        className="block relative aspect-square overflow-hidden bg-[#fafafa]"
      >
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-[1.1rem] text-white uppercase tracking-wide ${
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

        {/* Quick Actions (hover) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={e => e.preventDefault()}
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button
            onClick={e => e.preventDefault()}
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart (hover) */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={e => e.preventDefault()}
            className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-[1.3rem] flex items-center justify-center gap-2 transition-colors shadow-lg"
            style={{ fontWeight: 600 }}
          >
            <ShoppingCart className="w-4 h-4" />
            Thêm vào giỏ
          </button>
        </div>
      </Link>

      {/* Info */}
      <Link href={`/product/${product.id}`} className="block p-4">
        <p className="text-[1.2rem] text-primary uppercase tracking-wide mb-1" style={{ fontWeight: 600 }}>
          {product.brand}
        </p>
        <h3
          className="text-[1.4rem] text-foreground mb-3 line-clamp-2 leading-snug min-h-[2.5em]"
          style={{ fontWeight: 500 }}
        >
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-end gap-2">
          {product.price > 0 ? (
            <span className="text-[1.7rem] text-primary" style={{ fontWeight: 700 }}>
              {formatPrice(product.price)}
            </span>
          ) : (
            <span className="text-[1.7rem] text-foreground" style={{ fontWeight: 700 }}>
              Giá: Liên hệ
            </span>
          )}
          {product.price > 0 && product.originalPrice && (
            <span className="text-[1.3rem] text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
