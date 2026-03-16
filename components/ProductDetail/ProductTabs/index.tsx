'use client';

import { useState } from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface ProductTabsProps {
  tabs: Tab[];
}

function ProductTabs({ tabs }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      {/* Tab Headers */}
      <div className="border-b border-border">
        <div className="flex gap-0 overflow-x-auto">
          {tabs.map((tab, idx) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(idx)}
              className={`px-6 py-3.5 text-[14px] whitespace-nowrap relative transition-colors ${
                activeTab === idx
                  ? 'text-primary font-600'
                  : 'text-muted-foreground hover:text-foreground font-500'
              }`}
            >
              {tab.label}
              {activeTab === idx && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-8">{tabs[activeTab].content}</div>
    </div>
  );
}

/* Tab content components */

function ProductDescriptionTab() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h3 className="text-[18px] text-foreground mb-4 font-700">Thông tin sản phẩm</h3>
        <p className="text-[14px] text-primary mb-3 uppercase font-700">
          TRÌNH LÀNG SIÊU PHẨM: FAIRWAY WOODS HONMA BERES 10 (3 SAO) — TRỢ THỦ ĐẮC LỰC TRÊN FAIRWAY
        </p>
      </div>

      <div className="space-y-4 text-[14px] text-muted-foreground leading-[1.8]">
        <p>
          Trong thế giới Golf, khoảng cách từ Fairway đến Green luôn là thử thách lớn nhất đối với phần đông.{' '}
          <span className="text-foreground font-600">Honma Beres 10 (3 Sao)</span> xuất hiện không chỉ đơn
          thuần là một sản phẩm bán mới, mà là một xu hướng cho tương đăm đặt một giá trị hướng hội tụ sự tinh
          tế của nghệ nhân dập tay Nhật và sức mạnh của công nghệ tiên tiến.
        </p>
        <p>
          Được chế tác tại xưởng Sakata (Nhật Bản), mỗi chiếc gậy Fairway Wood Honma Beres 10 mang trên mình
          tinh thần Takumi — nghệ thuật tinh hoa. Với mặt gậy làm từ Maraging Steel cao cấp, chiếc gậy mang
          đến cảm giác êm ái, tiếng hit đặc trưng và khoảng cách ấn tượng.
        </p>
        <p>
          <span className="text-foreground font-600">Đặc điểm nổi bật:</span>
        </p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li>
            Mặt gậy <span className="text-foreground font-600">Maraging Steel</span> — cho độ nảy tối đa và
            cảm giác mềm mại khi tiếp bóng
          </li>
          <li>
            Crown siêu nhẹ bằng <span className="text-foreground font-600">Carbon Composite</span> — hạ trọng
            tâm, tăng MOI
          </li>
          <li>
            Hệ thống trọng lực <span className="text-foreground font-600">Non-Rotating System (NRS)</span> —
            ổn định hướng bóng
          </li>
          <li>
            Shaft <span className="text-foreground font-600">ARMRQ MX Graphite</span> — nhẹ, bền, tối ưu tốc
            độ swing
          </li>
          <li>
            Grip chính hãng <span className="text-foreground font-600">Honma Original</span> — cầm nắm chắc
            chắn, êm tay
          </li>
        </ul>
      </div>

      <div className="bg-muted rounded-xl p-5 space-y-3">
        <p className="text-[14px] text-foreground font-600">Thông số kỹ thuật:</p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-[13px]">
          {[
            ['Loft', '15° / 18° / 21°'],
            ['Lie', '58° / 59° / 60°'],
            ['Volume', '170cc / 160cc / 150cc'],
            ['Shaft', 'ARMRQ MX Graphite'],
            ['Flex', 'R / S / SR'],
            ['Trọng lượng', '310g - 320g'],
            ['Chiều dài', '42.5" / 41.5" / 40.5"'],
            ['Xuất xứ', 'Nhật Bản'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">{label}</span>
              <span className="text-foreground font-500">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Read More */}
      <button className="flex items-center gap-2 mx-auto px-6 py-2.5 border-2 border-border rounded-xl text-[14px] text-foreground hover:border-primary hover:text-primary transition-colors font-500">
        Đọc Thêm
      </button>
    </div>
  );
}

function ShippingPolicyTab() {
  return (
    <div className="max-w-3xl space-y-5 text-[14px] text-muted-foreground leading-[1.8]">
      <h3 className="text-[18px] text-foreground font-700">Chính sách giao hàng và trả hàng</h3>

      <div className="space-y-4">
        <div>
          <p className="text-foreground mb-2 font-600">1. Giao hàng</p>
          <ul className="list-disc list-inside space-y-1.5 ml-2">
            <li>Miễn phí giao hàng cho đơn từ 5.000.000 VNĐ trong nội thành TP.HCM và Hà Nội</li>
            <li>Phí giao hàng cho đơn dưới 5.000.000 VNĐ: 30.000 VNĐ - 50.000 VNĐ tùy khu vực</li>
            <li>Thời gian giao hàng: 1-3 ngày (nội thành) | 3-7 ngày (tỉnh thành khác)</li>
            <li>Hỗ trợ giao hàng nhanh trong 24h (phụ thu 50.000 VNĐ)</li>
          </ul>
        </div>

        <div>
          <p className="text-foreground mb-2 font-600">2. Chính sách đổi trả</p>
          <ul className="list-disc list-inside space-y-1.5 ml-2">
            <li>Đổi trả miễn phí trong vòng 7 ngày nếu sản phẩm lỗi do nhà sản xuất</li>
            <li>Sản phẩm đổi trả phải còn nguyên tem, nhãn, bao bì và chưa qua sử dụng</li>
            <li>Không áp dụng đổi trả với sản phẩm đã qua sử dụng hoặc hư hỏng do người dùng</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function PaymentPolicyTab() {
  return (
    <div className="max-w-3xl space-y-5 text-[14px] text-muted-foreground leading-[1.8]">
      <h3 className="text-[18px] text-foreground font-700">Chính sách thanh toán</h3>

      <div className="space-y-4">
        <div>
          <p className="text-foreground mb-2 font-600">Phương thức thanh toán</p>
          <ul className="list-disc list-inside space-y-1.5 ml-2">
            <li>Thanh toán khi nhận hàng (COD) — Áp dụng cho đơn dưới 10.000.000 VNĐ</li>
            <li>Chuyển khoản ngân hàng — BIDV / Vietcombank / Techcombank</li>
            <li>Thanh toán qua ví điện tử: MoMo, ZaloPay, VNPay</li>
            <li>Thanh toán trả góp qua thẻ tín dụng (0% lãi suất, 3-12 tháng)</li>
          </ul>
        </div>

        <div>
          <p className="text-foreground mb-2 font-600">Lưu ý</p>
          <ul className="list-disc list-inside space-y-1.5 ml-2">
            <li>Đối với sản phẩm trên 10.000.000 VNĐ, yêu cầu đặt cọc tối thiểu 25%</li>
            <li>Hóa đơn VAT được xuất theo yêu cầu</li>
            <li>Giá đã bao gồm thuế VAT</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export { ProductTabs, PaymentPolicyTab, ShippingPolicyTab, ProductDescriptionTab };
