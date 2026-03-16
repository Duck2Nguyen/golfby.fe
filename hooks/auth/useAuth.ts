import { METHOD } from '@/global/common';

import { useMutation } from '../swr';

export const useAuth = () => {
  const createUserMutation = useMutation('/api/v1/users', {
    url: '/api/v1/users',
    method: METHOD.POST,
    loading: true,
  });

  return {
    createUserMutation,
  };
};
