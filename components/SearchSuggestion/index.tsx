import { useMemo } from 'react';
import { Search } from 'lucide-react';

import Link from 'next/link';

import { useProducts, type ProductListItem } from '@/hooks/useProducts';

import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ballProducts, clubProducts, type Product, accessoryProducts } from '../mock-data';

const popularKeywords = ['g10', 'g430', 'taylormade', 'ping', 'prov1', 'bóng golf', 'titleist', 'callaway'];
const PRODUCT_IMAGE_FALLBACK = 'https://placehold.co/600x600?text=GolfBy';

const fakeBestSellingProducts = [...clubProducts, ...ballProducts, ...accessoryProducts].slice(0, 10);

interface SearchProductItem {
  badge: string | null;
  brand: string;
  discount?: number;
  id: number | string;
  image: string;
  name: string;
  originalPrice?: number;
  price: number;
}

const normalizeText = (value: string) => value.trim().toLowerCase();

const toNumber = (value?: string | null) => {
  const parsed = Number(value ?? 0);

  return Number.isFinite(parsed) ? parsed : 0;
};

const mapProductToSearchItem = (product: Product): SearchProductItem => {
  const badge =
    product.badge === 'sale'
      ? 'Sale'
      : product.badge === 'new'
        ? 'New'
        : product.badge === 'hot'
          ? 'Hot'
          : null;

  return {
    badge,
    brand: product.brand,
    ...(product.discount ? { discount: product.discount } : {}),
    id: product.id,
    image: product.image,
    name: product.name,
    ...(product.originalPrice ? { originalPrice: product.originalPrice } : {}),
    price: product.price,
  };
};

const mapApiProductToSearchItem = (product: ProductListItem): SearchProductItem => {
  const salePrice = toNumber(product.salePrice);
  const listPrice = toNumber(product.listPrice);

  const price = salePrice > 0 ? salePrice : listPrice;
  const originalPrice = salePrice > 0 && listPrice > salePrice ? listPrice : undefined;
  const discount =
    originalPrice && originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined;

  return {
    badge: discount ? 'Sale' : null,
    brand: product.brand?.name ?? 'GolfBy',
    ...(discount ? { discount } : {}),
    id: product.id,
    image: product.images?.[0]?.url || product.images?.[0]?.key || PRODUCT_IMAGE_FALLBACK,
    name: product.name,
    ...(originalPrice ? { originalPrice } : {}),
    price,
  };
};

function formatPrice(price: number) {
  return price.toLocaleString('vi-VN') + ' VND';
}

interface SearchSuggestionProps {
  onClose: () => void;
  onSearchTextChange: (value: string) => void;
  onSubmitSearch: (value: string) => void;
  searchText: string;
}

export function SearchSuggestion({
  onClose,
  onSearchTextChange,
  onSubmitSearch,
  searchText,
}: SearchSuggestionProps) {
  const normalizedSearchText = normalizeText(searchText);
  const hasSearchText = Boolean(normalizedSearchText);
  const { getAllProducts } = useProducts({
    enabled: hasSearchText,
    getAllParams: {
      page: 1,
      search: searchText.trim(),
      size: 4,
    },
  });

  const filteredKeywords = popularKeywords;

  const bestSellingProducts = useMemo(() => {
    return fakeBestSellingProducts.map(mapProductToSearchItem);
  }, []);

  const searchProducts = useMemo(() => {
    const apiItems = getAllProducts.data?.data?.items ?? [];

    return apiItems.map(mapApiProductToSearchItem);
  }, [getAllProducts.data?.data?.items]);

  const visibleBestSellingProducts = useMemo(() => {
    return bestSellingProducts.slice(0, 4);
  }, [bestSellingProducts]);

  return (
    <div className="absolute left-0 right-0 top-full bg-white border border-border border-t-0 rounded-b-xl shadow-xl z-50 overflow-hidden">
      <div className="py-4 px-5 min-w-0">
        {hasSearchText ? (
          <div>
            <h4
              className="text-[1.2rem] text-muted-foreground uppercase tracking-wider mb-3"
              style={{ fontWeight: 700 }}
            >
              Kết quả sản phẩm
            </h4>
            {getAllProducts.isLoading ? (
              <p className="text-[1.2rem] text-muted-foreground">Đang tìm sản phẩm...</p>
            ) : getAllProducts.error ? (
              <p className="text-[1.2rem] text-danger">Không thể tải kết quả tìm kiếm.</p>
            ) : searchProducts.length === 0 ? (
              <p className="mt-3 text-[1.2rem] text-muted-foreground">Không tìm thấy sản phẩm phù hợp.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {searchProducts.map(product => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="group rounded-xl border border-border bg-white hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
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

                    <div className="p-2.5">
                      <p
                        className="text-[1.2rem] text-foreground line-clamp-2 mb-1.5 group-hover:text-primary transition-colors"
                        style={{ fontWeight: 500, lineHeight: 1.4 }}
                      >
                        {product.name}
                      </p>
                      <div>
                        {product.originalPrice && (
                          <p className="text-[1.1rem] text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5">
                          <p className="text-[1.2rem] text-destructive" style={{ fontWeight: 700 }}>
                            {formatPrice(product.price)}
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
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mb-5">
              <h4
                className="text-[1.2rem] text-muted-foreground uppercase tracking-wider mb-3"
                style={{ fontWeight: 700 }}
              >
                Từ khóa hay được tìm kiếm
              </h4>
              <div className="flex flex-wrap gap-2">
                {filteredKeywords.map(keyword => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => {
                      onSearchTextChange(keyword);
                      onSubmitSearch(keyword);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f5f5] hover:bg-primary-light hover:text-primary border border-transparent hover:border-primary/20 rounded-full text-[1.3rem] text-muted-foreground transition-all duration-150"
                    style={{ fontWeight: 500 }}
                  >
                    <Search className="w-3 h-3 opacity-50" />
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4
                className="text-[1.2rem] text-muted-foreground uppercase tracking-wider mb-3"
                style={{ fontWeight: 700 }}
              >
                Sản phẩm bán chạy
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {visibleBestSellingProducts.map(product => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="group rounded-xl border border-border bg-white hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
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

                    <div className="p-2.5">
                      <p
                        className="text-[1.2rem] text-foreground line-clamp-2 mb-1.5 group-hover:text-primary transition-colors"
                        style={{ fontWeight: 500, lineHeight: 1.4 }}
                      >
                        {product.name}
                      </p>
                      <div>
                        {product.originalPrice && (
                          <p className="text-[1.1rem] text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5">
                          <p className="text-[1.2rem] text-destructive" style={{ fontWeight: 700 }}>
                            {formatPrice(product.price)}
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
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
