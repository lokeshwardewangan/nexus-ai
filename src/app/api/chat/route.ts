import { handleChatRequest } from "@/server/controllers/chat.controller";

export async function POST(request: Request) {
  return handleChatRequest(request);
}
