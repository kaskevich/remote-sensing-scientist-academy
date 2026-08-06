import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export type SupabasePublicConfig = {
  url: string;
  key: string;
};

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();

  return url && key ? { url, key } : null;
}

export function isSupabaseConfigured() {
  return getSupabasePublicConfig() !== null;
}

export function getBrowserSupabaseClient(): SupabaseClient | null {
  const config = getSupabasePublicConfig();
  if (!config || typeof window === "undefined") {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(config.url, config.key, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
        flowType: "pkce",
      },
    });
  }

  return browserClient;
}

export function currentAuthRedirectUrl() {
  if (typeof window === "undefined") {
    return undefined;
  }

  const redirect = new URL(window.location.href);
  redirect.hash = "";
  redirect.search = "";
  return redirect.toString();
}
