'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { ImageWithFallback } from '../figma/ImageWithFallback';

const slides = [
  {
    image:
      'https://images.unsplash.com/photo-1768396747921-5a18367415d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY291cnNlJTIwYWVyaWFsJTIwZ3JlZW4lMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzczNjI2NjMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    subtitle: 'Bộ sưu tập mới 2026',
    title: 'Nâng Tầm Cuộc Chơi',
    description: 'Khám phá dòng gậy golf cao cấp từ các thương hiệu hàng đầu thế giới',
    cta: 'Khám phá ngay',
  },
  {
    image:
      'https://images.unsplash.com/photo-1763916847372-fbfabd2420cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmZXIlMjBzd2luZ2luZyUyMHN1bnNldCUyMHNpbGhvdWV0dGV8ZW58MXx8fHwxNzczNjI2NjMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    subtitle: 'Khuyến mãi đặc biệt',
    title: 'Giảm Đến 50%',
    description: 'Ưu đãi cực lớn cho toàn bộ phụ kiện và thời trang golf',
    cta: 'Mua ngay',
  },
  {
    image:
      'https://images.unsplash.com/photo-1746631835089-dffbea45a365?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY2FydCUyMGNvdXJzZSUyMG1vcm5pbmd8ZW58MXx8fHwxNzczNjI2NjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    subtitle: 'Thành viên mới',
    title: 'Ưu Đãi Chào Mừng',
    description: 'Đăng ký ngay để nhận voucher giảm 10% cho đơn hàng đầu tiên',
    cta: 'Đăng ký ngay',
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => setCurrent(index);
  const goPrev = () => setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setCurrent(prev => (prev + 1) % slides.length);

  return (
    <section className="relative w-full h-[32rem] sm:h-[42rem] md:h-[52rem] lg:h-[56rem] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <ImageWithFallback src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 w-full">
              <div className="max-w-lg">
                <span
                  className="inline-block px-4 py-1.5 bg-primary/90 text-white text-[1.3rem] rounded-full mb-4 tracking-wide uppercase"
                  style={{ fontWeight: 600 }}
                >
                  {slide.subtitle}
                </span>
                <h1
                  className="text-white text-[3.2rem] sm:text-[4.2rem] md:text-[5.2rem] mb-3 leading-[1.1]"
                  style={{ fontWeight: 700 }}
                >
                  {slide.title}
                </h1>
                <p className="text-white/80 text-[1.5rem] sm:text-[1.7rem] mb-6 leading-relaxed max-w-md">
                  {slide.description}
                </p>
                <button
                  className="px-7 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-[1.5rem] transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
                  style={{ fontWeight: 600 }}
                >
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm hover:bg-white/30 text-white flex items-center justify-center transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm hover:bg-white/30 text-white flex items-center justify-center transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === current ? 'w-8 bg-primary' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
