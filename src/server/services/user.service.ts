import "server-only";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { findAuthUser } from "@/server/repositories/user.repository";
import type { StudioUser } from "@/types/user";

const DEMO_USER: StudioUser = { name: "Guest", email: "guest@nexus.ai" };

/**
 * Resolves the signed-in user for server components. Falls back to a demo user
 * when Supabase isn't configured so the studio stays explorable.
 */
export async function getCurrentUser(): Promise<StudioUser> {
  if (!isSupabaseConfigured) return DEMO_USER;

  const user = await findAuthUser();
  if (!user) return DEMO_USER;

  const fullName = (user.user_metadata?.full_name as string | undefined)?.trim();
  return {
    name: fullName || user.email?.split("@")[0] || "User",
    email: user.email ?? "",
  };
}
