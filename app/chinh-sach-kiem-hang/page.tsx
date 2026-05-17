import React from 'react';

import { Header } from '@/components/Header';

export const metadata = {
  title: 'Chính Sách Kiểm Hàng - GolfBy',
  description: 'Chính sách kiểm tra hàng hóa khi nhận hàng tại GolfBy',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <article className="max-w-none">
          <div className="page-width page-width--narrow">
            <div className="container">
              <h1 className="main-page-title text-[2.4rem] font-700 mb-6">Chính Sách Kiểm Hàng</h1>
              
              <div className="rte text-[1.4rem] leading-[2.1rem] text-muted-foreground space-y-4">
                <p>
                  Khi nhận hàng quý khách có quyền yêu cầu nhân viên giao hàng mở cho kiểm rồi mới nhận hàng.
                </p>
                <p>
                  Trường hợp đơn hàng đặt mà bên bán giao không đúng loại sản phẩm quý khách có quyền trả hàng và không không thanh toán tiền.
                </p>
                <p>
                  Trường hợp quý khách đã thanh toán trước nhưng đơn hàng không đúng quý khách yêu cầu hoàn tiền hoặc giao lại đơn mới như đã đặt.
                </p>
                <p>
                  Trong trường hợp yêu cầu hoàn tiền hoặc đổi đơn quý khách liên hệ qua Email: <a href="mailto:gbhoangsonltd@gmail.com" className="text-primary">gbhoangsonltd@gmail.com</a> hoặc số điện thoại <strong className="font-700">0975642922</strong> chúng tôi cam kết sẽ giải quyết mọi yêu cầu của quý khách.
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
