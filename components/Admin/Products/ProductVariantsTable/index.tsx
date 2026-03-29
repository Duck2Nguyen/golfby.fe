'use client';

import { Save, RefreshCcw, WandSparkles } from 'lucide-react';
import { useMemo, useState, useEffect, useCallback } from 'react';

import type { ColDef, CellValueChangedEvent } from 'ag-grid-community';

import { useVariants, ProductVariantStatus, type ProductVariantItem } from '@/hooks/useVariants';

import DataGrid from '@/components/DataGrid';

type EditableVariantRow = ProductVariantItem & {
  rowKey: string;
};

type BulkField = 'sku' | 'barcode' | 'costPrice' | 'listPrice' | 'salePrice' | 'stock';

const BULK_FIELD_OPTIONS: Array<{ label: string; value: BulkField }> = [
  { label: 'SKU', value: 'sku' },
  { label: 'Barcode', value: 'barcode' },
  { label: 'Cost Price', value: 'costPrice' },
  { label: 'List Price', value: 'listPrice' },
  { label: 'Sale Price', value: 'salePrice' },
  { label: 'Stock', value: 'stock' },
];

const NUMERIC_FIELDS: BulkField[] = ['costPrice', 'listPrice', 'salePrice', 'stock'];

const isNumericField = (field: BulkField) => NUMERIC_FIELDS.includes(field);

const toNumber = (value: unknown) => {
  const normalized = String(value ?? '')
    .replace(/\s+/g, '')
    .replace(/,/g, '')
    .replace(/\./g, '');
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
};

const toEditableRows = (items: ProductVariantItem[]): EditableVariantRow[] => {
  return items.map((item, index) => ({
    barcode: item.barcode ?? '',
    costPrice: toNumber(item.costPrice),
    id: item.id,
    listPrice: toNumber(item.listPrice),
    rowKey: item.variantId ?? item.id ?? `${item.sku || 'variant'}-${index}`,
    salePrice: toNumber(item.salePrice),
    sku: item.sku ?? '',
    status: item.status ?? ProductVariantStatus.ACTIVE,
    stock: toNumber(item.stock),
    variantId: item.variantId ?? item.id,
  }));
};

interface ProductVariantsTableProps {
  productId?: string;
  variantsFromDetail?: ProductVariantItem[];
}

export default function ProductVariantsTable({ productId, variantsFromDetail }: ProductVariantsTableProps) {
  const isFromProductDetail = variantsFromDetail !== undefined;
  const { putVariantsAction, putVariantsMutation } = useVariants(productId);

  const [rows, setRows] = useState<EditableVariantRow[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [bulkField, setBulkField] = useState<BulkField>('listPrice');
  const [bulkValue, setBulkValue] = useState('');

  const sourceRows = useMemo<ProductVariantItem[]>(() => {
    return variantsFromDetail ?? [];
  }, [variantsFromDetail]);

  const sourceSignature = useMemo(() => JSON.stringify(sourceRows), [sourceRows]);

  useEffect(() => {
    if (isDirty) {
      return;
    }

    setRows(toEditableRows(sourceRows));
  }, [isDirty, sourceSignature, sourceRows]);

  const columnDefs = useMemo<ColDef<EditableVariantRow>[]>(
    () => [
      {
        editable: true,
        field: 'sku',
        flex: 1,
        headerName: 'SKU',
        minWidth: 160,
      },
      {
        editable: true,
        field: 'barcode',
        flex: 1,
        headerName: 'Barcode',
        minWidth: 170,
      },
      {
        editable: true,
        field: 'costPrice',
        headerName: 'Cost Price',
        minWidth: 140,
        valueParser: params => toNumber(params.newValue),
      },
      {
        editable: true,
        field: 'listPrice',
        headerName: 'List Price',
        minWidth: 140,
        valueParser: params => toNumber(params.newValue),
      },
      {
        editable: true,
        field: 'salePrice',
        headerName: 'Sale Price',
        minWidth: 140,
        valueParser: params => toNumber(params.newValue),
      },
      {
        editable: true,
        field: 'stock',
        headerName: 'Stock',
        minWidth: 120,
        valueParser: params => toNumber(params.newValue),
      },
    ],
    [],
  );

  const handleCellValueChangedAction = useCallback((event: CellValueChangedEvent<EditableVariantRow>) => {
    const updated = event.data;
    if (!updated) {
      return;
    }

    setRows(prev => prev.map(row => (row.rowKey === updated.rowKey ? { ...updated } : row)));
    setIsDirty(true);
  }, []);

  const handleApplyBulkAction = () => {
    const normalizedValue = bulkValue.trim();
    if (!normalizedValue) {
      return;
    }

    const nextValue = isNumericField(bulkField) ? toNumber(normalizedValue) : normalizedValue;

    setRows(prev => prev.map(row => ({ ...row, [bulkField]: nextValue })));
    setIsDirty(true);
  };

  const handleResetAction = () => {
    setRows(toEditableRows(sourceRows));
    setIsDirty(false);
    setBulkValue('');
  };

  const handleSaveAllAction = async () => {
    if (!productId || rows.length === 0) {
      return;
    }

    const payload: ProductVariantItem[] = rows
      .map(({ rowKey, ...item }) => item)
      .filter(item => Boolean(item.variantId ?? item.id));

    if (payload.length === 0) {
      return;
    }

    await putVariantsAction(payload);

    setIsDirty(false);
  };

  const isLoading = false;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/20 p-3 lg:flex-row lg:items-end">
        <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-[1.2rem] font-500 text-muted-foreground">
              Cột cần sửa nhanh
            </label>
            <select
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-[1.3rem] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              onChange={event => setBulkField(event.target.value as BulkField)}
              value={bulkField}
            >
              {BULK_FIELD_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[1.2rem] font-500 text-muted-foreground">Giá trị áp dụng</label>
            <input
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-[1.3rem] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              onChange={event => setBulkValue(event.target.value)}
              placeholder={isNumericField(bulkField) ? 'Nhập số...' : 'Nhập text...'}
              value={bulkValue}
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              className="flex h-10 items-center gap-1.5 rounded-lg border border-primary/30 bg-primary-light px-3 text-[1.3rem] font-500 text-primary transition-colors hover:border-primary/50"
              onClick={handleApplyBulkAction}
              type="button"
            >
              <WandSparkles className="h-4 w-4" />
              Áp dụng cả cột
            </button>
            <button
              className="flex h-10 items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-[1.3rem] font-500 text-foreground transition-colors hover:bg-muted"
              onClick={handleResetAction}
              type="button"
            >
              <RefreshCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        <button
          className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-[1.3rem] font-500 text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!productId || putVariantsMutation.isMutating || !isDirty}
          onClick={handleSaveAllAction}
          type="button"
        >
          <Save className="h-4 w-4" />
          {putVariantsMutation.isMutating ? 'Đang lưu...' : 'Lưu tất cả variants'}
        </button>
      </div>

      {isFromProductDetail && (
        <p className="text-[1.2rem] text-muted-foreground">
          Variants đang lấy trực tiếp từ Product Detail response, nút lưu gọi API bulk update riêng.
        </p>
      )}

      {!productId && (
        <p className="text-[1.2rem] text-muted-foreground">
          Bạn đang ở chế độ tạo mới nên chưa có variants để cập nhật. Sau khi tạo sản phẩm sẽ có dữ liệu để
          lưu bulk variants.
        </p>
      )}

      <div className="h-[42rem] overflow-hidden rounded-xl border border-border bg-white">
        <DataGrid
          className="h-full w-full"
          columnDefs={columnDefs}
          defaultColDef={{
            cellClass: 'text-[1.3rem] text-foreground',
            editable: true,
            suppressHeaderMenuButton: true,
          }}
          getRowId={params => params.data.rowKey}
          headerHeight={44}
          loading={isLoading}
          onCellValueChanged={handleCellValueChangedAction}
          rowData={rows}
          rowHeight={54}
          stopEditingWhenCellsLoseFocus
          suppressCellFocus={false}
        />
      </div>
    </div>
  );
}
