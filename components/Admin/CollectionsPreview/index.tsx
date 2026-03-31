'use client';

import { useMemo, useState, useEffect } from 'react';
import { Database, FlaskConical } from 'lucide-react';

import { useCollections, type CollectionTreeNode } from '@/hooks/useCollections';

interface FlatOption {
  depth: number;
  id: string;
  label: string;
}

interface CategoryCatalogItem {
  id: string;
  name: string;
  slug: string;
}

interface AssignedCategoryInfo {
  collectionId: string;
  collectionName: string;
}

const FAKE_COLLECTIONS: CollectionTreeNode[] = [
  {
    id: 'col-root-1',
    name: 'Gay Golf',
    slug: 'gay-golf',
    description: 'Nhom san pham gay golf',
    parentId: null,
    createdAt: null,
    updatedAt: null,
    categories: [],
    children: [
      {
        id: 'col-child-1',
        name: 'Gay',
        slug: 'gay',
        description: null,
        parentId: 'col-root-1',
        createdAt: null,
        updatedAt: null,
        categories: [
          {
            id: 'cat-1',
            name: 'Sat',
            slug: 'sat',
            description: null,
            collectionId: 'col-child-1',
            createdAt: null,
            updatedAt: null,
          },
          {
            id: 'cat-2',
            name: 'Wedge',
            slug: 'wedge',
            description: null,
            collectionId: 'col-child-1',
            createdAt: null,
            updatedAt: null,
          },
        ],
        children: [],
      },
      {
        id: 'col-child-2',
        name: 'Shaft Gay',
        slug: 'shaft-gay',
        description: null,
        parentId: 'col-root-1',
        createdAt: null,
        updatedAt: null,
        categories: [
          {
            id: 'cat-3',
            name: 'Graphite',
            slug: 'graphite',
            description: null,
            collectionId: 'col-child-2',
            createdAt: null,
            updatedAt: null,
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'col-root-2',
    name: 'Bong Golf',
    slug: 'bong-golf',
    description: null,
    parentId: null,
    createdAt: null,
    updatedAt: null,
    categories: [],
    children: [
      {
        id: 'col-child-3',
        name: 'Bong Tournament',
        slug: 'bong-tournament',
        description: null,
        parentId: 'col-root-2',
        createdAt: null,
        updatedAt: null,
        categories: [
          {
            id: 'cat-4',
            name: 'Bong 3 lop',
            slug: 'bong-3-lop',
            description: null,
            collectionId: 'col-child-3',
            createdAt: null,
            updatedAt: null,
          },
        ],
        children: [],
      },
    ],
  },
];

const FAKE_CATEGORY_POOL: CategoryCatalogItem[] = [
  { id: 'cat-1', name: 'Sat', slug: 'sat' },
  { id: 'cat-2', name: 'Wedge', slug: 'wedge' },
  { id: 'cat-3', name: 'Graphite', slug: 'graphite' },
  { id: 'cat-4', name: 'Bong 3 lop', slug: 'bong-3-lop' },
  { id: 'cat-5', name: 'Driver', slug: 'driver' },
  { id: 'cat-6', name: 'Putter', slug: 'putter' },
  { id: 'cat-7', name: 'Hybrid', slug: 'hybrid' },
];

const flattenCollections = (nodes: CollectionTreeNode[], depth = 0): FlatOption[] => {
  return nodes.flatMap(node => {
    const current = {
      depth,
      id: node.id,
      label: `${'  '.repeat(depth)}${depth === 0 ? 'Cha' : 'Con'}: ${node.name}`,
    };

    return [current, ...flattenCollections(node.children, depth + 1)];
  });
};

const flattenRootCollections = (nodes: CollectionTreeNode[]): FlatOption[] => {
  return nodes
    .filter(node => !node.parentId)
    .map(node => ({
      depth: 0,
      id: node.id,
      label: `Cha: ${node.name}`,
    }));
};

const findCollectionById = (nodes: CollectionTreeNode[], id: string): CollectionTreeNode | null => {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }

    const found = findCollectionById(node.children, id);
    if (found) {
      return found;
    }
  }

  return null;
};

const buildAssignedCategoryMap = (nodes: CollectionTreeNode[]): Map<string, AssignedCategoryInfo> => {
  const map = new Map<string, AssignedCategoryInfo>();

  const walk = (items: CollectionTreeNode[]) => {
    for (const item of items) {
      for (const category of item.categories) {
        map.set(category.id, {
          collectionId: item.id,
          collectionName: item.name,
        });
      }

      walk(item.children);
    }
  };

  walk(nodes);
  return map;
};

const buildCategoryCatalogFromTree = (nodes: CollectionTreeNode[]): CategoryCatalogItem[] => {
  const map = new Map<string, CategoryCatalogItem>();

  const walk = (items: CollectionTreeNode[]) => {
    for (const item of items) {
      for (const category of item.categories) {
        map.set(category.id, {
          id: category.id,
          name: category.name,
          slug: category.slug,
        });
      }

      walk(item.children);
    }
  };

  walk(nodes);

  return Array.from(map.values());
};

interface TreeNodeProps {
  ancestorsHasNext: boolean[];
  isLast?: boolean;
  isRoot?: boolean;
  node: CollectionTreeNode;
}

function TreeNode({ ancestorsHasNext, isLast = false, isRoot = false, node }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(true);

  const hasChildren = node.children.length > 0;
  const hasCategories = node.categories.length > 0;
  const hasExpandableContent = hasChildren || hasCategories;
  const childAncestors = [...ancestorsHasNext, !isLast];
  const totalRows = node.children.length + node.categories.length;

  return (
    <div className="text-[1.4rem] text-slate-700">
      <div className="group flex items-center gap-2 rounded-md px-1 py-0.5 leading-[2.2rem] hover:bg-slate-100/80">
        {ancestorsHasNext.map((hasNext, index) => (
          <span className="relative h-6 w-4 shrink-0" key={`${node.id}-ancestor-${index}`}>
            {hasNext && <span className="absolute left-2 top-0 h-full w-px bg-slate-300/90" />}
          </span>
        ))}

        {!isRoot && (
          <span className="relative h-6 w-4 shrink-0">
            <span className="absolute left-2 top-0 h-1/2 w-px bg-slate-300/90" />
            <span className="absolute left-2 top-1/2 h-px w-3 bg-slate-300/90" />
            {!isLast && <span className="absolute left-2 top-1/2 h-1/2 w-px bg-slate-300/90" />}
          </span>
        )}

        {hasExpandableContent ? (
          <button
            className="flex h-5 w-5 items-center justify-center rounded-full border border-sky-500 bg-white text-[1.2rem] font-700 text-sky-600 shadow-[0_0_0_1px_rgba(14,165,233,0.08)]"
            onClick={() => setExpanded(prev => !prev)}
            type="button"
          >
            {expanded ? '-' : '+'}
          </button>
        ) : (
          <span className="inline-block h-5 w-5" />
        )}

        <span className="font-500 text-slate-800 group-hover:text-slate-950">{node.name}</span>
      </div>

      {expanded && hasExpandableContent && (
        <div>
          {hasChildren && (
            <div className="space-y-1">
              {node.children.map((child, index) => (
                <TreeNode
                  ancestorsHasNext={childAncestors}
                  isLast={index === totalRows - 1}
                  key={child.id}
                  node={child}
                />
              ))}
            </div>
          )}

          {hasCategories && (
            <div className={`${hasChildren ? 'mt-1' : ''} space-y-1`}>
              {node.categories.map((category, index) => {
                const rowIndex = node.children.length + index;
                const categoryIsLast = rowIndex === totalRows - 1;

                return (
                  <div className="flex items-center gap-2 leading-[2.1rem]" key={category.id}>
                    {childAncestors.map((hasNext, ancestorIndex) => (
                      <span className="relative h-6 w-4 shrink-0" key={`${category.id}-ancestor-${ancestorIndex}`}>
                        {hasNext && <span className="absolute left-2 top-0 h-full w-px bg-slate-300/90" />}
                      </span>
                    ))}

                    <span className="relative h-6 w-4 shrink-0">
                      <span className="absolute left-2 top-0 h-1/2 w-px bg-slate-300/90" />
                      <span className="absolute left-2 top-1/2 h-px w-3 bg-slate-300/90" />
                      {!categoryIsLast && (
                        <span className="absolute left-2 top-1/2 h-1/2 w-px bg-slate-300/90" />
                      )}
                    </span>

                    <span className="text-slate-600">{category.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CollectionsPreview() {
  const [sourceMode, setSourceMode] = useState<'api' | 'fake'>('fake');
  const [targetCollectionId, setTargetCollectionId] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const { getAllCollections } = useCollections();

  const treeData = useMemo(() => {
    if (sourceMode === 'api') {
      return getAllCollections.data?.data ?? [];
    }

    return FAKE_COLLECTIONS;
  }, [getAllCollections.data?.data, sourceMode]);

  const collectionOptions = useMemo(() => flattenCollections(treeData), [treeData]);

  const targetCollection = useMemo(() => {
    if (!targetCollectionId) return null;
    return findCollectionById(treeData, targetCollectionId);
  }, [targetCollectionId, treeData]);

  const parentOptions = useMemo(() => {
    return flattenRootCollections(treeData).filter(option => option.id !== targetCollectionId);
  }, [targetCollectionId, treeData]);

  const assignedCategoryMap = useMemo(() => buildAssignedCategoryMap(treeData), [treeData]);

  const categoryCatalog = useMemo(() => {
    if (sourceMode === 'fake') {
      return FAKE_CATEGORY_POOL;
    }

    return buildCategoryCatalogFromTree(treeData);
  }, [sourceMode, treeData]);

  const isNewCollection = !targetCollection;
  const isExistingChildCollection = Boolean(targetCollection?.parentId);
  const isExistingParentCollection = Boolean(targetCollection) && !targetCollection?.parentId;

  const canSelectParent = isNewCollection || isExistingChildCollection;
  const canSelectCategories = isNewCollection || isExistingChildCollection;

  useEffect(() => {
    if (!targetCollection) {
      setParentId('');
      setSelectedCategoryIds([]);
      return;
    }

    setParentId(targetCollection.parentId || '');
    setSelectedCategoryIds(targetCollection.categories.map(category => category.id));
  }, [targetCollection]);

  const previewPayload = useMemo(
    () => ({
      id: targetCollection?.id,
      parentId: parentId || undefined,
      categoryIds: canSelectCategories ? selectedCategoryIds : [],
    }),
    [canSelectCategories, parentId, selectedCategoryIds, targetCollection?.id],
  );

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-[1.8rem] font-600 text-gray-900">Preview Tree Collection</h2>
            <p className="text-[1.3rem] text-gray-500">Demo cho menu header: cha - con - category</p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-1">
            <button
              className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-[1.3rem] ${
                sourceMode === 'fake' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
              onClick={() => setSourceMode('fake')}
              type="button"
            >
              <FlaskConical className="h-4 w-4" />
              Fake
            </button>
            <button
              className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-[1.3rem] ${
                sourceMode === 'api' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
              onClick={() => setSourceMode('api')}
              type="button"
            >
              <Database className="h-4 w-4" />
              API
            </button>
          </div>
        </header>

        <div className="space-y-2 p-5">
          {sourceMode === 'api' && getAllCollections.isLoading && (
            <div className="rounded-lg bg-blue-50 px-4 py-3 text-[1.3rem] text-blue-700">
              Dang tai du lieu API...
            </div>
          )}

          {treeData.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center text-[1.4rem] text-gray-500">
              Chua co du lieu tree.
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
              {treeData.map((node, index) => (
                <TreeNode
                  ancestorsHasNext={[]}
                  isLast={index === treeData.length - 1}
                  isRoot
                  key={node.id}
                  node={node}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <header className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-[1.8rem] font-600 text-gray-900">Cau hinh Tree Collection (Demo)</h2>
          <p className="text-[1.3rem] text-gray-500">
            Review rule parentId + categoryIds theo business logic
          </p>
        </header>

        <div className="space-y-4 p-5">
          <div className="space-y-2">
            <label className="text-[1.3rem] font-600 text-gray-700">Collection muc tieu</label>
            <select
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-[1.4rem] outline-none focus:border-emerald-500"
              onChange={event => setTargetCollectionId(event.target.value)}
              value={targetCollectionId}
            >
              <option value="">Chon collection can cau hinh</option>
              {collectionOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[1.3rem] font-600 text-gray-700">Collection cha (parentId)</label>
            <select
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-[1.4rem] outline-none focus:border-emerald-500"
              disabled={!canSelectParent}
              onChange={event => {
                setParentId(event.target.value);
              }}
              value={parentId}
            >
              <option value="">Khong chon (tao collection cha)</option>
              {parentOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {isExistingParentCollection && (
            <div className="rounded-lg bg-amber-50 px-3 py-2 text-[1.3rem] text-amber-700">
              Collection dang la cha nen khong duoc chon parent/category.
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[1.3rem] font-600 text-gray-700">Gan categoryIds</label>
            {!canSelectCategories ? (
              <div className="rounded-lg bg-gray-100 px-3 py-2 text-[1.3rem] text-gray-600">
                Khong the gan category cho collection dang la cha.
              </div>
            ) : (
              <div className="max-h-52 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-3">
                {categoryCatalog.length === 0 && (
                  <p className="text-[1.3rem] text-gray-500">Khong co category de gan.</p>
                )}

                {categoryCatalog.map(option => {
                  const assigned = assignedCategoryMap.get(option.id);
                  const isOwnedByCurrent = assigned?.collectionId === targetCollection?.id;
                  const isAssignedToOther = Boolean(assigned) && !isOwnedByCurrent;

                  return (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between gap-2 text-[1.3rem] ${
                        isAssignedToOther ? 'text-gray-400' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          checked={selectedCategoryIds.includes(option.id)}
                          disabled={isAssignedToOther}
                          onChange={event => {
                            if (event.target.checked) {
                              setSelectedCategoryIds(prev => [...prev, option.id]);
                              return;
                            }

                            setSelectedCategoryIds(prev => prev.filter(item => item !== option.id));
                          }}
                          type="checkbox"
                        />
                        {option.name}
                      </div>

                      {assigned && (
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[1.2rem] text-gray-500">
                          dang thuoc: {assigned.collectionName}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="mb-2 text-[1.3rem] font-600 text-gray-700">Payload preview</p>
            <pre className="overflow-x-auto text-[1.2rem] text-gray-600">
              {JSON.stringify(previewPayload, null, 2)}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
