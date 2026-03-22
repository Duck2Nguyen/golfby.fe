import { METHOD } from '@/global/common';

import { fetcher } from './restApi';

export const genCsrfToken = async () => {
  try {
    const response = await fetcher<{ csrfToken: string }>('/api/v1/auth/csrf', METHOD.POST, {});
    return (response as unknown as { csrfToken: string })?.csrfToken || '';
  } catch {
    return '';
  }
};
