interface ModelUsage {
  totalTokens?: number;
  inputTokens?: number;
  outputTokens?: number;
}

/** Normalizes an AI SDK usage object to a single total-token count. */
export function tokenCount(usage: ModelUsage | undefined): number {
  if (!usage) return 0;
  return usage.totalTokens ?? (usage.inputTokens ?? 0) + (usage.outputTokens ?? 0);
}

/**
 * Rough client-side token estimate (~4 characters per token) used only for the
 * live counter while a response streams. The exact total is reconciled from the
 * server once the response finishes.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
