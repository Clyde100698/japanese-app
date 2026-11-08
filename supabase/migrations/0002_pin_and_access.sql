-- Nihongo Reviewer: Access Control & PIN Configuration
-- Run in the Supabase SQL editor after 0001_init.sql.

-- 1. Enable pgcrypto for SHA-256 hashing in triggers and RPCs
create extension if not exists pgcrypto;

-- 2. Add pin_hash columns to profiles and settings
alter table public.profiles add column if not exists pin_hash text;
alter table public.settings add column if not exists pin_hash text;

-- 3. Automatic hash trigger: if a user types a 6-digit plain PIN (e.g. '123456')
-- into the table editor in the Supabase Dashboard, automatically hash it to SHA-256.
create or replace function public.auto_hash_pin() returns trigger
language plpgsql as $$
begin
  if new.pin_hash is not null and new.pin_hash ~ '^\d{6}$' then
    new.pin_hash := encode(digest(new.pin_hash, 'sha256'), 'hex');
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_hash_pin on public.profiles;
create trigger profiles_hash_pin
  before insert or update of pin_hash on public.profiles
  for each row execute function public.auto_hash_pin();

drop trigger if exists settings_hash_pin on public.settings;
create trigger settings_hash_pin
  before insert or update of pin_hash on public.settings
  for each row execute function public.auto_hash_pin();

-- 4. Single-User Access Control:
-- Public sign-ups disabled. Allow at most ONE registered user in auth.users.
create or replace function public.restrict_single_user() returns trigger
language plpgsql security definer as $$
declare
  existing_count integer;
begin
  select count(*) into existing_count from auth.users;
  if existing_count >= 1 then
    raise exception 'Access Denied: Public registration is disabled. Only one account is permitted on this instance.';
  end if;
  return new;
end;
$$;

drop trigger if exists check_single_user on auth.users;
create trigger check_single_user
  before insert on auth.users
  for each row execute function public.restrict_single_user();

-- 5. Helper RPC to verify a 6-digit PIN attempt
create or replace function public.verify_user_pin(pin_attempt text)
returns boolean
language plpgsql
security definer
as $$
declare
  stored_hash text;
  attempt_hash text;
begin
  if pin_attempt is null or length(pin_attempt) != 6 then
    return false;
  end if;

  attempt_hash := encode(digest(pin_attempt, 'sha256'), 'hex');

  -- Look up in profiles
  select pin_hash into stored_hash
  from public.profiles
  where id = auth.uid();

  -- If not in profiles, look up in settings
  if stored_hash is null then
    select coalesce(pin_hash, data->>'pin_hash') into stored_hash
    from public.settings
    where user_id = auth.uid();
  end if;

  if stored_hash is null then
    return false;
  end if;

  return lower(stored_hash) = lower(attempt_hash);
end;
$$;

-- 6. Helper RPC to set the user PIN securely
create or replace function public.set_user_pin(new_pin text)
returns boolean
language plpgsql
security definer
as $$
declare
  new_hash text;
begin
  if new_pin is null or length(new_pin) != 6 or new_pin !~ '^\d{6}$' then
    raise exception 'PIN must be exactly 6 numeric digits';
  end if;

  new_hash := encode(digest(new_pin, 'sha256'), 'hex');

  update public.profiles
  set pin_hash = new_hash, updated_at = now()
  where id = auth.uid();

  update public.settings
  set pin_hash = new_hash,
      data = jsonb_set(coalesce(data, '{}'::jsonb), '{pin_hash}', to_jsonb(new_hash)),
      updated_at = now()
  where user_id = auth.uid();

  return true;
end;
$$;
