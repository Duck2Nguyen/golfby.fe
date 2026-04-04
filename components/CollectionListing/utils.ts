import type { Product } from '@/components/mock-data';
import type { ProductListItem, GetAllProductsParams } from '@/hooks/useProducts';
import type { CollectionCategory, CollectionTreeNode } from '@/hooks/useCollections';

export interface BreadcrumbItem {
  href: string;
  label: string;
}

interface CollectionRouteIndexNode {
  categories: CollectionCategory[];
  description?: string | null;
  id: string;
  name: string;
  parentId?: string | null;
  slug: string;
}

export interface ResolvedCollectionRoute {
  breadcrumbs: BreadcrumbItem[];
  description?: string | null;
  params: GetAllProductsParams;
  title: string;
}

export interface PriceRange {
  max: number;
  min: number;
}

export const DEFAULT_PAGE_SIZE = 24;
export const DEFAULT_MAX_PRICE = 100000000;
export const DEFAULT_MIN_PRICE = 0;
const PRODUCT_IMAGE_FALLBACK = 'https://placehold.co/600x600?text=GolfBy';

const toNumber = (value?: string | null) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const toSlug = (value?: string | null) => {
  const normalized = value?.trim().toLowerCase();
  return normalized ? normalized : null;
};

export const normalizeSlugSegments = (slugSegments: string[]) => {
  return slugSegments
    .map(segment => toSlug(segment))
    .filter((segment): segment is string => Boolean(segment));
};

const buildRouteKey = (slugSegments: string[]) => slugSegments.join('/');

export const mapApiProductToCardData = (item: ProductListItem): Product => {
  const salePrice = toNumber(item.salePrice);
  const listPrice = toNumber(item.listPrice);

  const price = salePrice > 0 ? salePrice : listPrice;
  const originalPrice = salePrice > 0 && listPrice > salePrice ? listPrice : undefined;
  const discount =
    originalPrice && originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined;

  return {
    brand: item.brand?.name ?? 'GolfBy',
    ...(discount ? { badge: 'sale' } : {}),
    ...(discount ? { discount } : {}),
    id: item.id,
    image: item.images?.[0]?.url || PRODUCT_IMAGE_FALLBACK,
    name: item.name,
    ...(originalPrice ? { originalPrice } : {}),
    price,
    rating: 0,
    reviews: 0,
  };
};

const buildCollectionHref = (...slugSegments: string[]) => {
  const normalizedSegments = slugSegments.filter(Boolean);

  if (normalizedSegments.length === 0) {
    return '/collection';
  }

  return `/collection/${normalizedSegments.join('/')}`;
};

const buildCollectionIndex = (collections: CollectionTreeNode[]) => {
  const index = new Map<string, CollectionRouteIndexNode>();

  const walk = (collection: CollectionTreeNode, parentIdFromTree: string | null) => {
    const normalizedSlug = toSlug(collection.slug);

    if (!normalizedSlug) {
      return;
    }

    const inferredParentId = collection.parentId ?? parentIdFromTree ?? null;
    const existing = index.get(collection.id);

    if (existing) {
      index.set(collection.id, {
        ...existing,
        categories: collection.categories?.length ? collection.categories : existing.categories,
        description: collection.description ?? existing.description ?? null,
        name: collection.name || existing.name,
        parentId: existing.parentId ?? inferredParentId,
        slug: normalizedSlug,
      });
    } else {
      index.set(collection.id, {
        categories: collection.categories ?? [],
        description: collection.description,
        id: collection.id,
        name: collection.name,
        parentId: inferredParentId,
        slug: normalizedSlug,
      });
    }

    (collection.children ?? []).forEach(child => walk(child, collection.id));
  };

  collections.forEach(collection => walk(collection, null));

  return index;
};

const buildCollectionPath = (nodeId: string, collectionIndex: Map<string, CollectionRouteIndexNode>) => {
  const visited = new Set<string>();
  const reversedPath: CollectionRouteIndexNode[] = [];

  let currentNode = collectionIndex.get(nodeId);

  while (currentNode) {
    if (visited.has(currentNode.id)) {
      return null;
    }

    visited.add(currentNode.id);
    reversedPath.push(currentNode);

    if (!currentNode.parentId) {
      break;
    }

    currentNode = collectionIndex.get(currentNode.parentId);
  }

  if (reversedPath.length === 0) {
    return null;
  }

  const pathNodes = [...reversedPath].reverse();

  return {
    pathNames: pathNodes.map(node => node.name),
    pathSlugs: pathNodes.map(node => node.slug),
  };
};

export const buildBaseBreadcrumbs = (): BreadcrumbItem[] => {
  return [
    { href: '/', label: 'Trang Chủ' },
    { href: '/collection', label: 'Sản phẩm' },
  ];
};

const buildCollectionPathBreadcrumbs = (pathNames: string[], pathSlugs: string[]): BreadcrumbItem[] => {
  const base = buildBaseBreadcrumbs();

  return [
    ...base,
    ...pathNames.map((label, index) => ({
      href: buildCollectionHref(...pathSlugs.slice(0, index + 1)),
      label,
    })),
  ];
};

export const buildCollectionRouteMap = (collections: CollectionTreeNode[]) => {
  const routeMap = new Map<string, ResolvedCollectionRoute>();
  const collectionIndex = buildCollectionIndex(collections);

  collectionIndex.forEach(node => {
    const resolvedPath = buildCollectionPath(node.id, collectionIndex);

    if (!resolvedPath) {
      return;
    }

    const { pathNames, pathSlugs } = resolvedPath;
    const collectionKey = buildRouteKey(pathSlugs);

    routeMap.set(collectionKey, {
      breadcrumbs: buildCollectionPathBreadcrumbs(pathNames, pathSlugs),
      description: node.description,
      params: { collectionId: node.id },
      title: node.name,
    });

    (node.categories ?? []).forEach(category => {
      const categorySlug = toSlug(category.slug);

      if (!categorySlug) {
        return;
      }

      const categoryPathSlugs = [...pathSlugs, categorySlug];
      const categoryKey = buildRouteKey(categoryPathSlugs);

      routeMap.set(categoryKey, {
        breadcrumbs: [
          ...buildCollectionPathBreadcrumbs(pathNames, pathSlugs),
          {
            href: buildCollectionHref(...categoryPathSlugs),
            label: category.name,
          },
        ],
        description: category.description,
        params: { categoryId: category.id },
        title: category.name,
      });
    });
  });

  return routeMap;
};

export const resolveCollectionRoute = (
  collectionRouteMap: Map<string, ResolvedCollectionRoute>,
  slugSegments: string[],
): ResolvedCollectionRoute | null => {
  const normalizedSlugs = normalizeSlugSegments(slugSegments);

  if (normalizedSlugs.length === 0) {
    return {
      breadcrumbs: buildBaseBreadcrumbs(),
      params: {},
      title: 'Tất cả sản phẩm',
    };
  }

  if (normalizedSlugs.length > 3) {
    return null;
  }

  const routeKey = buildRouteKey(normalizedSlugs);

  return collectionRouteMap.get(routeKey) ?? null;
};
