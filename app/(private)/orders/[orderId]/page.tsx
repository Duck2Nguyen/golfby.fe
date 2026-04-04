import OrderDetail from '@/components/OrderDetail';

interface OrderDetailPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

const OrderDetailPage = async ({ params }: OrderDetailPageProps) => {
  const { orderId } = await params;

  return <OrderDetail orderId={orderId} />;
};

export default OrderDetailPage;
