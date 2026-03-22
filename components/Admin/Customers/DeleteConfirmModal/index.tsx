'use client';

import { X, AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  confirmLabel?: string;
  isOpen: boolean;
  itemName?: string;
  onCloseAction: () => void;
  onConfirmAction: () => void;
  title?: string;
}

export default function DeleteConfirmModal({
  confirmLabel,
  isOpen,
  itemName,
  onCloseAction,
  onConfirmAction,
  title,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  const displayName = itemName || '';
  const displayTitle = title || 'Xác nhận xóa';
  const displayConfirm = confirmLabel || 'Xóa';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCloseAction}
        type="button"
      />

      <div className="relative mx-4 w-full max-w-[42rem] rounded-2xl bg-white p-6 shadow-2xl">
        <button
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
          onClick={onCloseAction}
          type="button"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>

          <h3 className="mb-2 text-[1.7rem] font-600 text-gray-900">{displayTitle}</h3>
          <p className="mb-6 text-[1.4rem] leading-relaxed text-gray-500">
            Bạn có chắc chắn muốn xóa <span className="font-500 text-gray-900">{displayName}</span>? Hành động
            này không thể hoàn tác.
          </p>

          <div className="flex w-full items-center gap-3">
            <button
              className="h-10 flex-1 rounded-lg border border-gray-200 text-[1.4rem] text-gray-900 transition-colors hover:bg-gray-100"
              onClick={onCloseAction}
              type="button"
            >
              Hủy
            </button>
            <button
              className="h-10 flex-1 rounded-lg bg-red-500 text-[1.4rem] font-500 text-white transition-colors hover:bg-red-600"
              onClick={onConfirmAction}
              type="button"
            >
              {displayConfirm}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
