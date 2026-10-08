-- A service may be published as a price without being selectable online.
-- This keeps walk-in prices transparent while preventing a customer from
-- reserving a barber or a timeslot for them.
alter table public.services
  add column if not exists is_price_visible boolean not null default false;

-- Preserve the existing public booking catalogue as the public price list.
update public.services
set is_price_visible = is_bookable;

-- Chương Dương walk-in catalogue: shown on the price list only. Customers
-- visit directly and the shop assigns a barber based on availability.
update public.services
set
  name = 'Haircut',
  description = 'Tới trực tiếp, không cần đặt lịch. Thợ được xếp theo tình trạng sẵn sàng.',
  price = 120000,
  price_label = '120.000đ',
  duration_minutes = 45,
  is_price_visible = true,
  is_bookable = false
where id = 'cd-haircut';

update public.services
set
  name = case id
    when 'cd-fresh-cut' then 'Fresh Cut'
    when 'cd-gentlemans-set' then 'Gentleman''s Set'
    when 'cd-full-grooming' then 'Full Grooming'
  end,
  description = case id
    when 'cd-fresh-cut' then 'Haircut + Hair Wash. Tới trực tiếp, không cần đặt lịch.'
    when 'cd-gentlemans-set' then 'Haircut + Beard Grooming & Shave. Tới trực tiếp, không cần đặt lịch.'
    when 'cd-full-grooming' then 'Haircut + Hair Wash + Beard Grooming & Shave. Tới trực tiếp, không cần đặt lịch.'
  end,
  price = case id
    when 'cd-fresh-cut' then 150000
    when 'cd-gentlemans-set' then 200000
    when 'cd-full-grooming' then 250000
  end,
  price_label = case id
    when 'cd-fresh-cut' then '150.000đ'
    when 'cd-gentlemans-set' then '200.000đ'
    when 'cd-full-grooming' then '250.000đ'
  end,
  is_price_visible = true,
  is_bookable = false
where id in ('cd-fresh-cut', 'cd-gentlemans-set', 'cd-full-grooming');

delete from public.barber_services
where service_id in ('cd-haircut', 'cd-fresh-cut', 'cd-gentlemans-set', 'cd-full-grooming');

-- The existing advance-cut service becomes the priority haircut. Its service
-- ID stays stable for reporting and historical bookings.
update public.services
set
  name = 'Haircut',
  description = 'Chọn barber · chọn khung giờ. Đặt lịch trước và được ưu tiên phục vụ.',
  price = 160000,
  price_label = '160.000đ',
  duration_minutes = 45,
  is_price_visible = true,
  is_bookable = true
where id = 'cd-haircut-expert';

-- Retain the former signature offer for history, but replace it in the public
-- catalogue with the requested priority combos below.
update public.services
set is_price_visible = false, is_bookable = false
where id = 'cd-win-dread-experience';

delete from public.barber_services
where service_id = 'cd-win-dread-experience';

insert into public.services (
  id, branch_id, name, description, price, price_label, service_category,
  duration_minutes, is_price_visible, is_bookable, menu_order
) values
  ('cd-priority-fresh-cut', 'chuong-duong', 'Priority Fresh Cut', 'Haircut + Hair Wash. Chọn barber · chọn khung giờ · ưu tiên phục vụ.', 190000, '190.000đ', 'barber', 60, true, true, 25),
  ('cd-priority-gentlemans-set', 'chuong-duong', 'Priority Gentleman''s Set', 'Haircut + Beard Grooming & Shave. Chọn barber · chọn khung giờ · ưu tiên phục vụ.', 240000, '240.000đ', 'barber', 75, true, true, 35),
  ('cd-priority-full-grooming', 'chuong-duong', 'Priority Full Grooming', 'Haircut + Hair Wash + Beard Grooming & Shave. Chọn barber · chọn khung giờ · ưu tiên phục vụ.', 290000, '290.000đ', 'barber', 90, true, true, 45)
on conflict (id) do update set
  branch_id = excluded.branch_id,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  price_label = excluded.price_label,
  service_category = excluded.service_category,
  duration_minutes = excluded.duration_minutes,
  is_price_visible = excluded.is_price_visible,
  is_bookable = excluded.is_bookable,
  menu_order = excluded.menu_order;

-- Mapping only follows online-bookable services; walk-ins are assigned at the
-- shop and must not appear in barber/time selection.
insert into public.barber_services (barber_id, service_id)
select barber.id, service.id
from public.barbers barber
join public.services service
  on service.branch_id = barber.branch_id
 and service.is_bookable
left join public.barber_services mapping
  on mapping.barber_id = barber.id
 and mapping.service_id = service.id
where barber.branch_id = 'chuong-duong'
  and mapping.barber_id is null;

alter table public.services
  drop constraint if exists services_bookable_requires_price_visibility;

alter table public.services
  add constraint services_bookable_requires_price_visibility
  check (not is_bookable or is_price_visible);

create index if not exists services_public_price_menu_idx
  on public.services (branch_id, service_category, menu_order)
  where is_price_visible;
