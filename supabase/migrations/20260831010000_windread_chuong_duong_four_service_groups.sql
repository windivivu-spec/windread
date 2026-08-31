-- Cơ sở 1 now follows the four printed menu groups. Old rows stay in place for
-- booking and invoice history; only the current menu rows stay bookable.
alter table public.services
  add column if not exists service_category text;

alter table public.services
  drop constraint if exists services_service_category_check;

alter table public.services
  add constraint services_service_category_check
  check (service_category is null or service_category in ('barber', 'dreadlocks', 'braids', 'afro'));

-- Cơ sở 2 keeps its current prices and services. This only gives its existing
-- catalogue the same four navigation groups for booking and cashier screens.
update public.services
set service_category = case
  when id in ('an-dreadlock', 'an-single-dread', 'an-pair-dreads', 'an-locs-styling', 'an-locs-washing',
              'an-maintenance-1-worker-first-hour', 'an-maintenance-1-worker-additional-hour',
              'an-maintenance-2-workers-first-hour', 'an-maintenance-2-workers-second-hour',
              'an-maintenance-2-workers-additional-hour') then 'dreadlocks'
  when id in ('an-cornrow', 'an-cornrow-10-16', 'an-braids-men', 'an-braids-women') then 'braids'
  when id in ('an-afro-perm', 'an-afro-wash-blowdry') then 'afro'
  else 'barber'
end
where branch_id = 'an-thuong';

-- Do not delete old Cơ sở 1 menu rows: bookings and invoices may still point
-- at them. They simply stop appearing as a new booking or POS choice.
update public.services
set is_bookable = false
where id in (
  'cd-long-haircut', 'cd-beard-trim', 'cd-full-head-face-shave',
  'cd-basic-beard-coloring', 'cd-keratin-therapy'
);

insert into public.services (
  id, branch_id, name, description, price, price_label, service_category, duration_minutes, is_bookable
) values
  -- Barber
  ('cd-haircut', 'chuong-duong', 'Cắt tóc & tạo kiểu', 'Cắt tóc và tạo kiểu.', 120000, '120.000đ', 'barber', 45, true),
  ('cd-hot-towel-shave', 'chuong-duong', 'Cạo râu khăn nóng & lạnh', 'Tỉa, tạo form râu, cạo mặt và khăn nóng/lạnh.', 100000, '100.000đ', 'barber', 30, true),
  ('cd-haircut-expert', 'chuong-duong', 'Signature Haircut', 'Cắt tóc signature; nên đặt lịch trước.', 160000, '160.000đ', 'barber', 60, true),
  ('cd-fresh-cut', 'chuong-duong', 'Fresh Cut', 'Cắt tóc & tạo kiểu + gội đầu.', 150000, '150.000đ', 'barber', 60, true),
  ('cd-gentlemans-set', 'chuong-duong', 'Gentleman''s Set', 'Cắt tóc & tạo kiểu + cạo râu khăn nóng/lạnh.', 200000, '200.000đ', 'barber', 75, true),
  ('cd-full-grooming', 'chuong-duong', 'Full Grooming', 'Cắt tóc & tạo kiểu + gội đầu + cạo râu khăn nóng/lạnh.', 250000, '250.000đ', 'barber', 90, true),
  ('cd-win-dread-experience', 'chuong-duong', 'The Win Dread Experience', 'Signature Haircut + gội đầu + cạo râu khăn nóng/lạnh.', 300000, '300.000đ', 'barber', 120, true),
  ('cd-sides-back-fade', 'chuong-duong', 'Fade hai bên & gáy', 'Làm gọn phần hai bên và gáy.', 90000, '90.000đ', 'barber', 30, true),
  ('cd-basic-beard-trim-line-up', 'chuong-duong', 'Tỉa râu cơ bản & cạo viền', 'Làm gọn râu và đường viền.', 70000, '70.000đ', 'barber', 15, true),
  ('cd-hair-washing', 'chuong-duong', 'Gội đầu', 'Gội đầu cơ bản.', 40000, '40.000đ', 'barber', 15, true),
  ('cd-wash-blowdry', 'chuong-duong', 'Sấy & tạo kiểu', 'Sấy và tạo kiểu tóc.', 60000, '60.000đ', 'barber', 25, true),
  ('cd-basic-hair-tattoo', 'chuong-duong', 'Tattoo tóc cơ bản', 'Thiết kế tattoo tóc cơ bản.', 50000, '50.000–150.000đ', 'barber', 30, true),
  ('cd-down-perm', 'chuong-duong', 'Ép side', 'Ép side tóc.', 250000, '250.000đ', 'barber', 120, true),
  ('cd-basic-perm', 'chuong-duong', 'Uốn basic', 'Uốn cơ bản theo độ dài và chất tóc.', 300000, '300.000–400.000đ', 'barber', 150, true),
  ('cd-curly-perm', 'chuong-duong', 'Uốn xoăn', 'Uốn xoăn theo độ dài và chất tóc.', 350000, '350.000–450.000đ', 'barber', 180, true),
  ('cd-ruffled-perm', 'chuong-duong', 'Uốn ruffled / textured', 'Uốn ruffled hoặc textured.', 400000, '400.000–500.000đ', 'barber', 210, true),
  ('cd-premlock-perm', 'chuong-duong', 'Uốn pre-lock', 'Uốn pre-lock theo độ dài tóc.', 800000, '800.000–1.200.000đ', 'barber', 240, true),
  ('cd-afro-perm', 'chuong-duong', 'Uốn afro', 'Uốn afro theo độ dài và mật độ tóc.', 1000000, '1.000.000–1.500.000đ', 'barber', 270, true),
  ('cd-hair-bleaching', 'chuong-duong', 'Tẩy tóc', 'Tẩy tóc theo mỗi lần xử lý.', 250000, '250.000đ / lần', 'barber', 150, true),
  ('cd-hair-color', 'chuong-duong', 'Nhuộm màu thời trang', 'Nhuộm màu thời trang theo nền tóc.', 250000, '250.000–350.000đ', 'barber', 150, true),
  ('cd-hair-blackening', 'chuong-duong', 'Nhuộm đen', 'Nhuộm đen theo nền tóc.', 150000, '150.000–250.000đ', 'barber', 90, true),
  ('cd-bleach-root-touch-up', 'chuong-duong', 'Tẩy nối chân', 'Tẩy phần chân tóc mọc mới.', 500000, '500.000–900.000đ', 'barber', 150, true),
  ('cd-beard-coloring', 'chuong-duong', 'Nhuộm râu', 'Nhuộm râu theo tình trạng râu.', 150000, '150.000–250.000đ', 'barber', 45, true),
  -- Dreadlocks
  ('cd-dreadlocks-new', 'chuong-duong', 'Dreadlocks mới', 'Tạo dreadlocks mới; cần tư vấn trước.', 2000000, 'Từ 2.000.000đ', 'dreadlocks', 300, true),
  ('cd-dreadlock-maintenance-one-first', 'chuong-duong', 'Bảo dưỡng dread · 1 thợ · giờ đầu', 'Bảo dưỡng dread với một thợ.', 400000, '400.000đ', 'dreadlocks', 60, true),
  ('cd-dreadlock-maintenance-one-additional', 'chuong-duong', 'Bảo dưỡng dread · 1 thợ · giờ thêm', 'Tính từ giờ thứ hai.', 300000, '300.000đ / giờ', 'dreadlocks', 60, true),
  ('cd-dreadlock-maintenance-team-first', 'chuong-duong', 'Bảo dưỡng dread · 2 thợ · giờ đầu', 'Bảo dưỡng dread với hai thợ.', 600000, '600.000đ', 'dreadlocks', 60, true),
  ('cd-dreadlock-maintenance-team-second', 'chuong-duong', 'Bảo dưỡng dread · 2 thợ · giờ thứ hai', 'Bảo dưỡng dread với hai thợ.', 500000, '500.000đ', 'dreadlocks', 60, true),
  ('cd-dreadlock-maintenance-team-additional', 'chuong-duong', 'Bảo dưỡng dread · 2 thợ · giờ thêm', 'Tính từ giờ thứ ba.', 400000, '400.000đ / giờ', 'dreadlocks', 60, true),
  ('cd-dreadlock-extension-short', 'chuong-duong', 'Nối dread ngắn 20–30cm', 'Tính theo mỗi loc.', 60000, '60.000đ / loc', 'dreadlocks', 30, true),
  ('cd-dreadlock-extension-medium', 'chuong-duong', 'Nối dread vừa 30–40cm', 'Tính theo mỗi loc.', 80000, '80.000đ / loc', 'dreadlocks', 30, true),
  ('cd-dreadlock-extension-long', 'chuong-duong', 'Nối dread dài 40–50cm', 'Tính theo mỗi loc.', 90000, '90.000đ / loc', 'dreadlocks', 30, true),
  ('cd-locs-basic-wash', 'chuong-duong', 'Gội locs cơ bản', 'Gội locs cơ bản.', 50000, 'Từ 50.000đ', 'dreadlocks', 30, true),
  ('cd-locs-deep-detox', 'chuong-duong', 'Detox locs sâu', 'Làm sạch sâu cho locs.', 350000, 'Từ 350.000đ', 'dreadlocks', 90, true),
  ('cd-locs-styling', 'chuong-duong', 'Tạo kiểu locs', 'Tạo kiểu locs tính theo giờ.', 450000, '450.000đ / giờ', 'dreadlocks', 60, true),
  -- Braids
  ('cd-cornrows-2-lines', 'chuong-duong', 'Cornrows 2 line', 'Tết cornrows sát da đầu.', 400000, '400.000đ', 'braids', 90, true),
  ('cd-cornrows-4-lines', 'chuong-duong', 'Cornrows 4 line', 'Tết cornrows sát da đầu.', 600000, '600.000đ', 'braids', 120, true),
  ('cd-cornrows-6-lines', 'chuong-duong', 'Cornrows 6 line', 'Tết cornrows sát da đầu.', 750000, '750.000đ', 'braids', 150, true),
  ('cd-cornrows-8-lines', 'chuong-duong', 'Cornrows 8 line', 'Tết cornrows sát da đầu.', 900000, '900.000đ', 'braids', 180, true),
  ('cd-cornrows-10-lines', 'chuong-duong', 'Cornrows 10+ line', 'Từ 10 line, tính theo mỗi line.', 1300000, '130.000đ / line', 'braids', 210, true),
  ('cd-cornrows-half-head', 'chuong-duong', 'Cornrows nửa đầu', 'Tết cornrows nửa đầu.', 100000, '100.000đ / line', 'braids', 60, true),
  ('cd-braids-custom-design', 'chuong-duong', 'Braids custom design', 'Thiết kế braids theo giờ.', 450000, '450.000đ / giờ', 'braids', 60, true),
  ('cd-box-braids-shoulder', 'chuong-duong', 'Box braids · ngang vai', 'Full head box braids ngang vai.', 1200000, '1.200.000đ', 'braids', 240, true),
  ('cd-box-braids-over-shoulder', 'chuong-duong', 'Box braids · qua vai', 'Full head box braids qua vai.', 1500000, '1.500.000đ', 'braids', 300, true),
  ('cd-box-braids-mid-back', 'chuong-duong', 'Box braids · giữa lưng', 'Full head box braids giữa lưng.', 1800000, '1.800.000đ', 'braids', 360, true),
  ('cd-knotless-braids-shoulder', 'chuong-duong', 'Knotless braids · ngang vai', 'Full head knotless braids ngang vai.', 1500000, '1.500.000đ', 'braids', 270, true),
  ('cd-knotless-braids-over-shoulder', 'chuong-duong', 'Knotless braids · qua vai', 'Full head knotless braids qua vai.', 1800000, '1.800.000đ', 'braids', 330, true),
  ('cd-knotless-braids-mid-back', 'chuong-duong', 'Knotless braids · giữa lưng', 'Full head knotless braids giữa lưng.', 2200000, '2.200.000đ', 'braids', 390, true),
  ('cd-boho-braids-shoulder', 'chuong-duong', 'Boho braids · ngang vai', 'Full head boho braids ngang vai.', 1800000, '1.800.000đ', 'braids', 300, true),
  ('cd-boho-braids-over-shoulder', 'chuong-duong', 'Boho braids · qua vai', 'Full head boho braids qua vai.', 2200000, '2.200.000đ', 'braids', 360, true),
  ('cd-boho-braids-mid-back', 'chuong-duong', 'Boho braids · giữa lưng', 'Full head boho braids giữa lưng.', 2600000, '2.600.000đ', 'braids', 420, true),
  ('cd-braid-extension-40', 'chuong-duong', 'Tóc nối braids 40cm', 'Tóc nối theo mỗi bịch.', 60000, '60.000đ / bịch', 'braids', 15, true),
  ('cd-braid-extension-60', 'chuong-duong', 'Tóc nối braids 60cm', 'Tóc nối theo mỗi bịch.', 90000, '90.000đ / bịch', 'braids', 15, true),
  ('cd-braid-extension-80', 'chuong-duong', 'Tóc nối braids 80cm', 'Tóc nối theo mỗi bịch.', 120000, '120.000đ / bịch', 'braids', 15, true),
  ('cd-braid-curl-ends', 'chuong-duong', 'Uốn đuôi braids', 'Dịch vụ cộng thêm uốn đuôi.', 200000, '200.000đ', 'braids', 60, true),
  -- Afro
  ('cd-afro-basic-wash', 'chuong-duong', 'Gội afro cơ bản', 'Gội afro theo độ dài tóc.', 50000, '50.000–150.000đ', 'afro', 30, true),
  ('cd-afro-wash-detangle', 'chuong-duong', 'Gội & gỡ rối afro', 'Gội và gỡ rối afro.', 150000, '150.000–250.000đ', 'afro', 60, true),
  ('cd-afro-heavy-detangle', 'chuong-duong', 'Phụ thu afro rối nặng', 'Phụ thu cho mỗi 30 phút gỡ rối nặng.', 150000, '150.000đ / 30 phút', 'afro', 30, true),
  ('cd-afro-signature-curl-treatment', 'chuong-duong', 'Signature afro curl treatment', 'Treatment curl cho afro.', 450000, 'Từ 450.000đ', 'afro', 120, true),
  ('cd-afro-extra-density', 'chuong-duong', 'Phụ thu afro dày', 'Phụ thu mỗi 30 phút cho tóc dày.', 150000, '150.000đ / 30 phút', 'afro', 30, true),
  ('cd-afro-extra-length', 'chuong-duong', 'Phụ thu afro dài', 'Phụ thu mỗi 30 phút cho tóc dài.', 150000, '150.000đ / 30 phút', 'afro', 30, true)
on conflict (id) do update set
  branch_id = excluded.branch_id,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  price_label = excluded.price_label,
  service_category = excluded.service_category,
  duration_minutes = excluded.duration_minutes,
  is_bookable = excluded.is_bookable;

-- Rebuild only current, same-branch capability mappings. This supports the
-- existing booking validator without touching historic booking records.
delete from public.barber_services mapping
using public.barbers barber
where barber.id = mapping.barber_id
  and barber.branch_id = 'chuong-duong';

insert into public.barber_services (barber_id, service_id)
select barber.id, service.id
from public.barbers barber
join public.services service
  on service.branch_id = barber.branch_id
 and service.is_bookable
where barber.branch_id = 'chuong-duong';

do $$
begin
  if exists (
    select 1
    from public.services
    where branch_id = 'chuong-duong'
      and is_bookable
      and service_category is null
  ) then
    raise exception 'Every bookable Chương Dương service must have one of the four categories.';
  end if;

  if exists (
    select 1
    from public.barbers barber
    join public.services service on service.branch_id = barber.branch_id and service.is_bookable
    left join public.barber_services mapping on mapping.barber_id = barber.id and mapping.service_id = service.id
    where barber.branch_id = 'chuong-duong'
      and mapping.barber_id is null
  ) then
    raise exception 'Every active Chương Dương barber must be mapped to every bookable service.';
  end if;
end;
$$;
