import { Input } from '@heroui/input';

import type { FieldProps } from 'formik';

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
      // endContent={
      //   hasValue && !hasError ? (
      //     <button className="flex size-8 items-center justify-center" type="button" onClick={handleClear}>
      //       <ClearIcon />
      //     </button>
      //   ) : hasError ? (
      //     <div className="flex size-8 items-center justify-center">
      //       <ErrorIcon />
      //     </div>
      //   ) : null
      // }
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
          className,
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
