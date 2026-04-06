'use client';

import { useMemo, useState, useEffect } from 'react';
import { Plus, Save, Info, Trash2, ChevronUp, RefreshCcw, ChevronDown, AlertCircle } from 'lucide-react';

import { addToast } from '@heroui/toast';

import type {
  StaticContentValue,
  HomeStaticContentValue,
  StaticContentHeroSlide,
  StaticContentProductShelfSection,
} from '@/hooks/useStaticContents';

import {
  useAdminStaticContent,
  useUpdateAdminStaticContent,
  STATIC_CONTENT_SECTION_TYPES,
  DEFAULT_STATIC_CONTENT_LOCALE,
} from '@/hooks/useStaticContents';

interface StructuredDraft {
  hero: StaticContentHeroSlide[];
  searchKeywords: string[];
  sections: StaticContentProductShelfSection[];
}

const DEFAULT_CONTENT_KEY = 'home';
const CUSTOM_SECTION_TYPE_VALUE = '__custom__';

const createEmptyDraft = (): StructuredDraft => ({
  hero: [],
  searchKeywords: [],
  sections: [],
});

const createEmptyHero = (): StaticContentHeroSlide => ({
  href: '',
  imageUrl: '',
  title: '',
});

const createEmptySection = (): StaticContentProductShelfSection => ({
  categoryId: '',
  collectionId: '',
  id: '',
  productIds: [],
  title: '',
  type: STATIC_CONTENT_SECTION_TYPES.PRODUCT_IDS,
});

const normalizeText = (value: string | null | undefined) => value?.trim() ?? '';

const normalizeProductIds = (value: string[] | undefined) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(item => normalizeText(item))
    .filter(Boolean)
    .filter((item, index, arr) => arr.indexOf(item) === index);
};

const stringifyPretty = (value: unknown) => JSON.stringify(value, null, 2);

const parseProductIdsText = (value: string) => {
  return value
    .split(/[\n,]/)
    .map(item => normalizeText(item))
    .filter(Boolean);
};

const toProductIdsText = (value: string[] | undefined) => {
  return normalizeProductIds(value).join('\n');
};

const moveArrayItem = <T,>(items: T[], from: number, to: number): T[] => {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) {
    return items;
  }

  const cloned = [...items];
  const [target] = cloned.splice(from, 1);
  cloned.splice(to, 0, target);
  return cloned;
};

const toStructuredDraft = (value: StaticContentValue | null | undefined): StructuredDraft => {
  const homeValue = (value ?? {}) as HomeStaticContentValue;

  return {
    hero: (homeValue.hero ?? []).map(item => ({
      href: item.href ?? '',
      imageUrl: item.imageUrl ?? '',
      title: item.title ?? '',
    })),
    searchKeywords: (homeValue.searchKeywords ?? []).map(item => item ?? ''),
    sections: (homeValue.sections ?? []).map(item => ({
      categoryId: item.categoryId ?? '',
      collectionId: item.collectionId ?? '',
      id: item.id ?? '',
      productIds: [...(item.productIds ?? [])],
      title: item.title ?? '',
      type: item.type ?? STATIC_CONTENT_SECTION_TYPES.PRODUCT_IDS,
    })),
  };
};

const buildValueFromStructuredDraft = (draft: StructuredDraft): HomeStaticContentValue => {
  const hero = draft.hero
    .map(item => ({
      href: normalizeText(item.href) || undefined,
      imageUrl: normalizeText(item.imageUrl),
      title: normalizeText(item.title) || undefined,
    }))
    .filter(item => item.imageUrl || item.title || item.href);

  const searchKeywords = draft.searchKeywords
    .map(item => normalizeText(item))
    .filter(Boolean)
    .filter((item, index, arr) => arr.indexOf(item) === index);

  const sections = draft.sections
    .map(item => {
      const sectionType = normalizeText(item.type);
      const productIds = normalizeProductIds(item.productIds);
      const collectionId = normalizeText(item.collectionId);
      const categoryId = normalizeText(item.categoryId);

      return {
        ...(categoryId ? { categoryId } : {}),
        ...(collectionId ? { collectionId } : {}),
        id: normalizeText(item.id),
        ...(productIds.length > 0 ? { productIds } : {}),
        title: normalizeText(item.title),
        type: sectionType,
      };
    })
    .filter(item => {
      return (
        item.id ||
        item.title ||
        item.type ||
        (Array.isArray(item.productIds) && item.productIds.length > 0) ||
        item.collectionId ||
        item.categoryId
      );
    });

  return {
    ...(hero.length > 0 ? { hero } : {}),
    ...(searchKeywords.length > 0 ? { searchKeywords } : {}),
    ...(sections.length > 0 ? { sections } : {}),
  };
};

const validateStructuredDraft = (draft: StructuredDraft): string[] => {
  const errors: string[] = [];
  const sectionIds = new Set<string>();

  draft.hero.forEach((item, index) => {
    const imageUrl = normalizeText(item.imageUrl);
    const title = normalizeText(item.title);
    const href = normalizeText(item.href);
    const hasAnyValue = Boolean(imageUrl || title || href);

    if (hasAnyValue && !imageUrl) {
      errors.push(`Hero #${index + 1}: imageUrl là bắt buộc.`);
    }
  });

  draft.sections.forEach((item, index) => {
    const sectionId = normalizeText(item.id);
    const sectionTitle = normalizeText(item.title);
    const sectionType = normalizeText(item.type);
    const normalizedProductIds = normalizeProductIds(item.productIds);

    const hasAnyValue = Boolean(
      sectionId ||
        sectionTitle ||
        sectionType ||
        normalizedProductIds.length > 0 ||
        normalizeText(item.collectionId) ||
        normalizeText(item.categoryId),
    );

    if (!hasAnyValue) {
      return;
    }

    if (!sectionId) {
      errors.push(`Section #${index + 1}: id là bắt buộc.`);
    }

    if (!sectionTitle) {
      errors.push(`Section #${index + 1}: title là bắt buộc.`);
    }

    if (!sectionType) {
      errors.push(`Section #${index + 1}: type là bắt buộc.`);
    }

    if (sectionType === STATIC_CONTENT_SECTION_TYPES.PRODUCT_IDS && normalizedProductIds.length === 0) {
      errors.push(`Section #${index + 1}: type=product_ids cần ít nhất 1 productId.`);
    }

    if (sectionId) {
      if (sectionIds.has(sectionId)) {
        errors.push(`Section id bị trùng: ${sectionId}`);
      }
      sectionIds.add(sectionId);
    }
  });

  return errors;
};

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return '--';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return date.toLocaleString('vi-VN');
};

export default function StaticContentsAdmin() {
  const [query, setQuery] = useState({
    contentKey: DEFAULT_CONTENT_KEY,
    locale: DEFAULT_STATIC_CONTENT_LOCALE,
  });
  const [draftQuery, setDraftQuery] = useState({
    contentKey: DEFAULT_CONTENT_KEY,
    locale: DEFAULT_STATIC_CONTENT_LOCALE,
  });

  const [editorMode, setEditorMode] = useState<'structured' | 'raw'>('structured');
  const [structuredDraft, setStructuredDraft] = useState<StructuredDraft>(createEmptyDraft());
  const [structuredSnapshot, setStructuredSnapshot] = useState(stringifyPretty(createEmptyDraft()));
  const [rawDraft, setRawDraft] = useState('{}');
  const [rawSnapshot, setRawSnapshot] = useState('{}');
  const [activeSignature, setActiveSignature] = useState('');

  const adminStaticContent = useAdminStaticContent({
    contentKey: query.contentKey,
    locale: query.locale,
  });
  const updateStaticContentMutation = useUpdateAdminStaticContent();

  const entry = adminStaticContent.data?.data;

  useEffect(() => {
    if (!entry) {
      return;
    }

    const signature = `${query.contentKey}:${query.locale}:${entry.id}:${entry.updatedAt ?? ''}`;

    if (activeSignature === signature) {
      return;
    }

    const mappedDraft = toStructuredDraft(entry.value);
    const mappedRaw = stringifyPretty(entry.value ?? {});

    setStructuredDraft(mappedDraft);
    setStructuredSnapshot(stringifyPretty(mappedDraft));
    setRawDraft(mappedRaw);
    setRawSnapshot(mappedRaw);
    setActiveSignature(signature);
  }, [activeSignature, entry, query.contentKey, query.locale]);

  const isDirty = useMemo(() => {
    if (editorMode === 'structured') {
      return stringifyPretty(structuredDraft) !== structuredSnapshot;
    }

    return rawDraft !== rawSnapshot;
  }, [editorMode, rawDraft, rawSnapshot, structuredDraft, structuredSnapshot]);

  const structuredPreview = useMemo(() => {
    return stringifyPretty(buildValueFromStructuredDraft(structuredDraft));
  }, [structuredDraft]);

  const hasNotFoundError =
    adminStaticContent.error &&
    typeof adminStaticContent.error === 'object' &&
    'status' in adminStaticContent.error &&
    Number(adminStaticContent.error.status) === 404;

  const applyQuery = () => {
    const nextContentKey = normalizeText(draftQuery.contentKey);
    const nextLocale = normalizeText(draftQuery.locale) || DEFAULT_STATIC_CONTENT_LOCALE;

    if (!nextContentKey) {
      addToast({
        color: 'warning',
        description: 'Content key không được để trống.',
      });
      return;
    }

    if (isDirty) {
      const shouldContinue = window.confirm(
        'Bạn đang có thay đổi chưa lưu. Tiếp tục tải key/locale mới sẽ mất dữ liệu đang sửa. Bạn chắc chắn muốn tiếp tục?',
      );

      if (!shouldContinue) {
        return;
      }
    }

    const emptyDraft = createEmptyDraft();

    setQuery({
      contentKey: nextContentKey,
      locale: nextLocale,
    });
    setDraftQuery({
      contentKey: nextContentKey,
      locale: nextLocale,
    });
    setStructuredDraft(emptyDraft);
    setStructuredSnapshot(stringifyPretty(emptyDraft));
    setRawDraft('{}');
    setRawSnapshot('{}');
    setActiveSignature('');
  };

  const handleReload = async () => {
    await adminStaticContent.mutate();
  };

  const handleReset = () => {
    if (editorMode === 'structured') {
      setStructuredDraft(JSON.parse(structuredSnapshot) as StructuredDraft);
      return;
    }

    setRawDraft(rawSnapshot);
  };

  const handleSave = async () => {
    if (!query.contentKey) {
      addToast({
        color: 'warning',
        description: 'Vui lòng nhập content key trước khi lưu.',
      });
      return;
    }

    try {
      let nextValue: StaticContentValue;

      if (editorMode === 'structured') {
        const validationErrors = validateStructuredDraft(structuredDraft);

        if (validationErrors.length > 0) {
          addToast({
            color: 'danger',
            description: validationErrors[0],
          });
          return;
        }

        nextValue = buildValueFromStructuredDraft(structuredDraft);
      } else {
        let parsedValue: unknown;

        try {
          parsedValue = JSON.parse(rawDraft);
        } catch {
          addToast({
            color: 'danger',
            description: 'Raw JSON không hợp lệ. Vui lòng kiểm tra lại cú pháp JSON.',
          });
          return;
        }

        if (!parsedValue || typeof parsedValue !== 'object' || Array.isArray(parsedValue)) {
          addToast({
            color: 'danger',
            description: 'Raw JSON phải là object (không phải mảng).',
          });
          return;
        }

        nextValue = parsedValue as StaticContentValue;
      }

      await updateStaticContentMutation.trigger({
        contentKey: query.contentKey,
        csrf: true,
        locale: query.locale,
        value: nextValue,
      });

      await adminStaticContent.mutate();
    } catch {
      // Toast error is already handled in useMutation.
    }
  };

  const updateHeroField = (index: number, field: keyof StaticContentHeroSlide, value: string) => {
    setStructuredDraft(prev => ({
      ...prev,
      hero: prev.hero.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        return {
          ...item,
          [field]: value,
        };
      }),
    }));
  };

  const updateKeyword = (index: number, value: string) => {
    setStructuredDraft(prev => ({
      ...prev,
      searchKeywords: prev.searchKeywords.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        return value;
      }),
    }));
  };

  const updateSectionField = (
    index: number,
    field: keyof StaticContentProductShelfSection,
    value: string | string[],
  ) => {
    setStructuredDraft(prev => ({
      ...prev,
      sections: prev.sections.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        return {
          ...item,
          [field]: value,
        };
      }),
    }));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-white">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-[2rem] font-700 text-foreground">Static Content Manager</h2>
            <p className="text-[1.3rem] text-muted-foreground">
              Quản lý dữ liệu tĩnh theo content key và locale.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-[1.3rem] text-muted-foreground transition-colors hover:bg-muted"
              onClick={() => {
                void handleReload();
              }}
              type="button"
            >
              <RefreshCcw className={`h-4 w-4 ${adminStaticContent.isValidating ? 'animate-spin' : ''}`} />
              Làm mới
            </button>

            <button
              className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-[1.3rem] text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!isDirty}
              onClick={handleReset}
              type="button"
            >
              Khôi phục
            </button>

            <button
              className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-[1.3rem] font-500 text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
              disabled={updateStaticContentMutation.isMutating}
              onClick={() => {
                void handleSave();
              }}
              type="button"
            >
              <Save className="h-4 w-4" />
              {updateStaticContentMutation.isMutating ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="grid gap-3 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="mb-1 text-[1.2rem] text-gray-500">Content key</p>
              <input
                className="h-9 w-full rounded-lg border border-border px-3 text-[1.3rem] focus:outline-none focus:ring-2 focus:ring-primary/20"
                onChange={event => {
                  setDraftQuery(prev => ({
                    ...prev,
                    contentKey: event.target.value,
                  }));
                }}
                placeholder="Ví dụ: home"
                type="text"
                value={draftQuery.contentKey}
              />
            </div>

            <div className="md:col-span-3">
              <p className="mb-1 text-[1.2rem] text-gray-500">Locale</p>
              <input
                className="h-9 w-full rounded-lg border border-border px-3 text-[1.3rem] focus:outline-none focus:ring-2 focus:ring-primary/20"
                onChange={event => {
                  setDraftQuery(prev => ({
                    ...prev,
                    locale: event.target.value,
                  }));
                }}
                placeholder="vi"
                type="text"
                value={draftQuery.locale}
              />
            </div>

            <div className="flex items-end gap-2 md:col-span-4">
              <button
                className="flex h-9 items-center justify-center rounded-lg border border-border px-3 text-[1.3rem] text-foreground transition-colors hover:bg-muted"
                onClick={applyQuery}
                type="button"
              >
                Tải dữ liệu
              </button>

              <div className="inline-flex h-9 overflow-hidden rounded-lg border border-border">
                <button
                  className={`px-3 text-[1.3rem] transition-colors ${
                    editorMode === 'structured'
                      ? 'bg-primary-light font-500 text-primary'
                      : 'bg-white text-muted-foreground hover:bg-muted'
                  }`}
                  onClick={() => {
                    setEditorMode('structured');
                  }}
                  type="button"
                >
                  Structured
                </button>
                <button
                  className={`px-3 text-[1.3rem] transition-colors ${
                    editorMode === 'raw'
                      ? 'bg-primary-light font-500 text-primary'
                      : 'bg-white text-muted-foreground hover:bg-muted'
                  }`}
                  onClick={() => {
                    setEditorMode('raw');
                  }}
                  type="button"
                >
                  Raw JSON
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-3 rounded-lg bg-gray-50 p-3 text-[1.2rem] text-gray-600 md:grid-cols-3">
            <p>
              <span className="font-600 text-gray-800">ID:</span> {entry?.id || '--'}
            </p>
            <p>
              <span className="font-600 text-gray-800">Created:</span> {formatDateTime(entry?.createdAt)}
            </p>
            <p>
              <span className="font-600 text-gray-800">Updated:</span> {formatDateTime(entry?.updatedAt)}
            </p>
          </div>

          {hasNotFoundError ? (
            <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-[1.3rem] text-warning-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              Không tìm thấy bản ghi cho key/locale này. Bạn vẫn có thể chỉnh sửa ở đây, nhưng backend hiện
              chỉ cho phép cập nhật bản ghi đã tồn tại.
            </div>
          ) : adminStaticContent.error ? (
            <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-[1.3rem] text-danger">
              Không thể tải static content. Vui lòng thử lại.
            </div>
          ) : null}

          <div className="flex items-center gap-2 text-[1.2rem] text-gray-500">
            <Info className="h-4 w-4" />
            Trạng thái chỉnh sửa: {isDirty ? 'Có thay đổi chưa lưu' : 'Đã đồng bộ'}
          </div>
        </div>
      </section>

      {editorMode === 'raw' ? (
        <section className="rounded-xl border border-border bg-white p-5">
          <h3 className="mb-2 text-[1.7rem] font-600 text-foreground">Raw JSON Editor</h3>
          <p className="mb-3 text-[1.3rem] text-muted-foreground">
            Dùng khi cần chỉnh key khác ngoài cấu trúc home hoặc cần cập nhật payload nâng cao.
          </p>
          <textarea
            className="min-h-[40rem] w-full rounded-xl border border-border bg-gray-50 p-4 font-mono text-[1.3rem] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            onChange={event => {
              setRawDraft(event.target.value);
            }}
            value={rawDraft}
          />
        </section>
      ) : (
        <>
          <section className="rounded-xl border border-border bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[1.7rem] font-600 text-foreground">Hero Slides</h3>
                <p className="text-[1.2rem] text-muted-foreground">
                  Quản lý banner chính. imageUrl là trường bắt buộc khi slide có dữ liệu.
                </p>
              </div>
              <button
                className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-[1.3rem] text-foreground transition-colors hover:bg-muted"
                onClick={() => {
                  setStructuredDraft(prev => ({
                    ...prev,
                    hero: [...prev.hero, createEmptyHero()],
                  }));
                }}
                type="button"
              >
                <Plus className="h-4 w-4" />
                Thêm slide
              </button>
            </div>

            <div className="space-y-3">
              {structuredDraft.hero.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-[1.3rem] text-muted-foreground">
                  Chưa có slide nào.
                </div>
              ) : (
                structuredDraft.hero.map((item, index) => {
                  return (
                    <div className="rounded-lg border border-border p-3" key={`hero-${index + 1}`}>
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <p className="text-[1.3rem] font-600 text-foreground">Slide #{index + 1}</p>
                        <div className="flex items-center gap-1">
                          <button
                            className="rounded-md border border-border p-1 text-muted-foreground hover:bg-muted disabled:opacity-40"
                            disabled={index === 0}
                            onClick={() => {
                              setStructuredDraft(prev => ({
                                ...prev,
                                hero: moveArrayItem(prev.hero, index, index - 1),
                              }));
                            }}
                            type="button"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            className="rounded-md border border-border p-1 text-muted-foreground hover:bg-muted disabled:opacity-40"
                            disabled={index === structuredDraft.hero.length - 1}
                            onClick={() => {
                              setStructuredDraft(prev => ({
                                ...prev,
                                hero: moveArrayItem(prev.hero, index, index + 1),
                              }));
                            }}
                            type="button"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                          <button
                            className="rounded-md border border-danger/30 p-1 text-danger hover:bg-danger/10"
                            onClick={() => {
                              setStructuredDraft(prev => ({
                                ...prev,
                                hero: prev.hero.filter((_, itemIndex) => itemIndex !== index),
                              }));
                            }}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <p className="mb-1 text-[1.2rem] text-gray-500">imageUrl</p>
                          <input
                            className="h-9 w-full rounded-lg border border-border px-3 text-[1.3rem] focus:outline-none focus:ring-2 focus:ring-primary/20"
                            onChange={event => {
                              updateHeroField(index, 'imageUrl', event.target.value);
                            }}
                            placeholder="https://..."
                            type="text"
                            value={item.imageUrl ?? ''}
                          />
                        </div>

                        <div>
                          <p className="mb-1 text-[1.2rem] text-gray-500">title</p>
                          <input
                            className="h-9 w-full rounded-lg border border-border px-3 text-[1.3rem] focus:outline-none focus:ring-2 focus:ring-primary/20"
                            onChange={event => {
                              updateHeroField(index, 'title', event.target.value);
                            }}
                            placeholder="Tiêu đề banner"
                            type="text"
                            value={item.title ?? ''}
                          />
                        </div>

                        <div>
                          <p className="mb-1 text-[1.2rem] text-gray-500">href</p>
                          <input
                            className="h-9 w-full rounded-lg border border-border px-3 text-[1.3rem] focus:outline-none focus:ring-2 focus:ring-primary/20"
                            onChange={event => {
                              updateHeroField(index, 'href', event.target.value);
                            }}
                            placeholder="/collection/gay-golf"
                            type="text"
                            value={item.href ?? ''}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[1.7rem] font-600 text-foreground">Search Keywords</h3>
                <p className="text-[1.2rem] text-muted-foreground">Từ khóa gợi ý ở thanh tìm kiếm.</p>
              </div>
              <button
                className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-[1.3rem] text-foreground transition-colors hover:bg-muted"
                onClick={() => {
                  setStructuredDraft(prev => ({
                    ...prev,
                    searchKeywords: [...prev.searchKeywords, ''],
                  }));
                }}
                type="button"
              >
                <Plus className="h-4 w-4" />
                Thêm keyword
              </button>
            </div>

            <div className="space-y-2">
              {structuredDraft.searchKeywords.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-[1.3rem] text-muted-foreground">
                  Chưa có keyword nào.
                </div>
              ) : (
                structuredDraft.searchKeywords.map((item, index) => {
                  return (
                    <div className="flex items-center gap-2" key={`keyword-${index + 1}`}>
                      <input
                        className="h-9 w-full rounded-lg border border-border px-3 text-[1.3rem] focus:outline-none focus:ring-2 focus:ring-primary/20"
                        onChange={event => {
                          updateKeyword(index, event.target.value);
                        }}
                        placeholder={`Keyword #${index + 1}`}
                        type="text"
                        value={item}
                      />
                      <button
                        className="rounded-md border border-danger/30 p-2 text-danger hover:bg-danger/10"
                        onClick={() => {
                          setStructuredDraft(prev => ({
                            ...prev,
                            searchKeywords: prev.searchKeywords.filter((_, itemIndex) => itemIndex !== index),
                          }));
                        }}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[1.7rem] font-600 text-foreground">Sections</h3>
                <p className="text-[1.2rem] text-muted-foreground">
                  Quản lý các block hiển thị. Hiện tại BE hỗ trợ chính type=product_ids.
                </p>
              </div>
              <button
                className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-[1.3rem] text-foreground transition-colors hover:bg-muted"
                onClick={() => {
                  setStructuredDraft(prev => ({
                    ...prev,
                    sections: [...prev.sections, createEmptySection()],
                  }));
                }}
                type="button"
              >
                <Plus className="h-4 w-4" />
                Thêm section
              </button>
            </div>

            <div className="space-y-3">
              {structuredDraft.sections.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-[1.3rem] text-muted-foreground">
                  Chưa có section nào.
                </div>
              ) : (
                structuredDraft.sections.map((item, index) => {
                  const sectionType = normalizeText(item.type);
                  const isCustomType =
                    sectionType.length > 0 && sectionType !== STATIC_CONTENT_SECTION_TYPES.PRODUCT_IDS;

                  return (
                    <div className="rounded-lg border border-border p-3" key={`section-${index + 1}`}>
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <p className="text-[1.3rem] font-600 text-foreground">Section #{index + 1}</p>
                        <div className="flex items-center gap-1">
                          <button
                            className="rounded-md border border-border p-1 text-muted-foreground hover:bg-muted disabled:opacity-40"
                            disabled={index === 0}
                            onClick={() => {
                              setStructuredDraft(prev => ({
                                ...prev,
                                sections: moveArrayItem(prev.sections, index, index - 1),
                              }));
                            }}
                            type="button"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            className="rounded-md border border-border p-1 text-muted-foreground hover:bg-muted disabled:opacity-40"
                            disabled={index === structuredDraft.sections.length - 1}
                            onClick={() => {
                              setStructuredDraft(prev => ({
                                ...prev,
                                sections: moveArrayItem(prev.sections, index, index + 1),
                              }));
                            }}
                            type="button"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                          <button
                            className="rounded-md border border-danger/30 p-1 text-danger hover:bg-danger/10"
                            onClick={() => {
                              setStructuredDraft(prev => ({
                                ...prev,
                                sections: prev.sections.filter((_, itemIndex) => itemIndex !== index),
                              }));
                            }}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <p className="mb-1 text-[1.2rem] text-gray-500">id</p>
                          <input
                            className="h-9 w-full rounded-lg border border-border px-3 text-[1.3rem] focus:outline-none focus:ring-2 focus:ring-primary/20"
                            onChange={event => {
                              updateSectionField(index, 'id', event.target.value);
                            }}
                            placeholder="featured-products"
                            type="text"
                            value={item.id ?? ''}
                          />
                        </div>

                        <div>
                          <p className="mb-1 text-[1.2rem] text-gray-500">title</p>
                          <input
                            className="h-9 w-full rounded-lg border border-border px-3 text-[1.3rem] focus:outline-none focus:ring-2 focus:ring-primary/20"
                            onChange={event => {
                              updateSectionField(index, 'title', event.target.value);
                            }}
                            placeholder="Sản phẩm nổi bật"
                            type="text"
                            value={item.title ?? ''}
                          />
                        </div>

                        <div>
                          <p className="mb-1 text-[1.2rem] text-gray-500">type</p>
                          <select
                            className="h-9 w-full rounded-lg border border-border px-3 text-[1.3rem] focus:outline-none focus:ring-2 focus:ring-primary/20"
                            onChange={event => {
                              if (event.target.value === CUSTOM_SECTION_TYPE_VALUE) {
                                updateSectionField(index, 'type', '');
                                return;
                              }

                              updateSectionField(index, 'type', event.target.value);
                            }}
                            value={
                              isCustomType
                                ? CUSTOM_SECTION_TYPE_VALUE
                                : sectionType || STATIC_CONTENT_SECTION_TYPES.PRODUCT_IDS
                            }
                          >
                            <option value={STATIC_CONTENT_SECTION_TYPES.PRODUCT_IDS}>product_ids</option>
                            <option value={CUSTOM_SECTION_TYPE_VALUE}>custom</option>
                          </select>
                        </div>

                        <div>
                          <p className="mb-1 text-[1.2rem] text-gray-500">custom type</p>
                          <input
                            className="h-9 w-full rounded-lg border border-border px-3 text-[1.3rem] focus:outline-none focus:ring-2 focus:ring-primary/20"
                            disabled={
                              !isCustomType && sectionType === STATIC_CONTENT_SECTION_TYPES.PRODUCT_IDS
                            }
                            onChange={event => {
                              updateSectionField(index, 'type', event.target.value);
                            }}
                            placeholder="Ví dụ: collection_dynamic"
                            type="text"
                            value={isCustomType ? sectionType : ''}
                          />
                        </div>

                        <div>
                          <p className="mb-1 text-[1.2rem] text-gray-500">collectionId (optional)</p>
                          <input
                            className="h-9 w-full rounded-lg border border-border px-3 text-[1.3rem] focus:outline-none focus:ring-2 focus:ring-primary/20"
                            onChange={event => {
                              updateSectionField(index, 'collectionId', event.target.value);
                            }}
                            placeholder="UUID collection"
                            type="text"
                            value={item.collectionId ?? ''}
                          />
                        </div>

                        <div>
                          <p className="mb-1 text-[1.2rem] text-gray-500">categoryId (optional)</p>
                          <input
                            className="h-9 w-full rounded-lg border border-border px-3 text-[1.3rem] focus:outline-none focus:ring-2 focus:ring-primary/20"
                            onChange={event => {
                              updateSectionField(index, 'categoryId', event.target.value);
                            }}
                            placeholder="UUID category"
                            type="text"
                            value={item.categoryId ?? ''}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <p className="mb-1 text-[1.2rem] text-gray-500">productIds</p>
                          <textarea
                            className="min-h-[10rem] w-full rounded-lg border border-border p-3 text-[1.3rem] focus:outline-none focus:ring-2 focus:ring-primary/20"
                            onChange={event => {
                              updateSectionField(
                                index,
                                'productIds',
                                parseProductIdsText(event.target.value),
                              );
                            }}
                            placeholder="Mỗi dòng 1 product UUID hoặc ngăn cách bằng dấu phẩy"
                            value={toProductIdsText(item.productIds)}
                          />
                          <p className="mt-1 text-[1.2rem] text-gray-500">
                            Bắt buộc khi type là product_ids.
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-white p-5">
            <h3 className="mb-2 text-[1.7rem] font-600 text-foreground">Payload Preview</h3>
            <p className="mb-3 text-[1.2rem] text-muted-foreground">
              `value` sẽ được gửi lên endpoint PATCH /api/v1/admin/static-contents/{'{key}'}.
            </p>
            <pre className="max-h-[32rem] overflow-auto rounded-lg bg-gray-50 p-3 text-[1.2rem] text-gray-700">
              {structuredPreview}
            </pre>
          </section>
        </>
      )}
    </div>
  );
}
