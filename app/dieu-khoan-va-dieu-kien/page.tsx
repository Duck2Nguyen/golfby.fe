import React from 'react';

import { Link } from '@heroui/link';

import { Header } from '@/components/Header';

export const metadata = {
  title: 'Điều Khoản Và Điều Kiện - GolfBy',
  description: 'Điều khoản và điều kiện sử dụng dịch vụ GolfBy',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <article className="max-w-none">
          <div className="page-width page-width--narrow">
            <div className="container">
              <h1 className="main-page-title text-[2.4rem] font-700 mb-6">Điều Khoản Và Điều Kiện</h1>
              <div className="rte text-[1.4rem] leading-[2.1rem] text-muted-foreground space-y-6">
                <p>
                  Khi Quý khách hàng truy cập vào trang website của chúng tôi có nghĩa là Quý khách đồng ý với
                  các điều khoản này. Trang web có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần
                  nào trong Điều khoản mua bán hàng hóa này, vào bất cứ lúc nào. Các thay đổi có hiệu lực ngay
                  khi được đăng trên trang web mà không cần thông báo trước. Và khi Quý khách tiếp tục sử dụng
                  trang web, sau khi các thay đổi về Điều khoản này được đăng tải, có nghĩa là quý khách chấp
                  nhận với những thay đổi đó. Quý khách vui lòng kiểm tra thường xuyên để cập nhật những thay
                  đổi của GOLFBY.
                </p>

                <h3 className="text-[1.6rem] font-700">1. Điều Khoản Sử Dụng Website:</h3>
                <p>
                  Quý khách hàng sẽ phải đăng ký tài khoản với thông tin xác thực về bản thân và phải cập nhật
                  nếu có bất kỳ thay đổi nào. Mỗi người truy cập phải có trách nhiệm với mật khẩu, tài khoản
                  và hoạt động của mình trên web. Hơn nữa, Quý khách hàng phải thông báo cho chúng tôi biết
                  khi tài khoản bị truy cập trái phép. Chúng tôi không chịu bất kỳ trách nhiệm nào, dù trực
                  tiếp hay gián tiếp, đối với những thiệt hại hoặc mất mát gây ra do quý khách không tuân thủ
                  quy định.
                </p>
                <p>
                  Nghiêm cấm sử dụng bất kỳ phần nào của trang web này với mục đích thương mại hoặc nhân danh
                  bất kỳ đối tác thứ ba nào nếu không được chúng tôi cho phép bằng văn bản. Nếu vi phạm bất cứ
                  điều nào trong đây, chúng tôi sẽ hủy tài khoản của khách mà không cần báo trước.
                </p>
                <p>
                  Trong suốt quá trình đăng ký, quý khách đồng ý nhận email quảng cáo từ website. Nếu không
                  muốn tiếp tục nhận mail, quý khách có thể từ chối bằng cách nhấp vào đường link ở dưới cùng
                  trong mọi email quảng cáo.
                </p>

                <h3 className="text-[1.6rem] font-700">2. Ý kiến của khách hàng:</h3>
                <p>
                  Tất cả nội dung trang web và ý kiến phê bình của quý khách đều là tài sản của chúng tôi. Nếu
                  chúng tôi phát hiện bất kỳ thông tin giả mạo nào, chúng tôi sẽ khóa tài khoản của quý khách
                  ngay lập tức hoặc áp dụng các biện pháp khác theo quy định của pháp luật Việt Nam.
                </p>

                <h3 className="text-[1.6rem] font-700">3. Chấp nhận đơn hàng và giá cả:</h3>
                <p>
                  Chúng tôi có quyền từ chối hoặc hủy đơn hàng của quý khách vì bất kỳ lý do gì liên quan đến
                  lỗi kỹ thuật, hệ thống một cách khách quan vào bất kỳ lúc nào.
                </p>
                <p>
                  Chúng tôi cam kết sẽ cung cấp thông tin giá cả chính xác nhất cho người tiêu dùng. Tuy
                  nhiên, đôi lúc vẫn có sai sót xảy ra, ví dụ như trường hợp giá sản phẩm không hiển thị chính
                  xác trên trang web hoặc sai giá, tùy theo từng trường hợp chúng tôi sẽ liên hệ hướng dẫn
                  hoặc thông báo hủy đơn hàng đó cho quý khách. Chúng tôi cũng có quyền từ chối hoặc hủy bỏ
                  bất kỳ đơn hàng nào dù đơn hàng đó đã hay chưa được xác nhận hoặc đã thanh toán.
                </p>

                <h3 className="text-[1.6rem] font-700">4. Thay đổi hoặc hủy bỏ giao dịch tại GOLFBY:</h3>
                <p>
                  Trong mọi trường hợp, khách hàng đều có quyền chấm dứt giao dịch nếu đã thực hiện các biện
                  pháp sau đây:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Thông báo cho GOLFBY về việc hủy giao dịch qua đường dây nóng (hotline){' '}
                    <strong>(+84) 889 686 8833</strong> hoặc email{' '}
                    <a href="mailto:gbhoangsonltd@gmail.com" className="text-primary">
                      gbhoangsonltd@gmail.com
                    </a>
                  </li>
                  <li>
                    Trả lại hàng hoá đã nhận nhưng chưa sử dụng hoặc hưởng bất kỳ lợi ích nào từ hàng hóa đó
                    (theo quy định của Chính sách đổi trả của GOLFBY,{' '}
                    <Link href="/chinh-sach-doi-tra" className="text-primary text-[1.4rem]">
                      xem tại đây
                    </Link>
                    ).
                  </li>
                </ul>

                <h3 className="text-[1.6rem] font-700">
                  5. Giải quyết hậu quả do lỗi nhập sai thông tin tại GOLFBY:
                </h3>
                <p>
                  Khách hàng có trách nhiệm cung cấp thông tin đầy đủ và chính xác khi tham gia giao dịch tại
                  GOLFBY. Trong trường hợp khách hàng nhập sai thông tin và gửi vào trang TMĐT{' '}
                  <a href="https://www.golfby.com.vn" className="text-primary">
                    https://www.golfby.com.vn
                  </a>
                  , GOLFBY có quyền từ chối thực hiện giao dịch. Ngoài ra, trong mọi trường hợp, khách hàng
                  đều có quyền đơn phương chấm dứt giao dịch nếu đã thực hiện các biện pháp sau đây:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Thông báo cho GOLFBY về việc hủy giao dịch qua đường dây nóng (hotline){' '}
                    <strong>(+84) 889 686 8833</strong> hoặc email{' '}
                    <a href="mailto:gbhoangsonltd@gmail.com" className="text-primary">
                      gbhoangsonltd@gmail.com
                    </a>
                  </li>
                  <li>
                    Trả lại hàng hoá đã nhận nhưng chưa sử dụng hoặc hưởng bất kỳ lợi ích nào từ hàng hóa đó.
                  </li>
                  <li>
                    Trong trường hợp sai thông tin phát sinh từ phía GOLFBY mà GOLFBY có thể chứng minh đó là
                    lỗi của hệ thống hoặc từ bên thứ ba (sai giá sản phẩm, sai xuất xứ, …), chúng tôi sẽ đền
                    bù cho khách hàng một mã giảm giá cho các lần mua sắm tiếp theo với mệnh giá tùy từng
                    trường hợp cụ thể và có quyền không thực hiện giao dịch bị lỗi.
                  </li>
                </ul>

                <h3 className="text-[1.6rem] font-700">6. Thương hiệu và bản quyền:</h3>
                <p>
                  Mọi quyền sở hữu trí tuệ (đã đăng ký hoặc chưa đăng ký), nội dung thông tin và tất cả các
                  thiết kế, văn bản, đồ họa, phần mềm, hình ảnh, video, âm nhạc, âm thanh, biên dịch phần mềm,
                  mã nguồn và phần mềm cơ bản đều là tài sản của chúng tôi. Toàn bộ nội dung của trang web
                  được bảo vệ bởi luật bản quyền của Việt Nam và các công ước quốc tế. Bản quyền đã được bảo
                  lưu.
                </p>

                <h3 className="text-[1.6rem] font-700">7. Quyền pháp lý:</h3>
                <p>
                  Các điều kiện, điều khoản và nội dung của trang web này được điều chỉnh bởi luật pháp Việt
                  Nam và Tòa án có thẩm quyền tại Việt Nam sẽ giải quyết bất kỳ tranh chấp nào phát sinh từ
                  việc sử dụng trái phép trang web này.
                </p>

                <h3 className="text-[1.6rem] font-700">8. Quy định về bảo mật:</h3>
                <p>
                  Trang web của chúng tôi coi trọng việc bảo mật thông tin và sử dụng các biện pháp tốt nhất
                  bảo vệ thông tin và việc thanh toán của quý khách. Thông tin của quý khách trong quá trình
                  thanh toán sẽ được mã hóa để đảm bảo an toàn. Sau khi quý khách hoàn thành quá trình đặt
                  hàng, quý khách sẽ thoát khỏi chế độ an toàn.
                </p>
                <p>
                  Quý khách không được sử dụng bất kỳ chương trình, công cụ hay hình thức nào khác để can
                  thiệp vào hệ thống hay làm thay đổi cấu trúc dữ liệu. Trang web cũng nghiêm cấm việc phát
                  tán, truyền bá hay cổ vũ cho bất kỳ hoạt động nào nhằm can thiệp, phá hoại hay xâm nhập vào
                  dữ liệu của hệ thống. Cá nhân hay tổ chức vi phạm sẽ bị tước bỏ mọi quyền lợi cũng như sẽ bị
                  truy tố trước pháp luật nếu cần thiết.
                </p>
                <p>
                  Mọi thông tin giao dịch sẽ được bảo mật ngoại trừ trong trường hợp cơ quan pháp luật yêu
                  cầu.
                </p>

                <h3 className="text-[1.6rem] font-700">9. Đảm bảo an toàn giao dịch tại GOLFBY:</h3>
                <p>
                  Chúng tôi sử dụng các dịch vụ để bảo vệ thông tin về nội dung mà người bán đăng sản phẩm
                  trên{' '}
                  <a href="https://www.golfby.com.vn" className="text-primary">
                    https://www.golfby.com.vn
                  </a>
                  . Để đảm bảo các giao dịch được tiến hành thành công, hạn chế tối đa rủi ro có thể phát
                  sinh.
                </p>

                <h3 className="text-[1.6rem] font-700">10. Luật pháp và thẩm quyền tại Lãnh thổ Việt Nam:</h3>
                <p>
                  Tất cả các Điều Khoản và Điều Kiện này và Hợp Đồng (và tất cả nghĩa vụ phát sinh ngoài hợp
                  đồng hoặc có liên quan) sẽ bị chi phối và được hiểu theo luật pháp của Việt Nam. Nếu có
                  tranh chấp phát sinh bởi các Quy định Sử dụng này, Quý khách hàng có quyền gửi khiếu
                  nại/khiếu kiện lên Tòa án có thẩm quyền tại Việt Nam để giải quyết.
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
