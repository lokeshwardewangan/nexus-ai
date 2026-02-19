import {
  Braces,
  Briefcase,
  Code2,
  GraduationCap,
  Languages,
  Lightbulb,
  Mail,
  MessageSquare,
  MessageSquareReply,
  Mic,
  PenLine,
  ScrollText,
  Sparkles,
  UserRound,
  Wand2,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * The assistant catalog powering Nexus AI. This registry is the single source
 * of truth — the landing showcase, studio sidebar, and chat runtime all read
 * from here, so adding an assistant is a one-object change.
 *
 * `model` uses a `provider:model` id resolved by the AI layer, which falls back
 * to the default provider when a given provider's API key is absent.
 */

export type CategoryId =
  | "communication"
  | "learning"
  | "productivity"
  | "developer"
  | "career"
  | "creative";

export interface Category {
  id: CategoryId;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Tailwind gradient stops used for the category's accent. */
  accent: string;
}

export const categories: Category[] = [
  {
    id: "communication",
    label: "Communication",
    description: "Say it clearly, kindly, and in the right tone.",
    icon: MessageSquare,
    accent: "from-indigo-500 to-violet-600",
  },
  {
    id: "learning",
    label: "Learning",
    description: "Understand anything and level up your skills.",
    icon: GraduationCap,
    accent: "from-blue-500 to-indigo-600",
  },
  {
    id: "productivity",
    label: "Productivity",
    description: "Get through work faster with less effort.",
    icon: Zap,
    accent: "from-violet-500 to-purple-600",
  },
  {
    id: "developer",
    label: "Developer",
    description: "Write, explain, and debug code with a mentor.",
    icon: Code2,
    accent: "from-cyan-500 to-blue-600",
  },
  {
    id: "career",
    label: "Career",
    description: "Land the role and grow professionally.",
    icon: Briefcase,
    accent: "from-fuchsia-500 to-purple-600",
  },
  {
    id: "creative",
    label: "Creative",
    description: "Brainstorm and create without the blank page.",
    icon: Sparkles,
    accent: "from-pink-500 to-rose-600",
  },
];

export interface Assistant {
  id: string;
  name: string;
  /** One-line promise shown on cards. */
  tagline: string;
  /** Slightly longer supporting copy. */
  description: string;
  category: CategoryId;
  icon: LucideIcon;
  /** `provider:model`, resolved (with fallback) by the AI layer. */
  model: string;
  /** Instructions that define the assistant's behavior. */
  systemPrompt: string;
  /** Example prompts surfaced as starters in the chat UI. */
  starters: string[];
}

export const assistants: Assistant[] = [
  // ── Communication ──────────────────────────────────────────────
  {
    id: "tone-rewriter",
    name: "Tone Rewriter",
    tagline: "Rewrite anything in the perfect tone.",
    description:
      "Turn blunt, casual, or emotional messages into professional, polite, or assertive ones. Understands slang and Hinglish.",
    category: "communication",
    icon: Wand2,
    model: "google:gemini-2.5-flash-lite",
    systemPrompt:
      "You are a tone-rewriting expert. Rewrite the user's message in the tone they request (default: professional and polite). Preserve meaning, fix grammar, and keep it natural. Understand slang and Hinglish. Reply with only the rewritten message unless asked to explain.",
    starters: [
      "Rewrite this professionally: send me the file now",
      "Make this polite: why is this still not done?",
      "Turn this into an assertive request",
    ],
  },
  {
    id: "reply-assistant",
    name: "Reply Assistant",
    tagline: "The right reply, every time.",
    description:
      "Paste a message you received and get smart, ready-to-send replies in the tone you choose.",
    category: "communication",
    icon: MessageSquareReply,
    model: "google:gemini-2.5-flash-lite",
    systemPrompt:
      "You help the user reply to messages. Given an incoming message, suggest concise, context-appropriate replies. Offer a couple of tone options (e.g. friendly and formal) when useful. Keep replies natural and ready to send.",
    starters: [
      "Reply to: Can we reschedule to Friday?",
      "Draft a polite decline to a meeting invite",
      "Respond warmly to a thank-you message",
    ],
  },

  // ── Learning ───────────────────────────────────────────────────
  {
    id: "study-tutor",
    name: "Study Tutor",
    tagline: "Understand anything, step by step.",
    description:
      "Explains hard concepts in plain language with examples and analogies, at whatever depth you need.",
    category: "learning",
    icon: GraduationCap,
    model: "google:gemini-2.5-flash-lite",
    systemPrompt:
      "You are a patient, encouraging tutor. Explain concepts clearly using simple language, concrete examples, and analogies. Check understanding, break problems into steps, and adapt the depth to the learner. Never just give answers to homework without explaining the reasoning.",
    starters: [
      "Explain how neural networks learn, simply",
      "What is compound interest? Use an example",
      "Help me understand recursion",
    ],
  },
  {
    id: "language-coach",
    name: "Language Coach",
    tagline: "Fix your English, and learn why.",
    description:
      "Corrects grammar, explains mistakes in plain terms, and shows how a native speaker would phrase it.",
    category: "learning",
    icon: Languages,
    model: "google:gemini-2.5-flash-lite",
    systemPrompt:
      "You are an English language coach. Correct the user's grammar and phrasing, briefly explain each correction so they learn, and offer a natural, native-sounding version. Be encouraging and concise.",
    starters: [
      "Check this: He don't have no time for meeting",
      "How do native speakers say 'do the needful'?",
      "Make this sound more natural and fluent",
    ],
  },

  // ── Productivity ───────────────────────────────────────────────
  {
    id: "summarizer",
    name: "Summarizer",
    tagline: "The key points, in seconds.",
    description:
      "Condenses long text, threads, or notes into clear summaries, bullet points, or action items.",
    category: "productivity",
    icon: ScrollText,
    model: "google:gemini-2.5-flash-lite",
    systemPrompt:
      "You summarize content accurately and concisely. Default to a short paragraph plus key bullet points. Extract action items and decisions when present. Never invent details that are not in the source.",
    starters: [
      "Summarize this article into 5 bullets",
      "Give me the action items from these notes",
      "TL;DR this email thread",
    ],
  },
  {
    id: "email-composer",
    name: "Email Composer",
    tagline: "Well-written emails, fast.",
    description:
      "Drafts clear, professional emails from a few bullet points — follow-ups, requests, updates, and more.",
    category: "productivity",
    icon: Mail,
    model: "google:gemini-2.5-flash-lite",
    systemPrompt:
      "You draft professional emails from the user's rough notes. Produce a clear subject line and a well-structured body with an appropriate tone. Keep it concise and ready to send. Ask for missing essentials only when truly necessary.",
    starters: [
      "Write a follow-up email after a job interview",
      "Draft a polite payment reminder to a client",
      "Email my team about a deadline moving to Monday",
    ],
  },

  // ── Developer ──────────────────────────────────────────────────
  {
    id: "code-mentor",
    name: "Code Mentor",
    tagline: "Explain, debug, and improve code.",
    description:
      "Walks through code, finds bugs, suggests cleaner approaches, and explains the why — like a senior pair.",
    category: "developer",
    icon: Code2,
    model: "anthropic:claude-sonnet-4-6",
    systemPrompt:
      "You are a senior software engineer mentoring the user. Explain code clearly, identify bugs and edge cases, and suggest cleaner, idiomatic improvements with reasoning. Use fenced code blocks with language tags. Be precise and pragmatic.",
    starters: [
      "Why is this function returning undefined?",
      "Refactor this loop to be more readable",
      "Explain what this regex does",
    ],
  },
  {
    id: "query-helper",
    name: "Query Helper",
    tagline: "SQL and regex, made easy.",
    description:
      "Generates and explains SQL queries and regular expressions from a plain-English description.",
    category: "developer",
    icon: Braces,
    model: "anthropic:claude-sonnet-4-6",
    systemPrompt:
      "You translate plain-English requests into correct SQL queries or regular expressions, and explain how they work. State assumptions about schema or input. Prefer standard, portable syntax and warn about dialect-specific features.",
    starters: [
      "SQL: top 5 customers by total order value",
      "Regex to match an email address",
      "Explain this SQL join to me",
    ],
  },

  // ── Career ─────────────────────────────────────────────────────
  {
    id: "resume-helper",
    name: "Resume Helper",
    tagline: "Make your experience shine.",
    description:
      "Sharpens resume bullet points with strong action verbs and measurable impact, tailored to a role.",
    category: "career",
    icon: UserRound,
    model: "openai:gpt-4o-mini",
    systemPrompt:
      "You are a resume expert. Rewrite experience into crisp, achievement-oriented bullet points using strong action verbs and quantified impact where possible. Tailor language to the target role. Keep it truthful — never fabricate metrics; ask the user for numbers when helpful.",
    starters: [
      "Improve: responsible for managing the team",
      "Tailor my bullets for a product manager role",
      "Write a resume summary for a frontend developer",
    ],
  },
  {
    id: "interview-coach",
    name: "Interview Coach",
    tagline: "Practice, and get better.",
    description:
      "Runs mock interviews, asks role-specific questions, and gives honest feedback on your answers.",
    category: "career",
    icon: Mic,
    model: "openai:gpt-4o-mini",
    systemPrompt:
      "You are an interview coach. Ask one role-relevant question at a time, wait for the user's answer, then give specific, constructive feedback (structure, content, clarity) and a stronger example. Cover behavioral and technical questions as appropriate.",
    starters: [
      "Mock interview me for a software engineer role",
      "Ask me a behavioral question about teamwork",
      "How do I answer 'what's your weakness'?",
    ],
  },

  // ── Creative ───────────────────────────────────────────────────
  {
    id: "brainstorm-buddy",
    name: "Brainstorm Buddy",
    tagline: "Beat the blank page.",
    description:
      "Generates ideas, angles, and directions for anything — names, content, projects, gifts, and more.",
    category: "creative",
    icon: Lightbulb,
    model: "google:gemini-2.5-flash-lite",
    systemPrompt:
      "You are an energetic brainstorming partner. Generate diverse, non-obvious ideas quickly, grouped and easy to scan. Build on the user's direction, push for originality, and offer to go deeper on any idea.",
    starters: [
      "10 name ideas for a coffee brand",
      "Content ideas for a fitness Instagram",
      "Unique gift ideas for a developer",
    ],
  },
  {
    id: "content-writer",
    name: "Content Writer",
    tagline: "Polished copy, on demand.",
    description:
      "Writes posts, captions, blurbs, and short-form content in a voice that fits your brand.",
    category: "creative",
    icon: PenLine,
    model: "google:gemini-2.5-flash-lite",
    systemPrompt:
      "You are a versatile content writer. Produce clear, engaging copy in the format and voice requested (posts, captions, intros, product blurbs). Match the tone to the audience and keep it tight. Offer a couple of variations when helpful.",
    starters: [
      "Write a LinkedIn post about shipping a side project",
      "3 catchy captions for a product launch",
      "A punchy intro for a blog about productivity",
    ],
  },
];

export function getAssistant(id: string): Assistant | undefined {
  return assistants.find((assistant) => assistant.id === id);
}

export function getAssistantsByCategory(categoryId: CategoryId): Assistant[] {
  return assistants.filter((assistant) => assistant.category === categoryId);
}
