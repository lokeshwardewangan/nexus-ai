import "server-only";

import type { UIMessage } from "ai";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { findAuthUser } from "@/server/repositories/user.repository";
import {
  insertConversation,
  selectConversationById,
  selectConversationsByUser,
  touchConversation,
} from "@/server/repositories/conversation.repository";
import {
  insertMessage,
  selectMessagesByConversation,
} from "@/server/repositories/message.repository";
import type { ChatRole, ConversationSummary } from "@/types/conversation";

export interface ConversationView {
  assistantId: string;
  title: string;
  messages: UIMessage[];
}

/**
 * Creates a new conversation for the signed-in user. Returns null in demo mode
 * or if persistence fails, so the chat can continue ephemerally.
 */
export async function startConversation(assistantId: string): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const user = await findAuthUser();
    if (!user) return null;
    return await insertConversation(user.id, assistantId, "New chat");
  } catch (error) {
    console.error("[conversation] startConversation failed", error);
    return null;
  }
}

/** Loads a conversation and its messages as UI messages (RLS scopes to owner). */
export async function getConversationView(
  conversationId: string,
): Promise<ConversationView | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const conversation = await selectConversationById(conversationId);
    if (!conversation) return null;

    const rows = await selectMessagesByConversation(conversationId);
    const messages = rows.map((row) => ({
      id: row.id,
      role: row.role,
      parts: [{ type: "text", text: row.content }],
    })) as UIMessage[];

    return { assistantId: conversation.assistant_id, title: conversation.title, messages };
  } catch (error) {
    console.error("[conversation] getConversationView failed", error);
    return null;
  }
}

/** Recent conversations for the sidebar. Empty in demo mode or on failure. */
export async function listRecentConversations(): Promise<ConversationSummary[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const user = await findAuthUser();
    if (!user) return [];

    const rows = await selectConversationsByUser(user.id);
    return rows.map((row) => ({
      id: row.id,
      assistantId: row.assistant_id,
      title: row.title,
      updatedAt: row.updated_at,
    }));
  } catch (error) {
    console.error("[conversation] listRecentConversations failed", error);
    return [];
  }
}

/**
 * Appends a message and bumps the conversation (optionally setting its title).
 * Best-effort: a persistence failure never breaks the chat response.
 */
export async function persistMessage(
  conversationId: string,
  role: ChatRole,
  content: string,
  title?: string,
): Promise<void> {
  if (!isSupabaseConfigured || !content.trim()) return;
  try {
    await insertMessage(conversationId, role, content);
    await touchConversation(conversationId, title);
  } catch (error) {
    console.error("[conversation] persistMessage failed", error);
  }
}
