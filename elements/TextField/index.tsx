import React from 'react';

import { Field as FormikField } from 'formik';

import type { FieldProps as FormikFieldProps } from 'formik';

import InputField from '../InputField';

interface TextFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  icon?: React.ComponentType;
  type?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  readOnly?: boolean;
}

const TextField = ({
  name,
  label,
  placeholder,
  icon,
  type = 'text',
  required,
  className,
  labelClassName,
  readOnly,
}: TextFieldProps) => {
  return (
    <FormikField name={name}>
      {({ field, form, meta }: FormikFieldProps) => {
        const hasError = Boolean(meta.touched && meta.error);

        return (
          <div className="flex flex-col gap-2">
            {label && (
              <label
                className={`text-[1.6rem] font-600 leading-[2rem] text-text-text-primary ${labelClassName || ''}`}
              >
                {label}
                {required && <span className="text-subtitle-red-300"> *</span>}
              </label>
            )}
            <InputField
              readOnly={readOnly}
              field={field}
              form={form}
              meta={meta}
              placeholder={placeholder || ''}
              icon={icon || (() => null)}
              type={type}
              className={className}
              hasError={hasError}
            />
            {hasError && (
              <p className="text-[1.4rem] font-600 leading-[2rem] text-subtitle-red-300">{meta.error}</p>
            )}
          </div>
        );
      }}
    </FormikField>
  );
};

export default TextField;
