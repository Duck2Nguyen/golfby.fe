import OrderDetail from '@/components/OrderDetail';

interface OrderDetailPageProps {
  params: {
    orderId: string;
  };
}

const OrderDetailPage = ({ params }: OrderDetailPageProps) => {
  return <OrderDetail orderId={params.orderId} />;
};

export default OrderDetailPage;
