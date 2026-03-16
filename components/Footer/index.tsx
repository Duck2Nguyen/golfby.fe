import { Mail, Phone, Clock, MapPin } from 'lucide-react';

import Link from 'next/link';

const shopLinks = ['Gậy Golf', 'Túi Golf', 'Bóng Golf', 'Phụ Kiện Golf', 'Thời Trang Golf', 'Xe Golf'];

const policyLinks = [
  'Chính sách đổi trả',
  'Chính sách bảo hành',
  'Chính sách vận chuyển',
  'Hướng dẫn mua hàng',
  'Phương thức thanh toán',
];

const supportLinks = [
  'Câu hỏi thường gặp',
  'Tư vấn chọn gậy',
  'Hệ thống cửa hàng',
  'Chương trình thành viên',
  'Liên hệ hợp tác',
];

export function Footer() {
  return (
    <footer className="bg-[#1a2e15] text-white">
      <div className="max-w-7xl mx-auto px-4 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-[1.6rem]" style={{ fontWeight: 700 }}>
                  G
                </span>
              </div>
              <span className="text-[1.8rem]" style={{ fontWeight: 700 }}>
                GolfStore
              </span>
            </div>
            <p className="text-white/60 text-[1.3rem] leading-relaxed mb-5">
              Hệ thống phân phối dụng cụ golf chính hãng hàng đầu Việt Nam. Cam kết chất lượng, giá tốt nhất
              thị trường.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-white/70 text-[1.3rem]">123 Nguyễn Huệ, Q.1, TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span className="text-white/70 text-[1.3rem]">1900 1234</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span className="text-white/70 text-[1.3rem]">info@golfstore.vn</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span className="text-white/70 text-[1.3rem]">08:00 - 21:00 (T2 - CN)</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-[1.5rem] mb-4 pb-2 border-b border-white/10" style={{ fontWeight: 600 }}>
              Sản Phẩm
            </h4>
            <ul className="space-y-2.5">
              {shopLinks.map(link => (
                <li key={link}>
                  <Link href="#" className="text-white/60 text-[1.3rem] hover:text-primary transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy Links */}
          <div>
            <h4 className="text-[1.5rem] mb-4 pb-2 border-b border-white/10" style={{ fontWeight: 600 }}>
              Chính Sách
            </h4>
            <ul className="space-y-2.5">
              {policyLinks.map(link => (
                <li key={link}>
                  <Link href="#" className="text-white/60 text-[1.3rem] hover:text-primary transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[1.5rem] mb-4 pb-2 border-b border-white/10" style={{ fontWeight: 600 }}>
              Hỗ Trợ
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map(link => (
                <li key={link}>
                  <Link href="#" className="text-white/60 text-[1.3rem] hover:text-primary transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-[1.2rem]">© 2026 GolfStore. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {['Facebook', 'Instagram', 'YouTube', 'Zalo'].map(s => (
              <Link
                key={s}
                href="#"
                className="text-white/40 text-[1.2rem] hover:text-primary transition-colors"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
