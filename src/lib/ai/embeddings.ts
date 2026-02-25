import "server-only";

import { google } from "@ai-sdk/google";
import { embed, embedMany } from "ai";

// gemini-embedding-001 defaults to 3072 dims; we request 768 to match the
// pgvector(768) schema. Cosine distance is magnitude-invariant, so the
// (unnormalized) reduced-dimension vectors work directly for retrieval.
const EMBEDDING_MODEL = "gemini-embedding-001";
const OUTPUT_DIMENSIONS = 768;

const providerOptions = { google: { outputDimensionality: OUTPUT_DIMENSIONS } };

export async function embedTexts(values: string[]): Promise<number[][]> {
  const { embeddings } = await embedMany({
    model: google.textEmbedding(EMBEDDING_MODEL),
    values,
    providerOptions,
  });
  return embeddings;
}

export async function embedQuery(value: string): Promise<number[]> {
  const { embedding } = await embed({
    model: google.textEmbedding(EMBEDDING_MODEL),
    value,
    providerOptions,
  });
  return embedding;
}
