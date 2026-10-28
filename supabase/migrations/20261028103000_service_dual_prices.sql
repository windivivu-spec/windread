-- Keep appointment IDs stable for bookings; legacy walk-in rows remain for
-- historical references and compatibility with the currently deployed site.
alter table public.services add column if not exists walk_in_price integer;
alter table public.services drop constraint if exists services_walk_in_price_nonnegative;
alter table public.services add constraint services_walk_in_price_nonnegative check (walk_in_price is null or walk_in_price >= 0);

update public.services appointment
set walk_in_price = walk_in.price, price_label = null
from public.services walk_in
where (appointment.id, walk_in.id) in (
  ('cd-haircut-expert', 'cd-haircut'),
  ('cd-priority-fresh-cut', 'cd-fresh-cut'),
  ('cd-priority-gentlemans-set', 'cd-gentlemans-set'),
  ('cd-priority-full-grooming', 'cd-full-grooming')
) and appointment.branch_id = walk_in.branch_id and appointment.walk_in_price is null;

-- The old public site still reads the separate walk-in row until it is deployed.
create or replace function public.sync_legacy_walk_in_price() returns trigger
language plpgsql set search_path = public as $$
declare legacy_id text;
begin
  legacy_id := case new.id
    when 'cd-haircut-expert' then 'cd-haircut'
    when 'cd-priority-fresh-cut' then 'cd-fresh-cut'
    when 'cd-priority-gentlemans-set' then 'cd-gentlemans-set'
    when 'cd-priority-full-grooming' then 'cd-full-grooming'
  end;
  if legacy_id is not null then
    update public.services set price = coalesce(new.walk_in_price, new.price),
      price_label = null
    where id = legacy_id and branch_id = new.branch_id;
  end if;
  return new;
end $$;
drop trigger if exists sync_legacy_walk_in_price on public.services;
create trigger sync_legacy_walk_in_price after update of price, walk_in_price on public.services
for each row execute function public.sync_legacy_walk_in_price();
