import React from 'react';
import { I18nProvider } from '@react-aria/i18n';

import { Field as FormikField } from 'formik';
import { DatePicker } from '@heroui/date-picker';

import type { CalendarDate } from '@internationalized/date';
import type { FieldProps as FormikFieldProps } from 'formik';

interface DatePickerFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  minDate?: CalendarDate;
  maxDate?: CalendarDate;
  labelClassName?: string;
}

const DatePickerField = ({
  name,
  label,
  required,
  minDate,
  maxDate,
  labelClassName,
}: DatePickerFieldProps) => {
  return (
    <FormikField name={name}>
      {({ field, form, meta }: FormikFieldProps) => {
        const hasError = Boolean(meta.error && meta.touched);

        return (
          <div className="flex flex-col gap-[0.8rem]">
            {label && (
              <label
                className={`text-[1.6rem] font-600 leading-[2rem] text-text-text-primary ${
                  labelClassName || ''
                }`}
              >
                {label}
                {required && <span className="text-subtitle-red-300"> *</span>}
              </label>
            )}
            <div className="relative w-full">
              <I18nProvider locale="vi-VN">
                <DatePicker
                  id={name}
                  placeholderValue={null}
                  minValue={minDate}
                  maxValue={maxDate}
                  classNames={{
                    base: 'w-full',
                    inputWrapper: [
                      'bg-white',
                      'border-2',
                      hasError ? 'border-subtitle-red-300' : 'border-neutral-30',
                      'rounded-[1.6rem]',
                      'px-[1.6rem]',
                      'py-[1.4rem]',
                      'h-auto',
                      'min-h-0',
                      hasError ? 'shadow-[0px_2px_0px_0px_#FF4363]' : 'shadow-none',
                    ].join(' '),
                    input: ['font-700', 'text-[1.6rem]', 'leading-[2.4rem]', 'text-text-text-primary'].join(
                      ' ',
                    ),
                    selectorButton: 'text-text-text-disable',
                  }}
                  onChange={value => form.setFieldValue(field.name, value?.toString() || '')}
                  onBlur={() => form.setFieldTouched(field.name, true)}
                />
              </I18nProvider>
            </div>
            {hasError && (
              <p className="text-[1.4rem] font-600 leading-[2rem] text-subtitle-red-300">{meta.error}</p>
            )}
          </div>
        );
      }}
    </FormikField>
  );
};

export default DatePickerField;
