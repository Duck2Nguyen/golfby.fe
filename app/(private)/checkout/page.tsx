'use client';

import { useState } from 'react';
import { Lock, Truck, MapPin, Package, CreditCard, CircleCheck, ChevronRight } from 'lucide-react';

import Link from 'next/link';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { initialCartItems } from '@/components/Cart/cart-mock-data';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

export default function CheckoutPage() {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');

  const cartItems = initialCartItems;
  const formatPrice = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + ' ₫';

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const couponDiscount = couponApplied ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal - couponDiscount;
  const savings =
    cartItems.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.quantity, 0) + couponDiscount;
  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);

  const toggleItemExpand = (id: number) => {
    setExpandedItems(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const steps = [
    { label: 'Thông tin', icon: MapPin, done: true },
    { label: 'Vận chuyển', icon: Truck, done: true },
    { label: 'Thanh toán', icon: CreditCard, done: false },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Header />

      <main className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 py-4 text-[13px]">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
          <Link href="/cart" className="text-muted-foreground hover:text-primary transition-colors">
            Giỏ Hàng
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
          <span className="text-foreground font-500">Thanh Toán</span>
        </nav>

        {/* Step Progress */}
        <div className="flex items-center justify-center gap-0 mb-8">
          {steps.map((step, idx) => (
            <div key={step.label} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    step.done
                      ? 'bg-primary text-white'
                      : idx === steps.length - 1
                        ? 'bg-primary/15 text-primary border-2 border-primary'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.done ? <CircleCheck className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
                </div>
                <span
                  className={`text-[13px] hidden sm:block ${
                    step.done || idx === steps.length - 1
                      ? 'text-foreground font-600'
                      : 'text-muted-foreground font-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`w-16 sm:w-24 h-0.5 mx-3 rounded-full ${step.done ? 'bg-primary' : 'bg-border'}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 pb-16">
          {/* LEFT: Form */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Contact Section */}
            <section className="bg-white rounded-2xl border border-border/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-[16px] text-foreground font-700">Thông Tin Liên Hệ</h2>
              </div>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  defaultValue="test@gmail.com"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
                />
                <input
                  type="tel"
                  placeholder="Số điện thoại"
                  defaultValue="0899686063"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
                />
              </div>
            </section>

            {/* Shipping Address */}
            <section className="bg-white rounded-2xl border border-border/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-5 h-5 text-primary" />
                <h2 className="text-[16px] text-foreground font-700">Địa Chỉ Vận Chuyển</h2>
              </div>
              <div className="space-y-3">
                <select className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white">
                  <option value="">Quốc gia</option>
                  <option value="VN">Việt Nam</option>
                  <option value="US">United States</option>
                </select>
                <input
                  type="text"
                  placeholder="Tên"
                  defaultValue="Hải"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
                />
                <input
                  type="text"
                  placeholder="Họ"
                  defaultValue="Nguyễn"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
                />
                <input
                  type="text"
                  placeholder="Địa chỉ"
                  defaultValue="Nhà ở Hải"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
                />
                <select className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white">
                  <option value="">Thành phố</option>
                  <option value="hanoi">Hà Nội</option>
                  <option value="hcm">TP. Hồ Chí Minh</option>
                </select>
              </div>
            </section>

            {/* Shipping Method */}
            <section className="bg-white rounded-2xl border border-border/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="text-[16px] text-foreground font-700">Phương Thức Vận Chuyển</h2>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-[#fafafa]">
                  <input
                    type="radio"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                  />
                  <p className="text-[14px] font-600">Giao hàng tiêu chuẩn — MIỄN PHÍ</p>
                </label>
                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-[#fafafa]">
                  <input
                    type="radio"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                  />
                  <p className="text-[14px] font-600">Giao hàng nhanh — 50.000 ₫</p>
                </label>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white rounded-2xl border border-border/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="text-[16px] text-foreground font-700">Thanh Toán</h2>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-[#fafafa]">
                  <input
                    type="radio"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                  />
                  <p className="text-[14px] font-600">Chuyển khoản ngân hàng</p>
                </label>
                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-[#fafafa]">
                  <input
                    type="radio"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <p className="text-[14px] font-600">Thanh toán khi nhận hàng (COD)</p>
                </label>
              </div>
            </section>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="w-full lg:w-[420px] shrink-0">
            <div className="bg-white rounded-2xl border border-border/50 overflow-hidden sticky top-[140px]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-[#fafafa]">
                <h2 className="text-[16px] text-foreground font-700">Đơn Hàng ({totalItems})</h2>
                <Link href="/cart" className="text-[13px] text-primary font-500">
                  Sửa đổi
                </Link>
              </div>

              {/* Items */}
              <div className="divide-y divide-border/40 max-h-[400px] overflow-y-auto">
                {cartItems.map(item => {
                  const isExpanded = expandedItems.includes(item.id);
                  return (
                    <div key={item.id} className="p-4 hover:bg-[#fafafa]">
                      <div className="flex gap-3">
                        <div className="relative shrink-0">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f3f3f3] border border-border/30">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-700">
                            {item.quantity}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-foreground line-clamp-2 mb-1 font-500">
                            {item.name}
                          </p>
                          <button
                            onClick={() => toggleItemExpand(item.id)}
                            className="text-[11px] text-primary/70 hover:text-primary"
                          >
                            {isExpanded ? 'Ẩn' : 'Xem chi tiết'}
                          </button>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-[14px] text-foreground font-600">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 ml-[76px] p-3 bg-[#f8f8f8] rounded-lg space-y-1">
                          {item.specs.map(spec => (
                            <div key={spec.label} className="flex justify-between text-[11px]">
                              <span className="text-muted-foreground">{spec.label}</span>
                              <span className="text-foreground font-500">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Coupon */}
              <div className="px-5 py-4 border-t border-border/40 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Mã giảm giá"
                    disabled={couponApplied}
                    className="flex-1 h-11 px-4 rounded-xl border border-border bg-[#f8f8f8] text-[13px] outline-none focus:border-primary disabled:opacity-60"
                  />
                  <button
                    onClick={() => couponCode.trim() && setCouponApplied(true)}
                    disabled={!couponCode.trim() || couponApplied}
                    className="h-11 px-5 rounded-xl border-2 border-border text-[13px] text-foreground hover:border-primary hover:text-primary disabled:opacity-40 font-600"
                  >
                    OK
                  </button>
                </div>
                {couponApplied && <p className="text-[12px] text-primary">Giảm 5%</p>}
              </div>

              {/* Price */}
              <div className="px-5 py-3 border-t border-border/40 space-y-2 text-[14px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tổng phụ</span>
                  <span className="font-600">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vận chuyển</span>
                  <span className="text-primary font-600">MIỄN PHÍ</span>
                </div>
              </div>

              {/* Total */}
              <div className="px-5 py-4 border-t border-border/40 bg-[#fafafa]">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-[16px] font-700">TỔNG</span>
                  <span className="text-[24px] text-primary font-700">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Button */}
              <div className="px-5 pb-5">
                <button className="w-full h-14 bg-primary text-white rounded-xl font-600 hover:bg-primary-dark flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Hoàn Tất Đơn Hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
