export interface Product {
    id: number;
    name: string;
    brand: string;
    image: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    badge?: "new" | "sale" | "hot";
    discount?: number;
  }
  
  export const clubProducts: Product[] = [
    {
      id: 1,
      name: "TaylorMade Qi35 Max Driver 10.5°",
      brand: "TaylorMade",
      image:
        "https://images.unsplash.com/photo-1629213287303-4f74fc4aa976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY2x1YiUyMGRyaXZlciUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzczNjI2NjMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: 15900000,
      originalPrice: 18500000,
      rating: 5,
      reviews: 42,
      badge: "hot",
      discount: 14,
    },
    {
      id: 2,
      name: "Callaway Paradym Ai Smoke Iron Set",
      brand: "Callaway",
      image:
        "https://images.unsplash.com/photo-1761233976530-d09fc58ad175?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwaXJvbiUyMGNsdWIlMjBzZXR8ZW58MXx8fHwxNzczNjI2NjMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: 32500000,
      rating: 5,
      reviews: 28,
      badge: "new",
    },
    {
      id: 3,
      name: "Titleist Scotty Cameron Phantom X Putter",
      brand: "Titleist",
      image:
        "https://images.unsplash.com/photo-1542770914-5773ed8acbaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwcHV0dGVyJTIwZ3JlZW58ZW58MXx8fHwxNzczNjI2NjMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: 12800000,
      originalPrice: 14500000,
      rating: 4,
      reviews: 36,
      badge: "sale",
      discount: 12,
    },
    {
      id: 4,
      name: "Ping G440 Driver 9° Stiff Shaft",
      brand: "Ping",
      image:
        "https://images.unsplash.com/photo-1708568326307-9d14c6405af6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwZHJpdmVyJTIwdGl0YW5pdW0lMjBwcm9kdWN0fGVufDF8fHx8MTc3MzYyNjYzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: 16200000,
      rating: 5,
      reviews: 19,
      badge: "new",
    },
  ];
  
  export const ballProducts: Product[] = [
    {
      id: 5,
      name: "Titleist Pro V1 - Hộp 12 bóng",
      brand: "Titleist",
      image:
        "https://images.unsplash.com/photo-1642235733613-ccba5328fb3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwYmFsbHMlMjB3aGl0ZSUyMHRlZXxlbnwxfHx8fDE3NzM2MjY2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: 1650000,
      originalPrice: 1900000,
      rating: 5,
      reviews: 87,
      badge: "sale",
      discount: 13,
    },
    {
      id: 6,
      name: "Callaway Chrome Soft X - 12 balls",
      brand: "Callaway",
      image:
        "https://images.unsplash.com/photo-1632244112951-95b29c92eee1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwd2VkZ2UlMjBzYW5kJTIwY2x1YnxlbnwxfHx8fDE3NzM2MjY2Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: 1450000,
      rating: 4,
      reviews: 53,
    },
    {
      id: 7,
      name: "Bridgestone Tour B XS - Hộp 12 bóng",
      brand: "Bridgestone",
      image:
        "https://images.unsplash.com/photo-1693163532134-5ea6c80b58a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwYmFnJTIwZXF1aXBtZW50fGVufDF8fHx8MTc3MzYyNjYzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: 1350000,
      originalPrice: 1500000,
      rating: 4,
      reviews: 31,
      badge: "sale",
      discount: 10,
    },
    {
      id: 8,
      name: "TaylorMade TP5x Pix 2026 Edition",
      brand: "TaylorMade",
      image:
        "https://images.unsplash.com/photo-1573684955725-34046d1ea9f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwdHJvcGh5JTIwbHV4dXJ5JTIwYXdhcmR8ZW58MXx8fHwxNzczNjI2NjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: 1550000,
      rating: 5,
      reviews: 22,
      badge: "new",
    },
  ];
  
  export const accessoryProducts: Product[] = [
    {
      id: 9,
      name: "Găng tay Titleist Players Glove",
      brand: "Titleist",
      image:
        "https://images.unsplash.com/photo-1653868250317-144a0c4f5884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwYWNjZXNzb3JpZXMlMjBnbG92ZXMlMjBzaG9lc3xlbnwxfHx8fDE3NzM2MjY2MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: 680000,
      rating: 4,
      reviews: 64,
    },
    {
      id: 10,
      name: "Mũ Golf Nike Dri-FIT Club Cap",
      brand: "Nike",
      image:
        "https://images.unsplash.com/photo-1715533173683-737d4a2433dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwZmFzaGlvbiUyMGFwcGFyZWwlMjBwb2xvJTIwc2hpcnR8ZW58MXx8fHwxNzczNjI2NjMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: 850000,
      originalPrice: 950000,
      rating: 5,
      reviews: 41,
      badge: "sale",
      discount: 11,
    },
    {
      id: 11,
      name: "Túi xách tay Callaway Fairway C Stand",
      brand: "Callaway",
      image:
        "https://images.unsplash.com/photo-1760253488581-f77fe3a6e479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwcGxheWVyJTIwcHJvZmVzc2lvbmFsJTIwdG91cm5hbWVudHxlbnwxfHx8fDE3NzM2MjY2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: 5200000,
      rating: 5,
      reviews: 15,
      badge: "hot",
    },
    {
      id: 12,
      name: "Kính mát Oakley Flak 2.0 Prizm Golf",
      brand: "Oakley",
      image:
        "https://images.unsplash.com/photo-1629213287303-4f74fc4aa976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY2x1YiUyMGRyaXZlciUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzczNjI2NjMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: 4500000,
      originalPrice: 5200000,
      rating: 4,
      reviews: 29,
      badge: "sale",
      discount: 13,
    },
  ];
  
