'use client';

import { addToast } from '@heroui/toast';
import useSWRMutation from 'swr/mutation';
import useSWR, { useSWRConfig } from 'swr';

import type { SWRMutationConfiguration } from 'swr/mutation';
import type { NotificationConfig } from '@/interfaces/model';
import type { Key, PublicConfiguration } from 'swr/_internal';
import type { RestError, RestResponse } from '@/interfaces/response';

import { fetcher } from '@/utils/restApi';
import { genCsrfToken } from '@/utils/csrf';

import { METHOD } from '@/global/common';
import { COMMON_LOADING } from '@/global/swr';

import { useSession } from './auth';

enum ErrorCodes {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_PARAMS = 'INVALID_PARAMS',
  URI_NOT_FOUND = 'URI_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_NOT_VERIFIED = 'USER_NOT_VERIFIED',
  USER_VERIFIED = 'USER_VERIFIED',
  USERNAME_EXIST = 'USERNAME_EXIST',
  USERNAME_ALREADY_EXIST = 'Username already exists',
  EMAIL_EXIST = 'EMAIL_EXIST',
  PHONE_NUMBER_EXIST = 'PHONE_NUMBER_EXIST',
  PASSWORD_NOT_MATCH = 'PASSWORD_NOT_MATCH',
  API_KEY_NOT_FOUND = 'API_KEY_NOT_FOUND',
  PACKAGE_NOT_FOUND = 'PACKAGE_NOT_FOUND',
  EMAIL_QUOTA_EXCEEDED = 'EMAIL_QUOTA_EXCEEDED',
  PAYMENT_METHOD_NOT_FOUND = 'PAYMENT_METHOD_NOT_FOUND',
  PAYMENT_TRANSACTION_NOT_FOUND = 'PAYMENT_TRANSACTION_NOT_FOUND',
  EMAIL_NOT_OWNED = 'EMAIL_NOT_OWNED',
}

const ERROR_MESSAGES: Record<string, string> = {
  [ErrorCodes.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [ErrorCodes.UNAUTHORIZED]: 'Unauthorized',
  [ErrorCodes.INVALID_PARAMS]: 'Invalid Parameters',
  [ErrorCodes.URI_NOT_FOUND]: 'Resource Not Found',
  [ErrorCodes.USER_NOT_FOUND]: 'User Not Found',
  [ErrorCodes.USER_NOT_VERIFIED]: 'User Email Not Verified',
  [ErrorCodes.USER_VERIFIED]: 'User Already Verified',
  [ErrorCodes.USERNAME_EXIST]: 'Username Already Exists',
  [ErrorCodes.USERNAME_ALREADY_EXIST]: 'Username Already Exists',
  [ErrorCodes.EMAIL_EXIST]: 'Email Already Exists',
  [ErrorCodes.PHONE_NUMBER_EXIST]: 'Phone Number Already Exists',
  [ErrorCodes.PASSWORD_NOT_MATCH]: 'Password Does Not Match',
  [ErrorCodes.API_KEY_NOT_FOUND]: 'API Key Not Found',
  [ErrorCodes.PACKAGE_NOT_FOUND]: 'Package Not Found',
  [ErrorCodes.EMAIL_QUOTA_EXCEEDED]: 'Email Quota Exceeded',
  [ErrorCodes.PAYMENT_METHOD_NOT_FOUND]: 'Payment Method Not Found',
  [ErrorCodes.PAYMENT_TRANSACTION_NOT_FOUND]: 'Payment Transaction Not Found',
  [ErrorCodes.EMAIL_NOT_OWNED]: 'Email Not Owned',
};

/**
 * Translate error code to user-friendly message
 * If code exists in ERROR_MESSAGES, use the translation
 * Otherwise, return the original error message
 */
export const translateErrorCode = (code?: string): string => {
  if (!code) return 'An error occurred';
  return ERROR_MESSAGES[code] || code;
};

export function useSWRWrapper<T = Record<string, unknown>>(
  key: Key,
  {
    url,
    method,
    body,
    noEndPoint,
    noAuth,
    ...config
  }: {
    url?: string;
    method?: METHOD;
    body?: Record<string, unknown>;
    noEndPoint?: boolean;
    noAuth?: boolean;
    extraHeader?: Record<string, string>;
  } & Partial<PublicConfiguration<RestResponse<T>, RestError, (arg: string) => any>>,
) {
  const { data: session } = useSession();

  return useSWR<RestResponse<T>>(
    key,
    async () => {
      const data = await fetcher<T>(url ?? '', method ?? METHOD.GET, body, {
        ...config?.extraHeader,
        ...(!noAuth && {
          Authorization: 'Bearer ' + session?.accessToken,
        }),
      });
      return data!;
    },
    { revalidateOnFocus: false, ...config },
  );
}

export const useMutation = <T = Record<string, unknown>,>(
  key: string,
  {
    url,
    method,
    noEndpoint,
    ...options
  }: {
    url?: string;
    method?: METHOD;
    notification?: NotificationConfig;
    componentId?: string;
    loading?: boolean;
    noEndpoint?: boolean;
    noAuth?: boolean;
    extraHeader?: Record<string, string>;
  } & SWRMutationConfiguration<RestResponse<T>, RestError & Record<string, unknown>>,
) => {
  const { mutate } = useSWRConfig();
  const { data: session } = useSession();

  return useSWRMutation(
    key,
    async (mutationKey: string, { arg: body }: { arg?: Record<string, unknown> | FormData }) => {
      return new Promise<RestResponse<T>>((resolve, reject) => {
        const executeRequest = async () => {
          const requestBody = body;

          if (requestBody && !(requestBody instanceof FormData)) {
            const shouldAttachCsrf = Boolean(requestBody.csrf);

            if ('csrf' in requestBody) {
              delete requestBody.csrf;
            }

            if (shouldAttachCsrf) {
              const csrfToken = await genCsrfToken();
              if (csrfToken) {
                requestBody.csrfToken = csrfToken;
              }
            }
          }

          return requestBody;
        };

        executeRequest()
          .then(requestBody => {
            let componentId = options.componentId;
            let notification = options.notification;

            if (!(requestBody instanceof FormData) && requestBody?.componentId) {
              componentId = requestBody?.componentId as string;
              delete requestBody.componentId;
            }
            if (!(requestBody instanceof FormData) && requestBody?.notification) {
              notification = requestBody?.notification as NotificationConfig;
              delete requestBody.notification;
            }

            if (options.loading) {
              mutate(COMMON_LOADING, {
                componentId,
                loading: true,
              });
            }

            const extraHeader = (requestBody as Record<string, unknown>)?.extraHeader as Record<
              string,
              string
            >;
            if (!(requestBody instanceof FormData) && requestBody?.extraHeader) {
              delete requestBody.extraHeader;
            }

            fetcher<T>(url ?? mutationKey, method ?? METHOD.POST, requestBody as Record<string, unknown>, {
              ...(!options.noAuth && {
                Authorization: 'Bearer ' + session?.accessToken,
              }),
              ...extraHeader,
            })
              .then(data => {
                resolve(data);
                if (notification && !notification.ignoreSuccess) {
                  addToast({
                    color: 'success',
                    variant: 'solid',
                    title: notification?.title,
                    description: notification?.content,
                  });
                }
              })
              .catch(err => {
                reject(err);
                if (!notification?.ignoreError) {
                  // Handle error message - first check if code is in our translations
                  let errorMessage = notification?.errorMessage;

                  if (!errorMessage) {
                    if (err?.code && ERROR_MESSAGES[err.code]) {
                      // Use translated error code
                      errorMessage = translateErrorCode(err.code);
                    } else if (err?.message) {
                      // Use message if it's a string, or take first element if array
                      errorMessage = Array.isArray(err.message) ? err.message[0] : err.message;
                    } else {
                      // Fallback
                      errorMessage = 'An error occurred';
                    }
                  }

                  addToast({
                    color: 'danger',
                    variant: 'solid',
                    title: notification?.title ?? 'Error',
                    description: errorMessage,
                  });
                }
              })
              .finally(() => {
                {
                  if (options.loading) {
                    mutate(COMMON_LOADING, {
                      componentId,
                      loading: false,
                    });
                  }
                }
              });
          })
          .catch(err => {
            reject(err);

            if (options.loading) {
              mutate(COMMON_LOADING, {
                componentId: options.componentId,
                loading: false,
              });
            }
          });
      });
    },
    {
      onError(err, keyErrr, config) {
        options.onError?.(err, key, config as any);
      },
      onSuccess(data, keySuccess, config) {
        options.onSuccess?.(data as RestResponse<T>, key, config as any);
      },
    },
  );
};
