import { Package } from 'lucide-react';

interface ShippingMethodSectionProps {
  shippingMethod: string;
  onShippingMethodChange: (value: string) => void;
}

export default function ShippingMethodSection({
  shippingMethod,
  onShippingMethodChange,
}: ShippingMethodSectionProps) {
  return (
    <section className="bg-white rounded-2xl border border-border/50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Package className="w-5 h-5 text-primary" />
        <h2 className="text-[16px] text-foreground font-700">Phương Thức Vận Chuyển</h2>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-[#fafafa]">
          <input
            type="radio"
            checked={shippingMethod === 'STANDARD'}
            onChange={() => onShippingMethodChange('STANDARD')}
          />
          <p className="text-[14px] font-600">Giao hàng tiêu chuẩn — MIỄN PHÍ</p>
        </label>
        <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-[#fafafa]">
          <input
            type="radio"
            checked={shippingMethod === 'EXPRESS'}
            onChange={() => onShippingMethodChange('EXPRESS')}
          />
          <p className="text-[14px] font-600">Giao hàng nhanh — 50.000 ₫</p>
        </label>
      </div>
    </section>
  );
}
