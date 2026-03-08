-- ============================================================================
-- Nexus AI — auto-generated usernames + avatar storage
-- ============================================================================

-- ── Unique, auto-generated usernames ───────────────────────────────────────
-- Derives a handle from the user's name/email and resolves collisions with a
-- numeric suffix. SECURITY DEFINER so the signup trigger can read the table.
create or replace function public.generate_username(seed text)
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  base      text;
  candidate text;
  suffix    int := 1;
begin
  base := regexp_replace(lower(coalesce(split_part(seed, '@', 1), '')), '[^a-z0-9]', '', 'g');
  if base = '' then
    base := 'user';
  end if;
  base := left(base, 20);

  candidate := base;
  while exists (select 1 from public.profiles where lower(username) = candidate) loop
    suffix := suffix + 1;
    candidate := base || suffix::text;
  end loop;

  return candidate;
end;
$$;

-- Provision profile rows for any pre-existing auth users that lack one
-- (e.g. accounts created before the signup trigger existed).
insert into public.profiles (id, email, full_name, avatar_url)
select
  u.id,
  u.email,
  u.raw_user_meta_data ->> 'full_name',
  u.raw_user_meta_data ->> 'avatar_url'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- Backfill rows missing a handle (one at a time so collisions resolve).
do $$
declare
  r record;
begin
  for r in
    select id, full_name, email
    from public.profiles
    where username is null or btrim(username) = ''
  loop
    update public.profiles
    set username = public.generate_username(coalesce(nullif(btrim(r.full_name), ''), r.email))
    where id = r.id;
  end loop;
end $$;

create unique index if not exists profiles_username_key
  on public.profiles (lower(username));

-- Provision a profile (with a generated handle) on signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, username)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    public.generate_username(
      coalesce(nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''), new.email)
    )
  );
  return new;
end;
$$;

-- ── Avatar storage bucket ──────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Avatar images are publicly readable" on storage.objects;
create policy "Avatar images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Users manage their own avatar" on storage.objects;
create policy "Users manage their own avatar"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
