'use client';

import { useMemo, useState } from 'react';
import { CreditCard } from 'lucide-react';

import Link from 'next/link';
import { addToast } from '@heroui/toast';
import { Spinner } from '@heroui/spinner';
import { useRouter } from 'next/navigation';

import { useCarts, type CartItem as ApiCartItem } from '@/hooks/useCarts';
import { useOrders, type CheckoutPaymentMethod } from '@/hooks/useOrders';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

import OrderSummary from './OrderSummary';
import StepProgress from './StepProgress';
import ContactSection from './ContactSection';
import PaymentMethodSection from './PaymentMethodSection';
import ShippingMethodSection from './ShippingMethodSection';
import ShippingAddressSection from './ShippingAddressSection';

interface CheckoutItem {
  id: number | string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  specs?: Array<{ label: string; value: string }>;
}

const toNumber = (value?: string | null) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: string | string[] }).message;

    if (Array.isArray(message)) {
      return message[0] || 'Thanh toán thất bại';
    }

    return message || 'Thanh toán thất bại';
  }

  return 'Thanh toán thất bại';
};

export default function Checkout() {
  const router = useRouter();

  const [email, setEmail] = useState('test@gmail.com');
  const [phone, setPhone] = useState('0899686063');
  const [firstName, setFirstName] = useState('Hải');
  const [lastName, setLastName] = useState('Nguyễn');
  const [address, setAddress] = useState('Nhà ở Hải');
  const [province, setProvince] = useState('Hà Nội');
  const [district, setDistrict] = useState('Ba Đình');
  const [commune, setCommune] = useState('Điện Biên');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('STANDARD');
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>('BANK_TRANSFER');
  const [note, setNote] = useState('');

  const { getMyCart } = useCarts();
  const { data, error, isLoading } = getMyCart;
  const { checkoutMutation } = useOrders();

  const cartApiItems = useMemo<ApiCartItem[]>(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data?.data]);

  const cartItems = useMemo<CheckoutItem[]>(() => {
    return cartApiItems
      .filter(item => Boolean(item.product))
      .map(item => {
        const product = item.product!;
        const variant = item.variant;

        const productListPrice = toNumber(product.listPrice);
        const productSalePrice = toNumber(product.salePrice);
        const variantListPrice = toNumber(variant?.listPrice);
        const variantSalePrice = toNumber(variant?.salePrice);

        const listPrice = variantListPrice > 0 ? variantListPrice : productListPrice;
        const salePrice = variantSalePrice > 0 ? variantSalePrice : productSalePrice;
        const hasSalePrice = salePrice > 0;

        const optionSpecs = (variant?.selectedOptionValues ?? [])
          .map(selected => {
            const optionLabel = selected.optionValue?.option?.name?.trim();
            const optionValue = selected.optionValue?.value?.trim();

            if (!optionLabel || !optionValue) {
              return null;
            }

            return {
              label: optionLabel,
              value: optionValue,
            };
          })
          .filter((spec): spec is { label: string; value: string } => Boolean(spec));

        const specs = [variant?.sku ? { label: 'SKU', value: variant.sku } : null, ...optionSpecs].filter(
          (spec): spec is { label: string; value: string } => Boolean(spec),
        );

        return {
          id: item.id,
          productId: item.productId,
          name: product.name,
          price: hasSalePrice ? salePrice : listPrice,
          ...(hasSalePrice && listPrice > salePrice ? { originalPrice: listPrice } : {}),
          quantity: item.quantity,
          image:
            product.images?.[0]?.url ||
            product.images?.[0]?.key ||
            'https://placehold.co/600x600?text=GolfBy',
          ...(specs.length > 0 ? { specs } : {}),
        };
      });
  }, [cartApiItems]);

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

  const canSubmitCheckout = cartItems.length > 0 && !isLoading;

  const handleCheckout = async () => {
    if (!canSubmitCheckout) {
      addToast({
        color: 'warning',
        description: 'Giỏ hàng đang trống hoặc chưa sẵn sàng để thanh toán.',
      });
      return;
    }

    const fullName = `${lastName} ${firstName}`.trim();

    if (
      !fullName ||
      !phone.trim() ||
      !address.trim() ||
      !province.trim() ||
      !district.trim() ||
      !commune.trim()
    ) {
      addToast({
        color: 'warning',
        description: 'Vui lòng nhập đầy đủ thông tin giao hàng bắt buộc.',
      });
      return;
    }

    try {
      const response = await checkoutMutation.trigger({
        address: address.trim(),
        commune: commune.trim(),
        csrf: true,
        ...(couponApplied && couponCode.trim() ? { discountCode: couponCode.trim() } : {}),
        district: district.trim(),
        fullName,
        ...(note.trim() ? { note: note.trim() } : {}),
        paymentMethod,
        phoneNumber: phone.trim(),
        province: province.trim(),
        shippingCode: shippingMethod,
      });

      await getMyCart.mutate();

      if (response?.data?.vietqrUrl) {
        const paymentSearchParams = new URLSearchParams({
          orderId: response.data.id,
          vietqrUrl: response.data.vietqrUrl,
        });

        addToast({
          color: 'success',
          description: 'Đặt hàng thành công. Vui lòng quét QR để thanh toán.',
        });

        router.push(`/checkout/payment?${paymentSearchParams.toString()}`);
        return;
      }

      addToast({
        color: 'success',
        description: 'Đặt hàng thành công.',
      });

      router.push('/');
    } catch (checkoutError) {
      addToast({
        color: 'danger',
        description: getErrorMessage(checkoutError),
      });
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
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner label="Đang tải dữ liệu giỏ hàng" size="lg" />
          </div>
        ) : error ? (
          <div className="py-16 text-center text-[1.4rem] text-danger">
            Không thể tải dữ liệu giỏ hàng. Vui lòng thử lại.
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 pb-16">
            {/* LEFT: Form */}
            <div className="flex-1 min-w-0 space-y-6">
              <ContactSection email={email} phone={phone} onEmailChange={setEmail} onPhoneChange={setPhone} />

              <ShippingAddressSection
                firstName={firstName}
                lastName={lastName}
                address={address}
                province={province}
                district={district}
                commune={commune}
                onFirstNameChange={setFirstName}
                onLastNameChange={setLastName}
                onAddressChange={setAddress}
                onProvinceChange={setProvince}
                onDistrictChange={setDistrict}
                onCommuneChange={setCommune}
              />

              <ShippingMethodSection
                shippingMethod={shippingMethod}
                onShippingMethodChange={setShippingMethod}
              />

              <PaymentMethodSection paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod} />

              <section className="bg-white rounded-2xl border border-border/50 p-6">
                <label className="mb-2 block text-[14px] text-foreground font-600">Ghi chú đơn hàng</label>
                <textarea
                  value={note}
                  onChange={event => setNote(event.target.value)}
                  placeholder="Ghi chú thêm cho đơn hàng (không bắt buộc)"
                  rows={3}
                  className="w-full rounded-xl border border-border bg-[#fafafa] px-4 py-3 text-[14px] outline-none focus:border-primary focus:bg-white"
                />
              </section>
            </div>

            {/* RIGHT: Order Summary */}
            <OrderSummary
              items={cartItems}
              subtotal={subtotal}
              couponDiscount={couponDiscount}
              total={total}
              couponCode={couponCode}
              couponApplied={couponApplied}
              canCheckout={canSubmitCheckout}
              isCheckoutLoading={checkoutMutation.isMutating}
              onCouponCodeChangeAction={setCouponCode}
              onApplyCouponAction={handleApplyCoupon}
              onCheckoutAction={() => {
                void handleCheckout();
              }}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
