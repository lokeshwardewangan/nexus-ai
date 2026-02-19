/**
 * Global brand + product metadata. Single source of truth for naming, copy,
 * and links so the identity stays consistent across every surface.
 */
export const siteConfig = {
  name: "Nexus AI",
  tagline: "Every AI assistant, one studio.",
  description:
    "Nexus AI is an AI studio — a library of specialized assistants for writing, learning, coding, and work, plus the ability to chat with your own documents and get cited answers.",
  // Short value prop used in hero / social cards.
  pitch: "Your AI studio for everything.",
} as const;

export type SiteConfig = typeof siteConfig;
