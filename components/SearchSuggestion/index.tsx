import { Search } from 'lucide-react';

import Link from 'next/link';

import { ImageWithFallback } from '../figma/ImageWithFallback';

const popularKeywords = ['g10', 'g430', 'taylormade', 'ping', 'prov1', 'bóng golf', 'titleist', 'callaway'];

const categories = [
  { label: 'Gậy golf', href: '/collection/gay-golf', icon: '🏌️' },
  { label: 'Shaft gậy', href: '/collection/shaft-gay', icon: '📏' },
  { label: 'Bóng golf', href: '/collection/bong-golf', icon: '⛳' },
  { label: 'Túi golf', href: '/collection/tui-golf', icon: '🎒' },
  { label: 'Thời trang', href: '/collection/thoi-trang', icon: '👕' },
  { label: 'Phụ kiện', href: '/collection/phu-kien', icon: '🧢' },
  { label: 'Tin tức', href: '#', icon: '📰' },
];

const bestSellingProducts = [
  {
    id: 1,
    name: 'Custom - Bộ Sắt Titleist T100',
    image:
      'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwaXJvbiUyMGNsdWIlMjBwcm9kdWN0fGVufDF8fHx8MTc3MzYzMzc5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: null,
    priceLabel: 'Giá: Liên hệ',
    badge: null,
  },
  {
    id: 2,
    name: 'Gậy Driver PING G430 LST',
    image:
      'https://images.unsplash.com/photo-1629213287303-4f74fc4aa976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwZHJpdmVyJTIwY2x1YiUyMGhlYWR8ZW58MXx8fHwxNzczNjMzNzkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: 11487600,
    originalPrice: 19146000,
    priceLabel: null,
    badge: 'Sale',
    discount: 40,
  },
  {
    id: 3,
    name: 'Bộ Sắt Titleist T100',
    image:
      'https://images.unsplash.com/photo-1596473122345-51ab4353edd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwcHV0dGVyJTIwY2xvc2V1cHxlbnwxfHx8fDE3NzM2MzM3OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: null,
    priceLabel: 'Giá: Liên hệ',
    badge: 'Sale',
  },
  {
    id: 4,
    name: 'Gậy Wedge Titleist Vokey SM10',
    image:
      'https://images.unsplash.com/photo-1723084574869-12540112a721?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwd2VkZ2UlMjBjbHVifGVufDF8fHx8MTc3MzYzMzc5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: 8500000,
    originalPrice: 10200000,
    priceLabel: null,
    badge: 'Sale',
    discount: 17,
  },
];

function formatPrice(price: number) {
  return price.toLocaleString('vi-VN') + ' VND';
}

interface SearchSuggestionProps {
  onClose: () => void;
}

export function SearchSuggestion({ onClose }: SearchSuggestionProps) {
  return (
    <div className="absolute left-0 right-0 top-full bg-white border border-border border-t-0 rounded-b-xl shadow-xl z-50 overflow-hidden">
      <div className="flex">
        {/* Left: Categories */}
        <div className="w-[200px] shrink-0 border-r border-border bg-[#fafafa] py-4 px-3">
          <h4 className="text-[1.3rem] text-foreground mb-3 px-2" style={{ fontWeight: 700 }}>
            Danh mục
          </h4>
          <ul className="space-y-0.5">
            {categories.map(cat => (
              <li key={cat.label}>
                <Link
                  href={cat.href}
                  onClick={onClose}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-[1.3rem] text-muted-foreground hover:bg-white hover:text-primary hover:shadow-sm transition-all duration-150"
                  style={{ fontWeight: 500 }}
                >
                  <span className="text-[1.6rem]">{cat.icon}</span>
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Keywords + Products */}
        <div className="flex-1 py-4 px-5 min-w-0">
          {/* Popular Keywords */}
          <div className="mb-5">
            <h4
              className="text-[1.2rem] text-muted-foreground uppercase tracking-wider mb-3"
              style={{ fontWeight: 700 }}
            >
              Từ khóa hay được tìm kiếm
            </h4>
            <div className="flex flex-wrap gap-2">
              {popularKeywords.map(keyword => (
                <button
                  key={keyword}
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f5f5] hover:bg-primary-light hover:text-primary border border-transparent hover:border-primary/20 rounded-full text-[1.3rem] text-muted-foreground transition-all duration-150"
                  style={{ fontWeight: 500 }}
                >
                  <Search className="w-3 h-3 opacity-50" />
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          {/* Best Selling Products */}
          <div>
            <h4
              className="text-[1.2rem] text-muted-foreground uppercase tracking-wider mb-3"
              style={{ fontWeight: 700 }}
            >
              Sản phẩm bán chạy
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {bestSellingProducts.map(product => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={onClose}
                  className="group rounded-xl border border-border bg-white hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-[#f8f8f8] overflow-hidden">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <span
                        className="absolute top-2 left-2 bg-destructive text-white text-[1.0rem] px-2 py-0.5 rounded"
                        style={{ fontWeight: 700 }}
                      >
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-2.5">
                    <p
                      className="text-[1.2rem] text-foreground line-clamp-2 mb-1.5 group-hover:text-primary transition-colors"
                      style={{ fontWeight: 500, lineHeight: 1.4 }}
                    >
                      {product.name}
                    </p>
                    {product.priceLabel ? (
                      <p className="text-[1.2rem] text-muted-foreground" style={{ fontWeight: 500 }}>
                        {product.priceLabel}
                      </p>
                    ) : (
                      <div>
                        {product.originalPrice && (
                          <p className="text-[1.1rem] text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5">
                          <p className="text-[1.2rem] text-destructive" style={{ fontWeight: 700 }}>
                            {formatPrice(product.price!)}
                          </p>
                          {product.discount && (
                            <span
                              className="text-[1.0rem] text-primary bg-primary-light px-1 py-0.5 rounded"
                              style={{ fontWeight: 700 }}
                            >
                              (-{product.discount}%)
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
