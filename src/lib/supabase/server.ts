import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { supabaseConfig } from "./config";

/** Supabase client for use in Server Components, Route Handlers, and Actions. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // `setAll` may be called from a Server Component, where writing cookies
        // throws. Middleware refreshes the session, so this can be ignored.
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // No-op outside a request that can mutate cookies.
        }
      },
    },
  });
}
