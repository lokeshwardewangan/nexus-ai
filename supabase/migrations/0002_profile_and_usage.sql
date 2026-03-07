-- ============================================================================
-- Nexus AI — profile fields + token usage
-- ============================================================================

alter table public.profiles
  add column if not exists username    text,
  add column if not exists bio         text,
  add column if not exists headline    text,
  add column if not exists tokens_used bigint not null default 0;

-- Atomically add to the signed-in user's token total (scoped to auth.uid()).
create or replace function public.add_token_usage(amount bigint)
returns void
language sql
security definer set search_path = public
as $$
  update public.profiles
  set tokens_used = tokens_used + greatest(amount, 0)
  where id = auth.uid();
$$;
