import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { getAssistant } from "@/config/assistants";
import { resolveModel } from "@/lib/ai/provider";

const FALLBACK_MODEL = "google:gemini-2.5-flash-lite";

export async function POST(req: Request) {
  const { messages, assistantId }: { messages: UIMessage[]; assistantId?: string } =
    await req.json();

  const assistant = assistantId ? getAssistant(assistantId) : undefined;

  const result = streamText({
    model: resolveModel(assistant?.model ?? FALLBACK_MODEL),
    system: assistant?.systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
