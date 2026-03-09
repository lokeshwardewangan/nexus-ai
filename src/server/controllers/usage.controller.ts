import "server-only";

import { getTokenUsage } from "@/server/services/profile.service";

/** Handles GET /api/usage: returns the signed-in user's current token total. */
export async function handleUsageRequest(): Promise<Response> {
  const tokensUsed = await getTokenUsage();
  return Response.json({ tokensUsed });
}
