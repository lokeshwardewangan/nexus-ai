import { createBrowserClient } from "@supabase/ssr";

import { supabaseConfig } from "./config";

/** Supabase client for use in browser ("use client") components. */
export function createClient() {
  return createBrowserClient(supabaseConfig.url, supabaseConfig.anonKey);
}
