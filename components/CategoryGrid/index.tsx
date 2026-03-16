import Link from 'next/link';

import { ImageWithFallback } from '../figma/ImageWithFallback';

const categories = [
  {
    name: 'Gậy Driver',
    image:
      'https://images.unsplash.com/photo-1629213287303-4f74fc4aa976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY2x1YiUyMGRyaXZlciUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzczNjI2NjMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    count: '128 sản phẩm',
  },
  {
    name: 'Gậy Iron Set',
    image:
      'https://images.unsplash.com/photo-1761233976530-d09fc58ad175?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwaXJvbiUyMGNsdWIlMjBzZXR8ZW58MXx8fHwxNzczNjI2NjMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    count: '96 sản phẩm',
  },
  {
    name: 'Gậy Putter',
    image:
      'https://images.unsplash.com/photo-1542770914-5773ed8acbaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwcHV0dGVyJTIwZ3JlZW58ZW58MXx8fHwxNzczNjI2NjMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    count: '74 sản phẩm',
  },
  {
    name: 'Túi Golf',
    image:
      'https://images.unsplash.com/photo-1693163532134-5ea6c80b58a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwYmFnJTIwZXF1aXBtZW50fGVufDF8fHx8MTc3MzYyNjYzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    count: '52 sản phẩm',
  },
  {
    name: 'Bóng Golf',
    image:
      'https://images.unsplash.com/photo-1642235733613-ccba5328fb3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwYmFsbHMlMjB3aGl0ZSUyMHRlZXxlbnwxfHx8fDE3NzM2MjY2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    count: '45 sản phẩm',
  },
  {
    name: 'Phụ Kiện',
    image:
      'https://images.unsplash.com/photo-1653868250317-144a0c4f5884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwYWNjZXNzb3JpZXMlMjBnbG92ZXMlMjBzaG9lc3xlbnwxfHx8fDE3NzM2MjY2MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    count: '210 sản phẩm',
  },
];

export function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-[2.6rem] sm:text-[3.0rem] text-foreground mb-2" style={{ fontWeight: 700 }}>
          Danh Mục Sản Phẩm
        </h2>
        <p className="text-muted-foreground text-[1.5rem]">
          Khám phá đầy đủ trang thiết bị golf từ cơ bản đến chuyên nghiệp
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(cat => (
          <Link
            key={cat.name}
            href="#"
            className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer"
          >
            <ImageWithFallback
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white text-[1.5rem] mb-0.5" style={{ fontWeight: 600 }}>
                {cat.name}
              </h3>
              <p className="text-white/70 text-[1.2rem]">{cat.count}</p>
            </div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary rounded-2xl transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  );
}
