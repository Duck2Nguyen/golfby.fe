'use client';

import { Button } from '@heroui/button';
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalContent } from '@heroui/modal';

interface TermsConditionsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function TermsConditionsModal({ isOpen, onOpenChange }: TermsConditionsModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg" className="max-w-[60vw]" placement="center">
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="text-[18px] font-700">ĐIỀU KHOẢN VÀ ĐIỀU KIỆN</ModalHeader>
            <ModalBody>
              <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-4 text-[14px] text-foreground">
                <p className="font-600">Các Điều Khoản Chung</p>
                <p>
                  Chào mừng Quý khách đến với GolfBy Vietnam (GolfBy). Khi Quý khách truy cập vào trang web
                  của chúng tôi, điều đó đồng nghĩa với việc Quý khách đồng ý với các điều khoản này. Trang
                  web có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong Quy định và Điều
                  kiện sử dụng, vào bất cứ lúc nào.
                </p>
                <p>
                  Các thay đổi có hiệu lực ngay khi được đăng tải mà không cần thông báo trước. Khi Quý khách
                  tiếp tục sử dụng trang web sau khi các thay đổi được đăng tải, điều đó đồng nghĩa với việc
                  Quý khách chấp nhận những thay đổi đó. Chúng tôi kính mong Quý khách kiểm tra thường xuyên
                  để cập nhật các thay đổi.
                </p>
                <p className="font-600">Xin vui lòng đọc kỹ trước khi quyết định mua hàng:</p>

                <p className="font-600">1. Hướng dẫn sử dụng web</p>
                <ul className="list-disc ml-5 mt-2">
                  <li>
                    Người dùng phải từ 18 tuổi trở lên hoặc truy cập dưới sự giám sát của cha mẹ hoặc người
                    giám hộ hợp pháp.
                  </li>
                  <li>
                    Chúng tôi cho phép Quý khách mua sắm trong khuôn khổ Điều khoản và Điều kiện sử dụng đã đề
                    ra.
                  </li>
                  <li>
                    Chúng tôi nghiêm cấm sử dụng bất kỳ phần nào của trang web với mục đích thương mại hoặc
                    nhân danh đối tác thứ ba mà không có sự đồng ý bằng văn bản từ chúng tôi.
                  </li>
                  <li>
                    Chúng tôi không chịu trách nhiệm đối với bất kỳ thiệt hại hoặc mất mát nào do Quý khách
                    không tuân thủ quy định.
                  </li>
                </ul>

                <p className="font-600">2. Ý kiến khách hàng</p>
                <ul className="list-disc ml-5 mt-2">
                  <li>
                    Tất cả nội dung trang web và ý kiến phản hồi của Quý khách đều là tài sản của chúng tôi.
                  </li>
                  <li>
                    Trường hợp phát hiện thông tin giả mạo, chúng tôi có quyền khóa tài khoản của Quý khách
                    hoặc áp dụng các biện pháp khác theo quy định pháp luật Việt Nam.
                  </li>
                </ul>

                <p className="font-600">3. Thông tin sản phẩm</p>
                <ul className="list-disc ml-5 mt-2">
                  <li>
                    GolfBy cung cấp thông tin chi tiết đối với từng sản phẩm, nhưng không đảm bảo thông tin
                    hoàn toàn chính xác, đầy đủ, hoặc không có sai sót.
                  </li>
                  <li>
                    Trong trường hợp sản phẩm nhận được không đúng như mô tả, Quý khách vui lòng liên hệ bộ
                    phận Hỗ trợ khách hàng ngay sau khi nhận hàng và đảm bảo sản phẩm chưa qua sử dụng để được
                    hỗ trợ đổi trả.
                  </li>
                </ul>

                <p className="font-600">4. Chính sách về hàng giả, hàng nhái, hàng không đúng chất lượng</p>
                <ul className="list-disc ml-5 mt-2">
                  <li>
                    GolfBy cam kết cung cấp sản phẩm chính hãng, chất lượng cao, từ chối bán hàng giả, hàng
                    nhái, hoặc hàng không rõ nguồn gốc xuất xứ.
                  </li>
                  <li>
                    Quý khách nghi ngờ sản phẩm không chính hãng, vui lòng thông báo cho chúng tôi qua Hotline
                    để được xác minh và hỗ trợ.
                  </li>
                </ul>

                <p className="font-600">5. Quyền pháp lý</p>
                <ul className="list-disc ml-5 mt-2">
                  <li>
                    Các điều kiện, điều khoản và nội dung của trang web này được điều chỉnh bởi luật pháp Việt
                    Nam.
                  </li>
                  <li>
                    Bất kỳ tranh chấp nào phát sinh sẽ được giải quyết bởi Tòa án có thẩm quyền tại Việt Nam.
                  </li>
                </ul>

                <p className="font-600">6. Chương trình khuyến mãi</p>
                <ul className="list-disc ml-5 mt-2">
                  <li>
                    GolfBy thường xuyên có các chương trình giảm giá để mang lại lợi ích cho Quý khách hàng.
                  </li>
                  <li>
                    Chúng tôi có quyền từ chối các đơn hàng không nhằm mục đích sử dụng cá nhân hoặc có mục
                    đích mua đi bán lại.
                  </li>
                  <li>
                    Thể lệ chương trình khuyến mãi được cập nhật tại trang khuyến mãi theo từng thời điểm và
                    có thể thay đổi mà không cần thông báo trước.
                  </li>
                </ul>

                <p className="font-600">7. Giá cả</p>
                <ul className="list-disc ml-5 mt-2">
                  <li>Giá sản phẩm tại GolfBy đã bao gồm thuế VAT và là giá bán cuối cùng.</li>
                  <li>
                    Phí vận chuyển hoặc phí dịch vụ (nếu có) sẽ được hiển thị rõ tại trang Thanh toán khi Quý
                    khách đặt hàng.
                  </li>
                  <li>
                    Trường hợp có sai sót về giá, chúng tôi sẽ thông báo cho Quý khách để xác nhận lại hoặc
                    hủy đơn hàng.
                  </li>
                </ul>

                <p className="font-600">8. Khu vực giao hàng</p>
                <ul className="list-disc ml-5 mt-2">
                  <li>
                    GolfBy giao hàng toàn quốc và áp dụng chính sách vận chuyển riêng tùy từng thời điểm.
                  </li>
                </ul>

                <p className="font-600">9. Giải quyết tranh chấp</p>
                <ul className="list-disc ml-5 mt-2">
                  <li>
                    Bất kỳ tranh cãi, khiếu nại hoặc tranh chấp phát sinh sẽ được giải quyết thông qua thương
                    lượng, hòa giải, trọng tài hoặc Tòa án theo quy định pháp luật Việt Nam.
                  </li>
                </ul>

                <p className="text-[13px] text-muted-foreground">
                  Chúng tôi kính mong Quý khách chỉ mua hàng khi đã hiểu và đồng ý với các điều khoản trên.
                  Xin cảm ơn Quý khách đã tin tưởng và ủng hộ GolfBy!
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="w-full flex justify-end">
                <Button onClick={() => onClose?.()} variant="ghost">
                  Đóng
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
