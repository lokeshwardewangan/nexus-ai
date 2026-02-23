import "server-only";

import type { UIMessage } from "ai";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ingestDocument, removeDocument } from "@/server/services/document.service";
import { streamDocumentAnswer } from "@/server/services/rag.service";

export async function handleUploadDocument(request: Request): Promise<Response> {
  if (!isSupabaseConfigured) {
    return Response.json({ error: "Document storage is not configured." }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided." }, { status: 400 });
  }

  try {
    const document = await ingestDocument(file);
    return Response.json(document);
  } catch {
    return Response.json({ error: "Failed to process the document." }, { status: 500 });
  }
}

export async function handleDeleteDocument(id: string): Promise<Response> {
  await removeDocument(id);
  return new Response(null, { status: 204 });
}

export async function handleDocumentChat(request: Request): Promise<Response> {
  const { messages } = (await request.json()) as { messages?: UIMessage[] };
  return streamDocumentAnswer(messages ?? []);
}
