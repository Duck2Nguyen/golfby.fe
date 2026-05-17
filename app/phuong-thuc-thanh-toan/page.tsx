import React from 'react';

import { Header } from '@/components/Header';

export const metadata = {
  title: 'Phương Thức Thanh Toán - GolfBy',
  description: 'Các phương thức thanh toán tại GolfBy',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <article className="max-w-none">
          <div className="page-width page-width--narrow">
            <div className="container">
              <h1 className="main-page-title text-[2.4rem] font-700 mb-6">Phương Thức Thanh Toán</h1>
              
              <div className="rte text-[1.4rem] leading-[2.1rem] text-muted-foreground space-y-6">
                <h3 className="text-[1.6rem] font-700">I – QUY ĐỊNH CHUNG</h3>
                
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Mục đích: thông báo về các hình thức thanh toán của website www.golfby.com.vn đang áp dụng.</li>
                  <li>Phạm vi áp dụng: dành cho tất cả các khách hàng mua sắm tại website www.golfby.com.vn .</li>
                </ol>

                <h3 className="text-[1.6rem] font-700 mt-8">II – NỘI DUNG QUY ĐỊNH</h3>
                
                <p>
                  Nhằm mang đến trải nghiệm mua sắm toàn diện cho quý khách hàng, www.golfby.com.vn đưa ra các hình thức thanh toán tiện lợi như sau:
                </p>

                <ul className="list-[disc] pl-6 space-y-2">
                  <li>Thanh toán trực tiếp khi nhận hàng (COD)</li>
                  <li>Chuyển khoản</li>
                </ul>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
