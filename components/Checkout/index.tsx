'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';

import Link from 'next/link';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { initialCartItems } from '@/components/Cart/cart-mock-data';

import OrderSummary from './OrderSummary';
import StepProgress from './StepProgress';
import ContactSection from './ContactSection';
import PaymentMethodSection from './PaymentMethodSection';
import ShippingMethodSection from './ShippingMethodSection';
import ShippingAddressSection from './ShippingAddressSection';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  specs?: Array<{ label: string; value: string }>;
}

export default function Checkout() {
  const [email, setEmail] = useState('test@gmail.com');
  const [phone, setPhone] = useState('0899686063');
  const [country, setCountry] = useState('');
  const [firstName, setFirstName] = useState('Hải');
  const [lastName, setLastName] = useState('Nguyễn');
  const [address, setAddress] = useState('Nhà ở Hải');
  const [city, setCity] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');

  const cartItems: CartItem[] = initialCartItems as CartItem[];

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const couponDiscount = couponApplied ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal - couponDiscount;

  const steps = [
    { label: 'Thông tin', icon: CreditCard, done: true },
    { label: 'Vận chuyển', icon: CreditCard, done: true },
    { label: 'Thanh toán', icon: CreditCard, done: false },
  ];

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setCouponApplied(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Header />

      <main className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 py-4 text-[13px]">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            Trang Chủ
          </Link>
          <span className="text-muted-foreground/50">›</span>
          <Link href="/cart" className="text-muted-foreground hover:text-primary transition-colors">
            Giỏ Hàng
          </Link>
          <span className="text-muted-foreground/50">›</span>
          <span className="text-foreground font-500">Thanh Toán</span>
        </nav>

        {/* Step Progress */}
        <StepProgress steps={steps} />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 pb-16">
          {/* LEFT: Form */}
          <div className="flex-1 min-w-0 space-y-6">
            <ContactSection email={email} phone={phone} onEmailChange={setEmail} onPhoneChange={setPhone} />

            <ShippingAddressSection
              country={country}
              firstName={firstName}
              lastName={lastName}
              address={address}
              city={city}
              onCountryChange={setCountry}
              onFirstNameChange={setFirstName}
              onLastNameChange={setLastName}
              onAddressChange={setAddress}
              onCityChange={setCity}
            />

            <ShippingMethodSection
              shippingMethod={shippingMethod}
              onShippingMethodChange={setShippingMethod}
            />

            <PaymentMethodSection paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod} />
          </div>

          {/* RIGHT: Order Summary */}
          <OrderSummary
            items={cartItems}
            subtotal={subtotal}
            couponDiscount={couponDiscount}
            total={total}
            couponCode={couponCode}
            couponApplied={couponApplied}
            onCouponCodeChangeAction={setCouponCode}
            onApplyCouponAction={handleApplyCoupon}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
