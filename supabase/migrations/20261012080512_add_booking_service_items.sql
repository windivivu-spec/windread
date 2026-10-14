-- An online appointment may contain several services performed consecutively by
-- one barber. service_id remains the first item for legacy calendar/admin code;
-- service_ids is the complete, ordered selection used for availability and totals.
alter table public.bookings
  add column if not exists service_ids text[];

update public.bookings
set service_ids = case
  when service_id is null then '{}'::text[]
  else array[service_id]
end
where service_ids is null;

alter table public.bookings
  alter column service_ids set default '{}'::text[],
  alter column service_ids set not null;

alter table public.bookings
  drop constraint if exists bookings_services_for_online;

alter table public.bookings
  add constraint bookings_services_for_online check (
    booking_origin = 'walk_in'
    or (
      service_id is not null
      and cardinality(service_ids) > 0
      and service_id = service_ids[1]
      and array_position(service_ids, null) is null
    )
  );

create or replace function public.validate_booking_catalog()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'UPDATE'
     and new.branch_id is not distinct from old.branch_id
     and new.service_ids is not distinct from old.service_ids
     and new.barber_id is not distinct from old.barber_id then
    return new;
  end if;

  if new.booking_origin = 'walk_in' and new.service_id is null then
    if not exists (
      select 1 from public.barbers barber
      where barber.id = new.barber_id and barber.branch_id = new.branch_id
    ) then
      raise exception using errcode = '23514', message = 'The selected barber is not at this branch.';
    end if;
    return new;
  end if;

  if new.service_id is distinct from new.service_ids[1]
     or cardinality(new.service_ids) = 0
     or array_position(new.service_ids, null) is not null
     or cardinality(new.service_ids) <> cardinality(array(select distinct unnest(new.service_ids))) then
    raise exception using errcode = '23514', message = 'Booking services must be a unique, ordered list.';
  end if;

  if exists (
    select 1
    from unnest(new.service_ids) as selected(service_id)
    left join public.services service
      on service.id = selected.service_id
      and service.branch_id = new.branch_id
      and service.is_bookable
    where service.id is null
  ) then
    raise exception using errcode = '23514', message = 'A selected service is not bookable at this branch.';
  end if;

  if exists (
    select 1
    from unnest(new.service_ids) as selected(service_id)
    where not exists (
      select 1
      from public.barber_services mapping
      join public.barbers barber on barber.id = mapping.barber_id
      where mapping.barber_id = new.barber_id
        and barber.branch_id = new.branch_id
        and mapping.service_id = selected.service_id
    )
  ) then
    raise exception using errcode = '23514', message = 'The selected barber cannot perform every selected service at this branch.';
  end if;

  return new;
end;
$$;
