'use client';

import { Input } from '@heroui/input';

import type { InputProps } from '@heroui/input';

import ClearIcon from '@/assets/svg/clear.svg';
import ErrorIcon from '@/assets/svg/error.svg';

interface TextInputProps extends Omit<InputProps, 'endContent'> {
  hasError?: boolean;
  onClear?: () => void;
}

export default function TextInput({ hasError = false, onClear, value, ...props }: TextInputProps) {
  const hasValue = Boolean(value);

  return (
    <Input
      {...props}
      classNames={{
        base: 'w-full',
        inputWrapper: [
          'bg-neutral-0',
          'border-[2px]',
          hasError ? 'border-subtitle-red-300' : 'border-neutral-30',
          'rounded-[1.6rem]',
          'px-4',
          'py-3.5',
          'h-[5.2rem]',
          hasError ? 'shadow-[0px_2px_0px_0px_#FF4363]' : 'shadow-none',
          'hover:bg-none',
          '!overflow-hidden',
        ],
        input: [
          'text-[1.6rem]',
          'leading-[2.4rem]',
          'h-full',
          hasError || hasValue ? 'text-text-text-primary !font-700' : 'text-text-text-secondary !font-400',
          'placeholder:text-text-text-secondary',
          'placeholder:font-400',
        ],
      }}
      endContent={
        hasValue && !hasError ? (
          <button className="flex size-8 items-center justify-center" type="button" onClick={onClear}>
            <ClearIcon />
          </button>
        ) : hasError ? (
          <div className="flex size-8 items-center justify-center">
            <ErrorIcon />
          </div>
        ) : null
      }
      type="text"
      value={value}
      variant="flat"
    />
  );
}
