'use client';

import { CreditCard } from 'lucide-react';
import { useRef, useMemo, useState, useEffect } from 'react';

import Link from 'next/link';
import { addToast } from '@heroui/toast';
import { Spinner } from '@heroui/spinner';
import { useRouter } from 'next/navigation';

import { getSessionKey, removeSessionKey } from '@/utils/localStorage';
import {
  type DirectCheckoutItem,
  CHECKOUT_DIRECT_ITEMS_KEY,
  normalizeDirectCheckoutItems,
  normalizeSelectedCartItemIds,
  CHECKOUT_SELECTED_CART_ITEM_IDS_KEY,
} from '@/utils/checkoutSelection';

import { useSession } from '@/hooks/auth';
import { useUserAddress } from '@/hooks/useUserAddress';
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

const CHECKOUT_IMAGE_FALLBACK = 'https://placehold.co/600x600?text=GolfBy';

const toNumber = (value?: string | number | null) => {
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
  const hasPrefilledDefaultAddressRef = useRef(false);

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [province, setProvince] = useState('');
  const [commune, setCommune] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('STANDARD');
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>('BANK_TRANSFER');
  const [note, setNote] = useState('');
  const [selectedCartItemIds, setSelectedCartItemIds] = useState<string[] | null>(null);
  const [directCheckoutItems, setDirectCheckoutItems] = useState<DirectCheckoutItem[]>([]);

  const { data: sessionData } = useSession();
  const { defaultAddress } = useUserAddress();
  const { getMyCart } = useCarts();
  const { data, error, isLoading } = getMyCart;
  const { checkoutMutation } = useOrders();

  const userEmail = sessionData?.userInfo?.email || '';

  useEffect(() => {
    const savedDirectItems = normalizeDirectCheckoutItems(
      getSessionKey<unknown>(CHECKOUT_DIRECT_ITEMS_KEY),
    );

    if (savedDirectItems.length > 0) {
      setDirectCheckoutItems(savedDirectItems);
      setSelectedCartItemIds(null);
      return;
    }

    setDirectCheckoutItems([]);

    const savedCartItemIds = normalizeSelectedCartItemIds(
      getSessionKey<unknown>(CHECKOUT_SELECTED_CART_ITEM_IDS_KEY),
    );

    if (savedCartItemIds.length > 0) {
      setSelectedCartItemIds(savedCartItemIds);
      return;
    }

    setSelectedCartItemIds(null);
  }, []);

  useEffect(() => {
    if (!userEmail) {
      return;
    }

    setEmail(prev => prev || userEmail);
  }, [userEmail]);

  useEffect(() => {
    if (!defaultAddress || hasPrefilledDefaultAddressRef.current) {
      return;
    }

    setFirstName(prev => prev || defaultAddress.firstName || '');
    setLastName(prev => prev || defaultAddress.lastName || '');
    setPhone(prev => prev || defaultAddress.phone || '');
    setAddress(prev => prev || defaultAddress.address1 || '');
    setCountry(prev => prev || defaultAddress.country || '');
    setProvince(prev => prev || defaultAddress.city || '');
    setCommune(prev => prev || defaultAddress.commune || '');

    hasPrefilledDefaultAddressRef.current = true;
  }, [defaultAddress]);

  const isDirectCheckout = directCheckoutItems.length > 0;

  const cartApiItems = useMemo<ApiCartItem[]>(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data?.data]);

  const checkoutCartApiItems = useMemo<ApiCartItem[]>(() => {
    if (isDirectCheckout) {
      return [];
    }

    if (!selectedCartItemIds || selectedCartItemIds.length === 0) {
      return cartApiItems;
    }

    const selectedCartItemIdSet = new Set(selectedCartItemIds);
    const filteredItems = cartApiItems.filter(item => selectedCartItemIdSet.has(String(item.id)));

    return filteredItems.length > 0 ? filteredItems : cartApiItems;
  }, [cartApiItems, isDirectCheckout, selectedCartItemIds]);

  const cartItems = useMemo<CheckoutItem[]>(() => {
    if (isDirectCheckout) {
      return directCheckoutItems.map((item, index) => {
        const normalizedPrice = toNumber(item.price);
        const normalizedOriginalPrice = toNumber(item.originalPrice);
        const displayPrice = normalizedPrice > 0 ? normalizedPrice : normalizedOriginalPrice;
        const specs = (item.specs ?? []).filter(
          spec => spec.label.trim().length > 0 && spec.value.trim().length > 0,
        );

        return {
          id: item.variantId ? `${item.productId}:${item.variantId}:${index}` : `${item.productId}:${index}`,
          productId: item.productId,
          name: item.name ?? 'Sản phẩm mua ngay',
          price: displayPrice,
          ...(normalizedOriginalPrice > displayPrice && displayPrice > 0
            ? { originalPrice: normalizedOriginalPrice }
            : {}),
          quantity: item.quantity,
          image: item.image ?? CHECKOUT_IMAGE_FALLBACK,
          ...(specs.length > 0 ? { specs } : {}),
        };
      });
    }

    return checkoutCartApiItems
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
  }, [checkoutCartApiItems, directCheckoutItems, isDirectCheckout]);

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

  const canSubmitCheckout = cartItems.length > 0 && (isDirectCheckout || !isLoading);

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
      !commune.trim()
    ) {
      addToast({
        color: 'warning',
        description: 'Vui lòng nhập đầy đủ thông tin giao hàng bắt buộc.',
      });
      return;
    }

    const directItemsPayload = directCheckoutItems.map(item => ({
      ...(item.variantId ? { variantId: item.variantId } : {}),
      productId: item.productId,
      quantity: item.quantity,
    }));

    try {
      const response = await checkoutMutation.trigger({
        address: address.trim(),
        ...(isDirectCheckout
          ? { directItems: directItemsPayload }
          : { cartItemIds: cartItems.map(item => String(item.id)) }),
        commune: commune.trim(),
        csrf: true,
        ...(couponApplied && couponCode.trim() ? { discountCode: couponCode.trim() } : {}),
        fullName,
        ...(note.trim() ? { note: note.trim() } : {}),
        paymentMethod,
        phoneNumber: phone.trim(),
        province: province.trim(),
        shippingCode: shippingMethod,
      });

      if (!isDirectCheckout) {
        await getMyCart.mutate();
      }

      removeSessionKey(CHECKOUT_DIRECT_ITEMS_KEY);
      removeSessionKey(CHECKOUT_SELECTED_CART_ITEM_IDS_KEY);
      setDirectCheckoutItems([]);
      setSelectedCartItemIds(null);

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
        {!isDirectCheckout && isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner label="Đang tải dữ liệu giỏ hàng" size="lg" />
          </div>
        ) : !isDirectCheckout && error ? (
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
                country={country}
                province={province}
                commune={commune}
                onFirstNameChange={setFirstName}
                onLastNameChange={setLastName}
                onAddressChange={setAddress}
                onCountryChange={setCountry}
                onProvinceChange={setProvince}
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
