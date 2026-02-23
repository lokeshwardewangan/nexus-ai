import "server-only";

import { google } from "@ai-sdk/google";
import { embed, embedMany } from "ai";

/** text-embedding-004 outputs 768-dim vectors (matches the DB schema). */
const EMBEDDING_MODEL = "text-embedding-004";

export async function embedTexts(values: string[]): Promise<number[][]> {
  const { embeddings } = await embedMany({
    model: google.textEmbedding(EMBEDDING_MODEL),
    values,
  });
  return embeddings;
}

export async function embedQuery(value: string): Promise<number[]> {
  const { embedding } = await embed({
    model: google.textEmbedding(EMBEDDING_MODEL),
    value,
  });
  return embedding;
}
