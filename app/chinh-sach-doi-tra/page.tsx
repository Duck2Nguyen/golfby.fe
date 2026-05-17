import React from 'react';

import { Header } from '@/components/Header';

export const metadata = {
  title: 'Chính Sách Đổi Trả - GolfBy',
  description: 'Chính sách đổi trả sản phẩm của GolfBy',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <article className="max-w-none">
          <div className="page-width page-width--narrow">
            <div className="container">
              <h1 className="main-page-title text-[2.4rem] font-700 mb-6">Chính Sách Đổi Trả</h1>
              
              <div className="rte text-[1.4rem] leading-[2.1rem] text-muted-foreground space-y-6">
                <h3 className="text-[1.6rem] font-700">Trả hàng</h3>
                
                <p>
                  Nhằm hỗ trợ Quý Khách Hàng trong quá trình sử dụng sản phẩm, GolfBy xin gửi đến quý khách chính sách đổi hàng như sau (áp dụng cho cả đơn hàng online và tại cửa hàng):
                </p>

                <ol className="list-decimal pl-6 space-y-2">
                  <li>Hàng <strong>đã mua</strong> không được trả lại.</li>
                  <li>Khách hàng có thể đổi sản phẩm một lần duy nhất trong vòng 07 ngày kể từ ngày mua hàng, với điều kiện:
                    <ul className="list-[circle] pl-6 mt-1 space-y-1">
                      <li>Không áp dụng cho các sản phẩm trong chương trình khuyến mãi.</li>
                    </ul>
                  </li>
                  <li>Điều kiện áp dụng chính sách đổi hàng:
                    <ul className="list-[circle] pl-6 mt-1 space-y-1">
                      <li>Sản phẩm phải còn giữ hóa đơn bán hàng.</li>
                      <li>Sản phẩm phải còn nguyên nhãn mác, tem giá.</li>
                      <li>Sản phẩm không bị dơ bẩn, hư hỏng do tác động bên ngoài sau khi rời khỏi cửa hàng.</li>
                    </ul>
                  </li>
                  <li>Sản phẩm mua tại cửa hàng có thể đổi tại bất kỳ cửa hàng nào thuộc hệ thống GolfBy trên toàn quốc.</li>
                  <li>Sản phẩm đổi phải có giá trị bằng hoặc cao hơn sản phẩm đã mua:
                    <ul className="list-[circle] pl-6 mt-1 space-y-1">
                      <li>Trường hợp sản phẩm đổi có giá trị thấp hơn, GolfBy <strong>không</strong> hoàn trả phần tiền chênh lệch</li>
                    </ul>
                  </li>
                </ol>

                <p className="font-700">
                  Khách hàng vui lòng quay video đồng kiểm với shipper khi nhận hàng. GOLFBY sẽ không chịu trách nhiệm xử lí vấn đề nếu không có video để đối chiếu.
                </p>

                <p>
                  Rất mong Quý Khách Hàng thông cảm và tuân thủ chính sách để trải nghiệm mua sắm được tốt nhất!
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
