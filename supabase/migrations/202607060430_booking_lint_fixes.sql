create index if not exists barber_services_service_idx on public.barber_services (service_id);
create index if not exists bookings_service_idx on public.bookings (service_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.prevent_booking_overlap()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.status <> 'cancelled' and exists (
    select 1
    from public.bookings existing
    where existing.barber_id = new.barber_id
      and existing.status <> 'cancelled'
      and existing.id <> new.id
      and new.start_time < existing.end_time + interval '10 minutes'
      and new.end_time + interval '10 minutes' > existing.start_time
  ) then
    raise exception 'Booking overlaps an existing appointment for this barber.';
  end if;

  return new;
end;
$$;

drop extension if exists btree_gist;
