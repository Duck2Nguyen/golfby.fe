import { heroui } from '@heroui/theme';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
        nunito: ['var(--font-nunito)'],
      },
      fontWeight: {
        100: '100',
        200: '200',
        300: '300',
        400: '400',
        500: '500',
        600: '600',
        700: '700',
        800: '800',
        900: '900',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      prefix: 'base-theme',
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: {
              100: '#e6faf8',
              400: '#66e1d3',
              500: '#1db7a6',
              600: '#009c8a',
            },
          },
        },
        dark: {
          colors: {
            primary: {
              100: '#e6faf8',
              400: '#66e1d3',
              500: '#1db7a6',
              600: '#009c8a',
            },
          },
        },
      },
    }),
  ],
};

module.exports = config;
