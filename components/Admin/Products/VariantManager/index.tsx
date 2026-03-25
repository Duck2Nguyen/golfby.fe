'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

import type { VariantOption } from '../product-types';

interface VariantManagerProps {
  onChangeAction: (variants: VariantOption[]) => void;
  variants: VariantOption[];
}

interface VariantCardProps {
  index: number;
  onAddValueAction: (value: string) => void;
  onRemoveAction: () => void;
  onRemoveValueAction: (index: number) => void;
  onUpdateNameAction: (name: string) => void;
  variant: VariantOption;
}

function VariantCard({
  index,
  onAddValueAction,
  onRemoveAction,
  onRemoveValueAction,
  onUpdateNameAction,
  variant,
}: VariantCardProps) {
  const [newValue, setNewValue] = useState('');

  const handleAddClick = () => {
    if (!newValue.trim()) {
      return;
    }

    onAddValueAction(newValue.trim());
    setNewValue('');
  };

  return (
    <div className="rounded-lg border border-border bg-white p-3">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[1.2rem] text-muted-foreground">Option {index + 1}</p>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive"
          onClick={onRemoveAction}
          type="button"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-[1.1rem] text-muted-foreground">Option name</label>
        <input
          className="h-10 w-full rounded-md border border-border bg-white px-3 text-[1.3rem] focus:outline-none focus:ring-2 focus:ring-primary/20"
          onChange={event => onUpdateNameAction(event.target.value)}
          placeholder="VD: Shaft"
          type="text"
          value={variant.name}
        />
      </div>

      <div>
        <label className="mb-1 block text-[1.1rem] text-muted-foreground">Option values</label>

        <div className="mb-2 flex flex-wrap gap-2">
          {variant.values.map((value, valueIndex) => (
            <div
              className="flex items-center gap-1.5 rounded-md border border-border bg-input-background px-2.5 py-1 text-[1.3rem]"
              key={`${variant.id}-${valueIndex}`}
            >
              <span>{value}</span>
              <button
                className="rounded-sm p-0.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive"
                onClick={() => onRemoveValueAction(valueIndex)}
                type="button"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="h-9 w-full rounded-md border border-dashed border-border bg-white px-2.5 text-[1.3rem] placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
            onChange={event => setNewValue(event.target.value)}
            onKeyDown={event => {
              if (event.key !== 'Enter') {
                return;
              }

              event.preventDefault();
              handleAddClick();
            }}
            placeholder="Nhập value rồi Enter"
            type="text"
            value={newValue}
          />
          <button
            className="h-9 shrink-0 rounded-md border border-border px-3 text-[1.3rem] text-foreground transition-colors hover:bg-muted"
            onClick={handleAddClick}
            type="button"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VariantManager({ onChangeAction, variants }: VariantManagerProps) {
  const handleAddVariant = () => {
    const newVariant: VariantOption = {
      id: `VAR${Date.now()}`,
      name: '',
      values: [],
    };

    onChangeAction([...variants, newVariant]);
  };

  const handleRemoveVariant = (id: string) => {
    onChangeAction(variants.filter(variant => variant.id !== id));
  };

  const handleUpdateVariantName = (id: string, name: string) => {
    onChangeAction(variants.map(variant => (variant.id === id ? { ...variant, name } : variant)));
  };

  const handleAddValue = (variantId: string, value: string) => {
    onChangeAction(
      variants.map(variant =>
        variant.id === variantId ? { ...variant, values: [...variant.values, value] } : variant,
      ),
    );
  };

  const handleRemoveValue = (variantId: string, valueIndex: number) => {
    onChangeAction(
      variants.map(variant =>
        variant.id === variantId
          ? { ...variant, values: variant.values.filter((_, index) => index !== valueIndex) }
          : variant,
      ),
    );
  };

  return (
    <div className="space-y-3">
      {variants.map((variant, index) => (
        <VariantCard
          index={index}
          key={variant.id}
          onAddValueAction={value => handleAddValue(variant.id, value)}
          onRemoveAction={() => handleRemoveVariant(variant.id)}
          onRemoveValueAction={valueIndex => handleRemoveValue(variant.id, valueIndex)}
          onUpdateNameAction={name => handleUpdateVariantName(variant.id, name)}
          variant={variant}
        />
      ))}

      <button
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 text-[1.3rem] font-500 text-primary transition-all hover:border-primary/50 hover:bg-primary-light"
        onClick={handleAddVariant}
        type="button"
      >
        <Plus className="h-4 w-4" />
        Thêm option
      </button>
    </div>
  );
}
