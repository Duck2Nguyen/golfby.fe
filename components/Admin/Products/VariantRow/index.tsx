'use client';

import { Trash2, ImageIcon, GripVertical } from 'lucide-react';

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

import type { ProductVariant } from '../product-types';

interface VariantRowProps {
  canRemove: boolean;
  index: number;
  onChangeAction: (id: string, field: keyof ProductVariant, value: number | string) => void;
  onRemoveAction: (id: string) => void;
  variant: ProductVariant;
}

const formatCurrency = (value: number) => {
  if (!value) return '';
  return new Intl.NumberFormat('vi-VN').format(value);
};

const parseCurrency = (value: string) => {
  const parsed = Number.parseInt(value.replace(/\D/g, ''), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export default function VariantRow({
  canRemove,
  index,
  onChangeAction,
  onRemoveAction,
  variant,
}: VariantRowProps) {
  const inputClass =
    'h-9 w-full rounded-lg bg-input-background px-3 text-[1.3rem] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20';

  return (
    <div className="group rounded-xl border border-border bg-white p-4 transition-colors hover:border-primary/20">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground/40" />
          <span className="rounded-full bg-primary-light px-3 py-1 text-[1.2rem] font-600 text-primary">
            Phân loại {index + 1}
          </span>
        </div>

        {canRemove && (
          <button
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
            onClick={() => onRemoveAction(variant.id)}
            title="Xóa phân loại"
            type="button"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1 block text-[1.2rem] font-500 text-muted-foreground">
            Tên phân loại <span className="text-destructive">*</span>
          </label>
          <input
            className={inputClass}
            onChange={event => onChangeAction(variant.id, 'name', event.target.value)}
            placeholder="VD: Shaft Regular 10.5°"
            type="text"
            value={variant.name}
          />
        </div>

        <div>
          <label className="mb-1 block text-[1.2rem] font-500 text-muted-foreground">
            SKU <span className="text-destructive">*</span>
          </label>
          <input
            className={inputClass}
            onChange={event => onChangeAction(variant.id, 'sku', event.target.value)}
            placeholder="VD: TM-QI35-R105"
            type="text"
            value={variant.sku}
          />
        </div>

        <div>
          <label className="mb-1 block text-[1.2rem] font-500 text-muted-foreground">Kích cỡ / Spec</label>
          <input
            className={inputClass}
            onChange={event => onChangeAction(variant.id, 'size', event.target.value)}
            placeholder="VD: 10.5°, S, M..."
            type="text"
            value={variant.size}
          />
        </div>

        <div>
          <label className="mb-1 block text-[1.2rem] font-500 text-muted-foreground">
            Giá bán (₫) <span className="text-destructive">*</span>
          </label>
          <input
            className={inputClass}
            onChange={event => onChangeAction(variant.id, 'price', parseCurrency(event.target.value))}
            placeholder="0"
            type="text"
            value={variant.price ? formatCurrency(variant.price) : ''}
          />
        </div>

        <div>
          <label className="mb-1 block text-[1.2rem] font-500 text-muted-foreground">Giá gốc (₫)</label>
          <input
            className={inputClass}
            onChange={event =>
              onChangeAction(variant.id, 'originalPrice', parseCurrency(event.target.value))
            }
            placeholder="Để trống nếu không giảm"
            type="text"
            value={variant.originalPrice ? formatCurrency(variant.originalPrice) : ''}
          />
        </div>

        <div>
          <label className="mb-1 block text-[1.2rem] font-500 text-muted-foreground">Khối lượng (gram)</label>
          <input
            className={inputClass}
            min={0}
            onChange={event => onChangeAction(variant.id, 'weight', Number.parseInt(event.target.value, 10) || 0)}
            placeholder="0"
            type="number"
            value={variant.weight || ''}
          />
        </div>

        <div>
          <label className="mb-1 block text-[1.2rem] font-500 text-muted-foreground">
            Tồn kho <span className="text-destructive">*</span>
          </label>
          <input
            className={inputClass}
            min={0}
            onChange={event => onChangeAction(variant.id, 'stock', Number.parseInt(event.target.value, 10) || 0)}
            placeholder="0"
            type="number"
            value={variant.stock || ''}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-[1.2rem] font-500 text-muted-foreground">Ảnh phân loại (URL)</label>
          <div className="flex gap-2">
            <input
              className={`${inputClass} flex-1`}
              onChange={event => onChangeAction(variant.id, 'image', event.target.value)}
              placeholder="https://..."
              type="text"
              value={variant.image}
            />

            {variant.image ? (
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                <ImageWithFallback alt={variant.name} className="h-full w-full object-cover" src={variant.image} />
              </div>
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                <ImageIcon className="h-4 w-4 text-muted-foreground/40" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
