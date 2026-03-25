import ProductForm from '@/components/Admin/Products/ProductForm';

interface ProductEditPageProps {
  params: Promise<{ id: string }>;
}

const ProductEditPage = async ({ params }: ProductEditPageProps) => {
  const { id } = await params;

  return <ProductForm productId={id} />;
};

export default ProductEditPage;
