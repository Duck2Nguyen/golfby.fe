import { CreditCard } from 'lucide-react';

import type { CheckoutPaymentMethod } from '@/hooks/useOrders';

interface PaymentMethodSectionProps {
  paymentMethod: CheckoutPaymentMethod;
  onPaymentMethodChange: (value: CheckoutPaymentMethod) => void;
}

export default function PaymentMethodSection({
  paymentMethod,
  onPaymentMethodChange,
}: PaymentMethodSectionProps) {
  return (
    <section className="bg-white rounded-2xl border border-border/50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <CreditCard className="w-5 h-5 text-primary" />
        <h2 className="text-[16px] text-foreground font-700">Thanh Toán</h2>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-[#fafafa]">
          <input
            type="radio"
            checked={paymentMethod === 'BANK_TRANSFER'}
            onChange={() => onPaymentMethodChange('BANK_TRANSFER')}
          />
          <p className="text-[14px] font-600">Chuyển khoản ngân hàng</p>
        </label>
        <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-[#fafafa]">
          <input
            type="radio"
            checked={paymentMethod === 'CASH_ON_DELIVERY'}
            onChange={() => onPaymentMethodChange('CASH_ON_DELIVERY')}
          />
          <p className="text-[14px] font-600">Thanh toán khi nhận hàng (COD)</p>
        </label>
      </div>
    </section>
  );
}
