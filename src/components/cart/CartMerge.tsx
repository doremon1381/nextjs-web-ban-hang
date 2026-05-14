'use client';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GUEST_SESSION_KEY } from '@/lib/api/client';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';

/**
 * Invisible component mounted inside CartProvider.
 * On SIGNED_IN: POSTs the guest cart session id to the backend so it can merge
 * the guest cart into the authenticated user's cart. Removes the local guest
 * session id on success. Fails silently — the backend may not be running yet.
 */
export function CartMerge() {
  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event !== 'SIGNED_IN' || !session?.access_token) return;

        const guestSessionId = localStorage.getItem(GUEST_SESSION_KEY);
        if (!guestSessionId) return;

        try {
          const res = await fetch(`${API_BASE}/api/v1/cart/merge`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ guestSessionId }),
          });

          if (res.ok) {
            localStorage.removeItem(GUEST_SESSION_KEY);
          }
        } catch {
          // Backend not yet running — fail silently.
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
