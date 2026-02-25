import "server-only";

import mammoth from "mammoth";
import { extractText, getDocumentProxy } from "unpdf";
import * as XLSX from "xlsx";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { embedTexts } from "@/lib/ai/embeddings";
import { chunkText } from "@/lib/text/chunk";
import { findAuthUser } from "@/server/repositories/user.repository";
import {
  deleteDocument,
  insertChunks,
  insertDocument,
  selectDocumentsByUser,
  updateDocumentStatus,
} from "@/server/repositories/document.repository";
import type { DocumentSummary } from "@/types/document";

// Keep ingestion bounded so a single upload stays within request limits.
const MAX_CHUNKS = 80;

async function extractFileText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  if (name.endsWith(".pdf")) {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    return text;
  }

  if (name.endsWith(".docx")) {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }

  if (name.endsWith(".xlsx") || name.endsWith(".xls") || name.endsWith(".csv")) {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    return workbook.SheetNames.map(
      (sheet) => `# ${sheet}\n${XLSX.utils.sheet_to_csv(workbook.Sheets[sheet])}`,
    ).join("\n\n");
  }

  // .txt, .md, .markdown, .json, and other plain-text formats
  return new TextDecoder().decode(buffer);
}

/** Extracts, chunks, embeds, and stores a document for the signed-in user. */
export async function ingestDocument(file: File): Promise<DocumentSummary> {
  const user = await findAuthUser();
  if (!user) throw new Error("Not authenticated");

  const text = await extractFileText(file);
  const documentId = await insertDocument(user.id, file.name, file.size);

  try {
    const chunks = chunkText(text).slice(0, MAX_CHUNKS);
    if (chunks.length > 0) {
      const embeddings = await embedTexts(chunks);
      await insertChunks(
        chunks.map((content, index) => ({
          document_id: documentId,
          user_id: user.id,
          content,
          embedding: embeddings[index],
          chunk_index: index,
        })),
      );
    }
    await updateDocumentStatus(documentId, "ready");
    return {
      id: documentId,
      name: file.name,
      status: "ready",
      sizeBytes: file.size,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    await updateDocumentStatus(documentId, "failed");
    throw error;
  }
}

export async function listDocuments(): Promise<DocumentSummary[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const user = await findAuthUser();
    if (!user) return [];

    const rows = await selectDocumentsByUser(user.id);
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      status: row.status,
      sizeBytes: row.size_bytes,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error("[document] listDocuments failed", error);
    return [];
  }
}

export async function removeDocument(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await deleteDocument(id); // RLS scopes deletion to the owner
  } catch (error) {
    console.error("[document] removeDocument failed", error);
  }
}
