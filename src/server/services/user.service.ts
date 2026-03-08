import "server-only";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { selectProfile } from "@/server/repositories/profile.repository";
import { findAuthUser } from "@/server/repositories/user.repository";
import type { StudioUser } from "@/types/user";

const DEMO_USER: StudioUser = {
  name: "Guest",
  email: "guest@nexus.ai",
  username: "guest",
  avatarUrl: null,
  tokensUsed: 0,
};

/**
 * Resolves the signed-in user for server components. Falls back to a demo user
 * when Supabase isn't configured so the studio stays explorable.
 */
export async function getCurrentUser(): Promise<StudioUser> {
  if (!isSupabaseConfigured) return DEMO_USER;

  const user = await findAuthUser();
  if (!user) return DEMO_USER;

  const row = await selectProfile(user.id);
  const meta = user.user_metadata ?? {};
  const fullName = (row?.full_name ?? (meta.full_name as string | undefined) ?? "").trim();

  return {
    name: fullName || user.email?.split("@")[0] || "User",
    email: row?.email ?? user.email ?? "",
    username: row?.username ?? "",
    avatarUrl: row?.avatar_url ?? (meta.avatar_url as string | undefined) ?? null,
    tokensUsed: row?.tokens_used ?? 0,
  };
}
