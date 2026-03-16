'use client';

import { useState } from 'react';
import {
  Star,
  Heart,
  Trash2,
  Grid2x2,
  Grid3x3,
  HeartOff,
  LayoutList,
  LayoutGrid,
  ShoppingCart,
  ChevronRight,
} from 'lucide-react';

import Link from 'next/link';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface WishlistItem {
  id: number;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: 'sale' | 'new' | 'hot';
  discount?: number;
  addedAt: string;
}

const mockWishlist: WishlistItem[] = [
  {
    id: 1,
    name: 'Gậy Golf Driver Honma Beres 10 (3 Sao)',
    brand: 'Honma',
    image:
      'https://images.unsplash.com/photo-1629213287303-4f74fc4aa976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY2x1YiUyMGRyaXZlciUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzczNjI2NjMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: 24640000,
    originalPrice: 30800000,
    rating: 5,
    reviews: 18,
    badge: 'sale',
    discount: 20,
    addedAt: '2 ngày trước',
  },
  {
    id: 2,
    name: 'Bộ Gậy Golf Titleist T100 Iron Set (5-PW)',
    brand: 'Titleist',
    image:
      'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwaXJvbiUyMGNsdWIlMjBwcm9kdWN0fGVufDF8fHx8MTc3MzYzMzc5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: 32500000,
    rating: 5,
    reviews: 28,
    badge: 'new',
    addedAt: '5 ngày trước',
  },
  {
    id: 3,
    name: 'Bóng Golf Titleist Pro V1 (Hộp 12 Quả)',
    brand: 'Titleist',
    image:
      'https://images.unsplash.com/photo-1677764359368-f6cdfa4c927a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwYmFsbCUyMHRpdGxlaXN0JTIwcHJvfGVufDF8fHx8MTc3MzYzNDgxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: 1850000,
    originalPrice: 2200000,
    rating: 4,
    reviews: 56,
    badge: 'sale',
    discount: 16,
    addedAt: '1 tuần trước',
  },
  {
    id: 4,
    name: 'Giày Golf FootJoy Pro|SL Carbon',
    brand: 'FootJoy',
    image:
      'https://images.unsplash.com/photo-1758157264325-d159cf9e9558?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwc2hvZXMlMjBzcG9ydCUyMHdoaXRlfGVufDF8fHx8MTc3MzYzNDgxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: 5600000,
    rating: 5,
    reviews: 12,
    badge: 'hot',
    addedAt: '1 tuần trước',
  },
  {
    id: 5,
    name: 'Găng Tay Golf Titleist Players Flex',
    brand: 'Titleist',
    image:
      'https://images.unsplash.com/photo-1635521299899-52613a1a3b17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwZ2xvdmUlMjBsZWF0aGVyJTIwd2hpdGV8ZW58MXx8fHwxNzczNjM0ODE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: 680000,
    originalPrice: 850000,
    rating: 4,
    reviews: 34,
    badge: 'sale',
    discount: 20,
    addedAt: '2 tuần trước',
  },
  {
    id: 6,
    name: 'Máy Đo Khoảng Cách Bushnell Pro X3',
    brand: 'Bushnell',
    image:
      'https://images.unsplash.com/photo-1643733490881-d1121e40b065?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwcmFuZ2VmaW5kZXIlMjBkZXZpY2V8ZW58MXx8fHwxNzczNjM0ODIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: 14200000,
    rating: 5,
    reviews: 9,
    badge: 'new',
    addedAt: '3 tuần trước',
  },
];

type ViewMode = 'list' | '2col' | '3col' | '4col';

const viewModes: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
  { mode: 'list', icon: <LayoutList className="w-4 h-4" />, label: 'Danh sách' },
  { mode: '2col', icon: <Grid2x2 className="w-4 h-4" />, label: '2 cột' },
  { mode: '3col', icon: <Grid3x3 className="w-4 h-4" />, label: '3 cột' },
  { mode: '4col', icon: <LayoutGrid className="w-4 h-4" />, label: '4 cột' },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(mockWishlist);
  const [viewMode, setViewMode] = useState<ViewMode>('4col');

  const handleRemove = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const gridClass = {
    list: 'grid-cols-1',
    '2col': 'grid-cols-1 sm:grid-cols-2',
    '3col': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4col': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[viewMode];

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[13px] text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-500">Wish List</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] text-foreground mb-1 font-700">Danh Mục Theo Dõi</h1>
            <p className="text-[14px] text-muted-foreground">{items.length} sản phẩm đang theo dõi</p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-muted-foreground mr-1 font-500">Xem dưới dạng</span>
            <div className="flex items-center bg-white border border-border rounded-xl overflow-hidden">
              {viewModes.map(({ mode, icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  title={label}
                  className={`p-2.5 transition-all duration-200 ${
                    viewMode === mode
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:text-primary hover:bg-muted'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <EmptyWishlist />
        ) : viewMode === 'list' ? (
          <div className="space-y-3">
            {items.map(item => (
              <WishlistListItem key={item.id} item={item} onRemove={() => handleRemove(item.id)} />
            ))}
          </div>
        ) : (
          <div className={`grid ${gridClass} gap-5`}>
            {items.map(item => (
              <WishlistGridItem key={item.id} item={item} onRemove={() => handleRemove(item.id)} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

/* ========== Grid Card ========== */
function WishlistGridItem({ item, onRemove }: { item: WishlistItem; onRemove: () => void }) {
  return (
    <div className="group bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-xl hover:shadow-black/8 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Image */}
      <Link
        href={`/product/${item.id}`}
        className="block relative aspect-square overflow-hidden bg-[#fafafa]"
      >
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge */}
        {item.badge && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-[11px] text-white uppercase tracking-wide font-700 ${
              item.badge === 'new' ? 'bg-primary' : item.badge === 'sale' ? 'bg-destructive' : 'bg-accent'
            }`}
          >
            {item.badge === 'sale' && item.discount
              ? `-${item.discount}%`
              : item.badge === 'new'
                ? 'Mới'
                : 'Hot'}
          </span>
        )}

        {/* Remove button */}
        <button
          onClick={e => {
            e.preventDefault();
            onRemove();
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-destructive hover:bg-destructive hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
          title="Xóa khỏi danh sách"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Add to Cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={e => e.preventDefault()}
            className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-[13px] flex items-center justify-center gap-2 transition-colors shadow-lg font-600"
          >
            <ShoppingCart className="w-4 h-4" />
            Thêm vào giỏ
          </button>
        </div>
      </Link>

      {/* Info */}
      <Link href={`/product/${item.id}`} className="block p-4 flex-1 flex flex-col">
        <p className="text-[12px] text-primary uppercase tracking-wide mb-1 font-600">{item.brand}</p>
        <h3 className="text-[14px] text-foreground mb-2 line-clamp-2 leading-snug min-h-[2.5em] flex-1 font-500">
          {item.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < item.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
              }`}
            />
          ))}
          <span className="text-[12px] text-muted-foreground ml-1">({item.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap">
          {item.originalPrice && (
            <span className="text-[13px] text-muted-foreground line-through">
              {formatPrice(item.originalPrice)}
            </span>
          )}
          <span className="text-[17px] text-primary font-700">{formatPrice(item.price)}</span>
          {item.discount && (
            <span className="text-[11px] text-destructive bg-red-50 px-1.5 py-0.5 rounded font-700">
              -{item.discount}%
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}

/* ========== List Card ========== */
function WishlistListItem({ item, onRemove }: { item: WishlistItem; onRemove: () => void }) {
  return (
    <div className="group bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-lg transition-all duration-200 flex">
      {/* Image */}
      <Link
        href={`/product/${item.id}`}
        className="relative w-40 sm:w-52 shrink-0 overflow-hidden bg-[#fafafa]"
      >
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {item.badge && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] text-white uppercase tracking-wide font-700 ${
              item.badge === 'new' ? 'bg-primary' : item.badge === 'sale' ? 'bg-destructive' : 'bg-accent'
            }`}
          >
            {item.badge === 'sale' && item.discount
              ? `-${item.discount}%`
              : item.badge === 'new'
                ? 'Mới'
                : 'Hot'}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[12px] text-primary uppercase tracking-wide mb-1 font-600">{item.brand}</p>
          <Link href={`/product/${item.id}`}>
            <h3 className="text-[15px] text-foreground mb-2 hover:text-primary transition-colors font-600">
              {item.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < item.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
            <span className="text-[12px] text-muted-foreground ml-1">({item.reviews})</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {item.originalPrice && (
              <span className="text-[14px] text-muted-foreground line-through">
                {formatPrice(item.originalPrice)}
              </span>
            )}
            <span className="text-[18px] text-primary font-700">{formatPrice(item.price)}</span>
            {item.discount && (
              <span className="text-[11px] text-destructive bg-red-50 px-1.5 py-0.5 rounded font-700">
                -{item.discount}%
              </span>
            )}
          </div>
          <p className="text-[12px] text-muted-foreground mt-2">Đã thêm {item.addedAt}</p>
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col gap-2 shrink-0">
          <button className="flex items-center justify-center gap-2 px-5 h-10 bg-primary hover:bg-primary/90 text-white rounded-xl text-[13px] transition-colors font-600">
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Thêm vào giỏ</span>
          </button>
          <button
            onClick={onRemove}
            className="flex items-center justify-center gap-2 px-5 h-10 border border-border text-muted-foreground hover:text-destructive hover:border-destructive rounded-xl text-[13px] transition-all duration-200 font-500"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========== Empty State ========== */
function EmptyWishlist() {
  return (
    <div className="text-center py-24">
      <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
        <HeartOff className="w-10 h-10 text-muted-foreground" />
      </div>
      <h2 className="text-[20px] text-foreground mb-2 font-600">Danh sách yêu thích trống</h2>
      <p className="text-[14px] text-muted-foreground mb-8 max-w-md mx-auto">
        Hãy thêm sản phẩm yêu thích bằng cách nhấn vào biểu tượng trái tim trên mỗi sản phẩm.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-full transition-all duration-200 hover:shadow-md hover:shadow-primary/20 text-[15px] font-600"
      >
        <Heart className="w-5 h-5" />
        Khám Phá Sản Phẩm
      </Link>
    </div>
  );
}
