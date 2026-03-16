import type { RestResponse } from '@/interfaces/response';

import { METHOD } from '@/global/common';

import { removeKey } from './localStorage';

export const replacePlaceholder = (s: string, data: Record<string, unknown>) => {
  const parts = s.split(/{(.*?)}/g).map(v => {
    const replaced = v.replace(/{/g, '');
    if (data instanceof FormData) {
      return data.get(replaced) || replaced;
    }
    const key = data[replaced] || replaced;
    data[replaced] = undefined;
    return key;
  });

  return parts.join('');
};

export const fetcher = async <T = Record<string, unknown>, TBody = Record<string, unknown>>(
  url: string,
  method: METHOD,
  body?: TBody | FormData,
  headers?: HeadersInit,
) => {
  let parsedUri = `${process.env.BASE_API_URL}${url}${
    method === METHOD.GET && body ? `?${new URLSearchParams(body as unknown as Record<string, string>)}` : ''
  }`;
  parsedUri = replacePlaceholder(parsedUri, (body as unknown as TBody) || {});
  const res = await fetch(parsedUri, {
    method,
    headers: {
      ...headers,
      ...(!(body instanceof FormData) && {
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    },
    ...(method !== METHOD.GET && {
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  });

  if (!res.ok) {
    let error;
    try {
      error = await res.json();
      error.status = res.status;

      if (error.status === 401) {
        window.location.href = '/login';
        removeKey('accessToken');
      }
    } catch {
      console.log('INTERNAL SERVER ERROR ');
      error = {
        message: 'Internal Server Error',
      };
    }
    throw error;
  }

  return res.json() as Promise<RestResponse<T>>;
};
