"use server";

import { updateProfile, type ProfileInput } from "@/server/services/profile.service";

export async function updateProfileAction(
  input: ProfileInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await updateProfile(input);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}
