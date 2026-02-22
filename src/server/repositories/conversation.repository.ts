import "server-only";

import { createClient } from "@/lib/supabase/server";

export interface ConversationRow {
  id: string;
  assistant_id: string;
  title: string;
  updated_at: string;
}

export async function insertConversation(
  userId: string,
  assistantId: string,
  title: string,
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: userId, assistant_id: assistantId, title })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function selectConversationsByUser(userId: string): Promise<ConversationRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("conversations")
    .select("id, assistant_id, title, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(30);
  return (data ?? []) as ConversationRow[];
}

export async function selectConversationById(id: string): Promise<ConversationRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("conversations")
    .select("id, assistant_id, title, updated_at")
    .eq("id", id)
    .maybeSingle();
  return (data as ConversationRow | null) ?? null;
}

export async function touchConversation(id: string, title?: string): Promise<void> {
  const supabase = await createClient();
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (title) patch.title = title;
  await supabase.from("conversations").update(patch).eq("id", id);
}
