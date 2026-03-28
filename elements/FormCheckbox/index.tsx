import { Check } from 'lucide-react';

import type { InputHTMLAttributes } from 'react';

interface FormCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function FormCheckbox({ label, checked = false, onCheckedChange, id, ...props }: FormCheckboxProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <label htmlFor={inputId} className="group flex cursor-pointer items-start gap-3">
      <div className="relative mt-0.5 shrink-0">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={e => onCheckedChange?.(e.target.checked)}
          className="peer sr-only"
          {...props}
        />
        <div
          className={` flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-200 ${
            checked ? 'border-primary bg-primary' : 'border-gray-300 bg-white group-hover:border-primary/50'
          } `}
        >
          {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
        </div>
      </div>
      <span
        className="select-none text-[1.4rem] leading-snug text-muted-foreground transition-colors group-hover:text-foreground"
        style={{ fontWeight: 400 }}
      >
        {label}
      </span>
    </label>
  );
}
