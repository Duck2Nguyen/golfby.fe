import type { Metadata } from 'next';

import Vouchers from '@/components/Admin/Vouchers';

export const metadata: Metadata = {
  title: 'Quản lý Khuyến mãi | Admin',
};

export default function PromotionsPage() {
  return <Vouchers />;
}
