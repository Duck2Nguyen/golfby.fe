'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';
import { ToastProvider } from '@heroui/toast';
import { HeroUIProvider } from '@heroui/system';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import type { ThemeProviderProps } from 'next-themes';

import ClientProvider from './providers/ClientProvider';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <ToastProvider
          placement="top-right"
          toastProps={{ timeout: 3000, classNames: { base: '!top-[0.8rem]' } }}
        />
        <ClientProvider>{children}</ClientProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
