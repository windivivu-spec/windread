-- Walk-in time holds share the bookings table so online availability and the
-- staff calendar see the same occupied chair. The original cancelled booking
-- remains available for audit when a late customer is served as a walk-in.
alter table public.bookings alter column service_id drop not null;
alter table public.bookings add column if not exists booking_origin text not null default 'online';
alter table public.bookings add column if not exists source_booking_id text references public.bookings(id);
alter table public.bookings add column if not exists cancel_reason text;
alter table public.bookings add constraint bookings_origin_valid
  check (booking_origin in ('online', 'walk_in'));
alter table public.bookings add constraint bookings_service_for_online
  check (booking_origin = 'walk_in' or service_id is not null);
create unique index if not exists bookings_source_booking_once_idx
  on public.bookings(source_booking_id) where source_booking_id is not null;

create or replace function public.validate_booking_catalog()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'UPDATE'
     and new.branch_id is not distinct from old.branch_id
     and new.service_id is not distinct from old.service_id
     and new.barber_id is not distinct from old.barber_id then
    return new;
  end if;

  if new.booking_origin = 'walk_in' and new.service_id is null then
    if not exists (select 1 from public.barbers barber
                   where barber.id = new.barber_id and barber.branch_id = new.branch_id) then
      raise exception using errcode = '23514', message = 'The selected barber is not at this branch.';
    end if;
    return new;
  end if;

  if not exists (select 1 from public.services service
                 where service.id = new.service_id
                   and service.branch_id = new.branch_id and service.is_bookable) then
    raise exception using errcode = '23514', message = 'The selected service is not bookable at this branch.';
  end if;
  if not exists (select 1 from public.barbers barber
                 join public.barber_services mapping on mapping.barber_id = barber.id
                 where barber.id = new.barber_id and barber.branch_id = new.branch_id
                   and mapping.service_id = new.service_id) then
    raise exception using errcode = '23514', message = 'The selected barber cannot perform this service at this branch.';
  end if;
  return new;
end;
$$;

-- Serialize all writes for one barber before checking buffered overlap. This
-- protects a walk-in hold racing with a public booking request.
create or replace function public.prevent_booking_overlap()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.status <> 'cancelled' then
    perform pg_advisory_xact_lock(hashtextextended(new.barber_id, 0));
    if exists (
      select 1 from public.bookings existing
      where existing.barber_id = new.barber_id
        and existing.status <> 'cancelled'
        and existing.id <> new.id
        and new.start_time < existing.end_time + interval '10 minutes'
        and new.end_time + interval '10 minutes' > existing.start_time
    ) then
      raise exception 'Booking overlaps an existing appointment for this barber.'
        using errcode = '23505';
    end if;
  end if;
  return new;
end;
$$;

-- A profile is earned only by a completed visit. Reuse the phone as the
-- deduplication key; an anonymous walk-in remains a time hold only.
create or replace function public.windread_record_served_booking()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_phone text;
  v_customer_id uuid;
begin
  v_phone := regexp_replace(coalesce(new.customer_phone, ''), '[^0-9]', '', 'g');
  if length(v_phone) < 9 or length(v_phone) > 15 then
    return new;
  end if;
  insert into public.customers(phone, name, email, source)
  values (v_phone, new.customer_name, nullif(trim(new.customer_email), ''), 'served')
  on conflict (phone) do update set
    name = excluded.name,
    email = coalesce(excluded.email, public.customers.email),
    source = 'served'
  returning id into v_customer_id;
  update public.bookings set customer_id = v_customer_id where id = new.id;
  return new;
end;
$$;

drop trigger if exists bookings_record_served_customer on public.bookings;
create trigger bookings_record_served_customer
after insert or update of status on public.bookings
for each row when (new.status = 'completed')
execute function public.windread_record_served_booking();

-- POS creates an invoice and customer in one transaction. Mark the customer
-- served only when that transaction actually finishes a sale.
create or replace function public.windread_record_served_invoice()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.customer_id is not null then
    update public.customers set source = 'served' where id = new.customer_id;
  end if;
  return new;
end;
$$;

drop trigger if exists invoices_record_served_customer on public.invoices;
create trigger invoices_record_served_customer
after insert or update of status on public.invoices
for each row when (new.status = 'completed')
execute function public.windread_record_served_invoice();

-- Earlier admin migration imported every booking phone. Keep those records,
-- but expose only people with a completed visit.
update public.customers customer
set source = 'served'
where exists (
  select 1 from public.bookings booking
  where booking.customer_id = customer.id and booking.status = 'completed'
) or exists (
  select 1 from public.invoices invoice
  where invoice.customer_id = customer.id and invoice.status = 'completed'
);

revoke all on function public.windread_record_served_booking() from public, anon, authenticated;
revoke all on function public.windread_record_served_invoice() from public, anon, authenticated;
