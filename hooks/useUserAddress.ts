import { useMemo } from 'react';

import type { UserAddress } from '@/interfaces/model';

import { useMutation, useSWRWrapper } from '@/hooks/swr';

import { METHOD } from '@/global/common';

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  commune?: string;
  city: string;
  district?: string;
  country: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}

export const mapAddressPayload = (data: Omit<Address, 'id'>) => ({
  firstName: data.firstName,
  lastName: data.lastName,
  phoneNumber: data.phone,
  address: data.address1,
  zipCode: data.zipCode,
  country: data.country,
  company: data.company || '',
  province: data.city,
  district: data.district || '',
  commune: data.commune || '',
  isDefault: data.isDefault,
});

export const mapApiAddressToAddress = (apiAddresses: UserAddress[]): Address[] =>
  apiAddresses.map(item => ({
    id: item.id || '',
    firstName: item.firstName || '',
    lastName: item.lastName || '',
    company: item.company || '',
    address1: item.address || '',
    commune: item.commune || '',
    city: item.province || '',
    district: item.district || '',
    country: item.country || '',
    zipCode: item.zipCode || '',
    phone: item.phoneNumber || '',
    isDefault: Boolean(item.isDefault),
  }));

export const useUserAddress = () => {
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

  const mappedAddresses = useMemo<Address[]>(() => mapApiAddressToAddress(apiAddresses), [apiAddresses]);

  const defaultAddress = useMemo(() => mappedAddresses.find(addr => addr.isDefault), [mappedAddresses]);

  return {
    addresses: mappedAddresses,
    defaultAddress,
    isLoading,
    mutateUserAddresses,
    createAddressMutation,
    updateAddressMutation,
    deleteAddressMutation,
    mapAddressPayload,
  };
};
