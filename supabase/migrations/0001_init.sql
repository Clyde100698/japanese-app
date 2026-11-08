-- Nihongo Reviewer: user progress schema. Study content is NOT stored here.
-- Run in the Supabase SQL editor, or with `supabase db push`.

-- profiles ---------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- card_states (SM-2 fields) ---------------------------------------------
create table if not exists public.card_states (
  user_id uuid not null references auth.users (id) on delete cascade,
  card_id text not null,
  ease numeric(4,2) not null default 2.5 check (ease >= 1.3),
  interval_days integer not null default 0 check (interval_days >= 0),
  reps integer not null default 0 check (reps >= 0),
  lapses integer not null default 0 check (lapses >= 0),
  due_at timestamptz not null,
  phase text not null default 'learning' check (phase in ('learning', 'review')),
  updated_at timestamptz not null default now(),
  primary key (user_id, card_id)
);
create index if not exists card_states_user_updated on public.card_states (user_id, updated_at);
create index if not exists card_states_user_due on public.card_states (user_id, due_at);

-- review_logs (append-only; id generated on the device) ------------------
create table if not exists public.review_logs (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  card_id text not null,
  grade text not null check (grade in ('again', 'hard', 'good', 'easy')),
  reviewed_at timestamptz not null,
  prev_interval integer not null default 0,
  new_interval integer not null default 0,
  ease_after numeric(4,2) not null default 2.5,
  updated_at timestamptz not null default now()
);
create index if not exists review_logs_user_updated on public.review_logs (user_id, updated_at);

-- daily_stats ------------------------------------------------------------
create table if not exists public.daily_stats (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  reviews integer not null default 0,
  new_cards integer not null default 0,
  correct integer not null default 0,
  xp integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);
create index if not exists daily_stats_user_updated on public.daily_stats (user_id, updated_at);

-- settings (one JSON document per user) ----------------------------------
create table if not exists public.settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Last-write-wins guard ---------------------------------------------------
-- Ignore any update whose updated_at is older than the stored row, so a device
-- that was offline for a week cannot overwrite newer progress from another device.
create or replace function public.reject_stale_update() returns trigger
language plpgsql as $$
begin
  if new.updated_at < old.updated_at then
    return null; -- silently skip the stale write
  end if;
  return new;
end;
$$;

create trigger card_states_lww before update on public.card_states
  for each row execute function public.reject_stale_update();
create trigger daily_stats_lww before update on public.daily_stats
  for each row execute function public.reject_stale_update();
create trigger settings_lww before update on public.settings
  for each row execute function public.reject_stale_update();
create trigger profiles_lww before update on public.profiles
  for each row execute function public.reject_stale_update();

-- Row Level Security: each user sees and writes only their own rows -------
alter table public.profiles enable row level security;
alter table public.card_states enable row level security;
alter table public.review_logs enable row level security;
alter table public.daily_stats enable row level security;
alter table public.settings enable row level security;

create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "card_states_own" on public.card_states
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "review_logs_own" on public.review_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "daily_stats_own" on public.daily_stats
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "settings_own" on public.settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Create a profile row automatically on sign-up ----------------------------
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

