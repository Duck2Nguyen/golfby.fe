import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Miễn phí giao hàng",
    desc: "Cho đơn hàng từ 2 triệu",
  },
  {
    icon: ShieldCheck,
    title: "Hàng chính hãng",
    desc: "Cam kết 100% authentic",
  },
  {
    icon: RotateCcw,
    title: "Đổi trả 30 ngày",
    desc: "Miễn phí, không rủi ro",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    desc: "Tư vấn chuyên nghiệp",
  },
];

export function Features() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="flex items-center gap-4 p-5 rounded-2xl bg-secondary/60 border border-primary/10 hover:bg-secondary hover:border-primary/20 transition-all group"
          >
            <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
              <f.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-foreground text-[1.4rem]" style={{ fontWeight: 600 }}>
                {f.title}
              </p>
              <p className="text-muted-foreground text-[1.2rem]">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
