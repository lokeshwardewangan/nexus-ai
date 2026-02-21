/**
 * Supabase connection config. Reading from env in one place lets the rest of
 * the app check {@link isSupabaseConfigured} and degrade gracefully to a demo
 * experience when keys are not set.
 */
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
};

export const isSupabaseConfigured = Boolean(supabaseConfig.url && supabaseConfig.anonKey);
