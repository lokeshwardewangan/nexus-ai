-- ============================================================================
-- Nexus AI — initial schema
-- Run in the Supabase SQL editor (or `supabase db push`).
-- Embedding dimension 768 matches Google's text-embedding-004 model.
-- ============================================================================

create extension if not exists vector;

-- ── Profiles (1:1 with auth.users) ─────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- ── Conversations ──────────────────────────────────────────────────────────
create table if not exists public.conversations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  assistant_id  text not null,
  title         text not null default 'New chat',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists conversations_user_idx on public.conversations (user_id, updated_at desc);

-- ── Messages ───────────────────────────────────────────────────────────────
create table if not exists public.messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references public.conversations (id) on delete cascade,
  role             text not null check (role in ('user', 'assistant', 'system')),
  content          text not null,
  created_at       timestamptz not null default now()
);

create index if not exists messages_conversation_idx on public.messages (conversation_id, created_at);

-- ── Documents (RAG sources) ────────────────────────────────────────────────
create table if not exists public.documents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  name        text not null,
  status      text not null default 'processing' check (status in ('processing', 'ready', 'failed')),
  size_bytes  bigint,
  created_at  timestamptz not null default now()
);

create index if not exists documents_user_idx on public.documents (user_id, created_at desc);

-- ── Document chunks + embeddings ───────────────────────────────────────────
create table if not exists public.document_chunks (
  id           uuid primary key default gen_random_uuid(),
  document_id  uuid not null references public.documents (id) on delete cascade,
  user_id      uuid not null references auth.users (id) on delete cascade,
  content      text not null,
  embedding    vector (768),
  chunk_index  int not null default 0
);

create index if not exists document_chunks_embedding_idx
  on public.document_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- ── Vector retrieval function ──────────────────────────────────────────────
create or replace function public.match_document_chunks (
  query_embedding vector (768),
  match_count int default 5,
  filter_user_id uuid default null
)
returns table (id uuid, document_id uuid, content text, similarity float)
language sql stable
as $$
  select
    c.id,
    c.document_id,
    c.content,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.document_chunks c
  where filter_user_id is null or c.user_id = filter_user_id
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

-- ── Row-Level Security ─────────────────────────────────────────────────────
alter table public.profiles        enable row level security;
alter table public.conversations   enable row level security;
alter table public.messages        enable row level security;
alter table public.documents       enable row level security;
alter table public.document_chunks enable row level security;

create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own conversations" on public.conversations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own messages" on public.messages
  for all using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );

create policy "own documents" on public.documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own chunks" on public.document_chunks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Auto-provision a profile row on signup ─────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
