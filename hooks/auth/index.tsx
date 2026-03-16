import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';

import type { UserInfo, SessionInfo } from '@/interfaces/model';

import { fetcher } from '@/utils/restApi';
import { getKey, removeKey, setKey } from '@/utils/localStorage';

import { auth } from '@/lib/firebase';
import { METHOD } from '@/global/common';
import { SESSION_INFO } from '@/global/swr';
import { ACCCESS_TOKEN, REFRESH_TOKEN } from '@/global/localStorage';

export const useSession = () => {
  const router = useRouter();
  const { data, mutate } = useSWR<SessionInfo>(SESSION_INFO);

  const initUser = async (accessTokenProps?: string) => {
    mutate(prev => ({ ...prev, loading: true }));
    const accessToken = accessTokenProps || (getKey('accessToken') as string);

    if (!accessToken) {
      mutate({ isAuthenticated: false, loading: false });
      return false;
    }

    try {
      const userInfo = await fetcher<Record<string, unknown>>(
        '/api/v1/auth/verifyAccessToken',
        METHOD.POST,
        undefined,
        {
          Authorization: 'Bearer ' + accessToken,
        },
      );

      mutate(prev => ({
        ...prev,
        isAuthenticated: true,
        loading: false,
        accessToken,
        userInfo: {
          ...(userInfo as UserInfo),
        },
      }));

      return true;
    } catch (error) {
      console.log({ error });
      mutate({ isAuthenticated: false, loading: false });
      return false;
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
        csrfToken = (csrfResponse as { csrfToken: string }).csrfToken || '';
      } catch {
        // Continue without CSRF token if it fails
      }

      const response = await fetcher<{ accessToken: string; refreshToken?: string }>(
        '/api/v1/auth/login',
        METHOD.POST,
        { idToken, csrfToken, remember: false },
      );

      const { accessToken, refreshToken } = response as { accessToken: string; refreshToken?: string };

      setKey(ACCCESS_TOKEN, accessToken);
      if (refreshToken) {
        setKey(REFRESH_TOKEN, refreshToken);
      }

      const success = await initUser(accessToken);

      if (!success) {
        mutate({ isAuthenticated: false, loading: false });
      }

      return success;
    } catch (error) {
      mutate({ isAuthenticated: false, loading: false });
      throw error;
    }
  };

  const logout = async () => {
    removeKey(ACCCESS_TOKEN);
    removeKey(REFRESH_TOKEN);
    // const uri = "/api/v1/auth/logout";
    // await fetcher<Record<string, unknown>>(uri, METHOD.POST, {});
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
