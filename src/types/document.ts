export type DocumentStatus = "processing" | "ready" | "failed";

/** A document as listed on the documents page. */
export interface DocumentSummary {
  id: string;
  name: string;
  status: DocumentStatus;
  sizeBytes: number | null;
  createdAt: string;
}

/** A chunk retrieved for RAG, with its source document and similarity score. */
export interface RetrievedChunk {
  documentId: string;
  documentName: string;
  content: string;
  similarity: number;
}
