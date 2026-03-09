import { handleUsageRequest } from "@/server/controllers/usage.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleUsageRequest();
}
