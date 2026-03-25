export interface ProductVariant {
  id: string;
  image: string;
  name: string;
  originalPrice?: number;
  price: number;
  size: string;
  sku: string;
  stock: number;
  weight: number;
}

export interface AdminProduct {
  brand: string;
  category: string;
  createdAt: string;
  description: string;
  featured: boolean;
  id: string;
  images: string[];
  name: string;
  status: 'active' | 'archived' | 'draft';
  thumbnail: string;
  updatedAt: string;
  variants: ProductVariant[];
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

export const brandOptions = [
  'TaylorMade',
  'Callaway',
  'Titleist',
  'Ping',
  'Mizuno',
  'Cobra',
  'Honma',
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
    status: 'active',
    thumbnail:
      'https://images.unsplash.com/photo-1629213287303-4f74fc4aa976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    updatedAt: '2026-03-10',
    variants: [
      {
        id: 'V001-1',
        image:
          'https://images.unsplash.com/photo-1629213287303-4f74fc4aa976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        name: 'Shaft Regular 10.5°',
        originalPrice: 18500000,
        price: 15900000,
        size: '10.5°',
        sku: 'TM-QI35-R105',
        stock: 12,
        weight: 310,
      },
      {
        id: 'V001-2',
        image:
          'https://images.unsplash.com/photo-1708568326307-9d14c6405af6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        name: 'Shaft Stiff 9°',
        originalPrice: 18500000,
        price: 16200000,
        size: '9°',
        sku: 'TM-QI35-S9',
        stock: 8,
        weight: 315,
      },
    ],
  },
  {
    brand: 'Callaway',
    category: 'Gậy Iron / Sắt',
    createdAt: '2026-02-01',
    description: 'Bộ gậy sắt Callaway Paradym Ai Smoke với công nghệ AI Flash Face cho vùng sweet-spot lớn hơn.',
    featured: true,
    id: 'P002',
    images: [],
    name: 'Callaway Paradym Ai Smoke Iron Set',
    status: 'active',
    thumbnail:
      'https://images.unsplash.com/photo-1761233976530-d09fc58ad175?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    updatedAt: '2026-03-12',
    variants: [
      {
        id: 'V002-1',
        image:
          'https://images.unsplash.com/photo-1761233976530-d09fc58ad175?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        name: '5-PW Steel Regular',
        price: 32500000,
        size: '5-PW (6 gậy)',
        sku: 'CW-PRDM-5PW-SR',
        stock: 5,
        weight: 2450,
      },
    ],
  },
  {
    brand: 'Titleist',
    category: 'Gậy Putter',
    createdAt: '2026-01-20',
    description: 'Putter Scotty Cameron Phantom X với thiết kế multi-material giúp kiểm soát đường bóng tốt hơn.',
    featured: false,
    id: 'P003',
    images: [],
    name: 'Titleist Scotty Cameron Phantom X Putter',
    status: 'active',
    thumbnail:
      'https://images.unsplash.com/photo-1542770914-5773ed8acbaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    updatedAt: '2026-03-05',
    variants: [
      {
        id: 'V003-1',
        image:
          'https://images.unsplash.com/photo-1542770914-5773ed8acbaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        name: '34 inch',
        originalPrice: 14500000,
        price: 12800000,
        size: '34"',
        sku: 'TT-SC-PX-34',
        stock: 10,
        weight: 355,
      },
    ],
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
    status: 'active',
    thumbnail:
      'https://images.unsplash.com/photo-1642235733613-ccba5328fb3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    updatedAt: '2026-03-15',
    variants: [
      {
        id: 'V004-1',
        image:
          'https://images.unsplash.com/photo-1642235733613-ccba5328fb3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        name: 'Hộp 12 bóng - Trắng',
        originalPrice: 1900000,
        price: 1650000,
        size: '12 bóng',
        sku: 'TT-PV1-12-W',
        stock: 50,
        weight: 550,
      },
    ],
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
    status: 'draft',
    thumbnail:
      'https://images.unsplash.com/photo-1708568326307-9d14c6405af6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    updatedAt: '2026-03-14',
    variants: [
      {
        id: 'V005-1',
        image:
          'https://images.unsplash.com/photo-1708568326307-9d14c6405af6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        name: '10.5° Regular Alta CB',
        price: 16200000,
        size: '10.5°',
        sku: 'PG-G440-105R',
        stock: 6,
        weight: 308,
      },
    ],
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
    status: 'archived',
    thumbnail:
      'https://images.unsplash.com/photo-1653868250317-144a0c4f5884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    updatedAt: '2026-03-02',
    variants: [
      {
        id: 'V006-1',
        image:
          'https://images.unsplash.com/photo-1653868250317-144a0c4f5884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        name: 'Size M',
        price: 590000,
        size: 'M',
        sku: 'CB-GLV-M',
        stock: 0,
        weight: 48,
      },
    ],
  },
];
