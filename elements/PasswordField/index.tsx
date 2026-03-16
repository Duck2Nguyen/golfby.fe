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
              <label className="text-[1.6rem] font-600 leading-[2rem] text-text-text-primary">
                {label}
                {required && <span className="text-subtitle-red-300"> *</span>}
              </label>
            )}
            <PasswordInputField
              field={field}
              form={form}
              meta={meta}
              placeholder={placeholder}
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

export default PasswordField;
