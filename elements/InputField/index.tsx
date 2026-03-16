import { Input } from '@heroui/input';

import type { FieldProps } from 'formik';

import ClearIcon from '@/assets/svg/clear.svg';
import ErrorIcon from '@/assets/svg/error.svg';

interface InputFieldProps {
  icon?: React.ComponentType;
  placeholder: string;
  type?: string;
  className?: string;
  hasError?: boolean;
  readOnly?: boolean;
}

// Formik Field component compatible
export default function InputField({
  icon: Icon,
  placeholder,
  type = 'text',
  className = '',
  hasError = false,
  field,
  form,
  ...props
}: InputFieldProps & FieldProps) {
  const hasValue = Boolean(field.value);

  const handleClear = () => {
    form.setFieldValue(field.name, '');
  };

  return (
    <Input
      {...field}
      {...props}
      type={type}
      placeholder={placeholder}
      aria-label={placeholder}
      startContent={Icon ? <Icon /> : undefined}
      endContent={
        hasValue && !hasError ? (
          <button className="flex size-8 items-center justify-center" type="button" onClick={handleClear}>
            <ClearIcon />
          </button>
        ) : hasError ? (
          <div className="flex size-8 items-center justify-center">
            <ErrorIcon />
          </div>
        ) : null
      }
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
          className,
        ].join(' '),
        input: [
          'text-[1.6rem] !font-600 text-text-text-primary',
          'leading-[2.4rem]',
          'h-full',
          'placeholder:text-text-text-secondary',
          'placeholder:font-400',
        ].join(' '),
      }}
      variant="flat"
    />
  );
}
