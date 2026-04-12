import { Truck } from 'lucide-react';

interface ShippingAddressSectionProps {
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  province: string;
  district: string;
  commune: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onProvinceChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  onCommuneChange: (value: string) => void;
}

export default function ShippingAddressSection({
  firstName,
  lastName,
  address,
  country,
  province,
  district,
  commune,
  onFirstNameChange,
  onLastNameChange,
  onAddressChange,
  onCountryChange,
  onProvinceChange,
  onDistrictChange,
  onCommuneChange,
}: ShippingAddressSectionProps) {
  return (
    <section className="bg-white rounded-2xl border border-border/50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Truck className="w-5 h-5 text-primary" />
        <h2 className="text-[16px] text-foreground font-700">Địa Chỉ Vận Chuyển</h2>
      </div>
      <div className="space-y-3">
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
        <input
          type="text"
          placeholder="Quốc gia"
          value={country}
          onChange={e => onCountryChange(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
        />
        <input
          type="text"
          placeholder="Tỉnh/Thành phố"
          value={province}
          onChange={e => onProvinceChange(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
        />
        <input
          type="text"
          placeholder="Quận/Huyện"
          value={district}
          onChange={e => onDistrictChange(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
        />
        <input
          type="text"
          placeholder="Phường/Xã"
          value={commune}
          onChange={e => onCommuneChange(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
        />
      </div>
    </section>
  );
}
