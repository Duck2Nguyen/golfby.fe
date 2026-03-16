'use client';

import { useState } from 'react';

import { Input } from '@heroui/input';

import type { FieldProps } from 'formik';

import EyeIcon from '@/assets/svg/eye.svg';

interface PasswordInputFieldProps {
  placeholder?: string;
  hasError?: boolean;
}

// Formik Field component compatible
export default function PasswordInputField({
  placeholder = '********',
  hasError = false,
  field,
  form,
  ...props
}: PasswordInputFieldProps & FieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const hasValue = Boolean(field.value);

  return (
    <Input
      {...field}
      {...props}
      type={showPassword ? 'text' : 'password'}
      placeholder={placeholder}
      aria-label={placeholder}
      endContent={
        hasValue && !hasError ? (
          <button
            className="flex size-8 items-center justify-center"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            <EyeIcon />
          </button>
        ) : null
      }
      classNames={{
        base: 'w-full',
        inputWrapper: [
          'bg-[#f8f8f8]',
          'border',
          hasError ? 'border-destructive' : 'border-border/80 hover:border-gray-300',
          'rounded-xl',
          'px-4',
          'h-[4.8rem]',
          'transition-all duration-200',
          'group-data-[focus=true]:bg-background',
          'group-data-[focus=true]:border-primary',
          'group-data-[focus=true]:ring-2',
          'group-data-[focus=true]:ring-primary/15',
          hasError
            ? 'group-data-[focus=true]:border-destructive group-data-[focus=true]:ring-destructive/15'
            : 'shadow-none',
          '!overflow-hidden',
        ].join(' '),
        input: [
          'text-[1.4rem] font-500 text-foreground',
          'h-full',
          'placeholder:text-muted-foreground/60',
          'placeholder:font-400',
        ].join(' '),
      }}
      variant="flat"
    />
  );
}
