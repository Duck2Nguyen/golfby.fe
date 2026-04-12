'use client';

import { useMemo } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

import Image from 'next/image';
import { Link } from '@heroui/link';

import { useBrands } from '@/hooks/useBrands';
import { useCollections, type CollectionTreeNode } from '@/hooks/useCollections';

import BoCongThuongImage from '@/assets/png/bo_cong_thuong.png';

const fallbackProductLinks = [
  { href: '/collection/gay-golf', label: 'Gậy Golf' },
  { href: '/collection/shaft-gay', label: 'Shaft Gậy' },
  { href: '/collection/bong-golf', label: 'Bóng Golf' },
  { href: '/collection/tui', label: 'Túi' },
  { href: '/collection/thoi-trang', label: 'Thời Trang' },
  { href: '/collection/thiet-bi-dien-tu', label: 'Thiết Bị Điện Tử' },
  { href: '/collection/tin-tuc', label: 'Tin Tức' },
];

const fallbackBrandLinks = [
  { href: '/collection?brand=titleist', label: 'Titleist' },
  { href: '/collection?brand=taylormade', label: 'Taylormade' },
  { href: '/collection?brand=ping', label: 'Ping' },
  { href: '/collection?brand=callaway', label: 'Callaway' },
  { href: '/collection?brand=mizuno', label: 'Mizuno' },
  { href: '/collection?brand=xxio', label: 'XXIO' },
  { href: '/collection', label: 'Tất Cả' },
];

const policyLinks = [
  { href: '#', label: 'Điều Khoản Và Điều Kiện' },
  { href: '#', label: 'Chính Sách Vận Chuyển' },
  { href: '#', label: 'Chính Sách Trả Đổi Trả' },
  { href: '#', label: 'Phương Thức Thanh Toán' },
  { href: '#', label: 'Chính Sách Bảo Mật' },
  { href: '#', label: 'Chính Sách Kiểm Hàng' },
];

const moreInfoLinks = [
  { href: '#', label: 'Về Chúng Tôi' },
  { href: '#', label: 'Liên Hệ' },
];

const socialLinks = [
  { href: 'https://facebook.com', isExternal: true, label: 'Facebook' },
  { href: 'https://instagram.com', isExternal: true, label: 'Instagram' },
  { href: 'https://youtube.com', isExternal: true, label: 'YouTube' },
  { href: 'https://zalo.me', isExternal: true, label: 'Zalo' },
];

export function Footer() {
  const { getAllCollections } = useCollections();
  const { getAllBrands } = useBrands();

  const productLinks = useMemo(() => {
    const collections = getAllCollections.data?.data ?? [];

    if (collections.length === 0) {
      return fallbackProductLinks;
    }

    const roots = collections.filter(collection => !collection.parentId);
    const rootCollections = roots.length > 0 ? roots : collections;

    return [...rootCollections]
      .sort((a, b) => {
        const aOrder = typeof a.sortOrder === 'number' ? a.sortOrder : Number.MAX_SAFE_INTEGER;
        const bOrder = typeof b.sortOrder === 'number' ? b.sortOrder : Number.MAX_SAFE_INTEGER;

        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }

        return a.name.localeCompare(b.name, 'vi');
      })
      .filter(collection => Boolean(collection.name && collection.slug))
      .map((collection: CollectionTreeNode) => ({
        href: `/collection/${collection.slug}`,
        label: collection.name,
      }));
  }, [getAllCollections.data?.data]);

  const brandLinks = useMemo(() => {
    const brands = getAllBrands.data?.data ?? [];

    if (brands.length === 0) {
      return fallbackBrandLinks;
    }

    return [
      ...brands
        .filter(brand => Boolean(brand.name && brand.slug))
        .slice(0, 6)
        .map(brand => ({
          href: `/collection?brand=${brand.slug}`,
          label: brand.name,
        })),
      { href: '/collection', label: 'Tất Cả' },
    ];
  }, [getAllBrands.data?.data]);

  return (
    <footer className="bg-[linear-gradient(90deg,#062d11_0%,#0d3618_55%,#123d17_100%)] text-white">
      <div className="mx-auto w-full max-w-[140rem] px-4 pb-6 pt-7 md:px-6 md:pb-8 md:pt-10 xl:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-[1fr_1fr_1fr_1fr_1.5fr] xl:gap-10">
          <div>
            <h3 className="mb-3 border-b border-white/10 pb-2 text-[1.6rem] font-700 leading-[2.2rem] text-white md:mb-4 md:text-[1.8rem] md:leading-[2.4rem]">
              Sản Phẩm
            </h3>
            <ul className="space-y-2 md:space-y-2.5">
              {productLinks.map(item => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[1.3rem] font-400 leading-[2rem] text-white/65 transition-colors hover:text-[#86cf5b] md:text-[1.4rem] md:leading-[2.2rem]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 border-b border-white/10 pb-2 text-[1.6rem] font-700 leading-[2.2rem] text-white md:mb-4 md:text-[1.8rem] md:leading-[2.4rem]">
              Thương Hiệu
            </h3>
            <ul className="space-y-2 md:space-y-2.5">
              {brandLinks.map(item => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[1.3rem] font-400 leading-[2rem] text-white/65 transition-colors hover:text-[#86cf5b] md:text-[1.4rem] md:leading-[2.2rem]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 border-b border-white/10 pb-2 text-[1.6rem] font-700 leading-[2.2rem] text-white md:mb-4 md:text-[1.8rem] md:leading-[2.4rem]">
              Chính Sách
            </h3>
            <ul className="space-y-2 md:space-y-2.5">
              {policyLinks.map(item => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[1.3rem] font-400 leading-[2rem] text-white/65 transition-colors hover:text-[#86cf5b] md:text-[1.4rem] md:leading-[2.2rem]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 border-b border-white/10 pb-2 text-[1.6rem] font-700 leading-[2.2rem] text-white md:mb-4 md:text-[1.8rem] md:leading-[2.4rem]">
              Thông Tin Thêm
            </h3>
            <ul className="space-y-2 md:space-y-2.5">
              {moreInfoLinks.map(item => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[1.3rem] font-400 leading-[2rem] text-white/65 transition-colors hover:text-[#86cf5b] md:text-[1.4rem] md:leading-[2.2rem]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-2 xl:col-span-1">
            <p className="mb-3 text-[1.5rem] font-700 leading-[2.1rem] text-white/90 md:text-[1.6rem] md:leading-[2.2rem]">
              CÔNG TY TNHH THƯƠNG MẠI GB HOÀNG SƠN
            </p>
            <p className="mb-4 text-[1.2rem] font-400 leading-[2rem] text-white/70 md:text-[1.3rem] md:leading-[2.2rem]">
              Giấy Chứng nhận đăng ký kinh doanh số 0110944804 do Sở Kế hoạch và Đầu tư thành phố Hà Nội cấp
              ngày 23/01/2025.
            </p>

            <div className="space-y-2 md:space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-[1.4rem] w-[1.4rem] shrink-0 text-[#59aa34] md:h-4 md:w-4" />
                <span className="text-[1.2rem] font-400 leading-[2rem] text-white/80 md:text-[1.3rem] md:leading-[2.2rem]">
                  Tòa nhà ADANA Complex, Lô 3, Khu A1-A2-A3, đường Cổ Linh, Phường Cự Khối, Quận Long Biên,
                  Thành phố Hà Nội, Việt Nam
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-[1.4rem] w-[1.4rem] shrink-0 text-[#59aa34] md:h-4 md:w-4" />
                <Link
                  href="tel:+84889686883"
                  className="text-[1.2rem] font-400 leading-[2rem] text-white/80 md:text-[1.3rem] md:leading-[2.2rem]"
                >
                  Hotline: +84 889 686 883
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-[1.4rem] w-[1.4rem] shrink-0 text-[#59aa34] md:h-4 md:w-4" />
                <Link
                  href="mailto:gbhoangsonltd@gmail.com"
                  className="text-[1.2rem] font-400 leading-[2rem] text-white/80 md:text-[1.3rem] md:leading-[2.2rem]"
                >
                  Email: gbhoangsonltd@gmail.com
                </Link>
              </div>
            </div>

            <Link href="http://online.gov.vn/Website/chi-tiet-129235" isExternal className="my-2 inline-flex">
              <Image
                src={BoCongThuongImage}
                alt="Đã thông báo Bộ Công Thương"
                width={244}
                height={92}
                className="h-auto w-[17rem] md:w-[20.4rem]"
              />
            </Link>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-white/15 pt-5 md:mt-6 md:gap-4 md:pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[1.2rem] font-400 leading-[2rem] text-white/45">
            © 2026 GolfBy. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 md:gap-5">
            {socialLinks.map(item => (
              <Link
                key={item.label}
                href={item.href}
                isExternal={item.isExternal}
                className="text-[1.2rem] font-400 leading-[2rem] text-white/45 transition-colors hover:text-[#86cf5b]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
