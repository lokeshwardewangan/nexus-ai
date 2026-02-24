/**
 * Supabase connection config. Reading from env in one place lets the rest of
 * the app check {@link isSupabaseConfigured} and degrade gracefully to a demo
 * experience when keys are not set.
 */
export const supabaseConfig = {
  // Normalize to the bare project URL. Guards against pasting the RESTful
  // endpoint (".../rest/v1") or a trailing slash, both of which break the
  // auth client and trigger PGRST125 "Invalid path specified".
  url: (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/rest\/v1$/, ""),
  anonKey: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim(),
};

export const isSupabaseConfigured = Boolean(supabaseConfig.url && supabaseConfig.anonKey);
