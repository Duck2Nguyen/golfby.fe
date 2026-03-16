import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';

import type { UserInfo, SessionInfo } from '@/interfaces/model';

import { fetcher } from '@/utils/restApi';

import { auth } from '@/lib/firebase';
import { SESSION_INFO } from '@/global/swr';
import { ROLE, METHOD } from '@/global/common';

export const useSession = () => {
  const router = useRouter();
  const { data, mutate } = useSWR<SessionInfo>(SESSION_INFO);

  const initUser = async () => {
    mutate(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetcher<{ success: boolean; data: UserInfo }>(
        '/api/v1/auth/me',
        METHOD.GET,
        undefined,
      );
      const userInfo = response.data as UserInfo;

      mutate(prev => ({
        ...prev,
        isAuthenticated: true,
        loading: false,
        userInfo,
      }));

      return { success: true, user: userInfo };
    } catch (error) {
      console.log({ error });
      mutate({ isAuthenticated: false, loading: false });
      return { success: false, user: null };
    }
  };

  const login = async (payload: { email: string; password: string }) => {
    try {
      mutate(prev => ({ ...prev, loading: true }));

      const userCredential = await signInWithEmailAndPassword(auth, payload.email, payload.password);
      const idToken = await userCredential.user.getIdToken();

      let csrfToken = '';
      try {
        const csrfResponse = await fetcher<{ csrfToken: string }>('/api/v1/auth/csrf', METHOD.POST, {});
        csrfToken = csrfResponse.csrfToken || '';
      } catch {
        // Continue without CSRF token if it fails
      }

      const loginPayload = {
        idToken,
        csrfToken,
        remember: false,
      };

      await fetcher<{ accessToken: string }>('/api/v1/auth/login', METHOD.POST, loginPayload);

      const result = await initUser();

      if (result.success) {
        if (result.user?.userRole === ROLE.ADMIN || result.user?.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      } else {
        mutate({ isAuthenticated: false, loading: false });
      }

      return result.success;
    } catch (error) {
      console.error('Login error:', error);
      mutate({ isAuthenticated: false, loading: false });
      throw error;
    }
  };

  const logout = async () => {
    const uri = '/api/v1/auth/logout';
    await fetcher<Record<string, unknown>>(uri, METHOD.POST, {});
    router.push('/login');
    mutate({
      isAuthenticated: false,
    });
  };

  return {
    data,
    login,
    logout,
    initUser,
    update: mutate,
  };
};
