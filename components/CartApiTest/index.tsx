'use client';

import { useMemo, useState, useCallback } from 'react';

import { Input } from '@heroui/input';
import { Button } from '@heroui/button';

import { useCarts } from '@/hooks/useCarts';

const formatErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: string | string[] }).message;
    if (Array.isArray(message)) {
      return message[0] || 'Unknown error';
    }

    return message || 'Unknown error';
  }

  return 'Unknown error';
};

export default function CartApiTest() {
  const [inputProductId, setInputProductId] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const { addToCartMutation, getMyCart } = useCarts();
  const { data, isLoading, mutate } = getMyCart;

  const cartItems = useMemo(() => (Array.isArray(data?.data) ? data.data : []), [data?.data]);

  const pushLog = useCallback((message: string) => {
    setLogs(prev => [`${new Date().toLocaleTimeString()} - ${message}`, ...prev]);
  }, []);

  const callAddToCart = useCallback(async () => {
    const productId = inputProductId.trim();
    if (!productId) {
      pushLog('[manual] productId is empty');
      return;
    }

    try {
      const response = await addToCartMutation.trigger({
        csrf: true,
        productId,
        quantity: 1,
      });

      pushLog(`[manual] success: ${productId} -> itemId=${response?.data?.id || 'unknown'}`);
      await mutate();
    } catch (error) {
      pushLog(`[manual] failed: ${productId} -> ${formatErrorMessage(error)}`);
    }
  }, [addToCartMutation, inputProductId, mutate, pushLog]);

  return (
    <div className="mx-auto w-full max-w-[90rem] p-6">
      <h1 className="mb-4 text-[2.2rem] font-700 leading-[3rem]">Cart API Test</h1>

      <div className="mb-4 flex flex-col gap-3">
        <Input
          label="Product ID"
          value={inputProductId}
          onChange={event => setInputProductId(event.target.value)}
          placeholder="Nhap product id"
        />

        <div className="flex gap-3">
          <Button
            color="primary"
            isLoading={addToCartMutation.isMutating}
            onPress={() => {
              void callAddToCart();
            }}
          >
            Add To Cart
          </Button>

          <Button
            variant="bordered"
            isLoading={isLoading}
            isDisabled={addToCartMutation.isMutating}
            onPress={() => {
              void mutate();
            }}
          >
            Reload Cart
          </Button>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-default-200 p-4">
        <p className="mb-3 text-[1.4rem] font-600 leading-[2rem]">Cart Items: {cartItems.length}</p>

        {cartItems.length === 0 ? (
          <p className="text-[1.4rem] leading-[2rem] text-default-500">Cart is empty</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {cartItems.map(item => (
              <li key={item.id} className="text-[1.3rem] leading-[1.9rem] text-default-700">
                itemId={item.id} | productId={item.productId} | quantity={item.quantity}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-default-200 p-4">
        <p className="mb-3 text-[1.4rem] font-600 leading-[2rem]">Logs</p>

        {logs.length === 0 ? (
          <p className="text-[1.4rem] leading-[2rem] text-default-500">No logs yet</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {logs.map(log => (
              <li key={log} className="text-[1.3rem] leading-[1.9rem] text-default-700">
                {log}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
