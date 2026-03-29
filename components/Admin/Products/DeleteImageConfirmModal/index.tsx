'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DeleteImageConfirmModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onConfirmAction: () => void;
  onCancelAction: () => void;
}

export default function DeleteImageConfirmModal({
  isOpen,
  isLoading = false,
  onConfirmAction,
  onCancelAction,
}: DeleteImageConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-100">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>

          <div className="flex-1">
            <h3 className="text-[1.6rem] font-600 text-foreground">Xóa ảnh?</h3>
            <p className="mt-2 text-[1.4rem] text-muted-foreground">
              Bạn chắc chắn muốn xóa ảnh này khỏi sản phẩm? Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-md border border-border px-4 py-2 text-[1.3rem] font-500 text-foreground transition-colors hover:bg-muted disabled:opacity-50"
            disabled={isLoading}
            onClick={onCancelAction}
            type="button"
          >
            Hủy
          </button>
          <button
            className="rounded-md bg-red-600 px-4 py-2 text-[1.3rem] font-500 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            disabled={isLoading}
            onClick={onConfirmAction}
            type="button"
          >
            {isLoading ? 'Đang xóa...' : 'Xóa ảnh'}
          </button>
        </div>
      </div>
    </div>
  );
}
