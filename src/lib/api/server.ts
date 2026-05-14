import { createClient } from '@/lib/supabase/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';

/**
 * Server-side fetch wrapper for RSC and Route Handlers.
 * Reads the Supabase access token from the server session and attaches it
 * as `Authorization: Bearer …`. Never sends the anon key to the .NET API.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }

  return fetch(`${API_BASE}${path}`, { ...init, headers });
}
