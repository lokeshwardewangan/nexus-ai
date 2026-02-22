"use server";

import { startConversation } from "@/server/services/conversation.service";

/** Creates a conversation on the first message of a new chat. */
export async function createConversationAction(assistantId: string): Promise<string | null> {
  return startConversation(assistantId);
}
