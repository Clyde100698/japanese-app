-- Migration 0003: Enable Multi-User Registration & Remove Single-User / PIN Restrictions
-- Run this in the Supabase SQL Editor.

-- 1. Remove single-user restriction so ANY user can sign up with their own account
drop trigger if exists check_single_user on auth.users;
drop function if exists public.restrict_single_user();

-- 2. Automatically create a profile when any user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, created_at, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    now(),
    now()
  )
  on conflict (id) do update
  set updated_at = now();

  -- Initialize settings row for the new user
  insert into public.settings (user_id, data, updated_at)
  values (new.id, '{}'::jsonb, now())
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Verify Row Level Security (RLS) is active on all user data tables
alter table public.profiles enable row level security;
alter table public.card_states enable row level security;
alter table public.review_logs enable row level security;
alter table public.daily_stats enable row level security;
alter table public.settings enable row level security;

-- Ensure every policy strictly isolates user data by auth.uid()
drop policy if exists "profiles_own" on public.profiles;
create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "card_states_own" on public.card_states;
create policy "card_states_own" on public.card_states
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "review_logs_own" on public.review_logs;
create policy "review_logs_own" on public.review_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "daily_stats_own" on public.daily_stats;
create policy "daily_stats_own" on public.daily_stats
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "settings_own" on public.settings;
create policy "settings_own" on public.settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
