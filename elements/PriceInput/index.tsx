'use client';

import { NumericFormat } from 'react-number-format';

import type { NumericFormatProps } from 'react-number-format';

interface PriceInputProps
  extends Omit<
    NumericFormatProps,
    'allowNegative' | 'decimalScale' | 'onValueChange' | 'thousandSeparator' | 'type' | 'value'
  > {
  className?: string;
  hasError?: boolean;
  onValueChange?: (value?: number) => void;
  value?: number | null;
}

export default function PriceInput({
  className = '',
  disabled,
  hasError = false,
  onValueChange,
  placeholder,
  value,
  ...props
}: PriceInputProps) {
  const isEmpty = value === undefined || value === null;

  return (
    <NumericFormat
      {...props}
      allowNegative={false}
      className={[
        'h-10 w-full rounded-lg border border-gray-300 px-3 text-[1.3rem] outline-none transition-colors',
        disabled ? 'bg-gray-50 text-gray-400' : 'bg-white',
        hasError ? 'border-red-300' : 'focus:border-primary',
        className,
      ].join(' ')}
      decimalScale={0}
      disabled={disabled}
      inputMode="numeric"
      placeholder={disabled ? '' : placeholder}
      thousandSeparator=","
      value={isEmpty ? '' : value}
      valueIsNumericString
      onValueChange={({ floatValue, value: numericValue }) => {
        if (numericValue === '') {
          onValueChange?.(undefined);
          return;
        }

        onValueChange?.(typeof floatValue === 'number' ? floatValue : Number(numericValue));
      }}
    />
  );
}
