'use client';

import { Trash2 } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalContent } from '@heroui/modal';

import type {
  AdminCustomOption,
  AdminConditionAction,
  AdminCustomOptionGroup,
  AdminPriceModifierType,
  AdminCustomOptionChoice,
} from '@/hooks/admin/useAdminCustomOptions';

import {
  useAdminCustomOptionGroups,
  useCreateAdminCustomOption,
  useDeleteAdminCustomOption,
  useUpdateAdminCustomOption,
  useAdminCustomOptionGroupDetail,
  useCreateAdminCustomOptionGroup,
  useDeleteAdminCustomOptionGroup,
  useUpdateAdminCustomOptionGroup,
  useCreateAdminCustomOptionChoice,
  useDeleteAdminCustomOptionChoice,
  useUpdateAdminCustomOptionChoice,
  useCreateAdminCustomOptionCondition,
  useDeleteAdminCustomOptionCondition,
} from '@/hooks/admin/useAdminCustomOptions';

import PreviewTab from './PreviewTab';
import { isChoiceType } from './types';
import GroupSidebar from './GroupSidebar';
import StructureTab from './StructureTab';
import ConditionsTab from './ConditionsTab';
import {
  getSortedChoices,
  getSortedOptions,
  computeVisibleOptionMap,
  calculateCustomSurcharge,
} from './engine';

import type {
  CustomOption,
  CustomCondition,
  CustomOptionGroup,
  PreviewSelections,
  PriceModifierType,
  CustomOptionChoice,
  PreviewSelectionValue,
} from './types';

type WorkspaceTab = 'conditions' | 'preview' | 'structure';

type GroupNameDialogMode = 'create' | 'rename';

type DeleteDialogTarget = {
  id: string;
  label: string;
  type: 'group' | 'option';
};

type GroupNameDialogState = {
  description: string;
  groupId: string | null;
  mode: GroupNameDialogMode;
  title: string;
  value: string;
};

const PREVIEW_BASE_PRICE = 15210000;

const WORKSPACE_TABS: Array<{ label: string; value: WorkspaceTab }> = [
  { label: 'Cấu trúc', value: 'structure' },
  { label: 'Điều kiện', value: 'conditions' },
  { label: 'Xem thử', value: 'preview' },
];

const normalizeChoices = (choices: CustomOptionChoice[]): CustomOptionChoice[] => {
  return [...choices]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((choice, index) => ({
      ...choice,
      sortOrder: index,
    }));
};

const normalizeOptions = (options: CustomOption[]): CustomOption[] => {
  return [...options]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((option, index) => ({
      ...option,
      choices: normalizeChoices(option.choices),
      sortOrder: index,
    }));
};

const toNumber = (value: number | string | null | undefined, fallback: number = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return fallback;
};

const toCustomPriceModifierType = (value: AdminPriceModifierType | null | undefined): PriceModifierType => {
  if (value === 'FIXED' || value === 'PERCENT') return value;
  return 'NONE';
};

const toCustomOptionType = (value: AdminCustomOption['type']): CustomOption['type'] => {
  const supportedTypes = new Set<CustomOption['type']>([
    'TEXT',
    'TEXTAREA',
    'NUMBER',
    'DROPDOWN',
    'RADIO',
    'CHECKBOX',
    'COLOR_SWATCH',
    'IMAGE_SWATCH',
    'FILE_UPLOAD',
    'DATE',
  ]);

  if (supportedTypes.has(value as CustomOption['type'])) {
    return value as CustomOption['type'];
  }

  return 'DROPDOWN';
};

const mapApiChoiceToUiChoice = (choice: AdminCustomOptionChoice, index: number): CustomOptionChoice => {
  return {
    id: choice.id,
    imageUrl: choice.imageUrl ?? undefined,
    label: choice.label,
    priceModifierType: toCustomPriceModifierType(choice.priceModifierType),
    priceModifierValue: toNumber(choice.priceModifierValue),
    sortOrder: toNumber(choice.sortOrder, index),
    value: choice.value,
  };
};

const mapApiOptionToUiOption = (option: AdminCustomOption, index: number): CustomOption => {
  return {
    choices: (option.choices ?? []).map((choice, choiceIndex) => mapApiChoiceToUiChoice(choice, choiceIndex)),
    id: option.id,
    isRequired: Boolean(option.isRequired),
    label: option.label,
    placeholder: option.placeholder ?? '',
    priceModifierType: toCustomPriceModifierType(option.priceModifierType),
    priceModifierValue: toNumber(option.priceModifierValue),
    sortOrder: toNumber(option.sortOrder, index),
    type: toCustomOptionType(option.type),
  };
};

const mapApiGroupToUiGroup = (group: AdminCustomOptionGroup, index: number): CustomOptionGroup => {
  return {
    conditions: [],
    id: group.id,
    name: group.name,
    options: normalizeOptions(
      (group.options ?? []).map((option, optionIndex) => mapApiOptionToUiOption(option, optionIndex)),
    ),
    sortOrder: index,
  };
};

const mapApiGroupDetailToUiGroup = (
  group: AdminCustomOptionGroup,
  currentSortOrder: number,
): CustomOptionGroup => {
  const options = normalizeOptions(
    (group.options ?? []).map((option, optionIndex) => mapApiOptionToUiOption(option, optionIndex)),
  );

  const conditionMap = new Map<string, CustomCondition>();

  for (const option of group.options ?? []) {
    for (const condition of option.conditionsAsTarget ?? []) {
      conditionMap.set(condition.id, {
        action: condition.action,
        id: condition.id,
        targetOptionId: condition.targetOptionId,
        triggerChoiceId: condition.triggerChoiceId,
        triggerOptionId: condition.triggerOptionId,
      });
    }
  }

  return {
    conditions: sanitizeConditions({
      conditions: Array.from(conditionMap.values()),
      id: group.id,
      name: group.name,
      options,
      sortOrder: currentSortOrder,
    }),
    id: group.id,
    name: group.name,
    options,
    sortOrder: currentSortOrder,
  };
};

const createDefaultConditionPayload = (group: CustomOptionGroup): Omit<CustomCondition, 'id'> | null => {
  const triggerOptions = group.options.filter(
    option => isChoiceType(option.type) && option.choices.length > 0,
  );

  if (triggerOptions.length === 0 || group.options.length < 2) {
    return null;
  }

  const triggerOption = triggerOptions[0];
  const triggerChoice = getSortedChoices(triggerOption)[0];
  const targetOption = group.options.find(option => option.id !== triggerOption.id) ?? group.options[0];

  if (!triggerChoice || !targetOption) {
    return null;
  }

  return {
    action: 'SHOW',
    targetOptionId: targetOption.id,
    triggerChoiceId: triggerChoice.id,
    triggerOptionId: triggerOption.id,
  };
};

const sanitizeConditions = (group: CustomOptionGroup): CustomCondition[] => {
  const optionMap = new Map(group.options.map(option => [option.id, option]));

  return group.conditions.filter(condition => {
    const triggerOption = optionMap.get(condition.triggerOptionId);
    const targetOption = optionMap.get(condition.targetOptionId);

    if (!triggerOption || !targetOption) return false;
    if (!isChoiceType(triggerOption.type)) return false;

    return triggerOption.choices.some(choice => choice.id === condition.triggerChoiceId);
  });
};

const hasPreviewValue = (value: PreviewSelectionValue | undefined): boolean => {
  if (value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  return value.trim().length > 0;
};

const createTempId = (prefix: string): string => {
  return `tmp_${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

export default function CustomOptions() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('structure');
  const [groups, setGroups] = useState<CustomOptionGroup[]>([]);
  const [isGroupPanelCollapsed, setIsGroupPanelCollapsed] = useState(false);
  const [groupNameDialog, setGroupNameDialog] = useState<GroupNameDialogState | null>(null);
  const [groupNameError, setGroupNameError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<DeleteDialogTarget | null>(null);
  const [isDeletingTarget, setIsDeletingTarget] = useState(false);
  const [isSavingGroupName, setIsSavingGroupName] = useState(false);
  const [isSavingStructure, setIsSavingStructure] = useState(false);
  const [isSavingConditions, setIsSavingConditions] = useState(false);
  const [syncedGroupsById, setSyncedGroupsById] = useState<Record<string, CustomOptionGroup>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [previewSelections, setPreviewSelections] = useState<PreviewSelections>({});

  const groupsQuery = useAdminCustomOptionGroups();
  const activeGroupDetailQuery = useAdminCustomOptionGroupDetail(
    activeGroupId ?? undefined,
    Boolean(activeGroupId),
  );

  const createGroupMutation = useCreateAdminCustomOptionGroup();
  const updateGroupMutation = useUpdateAdminCustomOptionGroup();
  const deleteGroupMutation = useDeleteAdminCustomOptionGroup();
  const createOptionMutation = useCreateAdminCustomOption();
  const updateOptionMutation = useUpdateAdminCustomOption();
  const deleteOptionMutation = useDeleteAdminCustomOption();
  const createChoiceMutation = useCreateAdminCustomOptionChoice();
  const updateChoiceMutation = useUpdateAdminCustomOptionChoice();
  const deleteChoiceMutation = useDeleteAdminCustomOptionChoice();
  const createConditionMutation = useCreateAdminCustomOptionCondition();
  const deleteConditionMutation = useDeleteAdminCustomOptionCondition();

  const groupsApiData = groupsQuery.data?.data;
  const activeGroupDetailApiData = activeGroupDetailQuery.data?.data;

  const filteredGroups = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) return groups;

    return groups.filter(group => group.name.toLowerCase().includes(normalizedQuery));
  }, [groups, searchQuery]);

  const activeGroup = useMemo(() => {
    if (!activeGroupId) return null;
    return groups.find(group => group.id === activeGroupId) ?? null;
  }, [activeGroupId, groups]);

  const sortedOptions = useMemo(() => {
    if (!activeGroup) return [];
    return getSortedOptions(activeGroup);
  }, [activeGroup]);

  const selectedOption = useMemo(() => {
    if (!selectedOptionId) return null;
    return sortedOptions.find(option => option.id === selectedOptionId) ?? null;
  }, [selectedOptionId, sortedOptions]);

  const visibleOptionMap = useMemo(() => {
    if (!activeGroup) return {};
    return computeVisibleOptionMap(activeGroup, previewSelections);
  }, [activeGroup, previewSelections]);

  const visibleOptions = useMemo(() => {
    return sortedOptions.filter(option => visibleOptionMap[option.id]);
  }, [sortedOptions, visibleOptionMap]);

  const customSurcharge = useMemo(() => {
    if (!activeGroup) return 0;

    return calculateCustomSurcharge(PREVIEW_BASE_PRICE, activeGroup, previewSelections, visibleOptionMap);
  }, [activeGroup, previewSelections, visibleOptionMap]);

  const finalPreviewPrice = PREVIEW_BASE_PRICE + customSurcharge;

  useEffect(() => {
    if (!groupsApiData) return;

    const mappedGroups = groupsApiData.map((group, index) => mapApiGroupToUiGroup(group, index));

    setGroups(previousGroups => {
      const previousGroupMap = new Map(previousGroups.map(group => [group.id, group]));

      return mappedGroups.map(group => {
        const previousGroup = previousGroupMap.get(group.id);

        if (!previousGroup) return group;

        return {
          ...group,
          conditions: previousGroup.conditions,
          options: previousGroup.options,
          sortOrder: group.sortOrder,
        };
      });
    });
  }, [groupsApiData]);

  useEffect(() => {
    if (!activeGroupDetailApiData) return;

    setGroups(previousGroups => {
      const existingGroup = previousGroups.find(group => group.id === activeGroupDetailApiData.id);
      const detailGroup = mapApiGroupDetailToUiGroup(activeGroupDetailApiData, existingGroup?.sortOrder ?? 0);

      if (!existingGroup) {
        return [...previousGroups, detailGroup];
      }

      return previousGroups.map(group => {
        if (group.id !== detailGroup.id) return group;

        return {
          ...detailGroup,
          sortOrder: group.sortOrder,
        };
      });
    });

    setSyncedGroupsById(previous => {
      const existingSortOrder =
        groups.find(group => group.id === activeGroupDetailApiData.id)?.sortOrder ?? 0;

      return {
        ...previous,
        [activeGroupDetailApiData.id]: mapApiGroupDetailToUiGroup(
          activeGroupDetailApiData,
          existingSortOrder,
        ),
      };
    });
  }, [activeGroupDetailApiData]);

  useEffect(() => {
    if (groups.length === 0) {
      if (activeGroupId !== null) {
        setActiveGroupId(null);
      }

      return;
    }

    if (!activeGroupId || !groups.some(group => group.id === activeGroupId)) {
      setActiveGroupId(groups[0].id);
      setPreviewSelections({});
      setActiveTab('structure');
    }
  }, [groups, activeGroupId]);

  useEffect(() => {
    if (!activeGroup) {
      setSelectedOptionId(null);
      return;
    }

    const hasCurrentSelection = activeGroup.options.some(option => option.id === selectedOptionId);

    if (hasCurrentSelection) return;

    setSelectedOptionId(getSortedOptions(activeGroup)[0]?.id ?? null);
  }, [activeGroup, selectedOptionId]);

  const refreshGroups = async () => {
    await groupsQuery.mutate();
  };

  const refreshActiveGroupDetail = async () => {
    if (!activeGroupId) return;
    await activeGroupDetailQuery.mutate();
  };

  const safelyTrigger = async <T,>(request: Promise<T>): Promise<T | null> => {
    try {
      return await request;
    } catch {
      return null;
    }
  };

  const closeGroupNameDialog = () => {
    if (isSavingGroupName) return;

    setGroupNameDialog(null);
    setGroupNameError('');
  };

  const openCreateGroupDialog = () => {
    setGroupNameError('');
    setGroupNameDialog({
      description: 'Nhập tên nhóm custom option để bắt đầu cấu hình.',
      groupId: null,
      mode: 'create',
      title: 'Tạo nhóm custom option',
      value: `Nhóm mới ${groups.length + 1}`,
    });
  };

  const openRenameGroupDialog = (groupId: string) => {
    const targetGroup = groups.find(group => group.id === groupId);

    if (!targetGroup) return;

    setGroupNameError('');
    setGroupNameDialog({
      description: 'Đổi tên nhóm custom option đang được chọn.',
      groupId: targetGroup.id,
      mode: 'rename',
      title: 'Đổi tên nhóm custom option',
      value: targetGroup.name,
    });
  };

  const requestDeleteGroup = (groupId: string) => {
    const targetGroup = groups.find(group => group.id === groupId);

    if (!targetGroup) return;

    setDeleteTarget({
      id: groupId,
      label: targetGroup.name,
      type: 'group',
    });
  };

  const requestDeleteOption = (optionId: string, optionLabel: string) => {
    setDeleteTarget({
      id: optionId,
      label: optionLabel || 'tùy chọn này',
      type: 'option',
    });
  };

  const handleSubmitGroupNameDialog = async () => {
    if (!groupNameDialog || isSavingGroupName) return;

    const normalizedName = groupNameDialog.value.trim();

    if (!normalizedName) {
      setGroupNameError('Vui lòng nhập tên nhóm.');
      return;
    }

    if (groupNameDialog.mode === 'rename') {
      const targetGroup = groups.find(group => group.id === groupNameDialog.groupId);

      if (!targetGroup) return;

      if (normalizedName === targetGroup.name) {
        closeGroupNameDialog();
        return;
      }

      setIsSavingGroupName(true);

      try {
        const updated = await safelyTrigger(
          updateGroupMutation.trigger({
            csrf: true,
            groupId: targetGroup.id,
            name: normalizedName,
          }),
        );

        if (!updated) return;

        await refreshGroups();

        if (activeGroupId === targetGroup.id) {
          await refreshActiveGroupDetail();
        }

        closeGroupNameDialog();
      } finally {
        setIsSavingGroupName(false);
      }

      return;
    }

    setIsSavingGroupName(true);

    try {
      const response = await safelyTrigger(
        createGroupMutation.trigger({
          csrf: true,
          name: normalizedName,
        }),
      );

      if (!response) return;

      await refreshGroups();

      setActiveGroupId(response.data?.id ?? null);
      setActiveTab('structure');
      setSelectedOptionId(null);
      setPreviewSelections({});
      closeGroupNameDialog();
    } finally {
      setIsSavingGroupName(false);
    }
  };

  const handleConfirmDeleteTarget = async () => {
    if (!deleteTarget || isDeletingTarget) return;

    setIsDeletingTarget(true);

    try {
      if (deleteTarget.type === 'group') {
        const deleted = await safelyTrigger(
          deleteGroupMutation.trigger({
            csrf: true,
            groupId: deleteTarget.id,
          }),
        );

        if (!deleted) return;

        if (activeGroupId === deleteTarget.id) {
          setSelectedOptionId(null);
          setActiveTab('structure');
          setPreviewSelections({});
        }

        await refreshGroups();
        setDeleteTarget(null);
        return;
      }

      const deleted = await safelyTrigger(
        deleteOptionMutation.trigger({
          csrf: true,
          optionId: deleteTarget.id,
        }),
      );

      if (!deleted) return;

      updateActiveGroup(group => ({
        ...group,
        conditions: group.conditions.filter(
          condition =>
            condition.targetOptionId !== deleteTarget.id && condition.triggerOptionId !== deleteTarget.id,
        ),
        options: group.options.filter(option => option.id !== deleteTarget.id),
      }));

      if (selectedOptionId === deleteTarget.id) {
        setSelectedOptionId(sortedOptions.filter(option => option.id !== deleteTarget.id)[0]?.id ?? null);
      }

      setPreviewSelections(previousSelections => {
        const nextSelections = { ...previousSelections };
        delete nextSelections[deleteTarget.id];
        return nextSelections;
      });

      await refreshActiveGroupDetail();
      await refreshGroups();
      setDeleteTarget(null);
    } finally {
      setIsDeletingTarget(false);
    }
  };

  const updateActiveGroup = (updater: (group: CustomOptionGroup) => CustomOptionGroup) => {
    if (!activeGroupId) return;

    setGroups(previousGroups =>
      previousGroups.map(group => {
        if (group.id !== activeGroupId) return group;

        const updatedGroup = updater(group);

        return {
          ...updatedGroup,
          conditions: sanitizeConditions(updatedGroup),
          options: normalizeOptions(updatedGroup.options),
        };
      }),
    );
  };

  const handleAddOption = async () => {
    if (!activeGroupId) return;

    const response = await safelyTrigger(
      createOptionMutation.trigger({
        csrf: true,
        groupId: activeGroupId,
        isRequired: false,
        label: 'Tùy chọn mới',
        placeholder: '',
        priceModifierType: 'NONE',
        priceModifierValue: 0,
        sortOrder: sortedOptions.length,
        type: 'DROPDOWN',
      }),
    );

    if (!response) return;

    await refreshActiveGroupDetail();
    await refreshGroups();

    setSelectedOptionId(response.data?.id ?? null);
    setActiveTab('structure');
  };

  const handleOptionPatch = (optionId: string, patch: Partial<CustomOption>) => {
    updateActiveGroup(group => ({
      ...group,
      options: group.options.map(option => {
        if (option.id !== optionId) return option;

        const nextOption: CustomOption = {
          ...option,
          ...patch,
        };

        if (!isChoiceType(nextOption.type)) {
          nextOption.choices = [];
        }

        if (nextOption.priceModifierType === 'NONE') {
          nextOption.priceModifierValue = 0;
        }

        return nextOption;
      }),
    }));
  };

  const handleAddChoice = (optionId: string) => {
    const option = activeGroup?.options.find(item => item.id === optionId);

    if (!option) return;

    const newChoice: CustomOptionChoice = {
      id: createTempId('CHOICE'),
      label: 'Lựa chọn mới',
      priceModifierType: 'NONE',
      priceModifierValue: 0,
      sortOrder: option.choices.length,
      value: `value-${option.choices.length + 1}`,
    };

    updateActiveGroup(group => ({
      ...group,
      options: group.options.map(groupOption => {
        if (groupOption.id !== optionId) return groupOption;

        return {
          ...groupOption,
          choices: [...groupOption.choices, newChoice],
        };
      }),
    }));
  };

  const handleChoicePatch = (optionId: string, choiceId: string, patch: Partial<CustomOptionChoice>) => {
    updateActiveGroup(group => ({
      ...group,
      options: group.options.map(option => {
        if (option.id !== optionId) return option;

        return {
          ...option,
          choices: option.choices.map(choice => {
            if (choice.id !== choiceId) return choice;

            const nextChoice = {
              ...choice,
              ...patch,
            };

            if (nextChoice.priceModifierType === 'NONE') {
              nextChoice.priceModifierValue = 0;
            }

            return nextChoice;
          }),
        };
      }),
    }));
  };

  const handleRemoveChoice = (optionId: string, choiceId: string) => {
    updateActiveGroup(group => ({
      ...group,
      conditions: group.conditions.filter(condition => condition.triggerChoiceId !== choiceId),
      options: group.options.map(option => {
        if (option.id !== optionId) return option;

        return {
          ...option,
          choices: option.choices.filter(choice => choice.id !== choiceId),
        };
      }),
    }));

    setPreviewSelections(previousSelections => {
      const currentSelection = previousSelections[optionId];

      if (currentSelection === undefined) return previousSelections;

      if (Array.isArray(currentSelection)) {
        return {
          ...previousSelections,
          [optionId]: currentSelection.filter(item => item !== choiceId),
        };
      }

      if (currentSelection === choiceId) {
        const nextSelections = { ...previousSelections };
        delete nextSelections[optionId];
        return nextSelections;
      }

      return previousSelections;
    });
  };

  const handleAddCondition = () => {
    if (!activeGroup) return;

    const newCondition = createDefaultConditionPayload(activeGroup);

    if (!newCondition) return;

    updateActiveGroup(group => ({
      ...group,
      conditions: [
        ...group.conditions,
        {
          ...newCondition,
          id: createTempId('COND'),
        },
      ],
    }));

    setActiveTab('conditions');
  };

  const handleConditionPatch = (conditionId: string, patch: Partial<CustomCondition>) => {
    const currentCondition = activeGroup?.conditions.find(condition => condition.id === conditionId);

    if (!currentCondition) return;

    const nextCondition: CustomCondition = {
      ...currentCondition,
      ...patch,
    };

    updateActiveGroup(group => ({
      ...group,
      conditions: group.conditions.map(condition => {
        if (condition.id !== conditionId) return condition;

        return nextCondition;
      }),
    }));
  };

  const handleRemoveCondition = (conditionId: string) => {
    updateActiveGroup(group => ({
      ...group,
      conditions: group.conditions.filter(condition => condition.id !== conditionId),
    }));
  };

  const handleSaveStructure = async () => {
    if (!activeGroupId || !activeGroup) return;

    const snapshot = syncedGroupsById[activeGroupId];

    if (!snapshot) return;

    setIsSavingStructure(true);

    try {
      const snapshotOptionsById = new Map(snapshot.options.map(option => [option.id, option]));
      const persistedOptions: CustomOption[] = [];

      for (const option of normalizeOptions(activeGroup.options)) {
        await safelyTrigger(
          updateOptionMutation.trigger({
            csrf: true,
            isRequired: option.isRequired,
            label: option.label,
            optionId: option.id,
            placeholder: option.placeholder ?? '',
            priceModifierType: option.priceModifierType as AdminPriceModifierType,
            priceModifierValue: option.priceModifierType === 'NONE' ? 0 : (option.priceModifierValue ?? 0),
            sortOrder: option.sortOrder,
            type: option.type,
          }),
        );

        const snapshotOption = snapshotOptionsById.get(option.id);
        const currentChoices = normalizeChoices(option.choices);
        const currentChoiceIds = new Set(
          currentChoices.filter(choice => !choice.id.startsWith('tmp_')).map(choice => choice.id),
        );

        for (const snapshotChoice of snapshotOption?.choices ?? []) {
          if (currentChoiceIds.has(snapshotChoice.id)) continue;

          await safelyTrigger(
            deleteChoiceMutation.trigger({
              choiceId: snapshotChoice.id,
              csrf: true,
            }),
          );
        }

        const persistedChoices: CustomOptionChoice[] = [];

        for (const choice of currentChoices) {
          if (choice.id.startsWith('tmp_')) {
            const createdChoice = await safelyTrigger(
              createChoiceMutation.trigger({
                csrf: true,
                imageUrl: choice.imageUrl,
                label: choice.label,
                optionId: option.id,
                priceModifierType: choice.priceModifierType as AdminPriceModifierType,
                priceModifierValue:
                  choice.priceModifierType === 'NONE' ? 0 : (choice.priceModifierValue ?? 0),
                sortOrder: choice.sortOrder,
                value: choice.value,
              }),
            );

            persistedChoices.push({
              ...choice,
              id: createdChoice?.data?.id ?? choice.id,
            });

            continue;
          }

          await safelyTrigger(
            updateChoiceMutation.trigger({
              choiceId: choice.id,
              csrf: true,
              imageUrl: choice.imageUrl,
              label: choice.label,
              priceModifierType: choice.priceModifierType as AdminPriceModifierType,
              priceModifierValue: choice.priceModifierType === 'NONE' ? 0 : (choice.priceModifierValue ?? 0),
              sortOrder: choice.sortOrder,
              value: choice.value,
            }),
          );

          persistedChoices.push(choice);
        }

        persistedOptions.push({
          ...option,
          choices: normalizeChoices(persistedChoices),
        });
      }

      updateActiveGroup(group => ({
        ...group,
        options: persistedOptions,
      }));

      await refreshActiveGroupDetail();
      await refreshGroups();
    } finally {
      setIsSavingStructure(false);
    }
  };

  const handleSaveConditions = async () => {
    if (!activeGroupId || !activeGroup) return;

    const snapshot = syncedGroupsById[activeGroupId];

    if (!snapshot) return;

    setIsSavingConditions(true);

    try {
      const currentConditions = sanitizeConditions(activeGroup);
      const snapshotConditions = snapshot.conditions;

      for (const snapshotCondition of snapshotConditions) {
        await safelyTrigger(
          deleteConditionMutation.trigger({
            conditionId: snapshotCondition.id,
            csrf: true,
          }),
        );
      }

      const persistedConditions: CustomCondition[] = [];

      for (const currentCondition of currentConditions) {
        const createdCondition = await safelyTrigger(
          createConditionMutation.trigger({
            action: currentCondition.action as AdminConditionAction,
            csrf: true,
            targetOptionId: currentCondition.targetOptionId,
            triggerChoiceId: currentCondition.triggerChoiceId,
            triggerOptionId: currentCondition.triggerOptionId,
          }),
        );

        persistedConditions.push({
          ...currentCondition,
          id: createdCondition?.data?.id ?? currentCondition.id,
        });
      }

      updateActiveGroup(group => ({
        ...group,
        conditions: persistedConditions,
      }));

      await refreshActiveGroupDetail();
    } finally {
      setIsSavingConditions(false);
    }
  };

  const handlePreviewSelectionChange = (option: CustomOption, value: PreviewSelectionValue | undefined) => {
    setPreviewSelections(previousSelections => {
      const nextSelections = {
        ...previousSelections,
      };

      if (value === undefined || !hasPreviewValue(value)) {
        delete nextSelections[option.id];
        return nextSelections;
      }

      nextSelections[option.id] = value;

      return nextSelections;
    });
  };

  return (
    <div className="h-full min-h-0 rounded-xl border border-gray-200 bg-white">
      <div className="grid h-full min-h-0 grid-cols-12">
        <GroupSidebar
          activeGroupId={activeGroupId}
          filteredGroups={filteredGroups}
          groups={groups}
          isGroupPanelCollapsed={isGroupPanelCollapsed}
          onCreateGroup={openCreateGroupDialog}
          onRenameGroup={openRenameGroupDialog}
          onSearchQueryChange={setSearchQuery}
          onSelectGroup={groupId => {
            setActiveGroupId(groupId);
            setPreviewSelections({});
            setActiveTab('structure');
          }}
          onToggleCollapse={() => setIsGroupPanelCollapsed(previous => !previous)}
          searchQuery={searchQuery}
        />

        <section
          className={`flex min-h-0 flex-col transition-all duration-200 ${
            isGroupPanelCollapsed ? 'col-span-11' : 'col-span-9'
          }`}
        >
          {!activeGroup && (
            <div className="m-auto max-w-[36rem] text-center">
              <p className="text-[1.8rem] font-600 text-gray-900">Chưa chọn nhóm</p>
              <p className="mt-2 text-[1.3rem] text-gray-500">
                Tạo mới hoặc chọn 1 nhóm bên trái để bắt đầu chỉnh sửa.
              </p>
            </div>
          )}

          {activeGroup && (
            <>
              <div className="border-b border-gray-200 px-4 py-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {WORKSPACE_TABS.map(tab => {
                      const active = tab.value === activeTab;

                      return (
                        <button
                          className={`rounded-lg px-3 py-2 text-[1.3rem] transition-colors ${
                            active
                              ? 'bg-primary-light font-600 text-primary'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          key={tab.value}
                          onClick={() => setActiveTab(tab.value)}
                          type="button"
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    aria-label="Xóa nhóm"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                    onClick={() => requestDeleteGroup(activeGroup.id)}
                    title="Xóa nhóm"
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {activeTab === 'structure' && (
                <StructureTab
                  isSavingStructure={isSavingStructure}
                  onAddChoice={handleAddChoice}
                  onAddOption={() => {
                    void handleAddOption();
                  }}
                  onChoicePatch={handleChoicePatch}
                  onOptionPatch={handleOptionPatch}
                  onRemoveChoice={handleRemoveChoice}
                  onRemoveOption={(optionId, optionLabel) => {
                    requestDeleteOption(optionId, optionLabel);
                  }}
                  onSaveStructure={() => {
                    void handleSaveStructure();
                  }}
                  onSelectOption={setSelectedOptionId}
                  selectedOption={selectedOption}
                  selectedOptionId={selectedOptionId}
                  sortedOptions={sortedOptions}
                />
              )}

              {activeTab === 'conditions' && (
                <ConditionsTab
                  activeGroup={activeGroup}
                  isSavingConditions={isSavingConditions}
                  onAddCondition={handleAddCondition}
                  onConditionPatch={handleConditionPatch}
                  onRemoveCondition={handleRemoveCondition}
                  onSaveConditions={() => {
                    void handleSaveConditions();
                  }}
                  sortedOptions={sortedOptions}
                />
              )}

              {activeTab === 'preview' && (
                <PreviewTab
                  customSurcharge={customSurcharge}
                  finalPreviewPrice={finalPreviewPrice}
                  onPreviewSelectionChange={handlePreviewSelectionChange}
                  previewBasePrice={PREVIEW_BASE_PRICE}
                  previewSelections={previewSelections}
                  visibleOptions={visibleOptions}
                />
              )}

              <Modal
                isOpen={Boolean(groupNameDialog)}
                onOpenChange={isOpen => {
                  if (!isOpen) {
                    closeGroupNameDialog();
                  }
                }}
                placement="center"
              >
                <ModalContent>
                  {onClose => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        {groupNameDialog?.title ?? 'Nhập tên nhóm custom option'}
                      </ModalHeader>
                      <ModalBody>
                        <p className="text-[1.3rem] text-gray-500">
                          {groupNameDialog?.description ?? 'Nhập tên nhóm custom option.'}
                        </p>
                        <Input
                          autoFocus
                          errorMessage={groupNameError || undefined}
                          isInvalid={Boolean(groupNameError)}
                          labelPlacement="outside"
                          className="border-none text-[1.4rem]"
                          placeholder="Nhập tên nhóm custom option"
                          value={groupNameDialog?.value ?? ''}
                          variant="bordered"
                          onValueChange={value => {
                            setGroupNameError('');

                            setGroupNameDialog(current =>
                              current
                                ? {
                                    ...current,
                                    value,
                                  }
                                : current,
                            );
                          }}
                        />
                      </ModalBody>
                      <ModalFooter>
                        <Button variant="flat" onPress={() => onClose()}>
                          Hủy
                        </Button>
                        <Button
                          color="primary"
                          isLoading={isSavingGroupName}
                          onPress={() => {
                            void handleSubmitGroupNameDialog();
                          }}
                        >
                          {groupNameDialog?.mode === 'rename' ? 'Lưu tên' : 'Tạo nhóm'}
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>

              <Modal
                isOpen={Boolean(deleteTarget)}
                onOpenChange={isOpen => {
                  if (!isOpen && !isDeletingTarget) {
                    setDeleteTarget(null);
                  }
                }}
                placement="center"
              >
                <ModalContent>
                  {onClose => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Xác nhận xóa {deleteTarget?.type === 'group' ? 'nhóm' : 'option'}
                      </ModalHeader>
                      <ModalBody>
                        <p className="text-[1.3rem] text-gray-600">
                          Bạn có chắc chắn muốn xóa {deleteTarget?.type === 'group' ? 'nhóm' : 'option'}{' '}
                          <span className="font-600 text-gray-900">{deleteTarget?.label}</span> không? Hành
                          động này không thể hoàn tác.
                        </p>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          variant="flat"
                          onPress={() => {
                            setDeleteTarget(null);
                            onClose();
                          }}
                        >
                          Hủy
                        </Button>
                        <Button
                          color="danger"
                          isLoading={isDeletingTarget}
                          onPress={() => {
                            void handleConfirmDeleteTarget();
                          }}
                        >
                          Xóa
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
