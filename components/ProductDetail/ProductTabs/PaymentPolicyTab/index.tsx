'use client';

function PaymentPolicyTab() {
  return (
    <div className="mx-auto max-w-[124rem] space-y-12 text-[1.4rem] leading-[2.3rem] text-[#5D5D5D]">
      <section className="space-y-4">
        <h3 className="text-[2.2rem] font-700 text-[#2B2B2B]">I - Quy định chung</h3>
        <ol className="pl-5 list-decimal space-y-3">
          <li>Mục đích: thông báo về các hình thức thanh toán của website www.golfby.com.vn đang áp dụng.</li>
          <li>Phạm vi áp dụng: dành cho tất cả các khách hàng mua sắm tại website www.golfby.com.vn.</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h4 className="text-[1.55rem] font-700 uppercase tracking-[0.04em] text-[#3B3B3B]">
          II - Nội dung quy định
        </h4>
        <p>
          Nhằm mang đến trải nghiệm mua sắm toàn diện cho quý khách hàng, www.golfby.com.vn đưa ra các hình
          thức thanh toán tiện lợi như sau:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Thanh toán trực tiếp khi nhận hàng (COD) — Áp dụng cho đơn hàng nội địa dưới hạn mức quy định.
          </li>
          <li>
            Chuyển khoản ngân hàng — Hỗ trợ các ngân hàng lớn: BIDV, Vietcombank, Techcombank (thông tin sẽ
            hiển thị ở trang thanh toán).
          </li>
          <li>
            Thanh toán qua ví điện tử: MoMo, ZaloPay, VNPay — Quý khách làm theo hướng dẫn trên cổng thanh
            toán.
          </li>
        </ul>
      </section>

      <p className="text-[1.3rem] text-[#3A3A3A]">
        Xin cảm ơn Quý Khách Hàng đã sử dụng dịch vụ và tin tưởng GolfBy.
      </p>
    </div>
  );
}

export default PaymentPolicyTab;
