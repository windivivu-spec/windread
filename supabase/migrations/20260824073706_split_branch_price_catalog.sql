-- WINDREAD now uses two independent booking catalogues. Historical bookings
-- retain their service IDs; this migration only changes what can be newly booked.
alter table public.services
  add column if not exists price_label text;

update public.services
set is_bookable = coalesce(branch_id in ('an-thuong', 'chuong-duong'), false);

update public.services as service
set
  name = catalog.name,
  description = catalog.description,
  price = catalog.price,
  price_label = catalog.price_label,
  duration_minutes = catalog.duration_minutes
from (
  values
    ('an-dreadlock', 'Dreadlock', 'Tạo dreadlock theo độ dài, mật độ và nền tóc; cần tư vấn trước khi làm.', 2000000, '2.000.000–8.000.000đ', 240),
    ('an-single-dread', 'Single Dread', 'Làm một dread riêng lẻ, áp dụng cho độ dài 20–30cm.', 150000, '150.000đ / dread', 30),
    ('an-pair-dreads', 'Pair of Dreads', 'Làm một cặp dread, áp dụng cho độ dài 30–40cm.', 300000, '300.000đ / cặp', 60),
    ('an-cornrow', 'Cornrow 2–8 line', 'Tết cornrow sát da đầu, 150.000đ mỗi line; áp dụng cho 2, 4, 6 hoặc 8 line.', 300000, '150.000đ / line', 90),
    ('an-cornrow-10-16', 'Cornrow 10–16 line', 'Tết cornrow sát da đầu, 130.000đ mỗi line; áp dụng cho 10, 12, 14 hoặc 16 line.', 1300000, '130.000đ / line', 180),
    ('an-braids-men', 'Braids nam', 'Box braids hoặc pattern theo nền tóc và số section.', 1000000, '1.000.000–3.000.000đ', 180),
    ('an-braids-women', 'Braids nữ', 'Box braids theo độ dài, mật độ và thiết kế mong muốn.', 3000000, '3.000.000–4.000.000đ', 300),
    ('an-locs-styling', 'Styling locs / braids', 'Thiết kế twist, cornrow hoặc braids; tính theo giờ.', 400000, '400.000đ / giờ', 60),
    ('an-maintenance-1-worker-first-hour', 'Maintenance · 1 thợ · giờ đầu', 'Bảo dưỡng dread/locs với 1 thợ, áp dụng cho giờ đầu tiên.', 400000, '400.000đ', 60),
    ('an-maintenance-1-worker-additional-hour', 'Maintenance · 1 thợ · giờ tiếp theo', 'Bảo dưỡng dread/locs với 1 thợ, tính từ giờ thứ hai.', 300000, '300.000đ / giờ', 60),
    ('an-maintenance-2-workers-first-hour', 'Maintenance · 2 thợ · giờ đầu', 'Bảo dưỡng dread/locs với 2 thợ, áp dụng cho giờ đầu tiên.', 600000, '600.000đ', 60),
    ('an-maintenance-2-workers-second-hour', 'Maintenance · 2 thợ · giờ thứ hai', 'Bảo dưỡng dread/locs với 2 thợ, áp dụng cho giờ thứ hai.', 500000, '500.000đ', 60),
    ('an-maintenance-2-workers-additional-hour', 'Maintenance · 2 thợ · từ giờ thứ ba', 'Bảo dưỡng dread/locs với 2 thợ, tính từ giờ thứ ba trở đi.', 400000, '400.000đ / giờ', 60),
    ('an-basic-perm', 'Uốn basic', 'Uốn cơ bản; giá thay đổi theo độ dài và chất tóc.', 300000, '300.000–400.000đ', 90),
    ('an-curly-perm', 'Uốn xoăn', 'Curly perm; giá thay đổi theo độ dài và chất tóc.', 350000, '350.000–450.000đ', 120),
    ('an-ruffled-perm', 'Uốn Ruffled', 'Ruffled perm; giá thay đổi theo form tóc.', 400000, '400.000–450.000đ', 120),
    ('an-texture-perm', 'Uốn sâu / Texture Perm', 'Uốn sâu tạo texture; giá thay đổi theo chất tóc.', 400000, '400.000–450.000đ', 120),
    ('an-premlock-perm', 'Uốn PremLock', 'PremLock perm; giá thay đổi theo độ dài tóc.', 800000, '800.000–1.300.000đ', 150),
    ('an-afro-perm', 'Uốn Afro', 'Afro perm; giá thay đổi theo độ dài và mật độ tóc.', 1000000, '1.000.000–1.500.000đ', 180),
    ('an-hair-bleach', 'Tẩy tóc', 'Tẩy tóc theo mỗi lần xử lý; kiểm tra nền tóc trước khi làm.', 250000, '250.000đ / lần', 90),
    ('an-root-bleaching', 'Tẩy nối chân', 'Tẩy nối chân tóc; giá thay đổi theo nền tóc.', 400000, '400.000–600.000đ', 120),
    ('an-hair-pressed-down', 'Ép side', 'Hair pressed down / ép side tóc.', 250000, '250.000đ', 60),
    ('an-hair-restore', 'Phục hồi tóc', 'Hair restore cho tóc cần phục hồi.', 300000, '300.000–400.000đ', 90),
    ('an-beard-dye', 'Nhuộm râu', 'Beard dye; giá thay đổi theo tình trạng râu.', 150000, '150.000–250.000đ', 45),
    ('an-black-dye', 'Nhuộm đen', 'Black dye; giá thay đổi theo nền tóc.', 150000, '150.000–250.000đ', 60),
    ('an-haircut-styling', 'Cắt tóc & tạo kiểu', 'Cắt tóc, tạo kiểu với Uppercut; thời lượng 45 phút.', 150000, '150.000đ', 45),
    ('an-hot-cold-towel-shave', 'Cạo khăn nóng & lạnh', 'Hot & cold towel shave; thời lượng 30 phút.', 120000, '120.000đ', 30),
    ('an-basic-beard-trim-side', 'Tỉa râu cơ bản / cắt side', 'Tỉa râu cơ bản hoặc chỉ cắt phần side; thời lượng 25 phút.', 100000, '100.000đ', 25),
    ('an-hair-styling', 'Sấy & tạo kiểu tóc', 'Hair styling sau khi gội hoặc cắt tóc.', 100000, '100.000đ', 30),
    ('an-hair-washing', 'Gội đầu thường', 'Hair washing cơ bản.', 50000, '50.000đ', 30),
    ('an-locs-washing', 'Gội & làm sạch Dreads / Locs', 'Giá thay đổi theo độ dài dread hoặc locs.', 50000, '50.000–150.000đ', 45),
    ('an-afro-wash-blowdry', 'Gội & sấy tóc Afro', 'Afro hair wash & blow-dry; giá thay đổi theo độ dài tóc.', 100000, '100.000–200.000đ', 60),
    ('an-basic-hair-tattoo', 'Tattoo tóc cơ bản', 'Giá thay đổi theo thiết kế.', 50000, '50.000–150.000đ', 30),
    ('an-gentlemans-set-1', 'Gentleman''s Set I', 'Cắt tóc + cạo khăn nóng/lạnh + Uppercut.', 250000, '250.000đ', 75),
    ('an-gentlemans-set-2', 'Gentleman''s Set II', 'Cắt tóc + gội + cạo khăn nóng/lạnh + Uppercut.', 290000, '290.000đ', 90),
    ('an-vip-gentlemans-combo', 'VIP Gentleman''s Combo', 'Chỉ nhận đặt lịch trước; tư vấn tạo kiểu, haircut/shave theo yêu cầu, khăn nóng/lạnh, grooming và quyền ưu tiên.', 390000, '390.000đ', 120),
    ('cd-haircut', 'Cắt tóc & tạo kiểu', 'Cắt tóc và tạo kiểu với pomade.', 120000, '120.000đ', 45),
    ('cd-sides-back-fade', 'Fade hai bên & gáy', 'Làm gọn phần hai bên và gáy.', 90000, '90.000đ', 30),
    ('cd-long-haircut', 'Cắt tóc nam dài', 'Cắt và chỉnh form cho tóc nam dài.', 200000, '200.000đ', 60),
    ('cd-basic-hair-tattoo', 'Tattoo tóc cơ bản', 'Giá thay đổi theo thiết kế.', 50000, '50.000–150.000đ', 30),
    ('cd-hair-washing', 'Gội đầu thư giãn', 'Hair washing cơ bản.', 40000, '40.000đ', 30),
    ('cd-haircut-expert', 'Cắt tóc bởi chuyên gia', 'Chỉ nhận lịch hẹn trước.', 160000, '160.000đ', 60),
    ('cd-beard-trim', 'Tỉa râu', 'Tạo form và làm gọn râu.', 80000, '80.000đ', 30),
    ('cd-basic-beard-trim-line-up', 'Tỉa râu cơ bản / cạo viền', 'Làm gọn đường viền.', 70000, '70.000đ', 25),
    ('cd-full-head-face-shave', 'Cạo đầu / cạo mặt', 'Dịch vụ cạo cơ bản.', 70000, '70.000đ', 30),
    ('cd-hot-towel-shave', 'Cạo khăn nóng & lạnh', 'Cạo mặt với khăn nóng và lạnh.', 60000, '60.000đ', 30),
    ('cd-wash-blowdry', 'Gội & sấy tạo kiểu', 'Gội, sấy và tạo kiểu với pomade.', 70000, '70.000đ', 30),
    ('cd-keratin-therapy', 'Phục hồi Keratin', 'Phục hồi Keratin cho tóc khô xơ; giá thay đổi theo tình trạng tóc.', 200000, '200.000–400.000đ', 60),
    ('cd-down-perm', 'Ép side tóc', 'Down perm làm gọn side tóc.', 250000, '250.000đ', 60),
    ('cd-basic-perm', 'Uốn basic', 'Uốn cơ bản; giá thay đổi theo độ dài và nền tóc.', 300000, '300.000–400.000đ', 90),
    ('cd-curly-perm', 'Uốn xoăn', 'Curly perm; giá thay đổi theo độ dài và độ xoăn mong muốn.', 350000, '350.000–450.000đ', 120),
    ('cd-ruffled-perm', 'Uốn Ruffled', 'Ruffled perm; giá thay đổi theo form tóc.', 400000, '400.000–500.000đ', 120),
    ('cd-premlock-perm', 'Uốn PremLock', 'Uốn PremLock; giá thay đổi theo nền tóc.', 800000, '800.000–1.200.000đ', 150),
    ('cd-afro-perm', 'Uốn Afro', 'Uốn Afro; giá thay đổi theo độ dài và mật độ tóc.', 1000000, '1.000.000–1.500.000đ', 180),
    ('cd-hair-bleaching', 'Tẩy tóc', 'Hair bleaching, tính theo mỗi lần tẩy.', 250000, '250.000đ / lần', 90),
    ('cd-bleach-root-touch-up', 'Tẩy nối chân tóc', 'Bleach root touch-up; giá thay đổi theo nền tóc.', 500000, '500.000–900.000đ', 120),
    ('cd-hair-color', 'Nhuộm tóc thời trang', 'Nhuộm màu thời trang; giá thay đổi theo nền tóc và màu chọn.', 250000, '250.000–350.000đ', 90),
    ('cd-hair-blackening', 'Nhuộm đen', 'Hair blackening; giá thay đổi theo nền tóc.', 150000, '150.000–250.000đ', 60),
    ('cd-beard-coloring', 'Nhuộm râu', 'Beard coloring; giá thay đổi theo tình trạng râu.', 150000, '150.000–250.000đ', 45),
    ('cd-basic-beard-coloring', 'Nhuộm râu cơ bản', 'Nhuộm râu cơ bản.', 100000, '100.000đ', 30)
) as catalog(id, name, description, price, price_label, duration_minutes)
where service.id = catalog.id;

-- Rebuild active capability mappings. A service may only be offered by a barber
-- at the same branch, while historical bookings remain untouched.
delete from public.barber_services
where barber_id in ('kai-loc', 'khoa-blend', 'linh-color', 'son-line', 'minh-fade', 'ryo-beard', 'bao-crop', 'hieu-wave');

insert into public.barber_services (barber_id, service_id)
select mapping.barber_id, mapping.service_id
from (
  values
    ('kai-loc', 'an-dreadlock'), ('kai-loc', 'an-single-dread'), ('kai-loc', 'an-pair-dreads'), ('kai-loc', 'an-cornrow'), ('kai-loc', 'an-cornrow-10-16'), ('kai-loc', 'an-braids-men'), ('kai-loc', 'an-braids-women'), ('kai-loc', 'an-locs-styling'), ('kai-loc', 'an-locs-washing'), ('kai-loc', 'an-maintenance-1-worker-first-hour'), ('kai-loc', 'an-maintenance-1-worker-additional-hour'), ('kai-loc', 'an-maintenance-2-workers-first-hour'), ('kai-loc', 'an-maintenance-2-workers-second-hour'), ('kai-loc', 'an-maintenance-2-workers-additional-hour'),
    ('khoa-blend', 'an-basic-perm'), ('khoa-blend', 'an-curly-perm'), ('khoa-blend', 'an-ruffled-perm'), ('khoa-blend', 'an-texture-perm'), ('khoa-blend', 'an-premlock-perm'), ('khoa-blend', 'an-afro-perm'), ('khoa-blend', 'an-hair-bleach'), ('khoa-blend', 'an-root-bleaching'), ('khoa-blend', 'an-hair-pressed-down'), ('khoa-blend', 'an-hair-restore'), ('khoa-blend', 'an-black-dye'), ('khoa-blend', 'an-locs-styling'), ('khoa-blend', 'an-braids-men'), ('khoa-blend', 'an-braids-women'),
    ('linh-color', 'an-basic-perm'), ('linh-color', 'an-curly-perm'), ('linh-color', 'an-ruffled-perm'), ('linh-color', 'an-texture-perm'), ('linh-color', 'an-premlock-perm'), ('linh-color', 'an-afro-perm'), ('linh-color', 'an-hair-bleach'), ('linh-color', 'an-root-bleaching'), ('linh-color', 'an-hair-pressed-down'), ('linh-color', 'an-hair-restore'), ('linh-color', 'an-black-dye'), ('linh-color', 'an-locs-styling'), ('linh-color', 'an-braids-men'), ('linh-color', 'an-braids-women'),
    ('son-line', 'an-haircut-styling'), ('son-line', 'an-hot-cold-towel-shave'), ('son-line', 'an-basic-beard-trim-side'), ('son-line', 'an-hair-styling'), ('son-line', 'an-hair-washing'), ('son-line', 'an-afro-wash-blowdry'), ('son-line', 'an-basic-hair-tattoo'), ('son-line', 'an-beard-dye'), ('son-line', 'an-gentlemans-set-1'), ('son-line', 'an-gentlemans-set-2'), ('son-line', 'an-vip-gentlemans-combo'), ('son-line', 'an-locs-styling'), ('son-line', 'an-cornrow'), ('son-line', 'an-single-dread'), ('son-line', 'an-maintenance-2-workers-first-hour'), ('son-line', 'an-maintenance-2-workers-second-hour'), ('son-line', 'an-maintenance-2-workers-additional-hour'),
    ('minh-fade', 'cd-haircut'), ('minh-fade', 'cd-sides-back-fade'), ('minh-fade', 'cd-long-haircut'), ('minh-fade', 'cd-wash-blowdry'), ('minh-fade', 'cd-basic-hair-tattoo'), ('minh-fade', 'cd-hair-washing'), ('minh-fade', 'cd-haircut-expert'),
    ('ryo-beard', 'cd-haircut'), ('ryo-beard', 'cd-beard-trim'), ('ryo-beard', 'cd-basic-beard-trim-line-up'), ('ryo-beard', 'cd-full-head-face-shave'), ('ryo-beard', 'cd-hot-towel-shave'), ('ryo-beard', 'cd-beard-coloring'), ('ryo-beard', 'cd-basic-beard-coloring'),
    ('bao-crop', 'cd-haircut'), ('bao-crop', 'cd-sides-back-fade'), ('bao-crop', 'cd-long-haircut'), ('bao-crop', 'cd-wash-blowdry'), ('bao-crop', 'cd-basic-hair-tattoo'), ('bao-crop', 'cd-hair-washing'), ('bao-crop', 'cd-haircut-expert'), ('bao-crop', 'cd-down-perm'), ('bao-crop', 'cd-basic-perm'),
    ('hieu-wave', 'cd-keratin-therapy'), ('hieu-wave', 'cd-down-perm'), ('hieu-wave', 'cd-basic-perm'), ('hieu-wave', 'cd-curly-perm'), ('hieu-wave', 'cd-ruffled-perm'), ('hieu-wave', 'cd-premlock-perm'), ('hieu-wave', 'cd-afro-perm'), ('hieu-wave', 'cd-hair-bleaching'), ('hieu-wave', 'cd-bleach-root-touch-up'), ('hieu-wave', 'cd-hair-color'), ('hieu-wave', 'cd-hair-blackening')
) as mapping(barber_id, service_id)
join public.barbers barber on barber.id = mapping.barber_id
join public.services service on service.id = mapping.service_id and service.is_bookable and service.branch_id = barber.branch_id;

create or replace function public.validate_barber_service_branch()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.barbers barber
    join public.services service on service.id = new.service_id
    where barber.id = new.barber_id
      and barber.branch_id = service.branch_id
  ) then
    raise exception using errcode = '23514', message = 'Barber and service must belong to the same branch.';
  end if;
  return new;
end;
$$;

drop trigger if exists barber_services_validate_branch on public.barber_services;
create trigger barber_services_validate_branch
before insert or update on public.barber_services
for each row execute function public.validate_barber_service_branch();

create or replace function public.validate_booking_catalog()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  -- Do not block a status update for an old booking that predates the split.
  if tg_op = 'UPDATE'
     and new.branch_id is not distinct from old.branch_id
     and new.service_id is not distinct from old.service_id
     and new.barber_id is not distinct from old.barber_id then
    return new;
  end if;

  if not exists (
    select 1
    from public.services service
    where service.id = new.service_id
      and service.branch_id = new.branch_id
      and service.is_bookable
  ) then
    raise exception using errcode = '23514', message = 'The selected service is not bookable at this branch.';
  end if;

  if not exists (
    select 1
    from public.barbers barber
    join public.barber_services mapping on mapping.barber_id = barber.id
    where barber.id = new.barber_id
      and barber.branch_id = new.branch_id
      and mapping.service_id = new.service_id
  ) then
    raise exception using errcode = '23514', message = 'The selected barber cannot perform this service at this branch.';
  end if;

  return new;
end;
$$;

drop trigger if exists bookings_validate_catalog on public.bookings;
create trigger bookings_validate_catalog
before insert or update on public.bookings
for each row execute function public.validate_booking_catalog();

do $$
begin
  if (select count(*) from public.services where is_bookable) <> 60 then
    raise exception 'Expected 60 active services across the two branch catalogues.';
  end if;

  if exists (
    select 1
    from public.barber_services mapping
    join public.barbers barber on barber.id = mapping.barber_id
    join public.services service on service.id = mapping.service_id
    where barber.branch_id <> service.branch_id
  ) then
    raise exception 'A barber is mapped to a service from another branch.';
  end if;
end;
$$;
