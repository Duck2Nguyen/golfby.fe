'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

import type { ProductOption } from '../product-types';

interface ProductOptionManagerProps {
  onChangeAction: (productOptions: ProductOption[]) => void;
  productOptions: ProductOption[];
}

interface ProductOptionCardProps {
  index: number;
  onAddValueAction: (value: string) => void;
  onRemoveAction: () => void;
  onRemoveValueAction: (index: number) => void;
  onUpdateNameAction: (name: string) => void;
  productOption: ProductOption;
}

function ProductOptionCard({
  index,
  onAddValueAction,
  onRemoveAction,
  onRemoveValueAction,
  onUpdateNameAction,
  productOption,
}: ProductOptionCardProps) {
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
        <p className="text-[1.2rem] text-muted-foreground">Phân loại {index + 1}</p>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive"
          onClick={onRemoveAction}
          type="button"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-[1.1rem] text-muted-foreground">Tên phân loại</label>
        <input
          className="h-10 w-full rounded-md border border-border bg-white px-3 text-[1.3rem] focus:outline-none focus:ring-2 focus:ring-primary/20"
          onChange={event => onUpdateNameAction(event.target.value)}
          placeholder="VD: Shaft"
          type="text"
          value={productOption.name}
        />
      </div>

      <div>
        <label className="mb-1 block text-[1.1rem] text-muted-foreground">Giá trị phân loại</label>

        <div className="mb-2 flex flex-wrap gap-2">
          {productOption.values.map((value, valueIndex) => (
            <div
              className="flex items-center gap-1.5 rounded-md border border-border bg-input-background px-2.5 py-1 text-[1.3rem]"
              key={`${productOption.id}-${valueIndex}`}
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

export default function ProductOptionManager({ onChangeAction, productOptions }: ProductOptionManagerProps) {
  const handleAddProductOption = () => {
    const newProductOption: ProductOption = {
      id: `OPT${Date.now()}`,
      name: '',
      values: [],
    };

    onChangeAction([...productOptions, newProductOption]);
  };

  const handleRemoveProductOption = (id: string) => {
    onChangeAction(productOptions.filter(option => option.id !== id));
  };

  const handleUpdateProductOptionName = (id: string, name: string) => {
    onChangeAction(productOptions.map(option => (option.id === id ? { ...option, name } : option)));
  };

  const handleAddValue = (optionId: string, value: string) => {
    onChangeAction(
      productOptions.map(option =>
        option.id === optionId ? { ...option, values: [...option.values, value] } : option,
      ),
    );
  };

  const handleRemoveValue = (optionId: string, valueIndex: number) => {
    onChangeAction(
      productOptions.map(option =>
        option.id === optionId
          ? { ...option, values: option.values.filter((_, index) => index !== valueIndex) }
          : option,
      ),
    );
  };

  return (
    <div className="space-y-3">
      {productOptions.map((option, index) => (
        <ProductOptionCard
          index={index}
          key={option.id}
          onAddValueAction={value => handleAddValue(option.id, value)}
          onRemoveAction={() => handleRemoveProductOption(option.id)}
          onRemoveValueAction={valueIndex => handleRemoveValue(option.id, valueIndex)}
          onUpdateNameAction={name => handleUpdateProductOptionName(option.id, name)}
          productOption={option}
        />
      ))}

      <button
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 text-[1.3rem] font-500 text-primary transition-all hover:border-primary/50 hover:bg-primary-light"
        onClick={handleAddProductOption}
        type="button"
      >
        <Plus className="h-4 w-4" />
        Thêm phân loại
      </button>
    </div>
  );
}
