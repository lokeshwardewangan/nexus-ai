import "server-only";

import { createClient } from "@/lib/supabase/server";

export interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  headline: string | null;
  tokens_used: number;
}

export type ProfilePatch = {
  full_name: string | null;
  username: string | null;
  headline: string | null;
  bio: string | null;
};

export async function selectProfile(userId: string): Promise<ProfileRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, username, bio, headline, tokens_used")
    .eq("id", userId)
    .maybeSingle();
  return (data as ProfileRow | null) ?? null;
}

export async function updateProfileRow(userId: string, patch: ProfilePatch): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
  if (error) throw error;
}

/** Adds to the signed-in user's token total via an auth.uid()-scoped RPC. */
export async function addTokenUsage(amount: number): Promise<void> {
  const supabase = await createClient();
  await supabase.rpc("add_token_usage", { amount });
}
