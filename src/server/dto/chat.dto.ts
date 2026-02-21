import "server-only";

import { z } from "zod";
import type { UIMessage } from "ai";

/**
 * Shape of an incoming chat request. The message list is validated for
 * structure here; its rich `UIMessage` typing is preserved for the service.
 */
const chatRequestSchema = z.object({
  assistantId: z.string().optional(),
  messages: z.array(z.unknown()).default([]),
});

export interface ChatRequest {
  assistantId?: string;
  messages: UIMessage[];
}

export function parseChatRequest(body: unknown): ChatRequest {
  const { assistantId, messages } = chatRequestSchema.parse(body);
  return { assistantId, messages: messages as UIMessage[] };
}
