import clsx from 'clsx';

import type { Metadata, Viewport } from 'next';

import { siteConfig } from '@/config/site';
import { fontSans, fontNunito } from '@/config/fonts';

import { Providers } from './providers';
import '@/styles/globals.css';
import 'keen-slider/keen-slider.min.css';

import '@/styles/toastify.scss';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          'min-h-screen text-foreground bg-background font-sans antialiased',
          fontSans.variable,
          fontNunito.variable,
        )}
      >
        <Providers
          themeProps={{
            attribute: 'class',
            defaultTheme: 'light',
            forcedTheme: 'light',
          }}
        >
          <div className="relative flex flex-col h-screen overflow-x-hidden">
            {/* <Navbar /> */}
            <main className="text-foreground bg-background flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
