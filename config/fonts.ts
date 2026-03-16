import { Nunito, Inter as FontSans, Fira_Code as FontMono } from 'next/font/google';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const fontNunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
});
