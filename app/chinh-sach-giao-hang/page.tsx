import React from 'react';

import { Header } from '@/components/Header';

export const metadata = {
  title: 'Chính Sách Vận Chuyển - GolfBy',
  description: 'Chính sách vận chuyển và giao nhận hàng hóa của GolfBy',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <article className="max-w-none">
          <div className="page-width page-width--narrow">
            <div className="container">
              <h1 className="main-page-title text-[2.4rem] font-700 mb-6">Chính Sách Vận Chuyển</h1>
              
              <div className="rte text-[1.4rem] leading-[2.1rem] text-muted-foreground space-y-6">
                <h3 className="text-[1.6rem] font-700">Chính sách giao hàng</h3>
                <p>
                  Với mục tiêu mang đến sự tiện lợi và nhanh chóng cho khách hàng khi mua sản phẩm, GolfBy áp dụng chính sách vận chuyển như sau:
                </p>

                <h3 className="text-[1.6rem] font-700">I. QUY ĐỊNH PHẠM VI GIAO HÀNG</h3>
                <p>
                  www.golfby.com.vn phục vụ giao hàng cho Khách hàng trên toàn quốc, ngoại trừ một số khu vực sau:
                </p>

                <div className="overflow-x-auto my-6">
                  <table className="w-full text-left border-collapse min-w-[400px]">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 pr-4 font-700 w-1/3">Tỉnh</th>
                        <th className="py-3 font-700">Quận/Huyện</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-3 pr-4">Đà Nẵng</td>
                        <td className="py-3">Huyện Hoàng Sa</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4">Hải Phòng</td>
                        <td className="py-3">Đảo Bạch Long Vĩ</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4">Khánh Hòa</td>
                        <td className="py-3">Huyện Trường Sa</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4">Kiên Giang</td>
                        <td className="py-3">Huyện Bắc Ái</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4">Ninh Thuận</td>
                        <td className="py-3">Huyện Cồn Cỏ</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-[1.3rem]">
                  (*) Trong các trường hợp có phát sinh dịch bệnh hoặc trong các trường hợp bất khả kháng tại thời điểm phát sinh theo quy định của cơ quan quản lý nhà nước vực giao hàng có thể thay đổi theo quy định của cơ quan quản lý nhà nước phát sinh trong khu vực này, www.golfby.com.vn được quyền từ chối giao hàng.
                </p>
                <p className="text-[1.3rem]">
                  (*) Đơn hàng sẽ được giao tới tận nhà của khách hàng, ngoại trừ các trường hợp như: khu vực văn phòng hạn chế ra vào, khu vực chung cư/ cao tầng (chỉ phục vụ giao tại chân tòa nhà) hoặc bên trong các khu vực hạn chế đi lại (khu vực quân sự, biên giới, …).
                </p>

                <h3 className="text-[1.6rem] font-700">II. QUY ĐỊNH KIỂM TRA HÀNG HÓA KHI GIAO NHẬN</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Khi nhận hàng quý khách có quyền yêu cầu nhân viên giao hàng mở cho kiểm rồi mới nhận hàng.</li>
                  <li>Trường hợp đơn hàng đặt mà bên bán giao không đúng loại sản phẩm quý khách có quyền trả hàng và không không thanh toán tiền.</li>
                  <li>Trường hợp quý khách đã thanh toán trước nhưng đơn hàng không đúng quý khách yêu cầu hoàn tiền hoặc giao lại đơn mới như đã đặt.</li>
                  <li>Trong trường hợp yêu cầu hoàn tiền hoặc đổi đơn quý khách liên hệ qua Email:{' '}
                    <a href="mailto:gbhoangsonltd@gmail.com" className="text-primary font-medium">gbhoangsonltd@gmail.com</a> hoặc số điện thoại{' '}
                    <strong className="font-700">0975642922</strong> chúng tôi cam kết sẽ giải quyết mọi yêu cầu của quý khách.
                  </li>
                </ul>

                <h3 className="text-[1.6rem] font-700">III. QUY ĐỊNH THỜI GIAN GIAO HÀNG</h3>
                <p>Thời gian phục vụ giao hàng:</p>
                <p>Phục vụ giao hàng trong giờ hành chính từ thứ 2 đến thứ 7 (trừ Chủ nhật và ngày Lễ, Tết).</p>

                <div className="overflow-x-auto my-6">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 pr-4 font-700 w-1/2">Khu vực</th>
                        <th className="py-3 font-700">Giao hàng tiêu chuẩn</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-3 pr-4">Nội tỉnh</td>
                        <td className="py-3">7-15 ngày làm việc</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4">Nội vùng</td>
                        <td className="py-3">7-15 ngày làm việc</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4">Liên vùng (giữa 3 thành phố HCM, Hà Nội và Đà Nẵng)</td>
                        <td className="py-3">7-15 ngày làm việc</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4">Liên vùng (từ 3 thành phố lớn HCM, Hà Nội, Đà Nẵng đến các thành phố khác thuộc vùng khác)</td>
                        <td className="py-3">10-20 ngày làm việc</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-[1.3rem]">
                  (**) Chi tiết phân nội thành, ngoại thành: tùy vào từng nhà cung cấp dịch vụ vận chuyển sẽ có cách thức phân nội thành, ngoại thành khác nhau
                </p>

                <p className="font-700">Tại Hà Nội:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Khu vực nội thành:</strong> Quận Ba Đình, Bắc Từ Liêm, Cầu Giấy, Đống Đa, Hà Đông, Hai Bà Trưng, Hoàn Kiếm, Hoàng Mai, Long Biên, Nam Từ Liêm, Tây Hồ, Thanh Xuân.</li>
                  <li><strong>Khu vực ngoại thành:</strong> Huyện Ba Vì, Chương Mỹ, Đan Phượng, Đông Anh, Gia Lâm, Hoài Đức, Mê Linh, Mỹ Đức, Phú Xuyên, Phúc Thọ, Quốc Oai, Sóc Sơn, Thạch Thất, Thanh Oai, Thanh Trì, Thường Tín, Ứng Hòa.</li>
                </ul>

                <p className="font-700">Tại Tp. Hồ Chí Minh:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Khu vực nội thành:</strong> quận 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 Tân Bình, Bình Tân, Tân Phú, Phú Nhuận, Bình Thạnh, Gò Vấp, TP. Thủ Đức (Quận 2 cũ).</li>
                  <li><strong>Khu vực ngoại thành:</strong> Huyện Nhà Bè, Huyện Củ Chi, Huyện Hóc Môn, Huyện Bình Chánh.</li>
                  <li><strong>Khu vực vùng sâu vùng xa phía Nam:</strong> Huyện Cần Giờ.</li>
                </ul>

                <p>Tại các tỉnh, thành phố khác: tùy theo phạm vi quy định của đơn vị giao nhận.</p>

                <h3 className="text-[1.6rem] font-700">IV. QUY ĐỊNH PHÍ GIAO HÀNG</h3>
                
                <h4 className="text-[1.5rem] font-700 mt-4">1. Đối với khu vực Hà Nội, Hồ Chí Minh</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Miễn phí giao hàng</strong> cho các đơn hàng có giá trị <strong>từ 3.000.000 VNĐ trở lên</strong>.</li>
                  <li>Đối với các đơn hàng có giá trị <strong>dưới 3.000.000 VNĐ</strong>, GolfBy sẽ thông báo chi phí vận chuyển sau khi làm việc với đơn vị vận chuyển.</li>
                  <li><strong>Thời gian nhận hàng:</strong> Từ <strong>7 đến 15 ngày</strong> kể từ khi đặt hàng, không bao gồm ngày lễ và cuối tuần</li>
                </ul>

                <h4 className="text-[1.5rem] font-700 mt-4">2. Đối với các khu vực khác</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Miễn phí giao hàng</strong> cho các đơn hàng có giá trị <strong>từ 3.000.000 VNĐ trở lên</strong> và có <strong>kích thước nhỏ gọn</strong>.</li>
                  <li>Với các đơn hàng khác, chi phí vận chuyển sẽ được áp dụng dựa trên bảng giá của đơn vị vận chuyển.</li>
                  <li><strong>Thời gian giao hàng:</strong> Dao động từ <strong>10 đến 20 ngày</strong> kể từ thời điểm đặt hàng, tùy thuộc vào vị trí địa lý và số lượng sản phẩm.</li>
                  <li>Trước khi giao hàng, GolfBy sẽ <strong>liên hệ xác nhận và thông báo chi phí vận chuyển</strong> để khách hàng nắm rõ.</li>
                </ul>

                <p>
                  <strong>Lưu ý:</strong> Chính sách này nhằm đảm bảo dịch vụ giao hàng hiệu quả và minh bạch, đem đến trải nghiệm mua sắm tốt nhất cho quý khách hàng, không bao gồm ngày lễ và cuối tuần.
                </p>

                <p className="font-700 mt-8">
                  Xin cảm ơn Quý Khách Hàng đã tin tưởng và ủng hộ GolfBy!
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
