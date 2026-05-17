'use client';

import { useState } from 'react';
import { Tag, Ticket, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

import Link from 'next/link';
import { Modal, ModalBody, ModalHeader, ModalContent } from '@heroui/modal';

import { setSessionKey, removeSessionKey } from '@/utils/localStorage';
import { CHECKOUT_DIRECT_ITEMS_KEY, CHECKOUT_SELECTED_CART_ITEM_IDS_KEY } from '@/utils/checkoutSelection';

interface OrderSummaryProps {
  selectedCartItemIds: string[];
  subtotal: number;
  itemCount: number;
}

export default function OrderSummary({ selectedCartItemIds, subtotal, itemCount }: OrderSummaryProps) {
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const formatPrice = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + '₫';

  const discount = couponApplied ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal - discount;
  const canProceedToCheckout = agreedToTerms && itemCount > 0 && selectedCartItemIds.length > 0;

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setCouponApplied(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border/50 overflow-hidden sticky top-[140px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4">
        <h3 className="text-[16px] text-white font-700">Tóm Tắt Đơn Hàng</h3>
        <p className="text-[13px] text-white/70 mt-0.5">{itemCount} sản phẩm được chọn</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-muted-foreground">Tổng phụ</span>
          <span className="text-[15px] text-foreground font-600">{formatPrice(subtotal)}</span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-muted-foreground">Phí vận chuyển</span>
          <span className="text-[13px] text-primary font-600">Miễn phí</span>
        </div>

        {/* Discount */}
        {couponApplied && (
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-primary flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Giảm giá (5%)
            </span>
            <span className="text-[15px] text-primary font-600">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="h-px bg-border/60" />

        {/* Coupon */}
        <div>
          <label className="flex items-center gap-2 text-[13px] text-foreground mb-2.5 font-600">
            <Ticket className="w-4 h-4 text-primary" />
            Mã phiếu giảm giá
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Nhập mã phiếu giảm giá"
              className="flex-1 h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[13px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:bg-white transition-all disabled:opacity-50"
              disabled={couponApplied}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={!couponCode.trim() || couponApplied}
              className="h-11 px-5 rounded-xl text-[13px] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-primary/10 text-primary hover:bg-primary hover:text-white font-600"
            >
              {couponApplied ? 'Đã áp dụng' : 'Áp Dụng'}
            </button>
          </div>
          {couponApplied && (
            <p className="text-[12px] text-primary mt-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Mã giảm giá đã được áp dụng thành công!
            </p>
          )}
          <p className="text-[11px] text-muted-foreground/70 mt-2 leading-relaxed">
            Mã phiếu giảm giá sẽ được áp dụng khi trong trạng thái thanh toán.
          </p>
        </div>

        <div className="h-px bg-border/60" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-[16px] text-foreground font-700">TỔNG CỘNG</span>
          <span className="text-[22px] text-primary font-700">{formatPrice(total)}</span>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={e => setAgreedToTerms(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                agreedToTerms
                  ? 'bg-primary border-primary'
                  : 'bg-white border-gray-300 group-hover:border-primary/50'
              }`}
            >
              {agreedToTerms && (
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-[12px] text-muted-foreground leading-relaxed select-none group-hover:text-foreground transition-colors">
            Tôi đồng ý với{' '}
            <button
              type="button"
              onClick={e => {
                e.preventDefault();
                setShowTermsModal(true);
              }}
              className="text-primary underline underline-offset-2 text-[1.2rem] hover:text-primary-dark cursor-pointer"
            >
              Điều Khoản và Điều Kiện
            </button>{' '}
            mua hàng
          </span>
        </label>

        {/* Action Buttons */}
        <div className="space-y-3 pt-1">
          <Link
            href={canProceedToCheckout ? '/checkout' : '#'}
            onClick={e => {
              if (!canProceedToCheckout) {
                e.preventDefault();
                return;
              }

              if (selectedCartItemIds.length > 0) {
                setSessionKey(CHECKOUT_SELECTED_CART_ITEM_IDS_KEY, selectedCartItemIds);
                removeSessionKey(CHECKOUT_DIRECT_ITEMS_KEY);
                return;
              }

              removeSessionKey(CHECKOUT_DIRECT_ITEMS_KEY);
              removeSessionKey(CHECKOUT_SELECTED_CART_ITEM_IDS_KEY);
            }}
            className={`w-full h-13 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-dark text-white rounded-xl text-[15px] flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-primary/25 active:scale-[0.98] font-600 ${
              !canProceedToCheckout ? 'opacity-40 cursor-not-allowed hover:shadow-md' : ''
            }`}
          >
            Tiến Hành Thanh Toán
            <ArrowRight className="w-4.5 h-4.5" />
          </Link>

          <Link
            href="/"
            className="w-full h-12 border-2 border-border hover:border-primary rounded-xl text-[14px] text-foreground hover:text-primary flex items-center justify-center gap-2 transition-all duration-200 font-600"
          >
            <ShoppingBag className="w-4 h-4" />
            Tiếp Tục Mua Sắm
          </Link>
        </div>
      </div>

      {/* Terms Modal */}
      <Modal
        isOpen={showTermsModal}
        onOpenChange={setShowTermsModal}
        size="lg"
        className="max-w-[40vw]"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-[24px] text-foreground font-700">Điều Khoản và Điều Kiện</h2>
          </ModalHeader>
          <ModalBody className="space-y-4">
            <section>
              <h3 className="text-[17px] text-foreground font-700 mb-3">1. Các Điều Khoản Chung</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Chào mừng Quý khách đến với GolfBy Vietnam (GolfBy). Khi Quý khách truy cập vào trang web của
                chúng tôi, điều đó đồng nghĩa với việc Quý khách đồng ý với các điều khoản này. Trang web có
                quyền thay đổi, chính sửa, thêm hoặc loại bỏ bất kỳ phần nào trong quy định và điều kiện sử
                dụng.
              </p>
            </section>

            <section>
              <h3 className="text-[17px] text-foreground font-700 mb-3">2. Hướng Dẫn Sử Dụng Web</h3>
              <ul className="text-[14px] text-muted-foreground leading-relaxed space-y-2">
                <li className="flex gap-2">
                  <span className="text-primary font-600">•</span>
                  <span>
                    Người dùng phải từ 18 tuổi trở lên hoặc truy cập dưới sự giám sát của cha mẹ hoặc người
                    giám hộ hợp pháp.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-600">•</span>
                  <span>
                    Chúng tôi cho phép Quý khách mua sắm trên trang web trong khuôn khổ điều khoản và điều
                    kiện sử dụng đã đề ra.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-600">•</span>
                  <span>
                    Nghiêm cấm sử dụng bất kỳ nội dung cuả trang web với mục đích thương mại hoặc nhân danh
                    độc lập tác thứ ba.
                  </span>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-[17px] text-foreground font-700 mb-3">3. Thông Tin Sản Phẩm</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                GolfBy cung cấp thông tin chi tiết đối với từng sản phẩm, nhưng không đảm bảo thông tin hoàn
                toàn chính xác, đầy đủ, hoặc không có sai sót.
              </p>
            </section>

            <section>
              <h3 className="text-[17px] text-foreground font-700 mb-3">4. Điều Kiện Mua Hàng</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Tất cả nội dung trang web và y kiến phê bình của Quý khách đều là tài sản của chúng tôi.
                Trường hợp phát hiện thông tin giả mạo, chúng tôi có quyền khóa tài khoản của Quý khách hoặc
                áp dụng các biện pháp khác theo quy định pháp luật Việt Nam.
              </p>
            </section>

            <section>
              <h3 className="text-[17px] text-foreground font-700 mb-3">5. Quyền Pháp Lý</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Các điều kiện, điều khoản và nội dung của trang web này được điều chỉnh bởi luật pháp Việt
                Nam. Bất kỳ tranh chấp nào phát sinh sẽ được giải quyết bởi Tòa án có thẩm quyền tại Việt Nam.
              </p>
            </section>

            <section>
              <h3 className="text-[17px] text-foreground font-700 mb-3">6. Chương Trình Khuyến Mãi</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                GolfBy thường xuyên có các chương trình giảm giá để mang lại lợi ích cho Quý khách hàng. Chúng
                tôi có quyền từ chối các đơn hàng không nhằm mục đích sử dụng cả nhân hoặc có mục dích mua đi
                bán lại.
              </p>
            </section>

            <section>
              <h3 className="text-[17px] text-foreground font-700 mb-3">7. Giá Cả</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Giá sản phẩm tại GolfBy đã bao gồm thuế VAT và là giá bán cuối cùng. Phí vận chuyển hoặc phí
                dịch vụ (nếu có) sẽ được hiển thị rõ tại trang Thanh toán khi Quý khách đặt hàng.
              </p>
            </section>

            <section>
              <h3 className="text-[17px] text-foreground font-700 mb-3">8. Khu Vực Giao Hàng</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                GolfBy giao hàng toàn quốc và áp dụng chính sách vận chuyển riêng tùng thời điểm.
              </p>
            </section>

            <section>
              <h3 className="text-[17px] text-foreground font-700 mb-3">9. Giải Quyết Tranh Chấp</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Bất kỳ tranh cãi, khiếu nại hoặc tranh chấp phát sinh sẽ được giải quyết thông qua thương
                lượng, hòa giải, trong tài hoặc Tòa án có thẩm quyền tại Việt Nam.
              </p>
            </section>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
