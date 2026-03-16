import { type ReactNode } from 'react';

import Image from 'next/image';
import { Link } from '@heroui/link';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const LeftArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-[100dvh] flex">
      {/* Left - Image */}
      <div className="hidden lg:flex lg:w-[55%] relative h-[100dvh]">
        <Image
          src="https://images.unsplash.com/photo-1649235311924-2dabc032db8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY291cnNlJTIwbW9ybmluZyUyMG1pc3QlMjBzY2VuaWN8ZW58MXx8fHwxNzczNjI3MjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Golf course"
          fill
          priority
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/50 to-black/40" />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-white text-[1.8rem] font-700">G</span>
            </div>
            <span className="text-white text-[2rem] font-700 tracking-tight">GolfStore</span>
          </Link>

          <div className="max-w-md">
            <h2 className="text-white text-[3.2rem] font-700 leading-[1.15] mb-4">
              Nâng tầm cuộc chơi
              <br />
              cùng trang bị tốt nhất
            </h2>
            <p className="text-white/70 text-[1.5rem] leading-relaxed">
              Hệ thống phân phối dụng cụ golf chính hãng hàng đầu Việt Nam. Trải nghiệm mua sắm premium dành
              cho golfer.
            </p>

            <div className="flex items-center gap-8 mt-8">
              {[
                { value: '10K+', label: 'Sản phẩm' },
                { value: '50K+', label: 'Khách hàng' },
                { value: '15+', label: 'Thương hiệu' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-white text-[2.4rem] font-700">{stat.value}</div>
                  <div className="text-white/60 text-[1.3rem]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex items-center justify-between p-6 lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-[1.4rem] font-500"
          >
            <LeftArrow />
            Về trang chủ
          </Link>

          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-[1.4rem] font-700">G</span>
            </div>
            <span className="text-primary text-[1.6rem] font-700">GolfStore</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-10 lg:px-10">
          <div className="w-full max-w-[42rem]">
            <div className="mb-8">
              <h1 className="text-[2.8rem] text-foreground font-700 mb-2">{title}</h1>
              <p className="text-muted-foreground text-[1.5rem]">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
