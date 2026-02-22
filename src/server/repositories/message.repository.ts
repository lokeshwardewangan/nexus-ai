import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { ChatRole } from "@/types/conversation";

export interface MessageRow {
  id: string;
  role: ChatRole;
  content: string;
  created_at: string;
}

export async function selectMessagesByConversation(conversationId: string): Promise<MessageRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  return (data ?? []) as MessageRow[];
}

export async function insertMessage(
  conversationId: string,
  role: ChatRole,
  content: string,
): Promise<void> {
  const supabase = await createClient();
  await supabase.from("messages").insert({ conversation_id: conversationId, role, content });
}
