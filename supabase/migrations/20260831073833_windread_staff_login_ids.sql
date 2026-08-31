alter table public.staff_profiles
  add column if not exists login_id text;

alter table public.staff_profiles
  drop constraint if exists staff_profiles_login_id_check;

alter table public.staff_profiles
  add constraint staff_profiles_login_id_check
  check (login_id is null or login_id ~ '^[a-z0-9][a-z0-9._-]{2,47}$');

create unique index if not exists staff_profiles_login_id_unique
  on public.staff_profiles (lower(login_id))
  where login_id is not null;
