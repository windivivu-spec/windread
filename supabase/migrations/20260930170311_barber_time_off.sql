-- One-off leave is separate from recurring working_hours and customer bookings.
create table public.barber_time_off (
  id uuid primary key default gen_random_uuid(),
  barber_id text not null references public.barbers(id) on delete cascade,
  start_time timestamptz not null,
  end_time timestamptz not null,
  all_day boolean not null default true,
  note text not null default '',
  created_by uuid,
  created_at timestamptz not null default now(),
  constraint barber_time_off_positive_duration check (end_time > start_time)
);

create index barber_time_off_barber_range_idx on public.barber_time_off (barber_id, start_time, end_time);
alter table public.barber_time_off enable row level security;
revoke all on public.barber_time_off from anon, authenticated;
grant select, insert, update, delete on public.barber_time_off to service_role;

-- The same per-barber advisory lock used by bookings makes a leave request
-- race safely with online bookings and walk-in holds.
create function public.prevent_barber_time_off_overlap()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(new.barber_id, 0));
  if exists (
    select 1 from public.bookings booking
    where booking.barber_id = new.barber_id
      and booking.status <> 'cancelled'
      and booking.end_time > now()
      and new.start_time < booking.end_time
      and new.end_time > booking.start_time
  ) then
    raise exception 'Time off overlaps an existing customer booking.' using errcode = '23505';
  end if;
  if exists (
    select 1 from public.barber_time_off existing
    where existing.barber_id = new.barber_id
      and existing.id <> new.id
      and new.start_time < existing.end_time
      and new.end_time > existing.start_time
  ) then
    raise exception 'Time off overlaps another leave period.' using errcode = '23505';
  end if;
  return new;
end;
$$;

create trigger barber_time_off_prevent_overlap
before insert or update of barber_id, start_time, end_time on public.barber_time_off
for each row execute function public.prevent_barber_time_off_overlap();

create or replace function public.prevent_booking_overlap()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.status <> 'cancelled' then
    perform pg_advisory_xact_lock(hashtextextended(new.barber_id, 0));
    if exists (
      select 1 from public.barber_time_off off_period
      where off_period.barber_id = new.barber_id
        and new.start_time < off_period.end_time
        and new.end_time > off_period.start_time
    ) then
      raise exception 'Booking overlaps time off for this barber.' using errcode = '23505';
    end if;
    if exists (
      select 1 from public.bookings existing
      where existing.barber_id = new.barber_id
        and existing.status <> 'cancelled'
        and existing.id <> new.id
        and new.start_time < existing.end_time + interval '10 minutes'
        and new.end_time + interval '10 minutes' > existing.start_time
    ) then
      raise exception 'Booking overlaps an existing appointment for this barber.' using errcode = '23505';
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public.prevent_barber_time_off_overlap() from public, anon, authenticated;
