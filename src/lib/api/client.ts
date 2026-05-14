'use client';
import { createClient } from '@/lib/supabase/client';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';

// Matches the key the backend spec uses for the guest cart session id.
export const GUEST_SESSION_KEY = 'nv-session';

/**
 * React hook for client components.
 * Returns an `apiFetch` function that:
 *  - Attaches `Authorization: Bearer …` when the user is signed in.
 *  - Attaches `X-NV-Session` when the user is a guest (mutually exclusive).
 *  - Persists a server-minted guest session id on the first cart call.
 *  - Retries once on 401 after refreshing the access token.
 */
export function useApiFetch() {
  const supabase = createClient();

  return async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
    const { data: { session } } = await supabase.auth.getSession();
    const guestSession = localStorage.getItem(GUEST_SESSION_KEY);

    const headers = new Headers(init.headers);
    if (!headers.has('Content-Type') && init.body) {
      headers.set('Content-Type', 'application/json');
    }

    if (session?.access_token) {
      headers.set('Authorization', `Bearer ${session.access_token}`);
    } else if (guestSession) {
      headers.set('X-NV-Session', guestSession);
    }

    let res = await fetch(`${API_BASE}${path}`, { ...init, headers });

    // Server mints a guest session id on the first cart call — persist it.
    const issued = res.headers.get('X-NV-Session');
    if (issued && !session) {
      localStorage.setItem(GUEST_SESSION_KEY, issued);
    }

    // Retry once with a fresh token on 401.
    if (res.status === 401 && session) {
      const { data: { session: refreshed } } = await supabase.auth.refreshSession();
      if (refreshed?.access_token) {
        headers.set('Authorization', `Bearer ${refreshed.access_token}`);
        res = await fetch(`${API_BASE}${path}`, { ...init, headers });
      }
    }

    return res;
  };
}
