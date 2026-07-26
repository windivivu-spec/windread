-- A group booking is persisted as one booking per occupied chair. Rows that
-- belong to the same party share group_id, while guest_count lets the UI show
-- an accurate single confirmation to the customer.
alter table public.bookings
  add column if not exists guest_count integer not null default 1,
  add column if not exists group_id text;

alter table public.bookings
  drop constraint if exists bookings_guest_count_check;

alter table public.bookings
  add constraint bookings_guest_count_check check (guest_count between 1 and 4);

create index if not exists bookings_group_id_idx on public.bookings (group_id)
  where group_id is not null;
