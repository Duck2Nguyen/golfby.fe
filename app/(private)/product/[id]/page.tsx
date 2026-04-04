import ProductDetailPageClient from '@/components/ProductDetail/ProductDetailClient';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  return <ProductDetailPageClient productId={id} />;
}
