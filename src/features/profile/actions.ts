"use server";

import { profileSchema } from "@/lib/validations/profile";
import { setAvatarUrl, updateProfile } from "@/server/services/profile.service";

type ProfileActionResult = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function updateProfileAction(input: unknown): Promise<ProfileActionResult> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, fieldErrors };
  }

  try {
    await updateProfile(parsed.data);
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update profile";
    if (message.toLowerCase().includes("username")) {
      return { ok: false, fieldErrors: { username: message } };
    }
    return { ok: false, error: message };
  }
}

export async function updateAvatarAction(
  avatarUrl: string | null,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await setAvatarUrl(avatarUrl);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to update photo",
    };
  }
}
