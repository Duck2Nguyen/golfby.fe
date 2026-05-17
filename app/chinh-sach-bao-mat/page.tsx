import React from 'react';

import { Header } from '@/components/Header';

export const metadata = {
  title: 'Chính Sách Bảo Mật - GolfBy',
  description: 'Chính sách bảo mật thông tin khách hàng tại GolfBy',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <article className="max-w-none">
          <div className="page-width page-width--narrow">
            <div className="container">
              <h1 className="main-page-title text-[2.4rem] font-700 mb-6">Chính Sách Bảo Mật</h1>
              
              <div className="rte text-[1.4rem] leading-[2.1rem] text-muted-foreground space-y-6">
                <h3 className="text-[1.6rem] font-700 uppercase">I. CHÍNH SÁCH BẢO MẬT THÔNG TIN:</h3>
                
                <div>
                  <p className="font-700">1. Mục đích thu thập thông tin cá nhân</p>
                  <p>Mục đích của việc thu thập thông tin khách hàng nhằm liên quan đến các vấn đề như:</p>
                  <p>- Hỗ trợ khách hàng: mua hàng, thanh toán, giao hàng.</p>
                  <p>- Cung cấp thông tin sản phẩm, các dịch vụ và hỗ trợ theo yêu cầu của khách hàng.</p>
                  <p>- Gửi thông báo các chương trình, sản phẩm mới nhất của chúng tôi.</p>
                  <p>- Giải quyết vấn đề phát sinh khi mua hàng.</p>
                </div>

                <div>
                  <p className="font-700">2. Phạm vi thu thập thông tin</p>
                  <p>Chúng tôi thu thập thông tin cá nhân của khách hàng khi tiến hàng đặt hàng trên website bao gồm : Họ tên ; Địa chỉ email ; Số điện thoại ; Địa chỉ.</p>
                </div>

                <div>
                  <p className="font-700">3. Thời gian lưu trữ thông tin</p>
                  <p>Dữ liệu cá nhân của khách hàng sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ hoặc tự khách hàng đăng nhập và thực hiện hủy bỏ. Còn lại trong mọi trường hợp thông tin cá nhân khách hàng sẽ được bảo mật trên máy chủ của golfby.com.vn</p>
                </div>

                <div>
                  <p className="font-700">4. Những người hoặc tổ chức có thể được tiếp cận với thông tin đó</p>
                  <p>– Đối với các bên vận chuyển, sẽ cung cấp các thông tin để phục vụ cho việc giao nhận hàng hóa như Tên, địa chỉ và số điện thoại.</p>
                  <p>– Đối với nhân viên công ty sẽ có các bộ phận chuyên trách để phục vụ việc chăm sóc khách hàng trong quá trình sử dụng sản phẩm.</p>
                  <p>– Các chương trình có tính liên kết, đồng thực hiện, thuê ngoài cho các mục đích được nêu tại Mục 1 và luôn áp dụng các yêu cầu bảo mật thông tin cá nhân.</p>
                  <p>– Yêu cầu pháp lý: Chúng tôi có thể tiết lộ các thông tin cá nhân nếu điều đó do luật pháp yêu cầu và việc tiết lộ như vậy là cần thiết một cách hợp lý để tuân thủ các quy trình pháp lý.</p>
                  <p>Chuyển giao kinh doanh (nếu có): trong trường hợp sáp nhập, hợp nhất toàn bộ hoặc một phần với công ty khác, người mua sẽ có quyền truy cập thông tin được chúng tôi lưu trữ, duy trì trong đó bao gồm cả thông tin cá nhân.</p>
                </div>

                <div>
                  <p className="font-700">5. Địa chỉ của đơn vị thu thập và quản lý thông tin</p>
                  <p>- Tên doanh nghiệp: CÔNG TY TNHH THƯƠNG MẠI GB HOÀNG SƠN</p>
                  <p>– Thành lập và hoạt động theo Giấy chứng nhận đăng ký doanh nghiệp số: 0110944804 do Sở Kế hoạch và Đầu tư thành phố Hà Nội cấp ngày 23 tháng 02 năm 2025.</p>
                  <p>– Trụ sở chính: Toà nhà ADANA Complex, Lô 3, Khu A1-A2-A3, đường Cổ Linh, Phường Cự Khối, Quận Long Biên, Thành phố Hà Nội, Việt Nam</p>
                </div>

                <div>
                  <p className="font-700">6. Phương thức và công cụ để người dùng tiếp cận và chỉnh sửa dữ liệu:</p>
                  <p>Nếu quý khách có bất cứ về yêu cầu nào về việc tiếp cận và chỉnh sửa thông tin cá nhân đã cung cấp, quý khách có thể:</p>
                  <p>- Gọi điện trực tiếp về số điện thoại: 0975642922</p>
                  <p>- Gửi mail: gbhoangsonltd@gmail.com</p>
                  
                  <p className="mt-4">*Cơ chế tiếp nhận và giải quyết khiếu nại của người tiêu dùng liên quan đến việc thông tin cá nhân bị sử dụng sai mục đích hoặc phạm vi đã thông báo:</p>
                  <p>
                    Tại golfby.com.vn, việc bảo vệ thông tin cá nhân của bạn là rất quan trọng, bạn được đảm bảo rằng thông tin cung cấp cho chúng tôi sẽ được mật golfby.com.vn cam kết không chia sẻ, bán hoặc cho thuê thông tin cá nhân của bạn cho bất kỳ người nào khác. golfby.com.vn cam kết chỉ sử dụng các thông tin của bạn vào các trường hợp sau:
                  </p>
                  <p>– Nâng cao chất lượng dịch vụ dành cho khách hàng</p>
                  <p>– Giải quyết các tranh chấp, khiếu nại trong vòng 3 ngày sau khi nhận được thông tin.</p>
                  <p>– Khi cơ quan pháp luật có yêu cầu.</p>
                  <p className="mt-4">
                    golfby.com.vn hiểu rằng quyền lợi của bạn trong việc bảo vệ thông tin cá nhân cũng chính là trách nhiệm của chúng tôi nên trong bất kỳ trường hợp có thắc mắc, góp ý nào liên quan đến chính sách bảo mật của golfby.com.vn, và liên quan đến việc thông tin cá nhân bị sử dụng sai mục đích hoặc phạm vi đã thông báo vui lòng liên hệ qua số hotline 0975642922 hoặc email: gbhoangsonltd@gmail.com để xử lý và làm việc trực tiếp với khách hàng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
