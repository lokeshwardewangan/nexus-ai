export type ChatRole = "user" | "assistant" | "system";

/** A conversation as listed in the studio sidebar. */
export interface ConversationSummary {
  id: string;
  assistantId: string;
  title: string;
  updatedAt: string;
}
