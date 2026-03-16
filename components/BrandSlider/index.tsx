const brands = [
  "Titleist",
  "Callaway",
  "TaylorMade",
  "Ping",
  "Mizuno",
  "Bridgestone",
  "Cobra",
  "Cleveland",
];

export function BrandSlider() {
  return (
    <section className="bg-muted border-y border-border">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground text-[1.3rem] mb-6 uppercase tracking-widest" style={{ fontWeight: 500 }}>
          Thương hiệu đối tác
        </p>
        <div className="flex items-center justify-center flex-wrap gap-8 md:gap-14">
          {brands.map((brand) => (
            <div
              key={brand}
              className="group cursor-pointer transition-all"
            >
              <span
                className="text-[1.8rem] md:text-[2.2rem] text-muted-foreground/40 group-hover:text-primary transition-colors tracking-tight select-none"
                style={{ fontWeight: 700 }}
              >
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
