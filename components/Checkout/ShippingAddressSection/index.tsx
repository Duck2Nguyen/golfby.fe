import { Truck } from 'lucide-react';

interface ShippingAddressSectionProps {
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  onCountryChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onCityChange: (value: string) => void;
}

export default function ShippingAddressSection({
  country,
  firstName,
  lastName,
  address,
  city,
  onCountryChange,
  onFirstNameChange,
  onLastNameChange,
  onAddressChange,
  onCityChange,
}: ShippingAddressSectionProps) {
  return (
    <section className="bg-white rounded-2xl border border-border/50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Truck className="w-5 h-5 text-primary" />
        <h2 className="text-[16px] text-foreground font-700">Địa Chỉ Vận Chuyển</h2>
      </div>
      <div className="space-y-3">
        <select
          value={country}
          onChange={e => onCountryChange(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
        >
          <option value="">Quốc gia</option>
          <option value="VN">Việt Nam</option>
          <option value="US">United States</option>
        </select>
        <input
          type="text"
          placeholder="Tên"
          value={firstName}
          onChange={e => onFirstNameChange(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
        />
        <input
          type="text"
          placeholder="Họ"
          value={lastName}
          onChange={e => onLastNameChange(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
        />
        <input
          type="text"
          placeholder="Địa chỉ"
          value={address}
          onChange={e => onAddressChange(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
        />
        <select
          value={city}
          onChange={e => onCityChange(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
        >
          <option value="">Thành phố</option>
          <option value="hanoi">Hà Nội</option>
          <option value="hcm">TP. Hồ Chí Minh</option>
        </select>
      </div>
    </section>
  );
}
