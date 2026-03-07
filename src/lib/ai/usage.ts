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
