-- Align the live, bookable catalogue with the four supplied WINDREAD menus.
-- Historical services and bookings are retained. Only choices offered for new
-- appointments are changed, and every active service is mapped within its
-- own branch.

update public.services as service
set
  name = catalog.name,
  description = catalog.description,
  price = catalog.price,
  price_label = catalog.price_label,
  service_category = catalog.service_category,
  duration_minutes = catalog.duration_minutes,
  is_bookable = true
from (
  values
    -- Barber services
    ('cd-haircut', 'Cắt tóc & tạo kiểu', 'Cắt tóc và tạo kiểu.', 120000, '120.000đ', 'barber', 45),
    ('cd-hot-towel-shave', 'Cạo râu khăn nóng & lạnh', 'Cạo râu với khăn nóng và lạnh.', 100000, '100.000đ', 'barber', 30),
    ('cd-haircut-expert', 'W Signature Haircut', 'Cắt tóc đặt trước với tư vấn tạo kiểu.', 160000, '160.000đ', 'barber', 60),
    ('cd-fresh-cut', 'Fresh Cut', 'Cắt tóc và gội đầu.', 150000, '150.000đ', 'barber', 60),
    ('cd-gentlemans-set', 'Gentleman''s Set', 'Cắt tóc, chăm sóc râu và cạo.', 200000, '200.000đ', 'barber', 75),
    ('cd-full-grooming', 'Full Grooming', 'Cắt tóc, gội đầu, chăm sóc râu và cạo.', 250000, '250.000đ', 'barber', 90),
    ('cd-win-dread-experience', 'W Signature Grooming Experience', 'Signature haircut, gội đầu, chăm sóc râu và cạo. Chỉ nhận đặt lịch trước.', 290000, '290.000đ', 'barber', 120),
    ('cd-sides-back-fade', 'Fade hai bên & gáy', 'Làm gọn fade hai bên và phần gáy.', 90000, '90.000đ', 'barber', 30),
    ('cd-basic-beard-trim-line-up', 'Tỉa râu cơ bản & tạo viền', 'Làm gọn râu và đường viền.', 70000, '70.000đ', 'barber', 15),
    ('cd-hair-washing', 'Gội đầu', 'Gội đầu cơ bản.', 50000, '50.000đ', 'barber', 20),
    ('cd-wash-blowdry', 'Sấy & tạo kiểu', 'Sấy và tạo kiểu tóc.', 50000, '50.000đ', 'barber', 25),
    ('cd-basic-hair-tattoo', 'Tattoo tóc cơ bản', 'Thiết kế tattoo tóc cơ bản.', 50000, '50.000-150.000đ', 'barber', 45),
    ('cd-down-perm', 'Ép side', 'Ép side tóc.', 250000, '250.000đ', 'barber', 120),
    ('cd-basic-perm', 'Uốn cơ bản', 'Uốn cơ bản theo độ dài và chất tóc.', 300000, '300.000-400.000đ', 'barber', 150),
    ('cd-curly-perm', 'Uốn xoăn', 'Uốn xoăn theo độ dài và chất tóc.', 350000, '350.000-450.000đ', 'barber', 180),
    ('cd-ruffled-perm', 'Uốn ruffled & textured', 'Uốn texture hoặc ruffled.', 350000, '350.000-450.000đ', 'barber', 240),
    ('cd-premlock-perm', 'Uốn pre-lock', 'Uốn pre-lock theo độ dài tóc.', 800000, '800.000-1.200.000đ', 'barber', 300),
    ('cd-afro-perm', 'Uốn afro', 'Uốn afro theo độ dài và mật độ tóc.', 1000000, '1.000.000-1.500.000đ', 'barber', 360),
    ('cd-hair-bleaching', 'Tẩy tóc', 'Tẩy tóc theo mỗi lần xử lý.', 250000, '250.000đ / lần', 'barber', 180),
    ('cd-bleach-root-touch-up', 'Tẩy nối chân', 'Tẩy phần chân tóc mọc mới.', 500000, '500.000-900.000đ', 'barber', 180),
    ('cd-hair-color', 'Nhuộm màu thời trang', 'Nhuộm màu thời trang theo nền tóc.', 250000, '250.000-350.000đ', 'barber', 180),
    ('cd-hair-blackening', 'Nhuộm đen', 'Nhuộm tóc đen theo nền tóc.', 150000, '150.000-250.000đ', 'barber', 90),
    ('cd-beard-coloring', 'Nhuộm râu', 'Nhuộm râu theo tình trạng râu.', 100000, '100.000-200.000đ', 'barber', 45),
    -- Dreadlocks
    ('cd-dreadlocks-new', 'Dreadlocks mới', 'Tạo dreadlocks mới. Giá cuối cùng xác nhận sau tư vấn.', 2000000, 'Từ 2.000.000đ', 'dreadlocks', 300),
    ('cd-dreadlock-maintenance-one-first', 'Bảo dưỡng dreadlocks - 1 thợ - giờ đầu', 'Bảo dưỡng, siết chân và sửa locs.', 400000, '400.000đ', 'dreadlocks', 60),
    ('cd-dreadlock-maintenance-one-additional', 'Bảo dưỡng dreadlocks - 1 thợ - giờ thêm', 'Tính từ giờ thứ hai.', 300000, '300.000đ / giờ', 'dreadlocks', 60),
    ('cd-dreadlock-maintenance-team-first', 'Bảo dưỡng dreadlocks - 2 thợ - giờ đầu', 'Bảo dưỡng với hai thợ.', 600000, '600.000đ', 'dreadlocks', 60),
    ('cd-dreadlock-maintenance-team-second', 'Bảo dưỡng dreadlocks - 2 thợ - giờ thứ hai', 'Bảo dưỡng với hai thợ.', 500000, '500.000đ', 'dreadlocks', 60),
    ('cd-dreadlock-maintenance-team-additional', 'Bảo dưỡng dreadlocks - 2 thợ - giờ thêm', 'Tính từ giờ thứ ba.', 400000, '400.000đ / giờ', 'dreadlocks', 60),
    ('cd-dreadlock-extension-short', 'Nối dreadlocks ngắn 20-30cm', 'Nối dài dreadlocks, tính theo mỗi loc.', 60000, '60.000đ / loc', 'dreadlocks', 30),
    ('cd-dreadlock-extension-medium', 'Nối dreadlocks vừa 30-40cm', 'Nối dài dreadlocks, tính theo mỗi loc.', 80000, '80.000đ / loc', 'dreadlocks', 30),
    ('cd-dreadlock-extension-long', 'Nối dreadlocks dài 40-50cm', 'Nối dài dreadlocks, tính theo mỗi loc.', 90000, '90.000đ / loc', 'dreadlocks', 30),
    ('cd-locs-basic-wash', 'Gội locs cơ bản', 'Gội locs cơ bản.', 50000, 'Từ 50.000đ', 'dreadlocks', 30),
    ('cd-locs-deep-detox', 'Detox locs sâu', 'Làm sạch sâu locs.', 350000, 'Từ 350.000đ', 'dreadlocks', 90),
    ('cd-locs-styling', 'Tạo kiểu locs', 'Tạo kiểu locs, tính theo giờ.', 420000, '420.000đ / giờ', 'dreadlocks', 60),
    -- Braids
    ('cd-cornrows-half-head', 'Cornrows nửa đầu', 'Tết cornrows nửa đầu, tính theo line.', 150000, '150.000đ / line', 'braids', 60),
    ('cd-cornrows-2-lines', '2 braids', 'Tết 2 bím.', 400000, '400.000đ', 'braids', 90),
    ('cd-cornrows-4-lines', '4 braids', 'Tết 4 bím.', 600000, '600.000đ', 'braids', 120),
    ('cd-cornrows-6-lines', '6 braids', 'Tết 6 bím.', 750000, '750.000đ', 'braids', 150),
    ('cd-cornrows-8-lines', '8 braids', 'Tết 8 bím.', 900000, '900.000đ', 'braids', 180),
    ('cd-cornrows-10-lines', '10 braids', 'Tết 10 bím.', 1050000, '1.050.000đ', 'braids', 210),
    ('cd-braids-custom-design', 'Braids custom design', 'Thiết kế braids phức tạp theo yêu cầu.', 420000, '420.000đ / giờ', 'braids', 60),
    ('cd-box-braids-shoulder', 'Box braids - trên vai', 'Full head box braids.', 1200000, '1.200.000đ', 'braids', 240),
    ('cd-box-braids-over-shoulder', 'Box braids - qua vai', 'Full head box braids.', 1500000, '1.500.000đ', 'braids', 300),
    ('cd-box-braids-mid-back', 'Box braids - giữa lưng', 'Full head box braids.', 1800000, '1.800.000đ', 'braids', 360),
    ('cd-knotless-braids-shoulder', 'Knotted braids - trên vai', 'Full head knotted braids.', 1500000, '1.500.000đ', 'braids', 270),
    ('cd-knotless-braids-over-shoulder', 'Knotted braids - qua vai', 'Full head knotted braids.', 1800000, '1.800.000đ', 'braids', 330),
    ('cd-knotless-braids-mid-back', 'Knotted braids - giữa lưng', 'Full head knotted braids.', 2200000, '2.200.000đ', 'braids', 390),
    ('cd-boho-braids-shoulder', 'Boho braids - trên vai', 'Full head boho braids.', 1800000, '1.800.000đ', 'braids', 300),
    ('cd-boho-braids-over-shoulder', 'Boho braids - qua vai', 'Full head boho braids.', 2200000, '2.200.000đ', 'braids', 360),
    ('cd-boho-braids-mid-back', 'Boho braids - giữa lưng', 'Full head boho braids.', 2600000, '2.600.000đ', 'braids', 420),
    ('cd-braid-extension-40', 'Tóc nối 40cm', 'Tóc nối braids, tính theo bịch.', 60000, '60.000đ / bịch', 'braids', 15),
    ('cd-braid-extension-60', 'Tóc nối 60cm', 'Tóc nối braids, tính theo bịch.', 90000, '90.000đ / bịch', 'braids', 15),
    ('cd-braid-extension-80', 'Tóc nối 80cm', 'Tóc nối braids, tính theo bịch.', 120000, '120.000đ / bịch', 'braids', 15),
    ('cd-braid-curl-ends', 'Uốn đuôi braids', 'Dịch vụ cộng thêm uốn đuôi.', 200000, '200.000đ', 'braids', 60)
) as catalog(id, name, description, price, price_label, service_category, duration_minutes)
where service.id = catalog.id;

insert into public.services (
  id, branch_id, name, description, price, price_label, service_category, duration_minutes, is_bookable
) values
  ('cd-afro-wash', 'chuong-duong', 'Gội afro cơ bản', 'Gội afro cơ bản.', 50000, '50.000đ', 'afro', 30, true),
  ('cd-afro-wash-care', 'chuong-duong', 'Gội & dưỡng afro', 'Gội và dưỡng afro cơ bản.', 100000, '100.000đ', 'afro', 45, true),
  ('cd-afro-blow-dry', 'chuong-duong', 'Sấy stretch afro', 'Gội afro và sấy stretch.', 150000, '150.000đ', 'afro', 60, true),
  ('cd-afro-professional-blowout', 'chuong-duong', 'Sấy afro chuyên dụng', 'Sấy afro bằng máy chuyên dụng.', 200000, '200.000đ', 'afro', 75, true),
  ('cd-afro-deep-treatment', 'chuong-duong', 'Ủ kem chuyên sâu', 'Ủ kem chuyên sâu cho afro.', 200000, '200.000đ', 'afro', 75, true),
  ('cd-afro-signature-care', 'chuong-duong', 'Signature Afro Care', 'Gội, ủ kem, dưỡng và tạo kiểu.', 400000, '400.000đ', 'afro', 120, true),
  ('cd-afro-finger-comb-coil', 'chuong-duong', 'Finger / comb coil', 'Tạo coil thủ công.', 420000, '420.000đ / giờ', 'afro', 60, true)
on conflict (id) do update set
  branch_id = excluded.branch_id,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  price_label = excluded.price_label,
  service_category = excluded.service_category,
  duration_minutes = excluded.duration_minutes,
  is_bookable = excluded.is_bookable;

-- Superseded Afro add-ons are retained for historic bookings only.
update public.services
set is_bookable = false
where id in ('cd-afro-basic-wash', 'cd-afro-wash-detangle', 'cd-afro-heavy-detangle',
             'cd-afro-signature-curl-treatment', 'cd-afro-extra-density', 'cd-afro-extra-length');

-- The printed level guide is a price adjustment, not an independently-bookable
-- appointment. Its rules are displayed alongside the Afro section in the UI.

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
    from public.barbers barber
    join public.services service
      on service.branch_id = barber.branch_id
     and service.is_bookable
    left join public.barber_services mapping
      on mapping.barber_id = barber.id
     and mapping.service_id = service.id
    where barber.branch_id = 'chuong-duong'
      and mapping.barber_id is null
  ) then
    raise exception 'Every bookable Chương Dương service must be selectable with every Chương Dương barber.';
  end if;
end;
$$;
