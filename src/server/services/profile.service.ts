import "server-only";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { findAuthUser } from "@/server/repositories/user.repository";
import {
  addTokenUsage,
  selectProfile,
  updateProfileRow,
} from "@/server/repositories/profile.repository";
import type { Profile } from "@/types/profile";

export interface ProfileInput {
  fullName: string;
  username: string;
  headline: string;
  bio: string;
}

/** Loads the signed-in user's profile (null in demo mode / when signed out). */
export async function getProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured) return null;

  const user = await findAuthUser();
  if (!user) return null;

  const row = await selectProfile(user.id);
  return {
    id: user.id,
    email: row?.email ?? user.email ?? "",
    fullName: row?.full_name ?? "",
    username: row?.username ?? "",
    headline: row?.headline ?? "",
    bio: row?.bio ?? "",
    tokensUsed: row?.tokens_used ?? 0,
  };
}

export async function updateProfile(input: ProfileInput): Promise<void> {
  if (!isSupabaseConfigured) return;

  const user = await findAuthUser();
  if (!user) return;

  await updateProfileRow(user.id, {
    full_name: input.fullName.trim() || null,
    username: input.username.trim() || null,
    headline: input.headline.trim() || null,
    bio: input.bio.trim() || null,
  });
}

/** Best-effort: add a completed response's token count to the user's total. */
export async function recordTokenUsage(tokens: number): Promise<void> {
  if (!isSupabaseConfigured || !Number.isFinite(tokens) || tokens <= 0) return;
  try {
    await addTokenUsage(Math.round(tokens));
  } catch (error) {
    console.error("[profile] recordTokenUsage failed", error);
  }
}
