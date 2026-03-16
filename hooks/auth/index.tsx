import useSWR from 'swr';
import { useRouter } from 'next/navigation';

import type { UserInfo, SessionInfo } from '@/interfaces/model';

import { fetcher } from '@/utils/restApi';
import { getKey, removeKey } from '@/utils/localStorage';

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

  const login = async (payload: { email: string; password: string }, lng: string) => {};

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
