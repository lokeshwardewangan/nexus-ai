import "server-only";

import type { UIMessage } from "ai";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ingestDocument, removeDocument } from "@/server/services/document.service";
import { streamDocumentAnswer } from "@/server/services/rag.service";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function handleUploadDocument(request: Request): Promise<Response> {
  if (!isSupabaseConfigured) {
    return Response.json({ error: "Document storage is not configured." }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: "File is too large (max 10 MB)." }, { status: 400 });
  }

  try {
    const document = await ingestDocument(file);
    return Response.json(document);
  } catch (error) {
    console.error("[document] upload failed", error);
    return Response.json(
      { error: "Couldn't read this file. Try a PDF, Word, Excel, or text file." },
      { status: 500 },
    );
  }
}

export async function handleDeleteDocument(id: string): Promise<Response> {
  await removeDocument(id);
  return new Response(null, { status: 204 });
}

export async function handleDocumentChat(request: Request): Promise<Response> {
  const { messages, documentIds } = (await request.json()) as {
    messages?: UIMessage[];
    documentIds?: string[];
  };
  return streamDocumentAnswer(messages ?? [], documentIds);
}
