import { Trash2 } from 'lucide-react';

import { getSortedChoices } from '../engine';
import { isChoiceType, CONDITION_ACTION_OPTIONS } from '../types';

import type { CustomOption, CustomCondition, CustomOptionGroup } from '../types';

interface ConditionsTabProps {
  activeGroup: CustomOptionGroup;
  isSavingConditions: boolean;
  onAddCondition: () => void;
  onConditionPatch: (conditionId: string, patch: Partial<CustomCondition>) => void;
  onRemoveCondition: (conditionId: string) => void;
  onSaveConditions: () => void;
  sortedOptions: CustomOption[];
}

export default function ConditionsTab({
  activeGroup,
  isSavingConditions,
  onAddCondition,
  onConditionPatch,
  onRemoveCondition,
  onSaveConditions,
  sortedOptions,
}: ConditionsTabProps) {
  const triggerOptions = sortedOptions.filter(
    option => isChoiceType(option.type) && option.choices.length > 0,
  );

  return (
    <div className="grid min-h-0 flex-1 grid-cols-12 gap-4 p-4">
      <div className="col-span-12 flex min-h-0 flex-col rounded-xl border border-gray-200">
        <div className="flex items-center justify-between border-b border-gray-200 p-3">
          <div>
            <p className="text-[1.3rem] font-600 text-gray-900">Trình tạo điều kiện</p>
            <p className="text-[1.2rem] text-gray-500">Định nghĩa rule theo mẫu: Nếu ... thì Hiện/Ẩn ...</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-gray-300 px-2.5 py-1 text-[1.2rem] text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={triggerOptions.length === 0 || sortedOptions.length < 2}
              onClick={onAddCondition}
              type="button"
            >
              Thêm điều kiện
            </button>

            <button
              className="h-9 rounded-lg bg-primary px-3 text-[1.2rem] font-600 text-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSavingConditions}
              onClick={onSaveConditions}
              type="button"
            >
              {isSavingConditions ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
          {activeGroup.conditions.map(condition => {
            const triggerOption = sortedOptions.find(option => option.id === condition.triggerOptionId);
            const triggerChoices = triggerOption ? getSortedChoices(triggerOption) : [];

            return (
              <div
                className="grid grid-cols-12 gap-2 rounded-lg border border-gray-100 bg-gray-50 p-2"
                key={condition.id}
              >
                <select
                  className="col-span-4 h-9 rounded-md border border-gray-200 px-2 text-[1.2rem]"
                  onChange={event => {
                    const nextTriggerOptionId = event.target.value;
                    const nextTriggerOption = sortedOptions.find(option => option.id === nextTriggerOptionId);
                    const nextTriggerChoiceId = nextTriggerOption?.choices[0]?.id ?? '';

                    onConditionPatch(condition.id, {
                      triggerChoiceId: nextTriggerChoiceId,
                      triggerOptionId: nextTriggerOptionId,
                    });
                  }}
                  value={condition.triggerOptionId}
                >
                  {triggerOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      Nếu {option.label}
                    </option>
                  ))}
                </select>

                <select
                  className="col-span-3 h-9 rounded-md border border-gray-200 px-2 text-[1.2rem]"
                  onChange={event =>
                    onConditionPatch(condition.id, {
                      triggerChoiceId: event.target.value,
                    })
                  }
                  value={condition.triggerChoiceId}
                >
                  {triggerChoices.map(choice => (
                    <option key={choice.id} value={choice.id}>
                      Là {choice.label}
                    </option>
                  ))}
                </select>

                <select
                  className="col-span-2 h-9 rounded-md border border-gray-200 px-2 text-[1.2rem]"
                  onChange={event =>
                    onConditionPatch(condition.id, {
                      action: event.target.value as CustomCondition['action'],
                    })
                  }
                  value={condition.action}
                >
                  {CONDITION_ACTION_OPTIONS.map(item => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>

                <select
                  className="col-span-2 h-9 rounded-md border border-gray-200 px-2 text-[1.2rem]"
                  onChange={event =>
                    onConditionPatch(condition.id, {
                      targetOptionId: event.target.value,
                    })
                  }
                  value={condition.targetOptionId}
                >
                  {sortedOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <button
                  className="col-span-1 h-9 rounded-md border border-red-200 text-red-500 hover:bg-red-50"
                  onClick={() => onRemoveCondition(condition.id)}
                  type="button"
                >
                  <Trash2 className="mx-auto h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}

          {activeGroup.conditions.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-[1.2rem] text-gray-500">
              Chưa có rule nào. Thêm điều kiện để điều khiển hiển/ẩn tùy chọn.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
