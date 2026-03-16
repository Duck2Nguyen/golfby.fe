'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AddressForm from '@/components/Address/AddressForm/index';
import AddressCard, { type Address } from '@/components/Address/AddressCard/index';

const mockAddresses: Address[] = [
  {
    id: '1',
    firstName: 'HAI',
    lastName: 'NGUYEN',
    company: '',
    address1: 'Nha o hai',
    address2: '',
    city: 'Hanoi',
    country: 'Việt Nam',
    zipCode: '100000',
    phone: '0923456781',
    isDefault: true,
  },
  {
    id: '2',
    firstName: 'MINH',
    lastName: 'TRAN',
    company: 'Golf Pro Co.',
    address1: '123 Nguyễn Huệ',
    address2: 'Tầng 5',
    city: 'Hồ Chí Minh',
    country: 'Việt Nam',
    zipCode: '700000',
    phone: '0912345678',
    isDefault: false,
  },
];

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleAddNew = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleSubmit = (data: Omit<Address, 'id'>) => {
    if (editingAddress) {
      setAddresses(prev =>
        prev.map(a => (a.id === editingAddress.id ? { ...data, id: editingAddress.id } : a)),
      );
    } else {
      const newAddress: Address = {
        ...data,
        id: Date.now().toString(),
      };
      setAddresses(prev => [...prev, newAddress]);
    }
    setShowForm(false);
    setEditingAddress(null);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-10">
        {/* Page Title */}
        <h1 className="text-center text-[28px] text-foreground mb-8 font-700">Địa Chỉ</h1>

        {showForm ? (
          <div className="mb-8">
            <AddressForm address={editingAddress} onSubmit={handleSubmit} onCancel={handleCancel} />
          </div>
        ) : (
          <>
            {/* Add New Button */}
            <div className="mb-6">
              <button
                onClick={handleAddNew}
                className="flex items-center text-[1.4rem] gap-2 bg-primary hover:bg-primary/90 text-white px-6 h-12 rounded-full transition-all duration-200 hover:shadow-md hover:shadow-primary/20 active:scale-[0.98] font-600"
              >
                <Plus className="w-5 h-5" />
                Thêm Địa Chỉ Mới
              </button>
            </div>

            {/* Address Count */}
            <h2 className="text-[16px] text-foreground mb-6 font-600">Số Địa Chỉ Khách Hàng</h2>

            {/* Address List */}
            {addresses.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-[15px] mb-4">Bạn chưa có địa chỉ nào.</p>
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 h-11 rounded-full transition-all duration-200 font-600"
                >
                  <Plus className="w-4 h-4" />
                  Thêm Địa Chỉ Mới
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {addresses.map(address => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    onEdit={() => handleEdit(address)}
                    onDelete={() => handleDelete(address.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
