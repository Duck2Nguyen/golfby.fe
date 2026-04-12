import { Star, Truck, Warehouse, CircleHelp, ShieldCheck } from 'lucide-react';

const reasons = [
  {
    description: 'Kiểm tra sản phẩm kỹ lưỡng và tìm nguồn hàng giá rẻ',
    icon: Star,
    title: 'Chất lượng và giá rẻ',
  },
  {
    description: 'Tìm kiếm giải pháp giao hàng an toàn toàn quốc',
    icon: Warehouse,
    title: 'Vận chuyển toàn quốc',
  },
  {
    description: 'Vận chuyển ngay khi hàng về',
    icon: Truck,
    title: 'Vận chuyển nhanh',
  },
  {
    description: 'Các cổng thanh toán được bảo mật và thông tin được bảo vệ',
    icon: ShieldCheck,
    title: 'An ninh thanh toán',
  },
  {
    description: 'Đội ngũ chúng tôi luôn sẵn sàng giải đáp thắc mắc của bạn',
    icon: CircleHelp,
    title: 'Cần giải đáp thắc mắc?',
  },
];

export default function WhyChooseGolfBy() {
  return (
    <section className="bg-[#ebebeb] px-4 py-5 md:py-8 xl:py-10">
      <div className="mx-auto w-full max-w-[160rem]">
        <h2 className="mb-5 text-center text-[2rem] font-700 leading-[2.8rem] text-[#222222] md:mb-8 md:text-[3.2rem] md:leading-[4rem] xl:text-[3rem] xl:leading-[3.8rem]">
          Tại Sao Lại Chọn GolfBy?
        </h2>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-5">
          {reasons.map(reason => {
            const Icon = reason.icon;

            return (
              <article
                key={reason.title}
                className="flex min-h-[16rem] flex-col items-center justify-center rounded-[0.8rem] bg-[#f3f3f3] px-4 py-5 text-center md:min-h-[22rem] md:px-5 md:py-7"
              >
                <Icon className="mb-3 h-[3.2rem] w-[3.2rem] text-[#3f8f2f] md:mb-5 md:h-[4rem] md:w-[4rem]" strokeWidth={2.3} />
                <h3 className="mb-2 text-[1.5rem] font-700 leading-[2rem] text-[#2f2f2f] md:text-[1.8rem] md:leading-[2.4rem]">
                  {reason.title}
                </h3>
                <p className="text-[1.4rem] font-400 leading-[2rem] text-[#4b4b4b] md:text-[1.6rem] md:leading-[2.4rem]">
                  {reason.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
