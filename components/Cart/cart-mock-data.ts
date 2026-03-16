import type { CartItem } from './CartItemRow';

export const initialCartItems: CartItem[] = [
  {
    id: 1,
    productId: 1,
    name: 'Shaft Driver / Fairway GRAPHITE DESIGN TOUR AD XC + Adapter',
    brand: 'Graphite Design',
    image:
      'https://images.unsplash.com/photo-1629213287303-4f74fc4aa976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY2x1YiUyMGRyaXZlciUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzczNjI2NjMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: 5310000,
    originalPrice: 5900000,
    quantity: 1,
    specs: [
      { label: 'SKU', value: 'GS-00101' },
      { label: 'Flex', value: 'Stiff (S)' },
      { label: 'Hãng Grip', value: 'Golf Pride' },
      { label: 'Chất liệu', value: 'Graphite' },
      { label: 'Chiều dài', value: '45.5 inch (Tiêu chuẩn)' },
    ],
  },
  {
    id: 2,
    productId: 4,
    name: 'Custom Gậy Driver Ping G440 MAX 2025',
    brand: 'Ping',
    image:
      'https://images.unsplash.com/photo-1708568326307-9d14c6405af6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwZHJpdmVyJTIwdGl0YW5pdW0lMjBwcm9kdWN0fGVufDF8fHx8MTc3MzYyNjYzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: 21910000,
    originalPrice: 24500000,
    quantity: 1,
    specs: [
      { label: 'SKU', value: 'GS-00004' },
      { label: 'Tay', value: 'Phải' },
      { label: 'Shaft Flex', value: 'Regular' },
      { label: 'Hãng Shaft', value: 'Fujikura' },
      { label: 'Loft', value: '10.5°' },
      { label: 'Model Shaft', value: 'Fujikura Regular 2024 Ventus Blue 5-R' },
    ],
  },
];
