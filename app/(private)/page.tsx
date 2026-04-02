import React from 'react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroBanner } from '@/components/HeroBanner';
import { Newsletter } from '@/components/Newsletter';
import { BrandSlider } from '@/components/BrandSlider';
import { PromoBanner } from '@/components/PromoBanner';
import { ProductSection } from '@/components/ProductSection';
import TopSellingSection from '@/components/TopSellingSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <HeroBanner />
        {/* <Features /> */}
        {/* <CategoryGrid /> */}
        <BrandSlider />

        <ProductSection />
        <TopSellingSection limit={10} />

        <PromoBanner
          layout="two-col"
          banners={[
            {
              image:
                'https://images.unsplash.com/photo-1760253488581-f77fe3a6e479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwcGxheWVyJTIwcHJvZmVzc2lvbmFsJTIwdG91cm5hbWVudHxlbnwxfHx8fDE3NzM2MjY2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
              title: 'Bộ Sưu Tập\nDriver 2026',
              subtitle: 'Mới ra mắt',
              cta: 'Xem ngay',
            },
            {
              image:
                'https://images.unsplash.com/photo-1715533173683-737d4a2433dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwZmFzaGlvbiUyMGFwcGFyZWwlMjBwb2xvJTIwc2hpcnR8ZW58MXx8fHwxNzczNjI2NjMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
              title: 'Thời Trang Golf\nSale 40%',
              subtitle: 'Ưu đãi có hạn',
              cta: 'Mua ngay',
              align: 'right',
            },
          ]}
        />

        <PromoBanner
          layout="full"
          banners={[
            {
              image:
                'https://images.unsplash.com/photo-1763916847372-fbfabd2420cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmZXIlMjBzd2luZ2luZyUyMHN1bnNldCUyMHNpbGhvdWV0dGV8ZW58MXx8fHwxNzczNjI2NjMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
              title: 'Trở Thành Thành Viên VIP',
              subtitle: 'Chương trình khách hàng thân thiết',
              cta: 'Đăng ký miễn phí',
            },
          ]}
        />

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
