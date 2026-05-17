import React from 'react';

import { Header } from '@/components/Header';

export const metadata = {
  title: 'Liên Hệ - GolfBy',
  description: 'Liên hệ với GolfBy - Gửi tin nhắn hoặc phản hồi cho chúng tôi',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <article className="max-w-6xl mx-auto">
          <h1 className="text-[2.8rem] font-700 mb-8 text-center text-foreground">Liên Hệ Với Chúng Tôi</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
            {/* Left side: Information */}
            <div className="space-y-8">
              <div>
                <p className="text-[1.5rem] leading-[2.2rem] text-muted-foreground">
                  Có câu hỏi hoặc ý kiến? Hãy sử dụng biểu mẫu bên cạnh để gửi tin nhắn cho chúng tôi hoặc
                  liên hệ trực tiếp qua các kênh thông tin dưới đây:
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[1.6rem] font-700 text-foreground">GỌI HỖ TRỢ</h4>
                    <p className="text-[1.5rem] font-600 text-primary mt-1">+84 889 686 883</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[1.6rem] font-700 text-foreground">ZALO</h4>
                    <p className="text-[1.5rem] font-600 text-primary mt-1">+84 889 686 883</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[1.6rem] font-700 text-foreground">EMAIL</h4>
                    <p className="text-[1.5rem] font-600 text-primary mt-1">
                      <a href="mailto:gbhoangson@gmail.com">gbhoangson@gmail.com</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[1.6rem] font-700 text-foreground">ĐỊA CHỈ</h4>
                    <p className="text-[1.4rem] text-muted-foreground mt-1 leading-[2.1rem]">
                      Adana Complex
                      <br />
                      Long Biên, Hà Nội
                      <br />
                      Việt Nam
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[1.6rem] font-700 text-foreground">GIỜ LÀM VIỆC</h4>
                    <p className="text-[1.4rem] text-muted-foreground mt-1 leading-[2.1rem]">
                      Thứ 2 đến Thứ 6: 9:00 AM - 9:00 PM
                      <br />
                      Thứ 7 - Chủ nhật: 9:00 AM - 9:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Contact Form */}
            <div className="bg-muted/30 p-8 rounded-2xl border border-border/60">
              <h3 className="text-[2rem] font-700 mb-6 text-foreground">Gửi Tin Nhắn Cho Chúng Tôi</h3>

              <form className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-[1.3rem] font-600 mb-2 text-foreground">
                    Họ và Tên
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-[1.4rem] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    placeholder="Nhập họ và tên của bạn"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[1.3rem] font-600 mb-2 text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-[1.4rem] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    placeholder="example@gmail.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-[1.3rem] font-600 mb-2 text-foreground">
                    Số Điện Thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-[1.4rem] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[1.3rem] font-600 mb-2 text-foreground">
                    Nội Dung Tin Nhắn
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-[1.4rem] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                    placeholder="Chúng tôi có thể giúp gì cho bạn?"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary hover:bg-primary/95 text-primary-foreground font-700 rounded-xl text-[1.5rem] shadow-lg shadow-primary/10 transition-all hover:shadow-primary/20 active:scale-[0.98]"
                >
                  Gửi Tin Nhắn
                </button>
              </form>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
