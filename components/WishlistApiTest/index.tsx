'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

import { Input } from '@heroui/input';
import { Button } from '@heroui/button';

import { useWishlists } from '@/hooks/useWishlists';

const DEFAULT_PRODUCT_IDS = ['4f7a3e20-13b6-4b37-a6f4-ec9db34b264b', '8d84ca9f-4542-4f27-af5e-0699215814a6'];

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

export default function WishlistApiTest() {
  const hasAutoRun = useRef(false);
  const [inputProductId, setInputProductId] = useState(DEFAULT_PRODUCT_IDS[0]);
  const [logs, setLogs] = useState<string[]>([]);

  const { addWishlistMutation } = useWishlists();

  const pushLog = useCallback((message: string) => {
    setLogs(prev => [`${new Date().toLocaleTimeString()} - ${message}`, ...prev]);
  }, []);

  const callAddWishlist = useCallback(
    async (productId: string, source: 'auto' | 'manual') => {
      if (!productId.trim()) {
        pushLog(`[${source}] productId is empty`);
        return;
      }

      try {
        const response = await addWishlistMutation.trigger({ csrf: true, productId });
        pushLog(`[${source}] success: ${productId} -> ${String(response?.data)}`);
      } catch (error) {
        pushLog(`[${source}] failed: ${productId} -> ${formatErrorMessage(error)}`);
      }
    },
    [addWishlistMutation, pushLog],
  );

  useEffect(() => {
    if (hasAutoRun.current) {
      return;
    }

    hasAutoRun.current = true;

    const autoRun = async () => {
      for (const productId of DEFAULT_PRODUCT_IDS) {
        await callAddWishlist(productId, 'auto');
      }
    };

    void autoRun();
  }, [callAddWishlist]);

  return (
    <div className="mx-auto w-full max-w-[90rem] p-6">
      <h1 className="mb-4 text-[2.2rem] font-700 leading-[3rem]">Wishlist API Test</h1>

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
            isLoading={addWishlistMutation.isMutating}
            onPress={() => void callAddWishlist(inputProductId, 'manual')}
          >
            Add To Wishlist
          </Button>

          <Button
            variant="bordered"
            isDisabled={addWishlistMutation.isMutating}
            onPress={() => {
              void (async () => {
                for (const productId of DEFAULT_PRODUCT_IDS) {
                  await callAddWishlist(productId, 'auto');
                }
              })();
            }}
          >
            Run Default IDs Again
          </Button>
        </div>
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
