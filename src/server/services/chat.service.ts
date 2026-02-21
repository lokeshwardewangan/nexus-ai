import "server-only";

import { convertToModelMessages, streamText } from "ai";

import { getAssistant } from "@/config/assistants";
import { resolveModel } from "@/lib/ai/provider";
import type { ChatRequest } from "@/server/dto/chat.dto";

const FALLBACK_MODEL = "google:gemini-2.5-flash-lite";

/**
 * Streams an assistant's reply: resolves the assistant's system prompt and
 * model (with provider fallback) and returns a UI message stream response.
 */
export async function streamAssistantReply({
  assistantId,
  messages,
}: ChatRequest): Promise<Response> {
  const assistant = assistantId ? getAssistant(assistantId) : undefined;

  const result = streamText({
    model: resolveModel(assistant?.model ?? FALLBACK_MODEL),
    system: assistant?.systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
