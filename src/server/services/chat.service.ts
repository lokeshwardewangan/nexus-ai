import "server-only";

import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { getAssistant } from "@/config/assistants";
import { resolveModel } from "@/lib/ai/provider";
import type { ChatRequest } from "@/server/dto/chat.dto";
import { persistMessage } from "./conversation.service";

const FALLBACK_MODEL = "google:gemini-2.5-flash-lite";

function messageText(message: UIMessage): string {
  return message.parts.map((part) => (part.type === "text" ? part.text : "")).join("");
}

function deriveTitle(text: string): string | undefined {
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  return trimmed.length > 60 ? `${trimmed.slice(0, 57)}…` : trimmed;
}

/**
 * Streams an assistant's reply: resolves the assistant's system prompt and
 * model (with provider fallback), and — when a conversation is supplied —
 * persists the user message before streaming and the reply on finish.
 */
export async function streamAssistantReply({
  assistantId,
  conversationId,
  messages,
}: ChatRequest): Promise<Response> {
  const assistant = assistantId ? getAssistant(assistantId) : undefined;

  if (conversationId) {
    const last = messages.at(-1);
    if (last?.role === "user") {
      // Seed the title from the first message of a new conversation.
      const title = messages.length === 1 ? deriveTitle(messageText(last)) : undefined;
      await persistMessage(conversationId, "user", messageText(last), title);
    }
  }

  const result = streamText({
    model: resolveModel(assistant?.model ?? FALLBACK_MODEL),
    system: assistant?.systemPrompt,
    messages: await convertToModelMessages(messages),
    onFinish: async ({ text }) => {
      if (conversationId) await persistMessage(conversationId, "assistant", text);
    },
  });

  return result.toUIMessageStreamResponse();
}
