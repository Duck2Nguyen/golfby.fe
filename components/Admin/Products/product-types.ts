export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface AdminProduct {
  brand: string;
  category: string;
  collectionIds?: string[];
  createdAt: string;
  description: string;
  featured: boolean;
  id: string;
  images: string[];
  name: string;
  status: 'active' | 'archived' | 'draft';
  tagIds?: string[];
  thumbnail: string;
  updatedAt: string;
  productOptions?: ProductOption[];
  vendorIds?: string[];
}

export interface ProductMultiSelectOption {
  id: string;
  label: string;
}

export const categoryOptions = [
  'Gậy Driver',
  'Gậy Iron / Sắt',
  'Gậy Putter',
  'Gậy Wedge',
  'Gậy Hybrid',
  'Gậy Fairway Wood',
  'Bóng Golf',
  'Phụ kiện Golf',
];

export const brandOptions = ['TaylorMade', 'Callaway', 'Titleist', 'Ping', 'Mizuno', 'Cobra', 'Honma'];

export const productTagOptions: ProductMultiSelectOption[] = [
  { id: 'tag1', label: 'Sale' },
  { id: 'tag2', label: 'Mới về' },
  { id: 'tag3', label: 'Best Seller' },
  { id: 'tag4', label: 'Giới hạn' },
  { id: 'tag5', label: 'Hot' },
  { id: 'tag6', label: 'Premium' },
];

export const productCollectionOptions: ProductMultiSelectOption[] = [
  { id: 'col1', label: 'Bộ sưu tập Driver 2026' },
  { id: 'col2', label: 'Bộ sưu tập Iron Pro' },
  { id: 'col3', label: 'Bộ sưu tập Putter Elite' },
  { id: 'col4', label: 'Golf Accessories' },
  { id: 'col5', label: 'Limited Edition' },
];

export const productVendorOptions: ProductMultiSelectOption[] = [
  { id: 'v1', label: 'TaylorMade VN' },
  { id: 'v2', label: 'Callaway Distributor' },
  { id: 'v3', label: 'Golf House Supply' },
  { id: 'v4', label: 'Premium Golf Import' },
  { id: 'v5', label: 'Titleist Partner' },
];

export const mockProducts: AdminProduct[] = [
  {
    brand: 'TaylorMade',
    category: 'Gậy Driver',
    createdAt: '2026-01-15',
    description:
      'Driver cao cấp với mặt gậy titanium siêu nhẹ, giúp tăng tốc độ bóng và cải thiện độ ổn định khi vào bóng.',
    featured: true,
    id: 'P001',
    images: [],
    name: 'TaylorMade Qi35 Max Driver',
    productOptions: [
      {
        id: 'OPT-1-1',
        name: 'Shaft Flex',
        values: ['Regular', 'Stiff'],
      },
      {
        id: 'OPT-1-2',
        name: 'Loft',
        values: ['9°', '10.5°'],
      },
    ],
    status: 'active',
    thumbnail:
      'https://images.unsplash.com/photo-1629213287303-4f74fc4aa976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    updatedAt: '2026-03-10',
  },
  {
    brand: 'Callaway',
    category: 'Gậy Iron / Sắt',
    createdAt: '2026-02-01',
    description:
      'Bộ gậy sắt Callaway Paradym Ai Smoke với công nghệ AI Flash Face cho vùng sweet-spot lớn hơn.',
    featured: true,
    id: 'P002',
    images: [],
    name: 'Callaway Paradym Ai Smoke Iron Set',
    productOptions: [
      {
        id: 'OPT-2-1',
        name: 'Shaft Type',
        values: ['Steel', 'Graphite'],
      },
      {
        id: 'OPT-2-2',
        name: 'Flex',
        values: ['Regular', 'Stiff'],
      },
    ],
    status: 'active',
    thumbnail:
      'https://images.unsplash.com/photo-1761233976530-d09fc58ad175?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    updatedAt: '2026-03-12',
  },
  {
    brand: 'Titleist',
    category: 'Gậy Putter',
    createdAt: '2026-01-20',
    description:
      'Putter Scotty Cameron Phantom X với thiết kế multi-material giúp kiểm soát đường bóng tốt hơn.',
    featured: false,
    id: 'P003',
    images: [],
    name: 'Titleist Scotty Cameron Phantom X Putter',
    productOptions: [
      {
        id: 'OPT-3-1',
        name: 'Chiều dài',
        values: ['33"', '34"', '35"'],
      },
    ],
    status: 'active',
    thumbnail:
      'https://images.unsplash.com/photo-1542770914-5773ed8acbaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    updatedAt: '2026-03-05',
  },
  {
    brand: 'Titleist',
    category: 'Bóng Golf',
    createdAt: '2026-01-10',
    description: 'Bóng golf chuyên nghiệp với cảm giác mềm, spin ổn định và độ bền cao.',
    featured: true,
    id: 'P004',
    images: [],
    name: 'Titleist Pro V1 Golf Ball',
    productOptions: [
      {
        id: 'OPT-4-1',
        name: 'Màu',
        values: ['Trắng', 'Vàng'],
      },
      {
        id: 'OPT-4-2',
        name: 'Quy cách',
        values: ['Hộp 12 bóng'],
      },
    ],
    status: 'active',
    thumbnail:
      'https://images.unsplash.com/photo-1642235733613-ccba5328fb3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    updatedAt: '2026-03-15',
  },
  {
    brand: 'Ping',
    category: 'Gậy Driver',
    createdAt: '2026-02-08',
    description: 'Ping G440 với turbulator tối ưu luồng khí, tăng tốc độ swing và độ ổn định.',
    featured: false,
    id: 'P005',
    images: [],
    name: 'Ping G440 Driver',
    productOptions: [
      {
        id: 'OPT-5-1',
        name: 'Loft',
        values: ['9°', '10.5°'],
      },
      {
        id: 'OPT-5-2',
        name: 'Shaft Flex',
        values: ['Regular', 'Stiff'],
      },
    ],
    status: 'draft',
    thumbnail:
      'https://images.unsplash.com/photo-1708568326307-9d14c6405af6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    updatedAt: '2026-03-14',
  },
  {
    brand: 'Cobra',
    category: 'Phụ kiện Golf',
    createdAt: '2026-02-20',
    description: 'Găng tay golf cao cấp, độ bám tốt và thoáng khí trong điều kiện thi đấu dài.',
    featured: false,
    id: 'P006',
    images: [],
    name: 'Cobra Premium Golf Glove',
    productOptions: [
      {
        id: 'OPT-6-1',
        name: 'Size',
        values: ['S', 'M', 'L'],
      },
    ],
    status: 'archived',
    thumbnail:
      'https://images.unsplash.com/photo-1653868250317-144a0c4f5884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    updatedAt: '2026-03-02',
  },
];
