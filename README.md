# 🧠 Nexus AI

> An AI studio with 12 specialized assistants and chat‑with‑your‑documents (RAG) — built with Next.js, the Vercel AI SDK, and Supabase.

Nexus AI is a production‑style AI workspace: a library of purpose‑built assistants (for engineers, founders, writers, and learners), per‑assistant streaming chat, and a flagship **document chat** that answers questions grounded in your own files with citations.

---

## 🛠 Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui, next‑themes (light/dark)
- **AI:** Vercel AI SDK v6 — Google Gemini, OpenAI, and Anthropic (per‑assistant routing with fallback)
- **Backend:** Supabase (Postgres + `pgvector` + Auth + Row‑Level Security)
- **State / validation:** TanStack Query, Zod
- **Tooling:** ESLint, Prettier, Husky + lint‑staged

---

## ✨ Features

- ⚡ **Streaming chat** with markdown rendering, copy, and starter prompts
- 🧩 **12 specialized assistants** across Developer, Writing, Ideas, Career, Learning, and Health
- 📄 **Chat with your documents (RAG)** — upload PDF, Word, Excel, CSV, or text → cited answers, scoped to the documents you choose
- 🔀 **Multi‑model routing** — each assistant picks Gemini / GPT / Claude, gracefully falling back to Gemini
- 🔐 **Auth + persistence** — Supabase login, per‑user saved conversations, RLS
- 🌙 **Polished UX** — light/dark theme, responsive studio, smart auto‑scroll, tooltips
- 🧱 **Layered architecture** — controllers → services → repositories (server‑only)

---

## 🏗 Architecture

```
src/
  app/                 # routes (thin handlers delegate inward)
  server/              # server-only application layer
    controllers/       # parse + validate requests
    services/          # business logic (chat, rag, conversations, documents)
    repositories/      # Supabase data access
    dto/               # request schemas
  lib/                 # infra: supabase clients, ai provider, embeddings, utils
  features/            # frontend modules: landing, auth, studio, chat, documents
  components/          # shared UI (ui = shadcn, layout = chrome)
  config/              # assistant registry + site metadata
  types/               # shared domain types
supabase/migrations/   # database schema (tables, pgvector, RLS)
```

The app degrades gracefully: without Supabase keys it runs in a demo mode; add keys to enable auth, persistence, and RAG.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and **pnpm**
- A [Supabase](https://supabase.com) project
- A [Google Gemini](https://aistudio.google.com/apikey) API key (powers chat + embeddings)

### 1. Install

```bash
pnpm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
GOOGLE_GENERATIVE_AI_API_KEY=...
# optional — enable extra models
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

### 3. Set up the database

Run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) in the Supabase **SQL editor**. It creates the tables, enables `pgvector`, configures Row‑Level Security, and adds a signup → profile trigger.

### 4. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📜 Scripts

| Command       | Description                |
| ------------- | -------------------------- |
| `pnpm dev`    | Start the dev server       |
| `pnpm build`  | Production build           |
| `pnpm start`  | Serve the production build |
| `pnpm lint`   | Run ESLint                 |
| `pnpm format` | Format with Prettier       |

Commits run **lint‑staged** (ESLint + Prettier on staged files) via a Husky pre‑commit hook.

---

## 🔮 Roadmap

- 🔎 Source highlighting / passage view in document chat
- 🛠 Tool‑calling assistants (web search, calculators)
- 📊 Usage analytics and rate limiting
- 🎤 Voice input
