import React from 'react';

import { Field as FormikField } from 'formik';

import type { FieldProps as FormikFieldProps } from 'formik';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  className?: string;
  disabled?: boolean;
  label?: string;
  name: string;
  options: SelectOption[];
  required?: boolean;
}

const SelectField = ({ className, disabled = false, label, name, options, required }: SelectFieldProps) => {
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

            <select
              className={`h-[4.8rem] w-full cursor-pointer appearance-none rounded-xl border bg-[#f8f8f8] px-4 text-[1.4rem] font-500 text-foreground transition-all duration-200 focus:outline-none focus:ring-2 ${
                hasError
                  ? 'border-destructive focus:border-destructive focus:ring-destructive/15'
                  : 'border-border/80 hover:border-gray-300 focus:border-primary focus:ring-primary/15'
              } ${disabled ? 'pointer-events-none opacity-75' : ''} ${className || ''}`}
              disabled={disabled}
              onBlur={() => form.setFieldTouched(name, true)}
              onChange={event => form.setFieldValue(name, event.target.value)}
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                backgroundPosition: 'right 12px center',
                backgroundRepeat: 'no-repeat',
              }}
              value={field.value || ''}
            >
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {hasError && <p className="text-[1.2rem] text-destructive">{meta.error}</p>}
          </div>
        );
      }}
    </FormikField>
  );
};

export default SelectField;
