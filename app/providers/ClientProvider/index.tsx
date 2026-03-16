import React from 'react';

import { SWRConfig } from 'swr';
import { useRouter } from 'next/navigation';

type Props = {
  children?: React.ReactNode;
  lng?: string;
};

const ClientProvider = ({ children, lng }: Props) => {
  const router = useRouter();

  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateIfStale: false,
        onError(err, key, config) {
          if (err.code === 'BAD_TOKEN' || err.status === 401) {
            console.log('API Error 401');
            router.push('/');
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default ClientProvider;
