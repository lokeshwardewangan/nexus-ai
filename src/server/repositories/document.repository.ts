import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { DocumentStatus } from "@/types/document";

export interface DocumentRow {
  id: string;
  name: string;
  status: DocumentStatus;
  size_bytes: number | null;
  created_at: string;
}

export interface ChunkInsert {
  document_id: string;
  user_id: string;
  content: string;
  embedding: number[];
  chunk_index: number;
}

export interface MatchedChunkRow {
  document_id: string;
  content: string;
  similarity: number;
}

export async function insertDocument(
  userId: string,
  name: string,
  sizeBytes: number,
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .insert({ user_id: userId, name, size_bytes: sizeBytes, status: "processing" })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function updateDocumentStatus(id: string, status: DocumentStatus): Promise<void> {
  const supabase = await createClient();
  await supabase.from("documents").update({ status }).eq("id", id);
}

export async function selectDocumentsByUser(userId: string): Promise<DocumentRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("documents")
    .select("id, name, status, size_bytes, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []) as DocumentRow[];
}

export async function deleteDocument(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("documents").delete().eq("id", id);
}

export async function insertChunks(chunks: ChunkInsert[]): Promise<void> {
  if (chunks.length === 0) return;
  const supabase = await createClient();
  const { error } = await supabase.from("document_chunks").insert(chunks);
  if (error) throw error;
}

export async function matchChunks(
  userId: string,
  queryEmbedding: number[],
  matchCount: number,
): Promise<MatchedChunkRow[]> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("match_document_chunks", {
    query_embedding: queryEmbedding,
    match_count: matchCount,
    filter_user_id: userId,
  });
  return (data ?? []) as MatchedChunkRow[];
}
