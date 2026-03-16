import { ImageWithFallback } from '../figma/ImageWithFallback';

interface PromoBannerProps {
  layout: 'two-col' | 'full';
  banners: {
    image: string;
    title: string;
    subtitle: string;
    cta: string;
    align?: 'left' | 'right';
  }[];
}

export function PromoBanner({ layout, banners }: PromoBannerProps) {
  if (layout === 'full' && banners[0]) {
    const b = banners[0];
    return (
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative rounded-3xl overflow-hidden h-[20rem] sm:h-[26rem] md:h-[30rem]">
          <ImageWithFallback src={b.image} alt={b.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-8 sm:px-12 max-w-lg">
              <p
                className="text-white/80 text-[1.3rem] sm:text-[1.4rem] uppercase tracking-wider mb-2"
                style={{ fontWeight: 500 }}
              >
                {b.subtitle}
              </p>
              <h3
                className="text-white text-[2.4rem] sm:text-[3.2rem] md:text-[3.8rem] leading-[1.1] mb-4"
                style={{ fontWeight: 700 }}
              >
                {b.title}
              </h3>
              <button
                className="px-6 py-3 bg-white text-primary rounded-xl text-[1.4rem] hover:bg-primary-light transition-colors shadow-lg"
                style={{ fontWeight: 600 }}
              >
                {b.cta}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid md:grid-cols-2 gap-4 md:gap-5">
        {banners.slice(0, 2).map((b, i) => (
          <div
            key={i}
            className="relative rounded-2xl overflow-hidden h-[20rem] sm:h-[24rem] group cursor-pointer"
          >
            <ImageWithFallback
              src={b.image}
              alt={b.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              className={`absolute inset-0 ${
                i === 0
                  ? 'bg-gradient-to-r from-black/70 via-black/40 to-transparent'
                  : 'bg-gradient-to-l from-black/70 via-black/40 to-transparent'
              }`}
            />
            <div
              className={`absolute inset-0 flex items-center ${
                i === 0 ? 'justify-start pl-8 sm:pl-10' : 'justify-end pr-8 sm:pr-10'
              }`}
            >
              <div className={`${i === 1 ? 'text-right' : ''}`}>
                <p
                  className="text-white/70 text-[1.2rem] sm:text-[1.3rem] uppercase tracking-wider mb-1"
                  style={{ fontWeight: 500 }}
                >
                  {b.subtitle}
                </p>
                <h3
                  className="text-white text-[2.0rem] sm:text-[2.6rem] leading-tight mb-3"
                  style={{ fontWeight: 700 }}
                >
                  {b.title}
                </h3>
                <button
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-[1.3rem] transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  {b.cta}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
