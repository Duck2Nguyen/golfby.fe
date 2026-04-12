import { useState } from 'react';

import type { Address } from '../AddressCard/index';

interface AddressFormProps {
  address?: Address | null;
  onSubmit: (data: Omit<Address, 'id'>) => void;
  onCancel: () => void;
}

const countryOptions = [
  { value: '', label: '---' },
  { value: 'Việt Nam', label: 'Việt Nam' },
  { value: 'Hoa Kỳ', label: 'Hoa Kỳ' },
  { value: 'Nhật Bản', label: 'Nhật Bản' },
  { value: 'Hàn Quốc', label: 'Hàn Quốc' },
  { value: 'Thái Lan', label: 'Thái Lan' },
  { value: 'Singapore', label: 'Singapore' },
  { value: 'Malaysia', label: 'Malaysia' },
  { value: 'Úc', label: 'Úc' },
];

export default function AddressForm({ address, onSubmit, onCancel }: AddressFormProps) {
  const isEditing = !!address;

  const [firstName, setFirstName] = useState(address?.firstName || '');
  const [lastName, setLastName] = useState(address?.lastName || '');
  const [company, setCompany] = useState(address?.company || '');
  const [address1, setAddress1] = useState(address?.address1 || '');
  const [commune, setCommune] = useState(address?.commune || '');
  const [city, setCity] = useState(address?.city || '');
  const [country, setCountry] = useState(address?.country || '');
  const [zipCode, setZipCode] = useState(address?.zipCode || '');
  const [phone, setPhone] = useState(address?.phone || '');
  const [isDefault, setIsDefault] = useState(address?.isDefault || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      firstName,
      lastName,
      company,
      address1,
      commune,
      city,
      country,
      zipCode,
      phone,
      isDefault,
    });
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-[18px] text-foreground mb-8 font-700">
        {isEditing ? 'Chỉnh Sửa Địa Chỉ' : 'Thêm Địa Chỉ Mới'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[14px] text-foreground mb-2 font-600">Tên</label>
          <input
            type="text"
            placeholder="Tên"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-[14px] text-foreground mb-2 font-600">Họ</label>
          <input
            type="text"
            placeholder="Họ"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-[14px] text-foreground mb-2 font-600">Công Ty</label>
          <input
            type="text"
            placeholder="Công ty"
            value={company}
            onChange={e => setCompany(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-[14px] text-foreground mb-2 font-600">Quốc gia/Khu vực</label>
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
          >
            {countryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[14px] text-foreground mb-2 font-600">Thành phố/Tỉnh</label>
          <input
            type="text"
            placeholder="Thành phố/Tỉnh"
            value={city}
            onChange={e => setCity(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-[14px] text-foreground mb-2 font-600">Phường/Xã</label>
          <input
            type="text"
            placeholder="Phường/Xã"
            value={commune}
            onChange={e => setCommune(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-[14px] text-foreground mb-2 font-600">Địa chỉ chi tiết</label>
          <input
            type="text"
            placeholder="Địa chỉ chi tiết"
            value={address1}
            onChange={e => setAddress1(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-[14px] text-foreground mb-2 font-600">Mã Bưu Điện/ZIP</label>
          <input
            type="text"
            placeholder="Mã bưu điện/ZIP"
            value={zipCode}
            onChange={e => setZipCode(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-[14px] text-foreground mb-2 font-600">Điện Thoại</label>
          <input
            type="tel"
            placeholder="Điện thoại"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="default-address"
            checked={isDefault}
            onChange={e => setIsDefault(e.target.checked)}
            className="w-4 h-4 rounded border-border cursor-pointer"
          />
          <label htmlFor="default-address" className="text-[14px] text-foreground font-600">
            Đặt Làm Địa Chỉ Mặc Định
          </label>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <button
            type="submit"
            className="w-full h-11 bg-primary hover:bg-primary/90 text-white rounded-xl font-600 text-[14px] transition-all duration-200"
          >
            {isEditing ? 'Cập Nhật Địa Chỉ' : 'Thêm Địa Chỉ'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full h-11 bg-[#f3f3f3] hover:bg-[#efefef] text-foreground rounded-xl font-600 text-[14px] border border-border transition-all duration-200"
          >
            Hủy Bỏ
          </button>
        </div>
      </form>
    </div>
  );
}
