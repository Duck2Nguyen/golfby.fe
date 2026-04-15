import { X, Plus, Trash2 } from 'lucide-react';

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

import { getSortedChoices } from '../engine';
import { isChoiceType, PRICE_MODIFIER_OPTIONS, CUSTOM_OPTION_TYPE_OPTIONS } from '../types';

import type { CustomOption, PriceModifierType, CustomOptionChoice } from '../types';

interface StructureTabProps {
  isSavingStructure: boolean;
  onAddChoice: (optionId: string) => void;
  onAddOption: () => void;
  onChoicePatch: (optionId: string, choiceId: string, patch: Partial<CustomOptionChoice>) => void;
  onOptionPatch: (optionId: string, patch: Partial<CustomOption>) => void;
  onRemoveChoice: (optionId: string, choiceId: string) => void;
  onRemoveOption: (optionId: string, optionLabel: string) => void;
  onSaveStructure: () => void;
  onSelectOption: (optionId: string) => void;
  selectedOption: CustomOption | null;
  selectedOptionId: string | null;
  sortedOptions: CustomOption[];
}

const getOptionTypeLabel = (type: CustomOption['type']): string => {
  return CUSTOM_OPTION_TYPE_OPTIONS.find(option => option.value === type)?.label ?? type;
};

export default function StructureTab({
  isSavingStructure,
  onAddChoice,
  onAddOption,
  onChoicePatch,
  onOptionPatch,
  onRemoveChoice,
  onRemoveOption,
  onSaveStructure,
  onSelectOption,
  selectedOption,
  selectedOptionId,
  sortedOptions,
}: StructureTabProps) {
  const isImageSwatchOption = selectedOption?.type === 'IMAGE_SWATCH';

  return (
    <div className="grid min-h-0 flex-1 grid-cols-12 gap-4 p-4">
      <div className="col-span-4 flex min-h-0 flex-col rounded-xl border border-gray-200">
        <div className="flex items-center justify-between border-b border-gray-200 p-3">
          <div>
            <p className="text-[1.3rem] font-600 text-gray-900">Danh sách tùy chọn</p>
            <p className="text-[1.2rem] text-gray-500">Chọn 1 tùy chọn để sửa chi tiết</p>
          </div>
          <button
            className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 px-3 text-[1.2rem] text-gray-700 hover:bg-gray-100"
            onClick={onAddOption}
            type="button"
          >
            <Plus className="h-3.5 w-3.5" />
            Thêm
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
          {sortedOptions.map(option => {
            const active = option.id === selectedOptionId;

            return (
              <button
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  active
                    ? 'border-primary bg-primary-light'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                key={option.id}
                onClick={() => onSelectOption(option.id)}
                type="button"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[1.3rem] font-600 text-gray-900">
                      {option.label || 'Tùy chọn chưa đặt tên'}
                    </p>
                    <p className="mt-1 text-[1.2rem] text-gray-500">
                      {getOptionTypeLabel(option.type)} | {option.choices.length} lựa chọn
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    {option.isRequired && (
                      <span className="rounded bg-red-100 px-2 py-0.5 text-[1.1rem] text-red-600">
                        Bắt buộc
                      </span>
                    )}
                    <button
                      className="rounded p-1.5 text-red-500 hover:bg-red-50"
                      onClick={event => {
                        event.stopPropagation();
                        onRemoveOption(option.id, option.label);
                      }}
                      type="button"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </button>
            );
          })}

          {sortedOptions.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-[1.2rem] text-gray-500">
              Group này chưa có option.
            </div>
          )}
        </div>
      </div>

      <div className="col-span-8 flex min-h-0 flex-col rounded-xl border border-gray-200">
        {!selectedOption && (
          <div className="m-auto max-w-[32rem] text-center">
            <p className="text-[1.7rem] font-600 text-gray-900">Chưa chọn option</p>
            <p className="mt-2 text-[1.3rem] text-gray-500">
              Chọn option bên trái để sửa chi tiết và quản lý choice.
            </p>
          </div>
        )}

        {selectedOption && (
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[1.3rem] font-600 text-gray-900">Chi tiết tùy chọn</p>
                  <p className="text-[1.2rem] text-gray-500">Chỉnh 1 tùy chọn tại 1 thời điểm để giảm rối.</p>
                </div>

                <button
                  className="h-9 rounded-lg bg-primary px-3 text-[1.2rem] font-600 text-white disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSavingStructure}
                  onClick={onSaveStructure}
                  type="button"
                >
                  {isSavingStructure ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>

              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-7">
                  <label className="mb-1 block text-[1.2rem] text-gray-600">Nhãn</label>
                  <input
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-[1.3rem]"
                    onChange={event => onOptionPatch(selectedOption.id, { label: event.target.value })}
                    value={selectedOption.label}
                  />
                </div>

                <div className="col-span-5">
                  <label className="mb-1 block text-[1.2rem] text-gray-600">Kiểu</label>
                  <select
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-[1.3rem]"
                    onChange={event => {
                      onOptionPatch(selectedOption.id, {
                        type: event.target.value as CustomOption['type'],
                      });
                    }}
                    value={selectedOption.type}
                  >
                    {CUSTOM_OPTION_TYPE_OPTIONS.map(item => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-3">
                  <label className="mb-1 block text-[1.2rem] text-gray-600">Thứ tự</label>
                  <input
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-[1.3rem]"
                    min={0}
                    onChange={event =>
                      onOptionPatch(selectedOption.id, {
                        sortOrder: Number(event.target.value) || 0,
                      })
                    }
                    type="number"
                    value={selectedOption.sortOrder}
                  />
                </div>

                <div className="col-span-5">
                  <label className="mb-1 block text-[1.2rem] text-gray-600">Kiểu phụ phí</label>
                  <select
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-[1.3rem]"
                    onChange={event => {
                      onOptionPatch(selectedOption.id, {
                        priceModifierType: event.target.value as PriceModifierType,
                      });
                    }}
                    value={selectedOption.priceModifierType}
                  >
                    {PRICE_MODIFIER_OPTIONS.map(item => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-4">
                  <label className="mb-1 block text-[1.2rem] text-gray-600">Giá trị phụ phí</label>
                  <input
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-[1.3rem]"
                    disabled={selectedOption.priceModifierType === 'NONE'}
                    min={0}
                    onChange={event =>
                      onOptionPatch(selectedOption.id, {
                        priceModifierValue: Number(event.target.value) || 0,
                      })
                    }
                    type="number"
                    value={selectedOption.priceModifierValue ?? 0}
                  />
                </div>

                <div className="col-span-12">
                  <label className="mb-1 block text-[1.2rem] text-gray-600">Gợi ý nhập liệu</label>
                  <input
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-[1.3rem]"
                    onChange={event =>
                      onOptionPatch(selectedOption.id, {
                        placeholder: event.target.value,
                      })
                    }
                    value={selectedOption.placeholder ?? ''}
                  />
                </div>

                <div className="col-span-12">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-[1.3rem] text-gray-700">
                    <input
                      checked={selectedOption.isRequired}
                      onChange={event => {
                        onOptionPatch(selectedOption.id, {
                          isRequired: event.target.checked,
                        });
                      }}
                      type="checkbox"
                    />
                    Trường bắt buộc
                  </label>
                </div>
              </div>

              {isChoiceType(selectedOption.type) && (
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[1.2rem] font-600 uppercase tracking-wide text-gray-500">
                      Danh sách lựa chọn
                    </p>
                    <button
                      className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-[1.2rem] text-gray-700 hover:bg-gray-100"
                      onClick={() => onAddChoice(selectedOption.id)}
                      type="button"
                    >
                      Thêm lựa chọn
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-2 px-0.5">
                      <p
                        className={`${isImageSwatchOption ? 'col-span-2' : 'col-span-3'} text-[1.1rem] font-600 uppercase tracking-wide text-gray-500`}
                      >
                        Nhãn
                      </p>
                      <p className="col-span-2 text-[1.1rem] font-600 uppercase tracking-wide text-gray-500">
                        Giá trị
                      </p>
                      {isImageSwatchOption && (
                        <p className="col-span-2 text-[1.1rem] font-600 uppercase tracking-wide text-gray-500">
                          Ảnh
                        </p>
                      )}
                      <p className="col-span-2 text-[1.1rem] font-600 uppercase tracking-wide text-gray-500">
                        Kiểu phụ phí
                      </p>
                      <p className="col-span-2 text-[1.1rem] font-600 uppercase tracking-wide text-gray-500">
                        Giá trị phụ phí
                      </p>
                      <p className="col-span-2 text-[1.1rem] font-600 uppercase tracking-wide text-gray-500">
                        Thứ tự
                      </p>
                      <p className="col-span-1 text-[1.1rem] font-600 uppercase tracking-wide text-gray-500">
                        Thao tác
                      </p>
                    </div>

                    {getSortedChoices(selectedOption).map(choice => {
                      const displayImageUrl = choice.presignedImageUrl ?? choice.imageUrl;

                      return (
                        <div className="grid grid-cols-12 gap-2" key={choice.id}>
                          <input
                            className={`${isImageSwatchOption ? 'col-span-2' : 'col-span-3'} h-9 rounded-md border border-gray-200 px-2 text-[1.2rem]`}
                            onChange={event =>
                              onChoicePatch(selectedOption.id, choice.id, {
                                label: event.target.value,
                              })
                            }
                            placeholder="Nhãn"
                            value={choice.label}
                          />
                          <input
                            className="col-span-2 h-9 rounded-md border border-gray-200 px-2 text-[1.2rem]"
                            onChange={event =>
                              onChoicePatch(selectedOption.id, choice.id, {
                                value: event.target.value,
                              })
                            }
                            placeholder="Giá trị"
                            value={choice.value}
                          />

                          {isImageSwatchOption && (
                            <div className="col-span-2 rounded-md border border-gray-200 p-1">
                              {displayImageUrl ? (
                                <div className="relative h-7 w-full overflow-hidden rounded">
                                  <ImageWithFallback
                                    alt={choice.label || 'Choice image'}
                                    className="h-full w-full object-cover"
                                    src={displayImageUrl}
                                  />
                                  <button
                                    className="absolute top-0.5 right-0.5 rounded border border-red-200 bg-white p-0.5 text-red-500 hover:bg-red-50"
                                    onClick={() => {
                                      onChoicePatch(selectedOption.id, choice.id, {
                                        imageFile: null,
                                        imageUrl: undefined,
                                        presignedImageUrl: undefined,
                                      });
                                    }}
                                    type="button"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <input
                                    accept="image/png,image/jpeg,image/webp"
                                    className="hidden"
                                    id={`choice-image-${choice.id}`}
                                    onChange={event => {
                                      const nextFile = event.target.files?.[0] ?? null;

                                      onChoicePatch(selectedOption.id, choice.id, {
                                        imageFile: nextFile,
                                        presignedImageUrl: nextFile
                                          ? URL.createObjectURL(nextFile)
                                          : undefined,
                                      });
                                    }}
                                    type="file"
                                  />

                                  <label
                                    className="flex h-7 w-full cursor-pointer items-center justify-center rounded border border-dashed border-gray-300 text-[1.1rem] text-gray-600 hover:bg-gray-100"
                                    htmlFor={`choice-image-${choice.id}`}
                                  >
                                    Chọn ảnh
                                  </label>
                                </>
                              )}
                            </div>
                          )}

                          <select
                            className="col-span-2 h-9 rounded-md border border-gray-200 px-2 text-[1.2rem]"
                            onChange={event => {
                              onChoicePatch(selectedOption.id, choice.id, {
                                priceModifierType: event.target.value as PriceModifierType,
                              });
                            }}
                            value={choice.priceModifierType}
                          >
                            {PRICE_MODIFIER_OPTIONS.map(item => (
                              <option key={item.value} value={item.value}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                          <input
                            className="col-span-2 h-9 rounded-md border border-gray-200 px-2 text-[1.2rem]"
                            disabled={choice.priceModifierType === 'NONE'}
                            onChange={event =>
                              onChoicePatch(selectedOption.id, choice.id, {
                                priceModifierValue: Number(event.target.value) || 0,
                              })
                            }
                            placeholder="Phụ phí"
                            type="number"
                            value={choice.priceModifierValue ?? 0}
                          />
                          <input
                            className="col-span-1 h-9 rounded-md border border-gray-200 px-2 text-[1.2rem]"
                            min={0}
                            onChange={event =>
                              onChoicePatch(selectedOption.id, choice.id, {
                                sortOrder: Number(event.target.value) || 0,
                              })
                            }
                            type="number"
                            value={choice.sortOrder}
                          />
                          <button
                            className="col-span-1 h-9 rounded-md border border-red-200 text-[1.2rem] text-red-500 hover:bg-red-50"
                            onClick={() => onRemoveChoice(selectedOption.id, choice.id)}
                            type="button"
                          >
                            <Trash2 className="mx-auto h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}

                    {selectedOption.choices.length === 0 && (
                      <p className="text-[1.2rem] text-gray-500">Chưa có lựa chọn nào.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
