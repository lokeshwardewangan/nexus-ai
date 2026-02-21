import "server-only";

import { parseChatRequest } from "@/server/dto/chat.dto";
import { streamAssistantReply } from "@/server/services/chat.service";

/** Handles POST /api/chat: validates the request, then delegates to the service. */
export async function handleChatRequest(request: Request): Promise<Response> {
  const body = await request.json();
  const chatRequest = parseChatRequest(body);
  return streamAssistantReply(chatRequest);
}
