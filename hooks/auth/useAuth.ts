import { METHOD } from '@/global/common';

import { useMutation } from '../swr';

export const useAuth = () => {
  const createUserMutation = useMutation('/api/v1/users', {
    url: '/api/v1/users',
    method: METHOD.POST,
    loading: true,
  });

  const forgotPasswordMutation = useMutation('/api/v1/auth/forgot', {
    url: '/api/v1/auth/forgot',
    method: METHOD.POST,
    noAuth: true,
  });

  const resetPasswordMutation = useMutation('/api/v1/auth/reset', {
    url: '/api/v1/auth/reset',
    method: METHOD.POST,
    noAuth: true,
  });

  const forgotPasswordCheckMutation = useMutation('/api/v1/auth/forgot-check', {
    url: '/api/v1/auth/forgot-check',
    method: METHOD.POST,
    noAuth: true,
  });

  return {
    createUserMutation,
    forgotPasswordMutation,
    forgotPasswordCheckMutation,
    resetPasswordMutation,
  };
};
