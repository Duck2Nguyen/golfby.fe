import type { Product } from '@/components/mock-data';

import ProductDetailPageClient from '@/components/ProductDetail/ProductDetailClient';
import { clubProducts, ballProducts, accessoryProducts } from '@/components/mock-data';

// Combine all products for lookup
const allProducts: Product[] = [...clubProducts, ...ballProducts, ...accessoryProducts];

// Extended product detail data
const productDetails: Record<
  number,
  {
    sku: string;
    shortDescription: string;
    images: string[];
    options: { label: string; values: string[] }[];
    category: string;
  }
> = {};

// Generate detail data for all products
allProducts.forEach(product => {
  productDetails[product.id] = {
    sku: `GS-${String(product.id).padStart(5, '0')}`,
    shortDescription: `Trung tâm phân phối chính hãng ${product.brand}. Sản phẩm ${product.name} — được thiết kế dành cho golfer từ trung bình đến chuyên nghiệp. Cam kết hàng chính hãng 100%, bảo hành theo chính sách nhà sản xuất.`,
    images: generateGalleryImages(product),
    options: generateOptions(product),
    category: getCategoryForProduct(product.id),
  };
});

function generateGalleryImages(product: Product): string[] {
  // Use product image + some related images
  const extraImages = [
    'https://images.unsplash.com/photo-1675106643681-da7ad12e926f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY2x1YiUyMGNsb3NldXAlMjBkZXRhaWx8ZW58MXx8fHwxNzczNjI5MTI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1662224107272-c964ea82bd3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY2x1YiUyMHNldCUyMGlyb24lMjB3b29kfGVufDF8fHx8MTc3MzYyOTEyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1592459777315-00ab1374a953?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwd29vZCUyMGNsdWIlMjBzcG9ydCUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzM2MjkxMzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1675106645743-1e47fd7206a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwZHJpdmVyJTIwdGVlJTIwc3BvcnR8ZW58MXx8fHwxNzczNjI5MTM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  ];
  return [product.image, ...extraImages.slice(0, 3)];
}

function generateOptions(product: Product): { label: string; values: string[] }[] {
  const id = product.id;
  // Clubs
  if (id <= 4)
    return [
      { label: 'Tay Thuận', values: ['Phải', 'Trái'] },
      { label: 'Độ Cứng (Flex)', values: ['R', 'SR', 'S'] },
      { label: 'Loft', values: ['9°', '10.5°', '12°'] },
    ];
  // Balls
  if (id <= 8)
    return [
      { label: 'Màu Sắc', values: ['Trắng', 'Vàng', 'Cam'] },
      { label: 'Số Lượng', values: ['12 bóng', '24 bóng', '48 bóng'] },
    ];
  // Accessories
  return [
    { label: 'Size', values: ['S', 'M', 'L', 'XL'] },
    { label: 'Màu Sắc', values: ['Đen', 'Trắng', 'Xanh Navy'] },
  ];
}

function getCategoryForProduct(id: number): string {
  if (id <= 4) return 'Gậy Golf';
  if (id <= 8) return 'Bóng Golf';
  return 'Phụ Kiện';
}

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const productId = Number(id) || 1;
  const product = allProducts.find(p => p.id === productId) || allProducts[0];
  const detail = productDetails[product.id] || productDetails[allProducts[0].id];

  // Related products (same category, excluding current)
  const relatedProducts = allProducts.filter(
    p => p.id !== product.id && getCategoryForProduct(p.id) === detail.category,
  );

  // If no related in same category, use all others
  const displayRelated =
    relatedProducts.length >= 2 ? relatedProducts : allProducts.filter(p => p.id !== product.id).slice(0, 4);

  return <ProductDetailPageClient product={product} detail={detail} displayRelated={displayRelated} />;
}
