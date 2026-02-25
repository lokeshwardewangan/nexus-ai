import "server-only";

import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { resolveModel } from "@/lib/ai/provider";
import { embedQuery } from "@/lib/ai/embeddings";
import { findAuthUser } from "@/server/repositories/user.repository";
import { matchChunks, selectDocumentsByUser } from "@/server/repositories/document.repository";
import type { RetrievedChunk } from "@/types/document";

const RAG_MODEL = "google:gemini-2.5-flash";
const DEFAULT_COUNT = 6;

function messageText(message: UIMessage): string {
  return message.parts.map((part) => (part.type === "text" ? part.text : "")).join("");
}

/**
 * Retrieves the most relevant chunks from the user's documents for a query.
 * When `documentIds` is provided, retrieval is scoped to those documents
 * (over-fetch then filter, since the match function is user-scoped).
 */
export async function retrieveContext(
  query: string,
  documentIds?: string[],
  count = DEFAULT_COUNT,
): Promise<RetrievedChunk[]> {
  if (!isSupabaseConfigured || !query.trim()) return [];

  try {
    const user = await findAuthUser();
    if (!user) return [];

    const scoped = Boolean(documentIds && documentIds.length > 0);
    const fetchCount = scoped ? Math.min(count * 8, 60) : count;

    const embedding = await embedQuery(query);
    const [rows, documents] = await Promise.all([
      matchChunks(user.id, embedding, fetchCount),
      selectDocumentsByUser(user.id),
    ]);

    const nameById = new Map(documents.map((doc) => [doc.id, doc.name]));
    let chunks = rows.map((row) => ({
      documentId: row.document_id,
      documentName: nameById.get(row.document_id) ?? "Document",
      content: row.content,
      similarity: row.similarity,
    }));

    if (scoped) {
      const allowed = new Set(documentIds);
      chunks = chunks.filter((chunk) => allowed.has(chunk.documentId)).slice(0, count);
    }

    return chunks;
  } catch (error) {
    console.error("[rag] retrieveContext failed", error);
    return [];
  }
}

/** Streams an answer grounded in the (optionally scoped) documents, naming sources. */
export async function streamDocumentAnswer(
  messages: UIMessage[],
  documentIds?: string[],
): Promise<Response> {
  const last = messages.at(-1);
  const query = last ? messageText(last) : "";
  const chunks = await retrieveContext(query, documentIds);

  const system =
    chunks.length > 0
      ? [
          "You answer questions using ONLY the sources below, which come from the user's uploaded documents.",
          "Write a clean, natural, well-formatted answer (short paragraphs, lists, or bold where helpful).",
          "Do NOT append the file or source name after sentences or list items — that clutters the answer. Mention a document's name at most once, and only if it is genuinely needed to distinguish between multiple different documents.",
          "If the answer isn't in the sources, clearly say you couldn't find it in the selected documents.",
          "",
          "Sources:",
          chunks.map((chunk) => `[From "${chunk.documentName}"]\n${chunk.content}`).join("\n\n"),
        ].join("\n")
      : "There are no documents matching the user's question in the selected scope. Briefly tell them to upload relevant documents or widen the document selection.";

  const result = streamText({
    model: resolveModel(RAG_MODEL),
    system,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
