import React from 'react';

import { Field as FormikField } from 'formik';

import type { FieldProps as FormikFieldProps } from 'formik';

import PasswordInputField from '../PasswordInputField';

interface PasswordFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

const PasswordField = ({ name, label, placeholder = '********', required }: PasswordFieldProps) => {
  return (
    <FormikField name={name}>
      {({ field, form, meta }: FormikFieldProps) => {
        const hasError = Boolean(meta.touched && meta.error);

        return (
          <div className="flex flex-col gap-2">
            {label && (
              <label className="block mb-2 text-[1.4rem] font-500 text-foreground">
                {label}
                {required && <span className="text-destructive ml-0.5">*</span>}
              </label>
            )}
            <PasswordInputField
              field={field}
              form={form}
              meta={meta}
              placeholder={placeholder}
              hasError={hasError}
            />
            {hasError && <p className="text-[1.2rem] text-destructive">{meta.error}</p>}
          </div>
        );
      }}
    </FormikField>
  );
};

export default PasswordField;
