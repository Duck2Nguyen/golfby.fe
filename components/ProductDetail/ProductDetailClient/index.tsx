'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import Link from 'next/link';

import type { Product } from '@/components/mock-data';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import ProductInfo from '@/components/ProductDetail/ProductInfo';
import ProductGallery from '@/components/ProductDetail/ProductGallery';
import { ProductTabs, PaymentPolicyTab, ShippingPolicyTab } from '@/components/ProductDetail/ProductTabs';

export interface ProductDetailOption {
  label: string;
  values: string[];
}

export interface ProductDetailViewData {
  category: string;
  categorySlug?: string;
  descriptionHtml: string;
  images: string[];
  inStock: boolean;
  options: ProductDetailOption[];
  sku: string;
}

interface ProductDetailClientProps {
  product: Product;
  detail: ProductDetailViewData;
  displayRelated: Product[];
}

export default function ProductDetailPageClient({
  product,
  detail,
  displayRelated,
}: ProductDetailClientProps) {
  const relatedScrollRef = useRef<HTMLDivElement>(null);
  const categoryHref = detail.categorySlug ? `/collection/${detail.categorySlug}` : '/collection';
  const descriptionMarkup =
    detail.descriptionHtml?.trim() || '<p>Thông tin mô tả sản phẩm đang được cập nhật.</p>';

  const scrollRelated = (direction: 'left' | 'right') => {
    if (relatedScrollRef.current) {
      const scrollAmount = 300;
      relatedScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const tabs = [
    {
      label: 'Thông tin chung',
      content: (
        <div className="max-w-3xl text-[1.6rem] leading-[2.8rem] text-muted-foreground [&_a]:text-primary [&_figure]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_li]:mb-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_strong]:text-foreground [&_strong]:font-700 [&_ul]:list-disc [&_ul]:pl-6">
          <div dangerouslySetInnerHTML={{ __html: descriptionMarkup }} />
        </div>
      ),
    },
    { label: 'Chính sách giao hàng và trả hàng', content: <ShippingPolicyTab /> },
    { label: 'Chính sách thanh toán', content: <PaymentPolicyTab /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 py-4 text-[13px] overflow-x-auto">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
          >
            Trang Chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
          <Link
            href={categoryHref}
            className="text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
          >
            {detail.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
          <span className="text-foreground truncate max-w-[300px] font-500">{product.name}</span>
        </nav>

        {/* Product Section - Gallery + Info */}
        <section className="flex flex-col lg:flex-row gap-8 lg:gap-12 pb-12">
          {/* Gallery */}
          <div className="w-full lg:w-[55%] lg:max-w-[580px]">
            <ProductGallery discount={product.discount} images={detail.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <ProductInfo
              name={product.name}
              brand={product.brand}
              sku={detail.sku}
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              options={detail.options}
              inStock={detail.inStock}
            />
          </div>
        </section>

        <div className="h-px bg-border/60" />

        {/* Product Tabs */}
        <section className="py-2">
          <ProductTabs tabs={tabs} />
        </section>

        <div className="h-px bg-border/60" />

        {/* Related Products */}
        <section className="py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[22px] text-foreground font-700">Sản Phẩm Liên Quan</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollRelated('left')}
                className="w-10 h-10 rounded-full border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollRelated('right')}
                className="w-10 h-10 rounded-full border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={relatedScrollRef}
            className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none' }}
          >
            {displayRelated.map(rp => (
              <div key={rp.id} className="shrink-0 w-[260px] snap-start">
                <ProductCard product={rp} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
