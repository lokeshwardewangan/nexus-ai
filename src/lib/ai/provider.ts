import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import type { LanguageModel } from "ai";

/**
 * Resolves an assistant's `provider:model` id into a runnable language model.
 *
 * Each assistant declares its preferred model, but only Google is guaranteed to
 * be configured. When an OpenAI/Anthropic key is absent, we transparently fall
 * back to the default Gemini model so the studio always works with a single key.
 */

const DEFAULT_MODEL = "gemini-2.5-flash-lite";

export function resolveModel(modelId: string): LanguageModel {
  const [provider, ...rest] = modelId.split(":");
  const model = rest.join(":");

  switch (provider) {
    case "openai":
      return process.env.OPENAI_API_KEY ? openai(model) : google(DEFAULT_MODEL);
    case "anthropic":
      return process.env.ANTHROPIC_API_KEY ? anthropic(model) : google(DEFAULT_MODEL);
    case "google":
      return google(model || DEFAULT_MODEL);
    default:
      // Unknown or bare model id — treat as a Google model.
      return google(modelId || DEFAULT_MODEL);
  }
}
