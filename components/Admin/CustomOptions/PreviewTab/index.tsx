import { useState, useEffect } from 'react';
import { Eye, ChevronUp, ChevronDown, SlidersHorizontal } from 'lucide-react';

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

import { isChoiceType } from '../types';
import { getSortedChoices } from '../engine';

import type { CustomOption, PreviewSelections, PreviewSelectionValue } from '../types';

interface PreviewTabProps {
  customSurcharge: number;
  finalPreviewPrice: number;
  onPreviewSelectionChange: (option: CustomOption, value: PreviewSelectionValue | undefined) => void;
  previewBasePrice: number;
  previewSelections: PreviewSelections;
  visibleOptions: CustomOption[];
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN').format(Math.round(value));
};

export default function PreviewTab({
  customSurcharge,
  finalPreviewPrice,
  onPreviewSelectionChange,
  previewBasePrice,
  previewSelections,
  visibleOptions,
}: PreviewTabProps) {
  const [openImageDropdownOptionId, setOpenImageDropdownOptionId] = useState<string | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      if (target?.closest('[data-image-swatch-dropdown="true"]')) return;

      setOpenImageDropdownOptionId(null);
    };

    window.addEventListener('mousedown', handleOutsideClick);

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!openImageDropdownOptionId) return;

    const stillVisible = visibleOptions.some(option => option.id === openImageDropdownOptionId);

    if (!stillVisible) {
      setOpenImageDropdownOptionId(null);
    }
  }, [openImageDropdownOptionId, visibleOptions]);

  const getChoicePreviewLabel = (choiceLabel: string, choicePriceModifierValue?: number): string => {
    if (!choicePriceModifierValue || choicePriceModifierValue <= 0) return choiceLabel;

    const formattedAmount = formatCurrency(choicePriceModifierValue);
    return `${choiceLabel} (+${formattedAmount})`;
  };

  const renderPreviewField = (option: CustomOption) => {
    const sortedChoices = getSortedChoices(option);
    const selectedValue = previewSelections[option.id];
    const selectedChoice =
      typeof selectedValue === 'string'
        ? sortedChoices.find(choice => choice.id === selectedValue)
        : undefined;

    if (option.type === 'DROPDOWN') {
      return (
        <select
          className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-[1.3rem]"
          onChange={event => {
            const nextValue = event.target.value;
            onPreviewSelectionChange(option, nextValue ? nextValue : undefined);
          }}
          value={typeof selectedValue === 'string' ? selectedValue : ''}
        >
          <option value="">Chọn...</option>
          {sortedChoices.map(choice => (
            <option key={choice.id} value={choice.id}>
              {choice.label}
            </option>
          ))}
        </select>
      );
    }

    if (option.type === 'IMAGE_SWATCH') {
      const isOpen = openImageDropdownOptionId === option.id;
      const selectedChoiceImageUrl = selectedChoice?.presignedImageUrl ?? selectedChoice?.imageUrl;

      return (
        <div className="relative" data-image-swatch-dropdown="true">
          <button
            className="flex w-full items-start justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-left"
            onClick={() => {
              setOpenImageDropdownOptionId(previous => (previous === option.id ? null : option.id));
            }}
            type="button"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[1.3rem] text-gray-700">
                {selectedChoice
                  ? getChoicePreviewLabel(selectedChoice.label, selectedChoice.priceModifierValue)
                  : 'Chọn...'}
              </p>

              {selectedChoiceImageUrl ? (
                <div className="mt-2 h-[4.8rem] w-full overflow-hidden">
                  <ImageWithFallback
                    alt={selectedChoice?.label}
                    className="h-full w-full object-cover"
                    src={selectedChoiceImageUrl}
                  />
                </div>
              ) : null}
            </div>

            {isOpen ? (
              <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-gray-500" />
            ) : (
              <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-gray-500" />
            )}
          </button>

          {isOpen && (
            <div className="absolute z-20 mt-1 max-h-[24rem] w-full overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
              {sortedChoices.map(choice => {
                const isSelected = selectedChoice?.id === choice.id;
                const choiceImageUrl = choice.presignedImageUrl ?? choice.imageUrl;

                return (
                  <button
                    className={`mb-2 w-full rounded-lg border p-2 text-left transition-colors last:mb-0 ${
                      isSelected
                        ? 'border-primary bg-primary-light'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    key={choice.id}
                    onClick={() => {
                      onPreviewSelectionChange(option, choice.id);
                      setOpenImageDropdownOptionId(null);
                    }}
                    type="button"
                  >
                    <p className="text-[1.3rem] text-gray-700">
                      {getChoicePreviewLabel(choice.label, choice.priceModifierValue)}
                    </p>

                    {choiceImageUrl ? (
                      <div className="mt-2 h-[4.8rem] w-full overflow-hidden">
                        <ImageWithFallback
                          alt={choice.label}
                          className="h-full w-full object-cover"
                          src={choiceImageUrl}
                        />
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    if (option.type === 'CHECKBOX') {
      const values = Array.isArray(selectedValue) ? selectedValue : [];

      return (
        <div className="flex flex-wrap gap-2">
          {sortedChoices.map(choice => {
            const checked = values.includes(choice.id);

            return (
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-[1.3rem] transition-colors ${
                  checked
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
                key={choice.id}
              >
                <input
                  checked={checked}
                  onChange={event => {
                    const nextValues = event.target.checked
                      ? [...values, choice.id]
                      : values.filter(item => item !== choice.id);

                    onPreviewSelectionChange(option, nextValues);
                  }}
                  type="checkbox"
                />
                {choice.label}
              </label>
            );
          })}
        </div>
      );
    }

    if (isChoiceType(option.type)) {
      return (
        <div className="flex flex-wrap gap-2">
          {sortedChoices.map(choice => {
            const isSelected = selectedValue === choice.id;

            return (
              <button
                className={`rounded-lg border px-4 py-2 text-[1.3rem] transition-colors ${
                  isSelected
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
                key={choice.id}
                onClick={() => onPreviewSelectionChange(option, choice.id)}
                type="button"
              >
                {choice.label}
              </button>
            );
          })}
        </div>
      );
    }

    if (option.type === 'TEXTAREA') {
      return (
        <textarea
          className="min-h-[8.8rem] w-full rounded-lg border border-gray-200 px-3 py-2 text-[1.3rem]"
          onChange={event => onPreviewSelectionChange(option, event.target.value)}
          placeholder={option.placeholder || 'Nhập giá trị'}
          value={typeof selectedValue === 'string' ? selectedValue : ''}
        />
      );
    }

    if (option.type === 'NUMBER') {
      return (
        <input
          className="h-11 w-full rounded-lg border border-gray-200 px-3 text-[1.3rem]"
          onChange={event => onPreviewSelectionChange(option, event.target.value)}
          placeholder={option.placeholder || '0'}
          type="number"
          value={typeof selectedValue === 'string' ? selectedValue : ''}
        />
      );
    }

    if (option.type === 'DATE') {
      return (
        <input
          className="h-11 w-full rounded-lg border border-gray-200 px-3 text-[1.3rem]"
          onChange={event => onPreviewSelectionChange(option, event.target.value)}
          type="date"
          value={typeof selectedValue === 'string' ? selectedValue : ''}
        />
      );
    }

    return (
      <input
        className="h-11 w-full rounded-lg border border-gray-200 px-3 text-[1.3rem]"
        onChange={event => onPreviewSelectionChange(option, event.target.value)}
        placeholder={option.placeholder || 'Nhập giá trị'}
        type="text"
        value={typeof selectedValue === 'string' ? selectedValue : ''}
      />
    );
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4">
      <div className="mx-auto max-w-[74rem] space-y-4">
        <div className="rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            <p className="text-[1.4rem] font-600 text-gray-900">Xem thử runtime</p>
          </div>
          <p className="mt-1 text-[1.2rem] text-gray-500">
            Mô phỏng hành vi người dùng khi custom trên trang sản phẩm.
          </p>

          <div className="mt-3 rounded-lg bg-gray-50 p-3">
            <div className="flex items-center justify-between text-[1.3rem] text-gray-600">
              <span>Giá cơ bản</span>
              <span>{formatCurrency(previewBasePrice)} VND</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[1.3rem] text-gray-600">
              <span>Phụ phí custom</span>
              <span>{formatCurrency(customSurcharge)} VND</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[1.5rem] font-700 text-gray-900">
              <span>Giá dự kiến sau custom</span>
              <span>{formatCurrency(finalPreviewPrice)} VND</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <div className="mb-3 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <p className="text-[1.3rem] font-600 text-gray-900">Form tùy chọn</p>
          </div>

          <div className="space-y-3">
            {visibleOptions.map(option => (
              <div key={option.id}>
                <label className="mb-1 block text-[1.3rem] font-600 text-gray-800">
                  {option.label}
                  {option.isRequired ? ' *' : ''}
                </label>
                {renderPreviewField(option)}
              </div>
            ))}

            {visibleOptions.length === 0 && (
              <p className="text-[1.2rem] text-gray-500">
                Không có tùy chọn nào đang hiển với điều kiện hiện tại.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
