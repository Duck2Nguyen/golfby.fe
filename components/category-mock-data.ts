import type { Product } from './mock-data';

const shaftImages = [
  'https://images.unsplash.com/photo-1750272001535-524d6a246947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY2x1YiUyMHNoYWZ0JTIwZ3JhcGhpdGV8ZW58MXx8fHwxNzczNjI3Njk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1629213287303-4f74fc4aa976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwZHJpdmVyJTIwc2hhZnQlMjBjbG9zZXVwfGVufDF8fHx8MTc3MzYyNzcwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1654883861330-1b4fc2f40327?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwaXJvbiUyMHNoYWZ0JTIwc3RlZWx8ZW58MXx8fHwxNzczNjI3NzAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1677174503070-f3a68b35c158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwZXF1aXBtZW50JTIwc2hhZnQlMjBkZXRhaWx8ZW58MXx8fHwxNzczNjI3NzAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1763111332218-bf71f80d258d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwd2VkZ2UlMjBjbHViJTIwaGVhZHxlbnwxfHx8fDE3NzM2Mjc3MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1763111118127-5107b8f38b1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwcHV0dGVyJTIwY2x1YiUyMGhlYWR8ZW58MXx8fHwxNzczNjI3NzA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1592459777315-00ab1374a953?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwaHlicmlkJTIwY2x1YiUyMHdvb2R8ZW58MXx8fHwxNzczNjI3NzA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
];

const shaftNames = [
  'Shaft Driver / Fairway GRAPHITE DESIGN TOUR AD XC + Adapter',
  'Shaft Driver / Fairway GRAPHITE DESIGN TOUR AD HD + Adapter',
  'Shaft Driver / Fairway FUJIKURA 2024 VENTUS BLACK + Adapter',
  'Shaft Driver / Fairway GRAPHITE DESIGN TOUR AD DI + Adapter',
  'Shaft Driver / Fairway GRAPHITE DESIGN PT HIGH MODULUS + Adapter',
  'Shaft Driver / Fairway GRAPHITE DESIGN TOUR AD UB + Adapter',
  'Shaft Driver / Fairway GRAPHITE DESIGN TOUR AD CQ + Adapter',
  'Shaft Driver / Fairway GRAPHITE DESIGN TOUR AD VF + Adapter',
  'Shaft Driver / Fairway GRAPHITE DESIGN TOUR AD DI HIGH MODULUS RELOADED + Adapter',
  'Shaft Driver / Fairway GRAPHITE DESIGN TOUR AD GC + Adapter',
  'Shaft Driver / Fairway GRAPHITE DESIGN TOUR AD DI BLACK + Adapter',
  'Shaft Iron NSPRO 950GH Neo',
  'Shaft Iron NSPRO MODUS3 TOUR 120 + Adapter',
  'Shaft Driver / Fairway FUJIKURA SPEEDER NX GREEN + Adapter',
  'Shaft Iron KBS TOUR V 110 Steel',
  'Shaft Driver / Fairway MITSUBISHI TENSEI CK PRO ORANGE + Adapter',
  'Shaft Iron TRUE TEMPER DYNAMIC GOLD 105',
  'Shaft Driver / Fairway UST MAMIYA HELIUM NanoCore + Adapter',
  'Shaft Iron PROJECT X LZ Steel',
  'Shaft Driver / Fairway ALDILA ROGUE SILVER + Adapter',
  'Shaft Iron NIPPON NS PRO ZELOS 7',
  'Shaft Driver / Fairway GRAPHITE DESIGN TOUR AD TP + Adapter',
  'Shaft Iron TRUE TEMPER ELEVATE ETS 95',
  'Shaft Driver / Fairway FUJIKURA VENTUS TR RED + Adapter',
  'Shaft Iron KBS MAX MT 85 Steel',
  'Shaft Driver / Fairway MITSUBISHI TENSEI AV BLUE + Adapter',
  'Shaft Iron NIPPON NS PRO 850GH Neo',
  'Shaft Driver / Fairway UST MAMIYA LIN-Q BLUE + Adapter',
  'Shaft Iron PROJECT X CATALYST 80',
  'Shaft Driver / Fairway ALDILA NV 2KXV + Adapter',
  'Shaft Iron TRUE TEMPER XP 105 S300',
];

const brands = [
  'Graphite Design',
  'Fujikura',
  'NSPRO',
  'SteelFiber',
  'Mitsubishi',
  'KBS',
  'True Temper',
  'UST Mamiya',
  'Project X',
  'Aldila',
];

function getBrand(name: string): string {
  if (name.includes('GRAPHITE DESIGN')) return 'Graphite Design';
  if (name.includes('FUJIKURA')) return 'Fujikura';
  if (name.includes('NSPRO') || name.includes('NIPPON')) return 'NSPRO';
  if (name.includes('MITSUBISHI')) return 'Mitsubishi';
  if (name.includes('KBS')) return 'KBS';
  if (name.includes('TRUE TEMPER')) return 'True Temper';
  if (name.includes('UST MAMIYA')) return 'UST Mamiya';
  if (name.includes('PROJECT X')) return 'Project X';
  if (name.includes('ALDILA')) return 'Aldila';
  return 'SteelFiber';
}

export const shaftProducts: Product[] = shaftNames.map((name, i) => {
  const originalPrice = [5900000, 7600000, 6500000, 4800000, 1100000][i % 5];
  const discounts = [
    10, 16, 10, 10, 21, 15, 10, 10, 12, 10, 10, 21, 10, 15, 10, 10, 21, 12, 10, 15, 10, 10, 15, 12, 21, 10,
    10, 15, 12, 10, 10,
  ];
  const discount = discounts[i];
  const price = Math.round(originalPrice * (1 - discount / 100));
  const hasSale = i % 3 !== 2;

  return {
    id: 100 + i,
    name,
    brand: getBrand(name),
    image: shaftImages[i % shaftImages.length],
    price,
    originalPrice: hasSale ? originalPrice : undefined,
    rating: [4, 5, 4, 5, 3, 4, 5, 4, 5, 4][i % 10],
    reviews: [12, 8, 23, 5, 31, 17, 9, 14, 6, 20][i % 10],
    badge: hasSale ? ('sale' as const) : undefined,
    discount: hasSale ? discount : undefined,
  };
});

export const brandFilters = brands.map(brand => ({
  label: brand,
  count: shaftProducts.filter(p => p.brand === brand).length,
  checked: false,
}));

export const flexFilters = [
  { label: 'Regular (R)', count: 9, checked: false },
  { label: 'Stiff (S)', count: 12, checked: false },
  { label: 'Extra Stiff (X)', count: 7, checked: false },
  { label: 'Ladies (L)', count: 3, checked: false },
];

export const materialFilters = [
  { label: 'Graphite', count: 18, checked: false },
  { label: 'Steel', count: 10, checked: false },
  { label: 'Composite', count: 3, checked: false },
];

export const weightFilters = [
  { label: 'Dưới 60g', count: 8, checked: false },
  { label: '60g - 70g', count: 11, checked: false },
  { label: '70g - 80g', count: 7, checked: false },
  { label: 'Trên 80g', count: 5, checked: false },
];
