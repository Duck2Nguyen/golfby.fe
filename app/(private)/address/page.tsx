'use client';

import { Plus } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

import { addToast } from '@heroui/toast';

import type { UserAddress } from '@/interfaces/model';

import { useMutation, useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AddressForm from '@/components/Address/AddressForm/index';
import AddressCard, { type Address } from '@/components/Address/AddressCard/index';

export default function AddressPage() {
  const {
    data: userAddressesResponse,
    isLoading,
    mutate: mutateUserAddresses,
  } = useSWRWrapper<UserAddress[]>('/api/v1/user-addresses', {
    url: '/api/v1/user-addresses',
    method: METHOD.GET,
  });

  const createAddressMutation = useMutation('/api/v1/user-addresses', {
    url: '/api/v1/user-addresses',
    method: METHOD.POST,
  });

  const updateAddressMutation = useMutation('/api/v1/user-addresses/{id}', {
    url: '/api/v1/user-addresses/{id}',
    method: METHOD.PATCH,
  });

  const deleteAddressMutation = useMutation('/api/v1/user-addresses/{id}', {
    url: '/api/v1/user-addresses/{id}',
    method: METHOD.DELETE,
  });

  const apiAddresses = useMemo(
    () => (Array.isArray(userAddressesResponse?.data) ? userAddressesResponse.data : []),
    [userAddressesResponse?.data],
  );

  const mappedApiAddresses = useMemo<Address[]>(
    () =>
      apiAddresses.map(item => ({
        id: item.id || '',
        firstName: item.firstName || '',
        lastName: item.lastName || '',
        company: item.company || '',
        address1: item.address || '',
        address2: item.commune || '',
        city: item.province || '',
        country: item.country || '',
        zipCode: item.zipCode || '',
        phone: item.phoneNumber || '',
        isDefault: Boolean(item.isDefault),
      })),
    [apiAddresses],
  );

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setAddresses(mappedApiAddresses);
  }, [mappedApiAddresses]);

  const handleAddNew = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const mapAddressPayload = (data: Omit<Address, 'id'>) => ({
    firstName: data.firstName,
    lastName: data.lastName,
    phoneNumber: data.phone,
    address: data.address1,
    zipCode: data.zipCode,
    country: data.country,
    company: data.company || '',
    province: data.city,
    commune: data.address2 || '',
    isDefault: data.isDefault,
  });

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
