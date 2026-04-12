'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { addToast } from '@heroui/toast';

import { type Address, useUserAddress } from '@/hooks/useUserAddress';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AddressForm from '@/components/Address/AddressForm/index';
import AddressCard from '@/components/Address/AddressCard/index';

export default function AddressPage() {
  const {
    addresses,
    isLoading,
    mutateUserAddresses,
    createAddressMutation,
    updateAddressMutation,
    deleteAddressMutation,
    mapAddressPayload,
  } = useUserAddress();

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAddNew = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);

      await deleteAddressMutation.trigger({
        csrf: true,
        id,
      });

      await mutateUserAddresses();
      addToast({ color: 'success', description: 'Xóa địa chỉ thành công.' });
    } catch (error: any) {
      const errorMsg = error?.message || 'Không thể xóa địa chỉ. Vui lòng thử lại.';
      addToast({ color: 'danger', description: Array.isArray(errorMsg) ? errorMsg[0] : errorMsg });
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleSubmit = async (data: Omit<Address, 'id'>) => {
    try {
      setIsSaving(true);
      const payload = {
        csrf: true,
        ...mapAddressPayload(data),
      };

      if (editingAddress) {
        await updateAddressMutation.trigger({
          id: editingAddress.id,
          ...payload,
        });
        addToast({ color: 'success', description: 'Cập nhật địa chỉ thành công.' });
      } else {
        await createAddressMutation.trigger(payload);
        addToast({ color: 'success', description: 'Thêm địa chỉ thành công.' });
      }

      await mutateUserAddresses();
      setShowForm(false);
      setEditingAddress(null);
    } catch (error: any) {
      console.log('Error occurred while submitting address:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-10">
        {/* Page Title */}
        <h1 className="text-center text-[28px] text-foreground mb-8 font-700">Địa Chỉ</h1>

        {isLoading && !showForm && (
          <div className="mb-6 rounded-xl border border-border bg-white px-4 py-3 text-[1.4rem] text-muted-foreground">
            Đang tải danh sách địa chỉ...
          </div>
        )}

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

            {(isSaving || deletingId) && (
              <div className="mt-6 rounded-xl border border-border bg-white px-4 py-3 text-[1.4rem] text-muted-foreground">
                {isSaving ? 'Đang lưu địa chỉ...' : 'Đang xóa địa chỉ...'}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
