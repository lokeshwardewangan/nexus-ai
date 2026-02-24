import "server-only";

import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { resolveModel } from "@/lib/ai/provider";
import { embedQuery } from "@/lib/ai/embeddings";
import { findAuthUser } from "@/server/repositories/user.repository";
import { matchChunks, selectDocumentsByUser } from "@/server/repositories/document.repository";
import type { RetrievedChunk } from "@/types/document";

const RAG_MODEL = "google:gemini-2.5-flash-lite";

function messageText(message: UIMessage): string {
  return message.parts.map((part) => (part.type === "text" ? part.text : "")).join("");
}

/** Retrieves the most relevant chunks from the user's documents for a query. */
export async function retrieveContext(query: string, count = 6): Promise<RetrievedChunk[]> {
  if (!isSupabaseConfigured || !query.trim()) return [];

  try {
    const user = await findAuthUser();
    if (!user) return [];

    const embedding = await embedQuery(query);
    const [rows, documents] = await Promise.all([
      matchChunks(user.id, embedding, count),
      selectDocumentsByUser(user.id),
    ]);

    const nameById = new Map(documents.map((doc) => [doc.id, doc.name]));
    return rows.map((row) => ({
      documentId: row.document_id,
      documentName: nameById.get(row.document_id) ?? "Document",
      content: row.content,
      similarity: row.similarity,
    }));
  } catch (error) {
    console.error("[rag] retrieveContext failed", error);
    return [];
  }
}

/** Streams an answer grounded in the user's documents, with inline citations. */
export async function streamDocumentAnswer(messages: UIMessage[]): Promise<Response> {
  const last = messages.at(-1);
  const query = last ? messageText(last) : "";
  const chunks = await retrieveContext(query);

  const system =
    chunks.length > 0
      ? [
          "You answer questions using ONLY the sources below.",
          "Cite the sources you use inline like [Source 1], [Source 2].",
          "If the answer isn't in the sources, say you couldn't find it in the uploaded documents.",
          "",
          "Sources:",
          chunks
            .map(
              (chunk, index) => `[Source ${index + 1} — ${chunk.documentName}]\n${chunk.content}`,
            )
            .join("\n\n"),
        ].join("\n")
      : "The user has no documents that match their question. Tell them to upload relevant documents first, and keep it brief.";

  const result = streamText({
    model: resolveModel(RAG_MODEL),
    system,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
