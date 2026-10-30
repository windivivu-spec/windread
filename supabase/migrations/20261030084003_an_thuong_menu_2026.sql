-- Prepared from the two An Thuong price-menu images. Review current rows before applying.
-- This script does not change Chương Dương or unrelated Locs/Braids services.
begin;
do $$
begin
  if (select count(*) from public.services where branch_id = 'an-thuong' and id in (
    'an-haircut-styling','an-hot-cold-towel-shave','an-hair-styling','an-hair-washing',
    'an-basic-hair-tattoo','an-gentlemans-set-1','an-gentlemans-set-2','an-vip-gentlemans-combo',
    'an-hair-pressed-down','an-basic-perm','an-curly-perm','an-ruffled-perm','an-texture-perm',
    'an-premlock-perm','an-afro-perm','an-hair-bleach','an-root-bleaching','an-black-dye','an-beard-dye'
  )) <> 19 then raise exception 'Expected An Thuong services are missing; inspect the current catalog first.'; end if;
end $$;

update public.services s set name=v.name, description=v.description, price=v.price,
  walk_in_price=v.walk_in_price, price_label=v.price_label, duration_minutes=v.minutes
from (values
  ('an-haircut-styling','Cắt tóc & tạo kiểu','Cắt tóc và tạo kiểu.',170000,190000,null,45),
  ('an-hot-cold-towel-shave','Cạo khăn nóng & lạnh','Cạo râu với khăn nóng và lạnh.',120000,null,null,25),
  ('an-hair-styling','Sấy & tạo kiểu tóc','Sấy và tạo kiểu tóc.',100000,null,null,20),
  ('an-hair-washing','Gội đầu','Gội đầu cơ bản.',70000,null,null,15),
  ('an-basic-hair-tattoo','Xăm tóc cơ bản','Giá thay đổi theo thiết kế.',50000,null,'50.000–150.000đ+',30),
  ('an-gentlemans-set-1','Cắt tóc + cạo khăn nóng & lạnh','Cắt tóc và cạo khăn nóng & lạnh.',280000,300000,null,75),
  ('an-gentlemans-set-2','Cắt tóc + gội đầu + cạo khăn nóng & lạnh','Cắt tóc, gội đầu và cạo khăn nóng & lạnh.',350000,370000,null,90),
  ('an-vip-gentlemans-combo','Signature VIP Experience','Chỉ đặt lịch trước: cắt tóc, gội, tạo kiểu, cạo khăn nóng & lạnh, một ly short drink và chơi game cùng barber.',420000,null,null,120),
  ('an-hair-pressed-down','Ép side tóc','Thời gian thực hiện 1,5–2,5 giờ.',250000,null,null,150),
  ('an-basic-perm','Uốn cơ bản','Thời gian thực hiện 2–3 giờ.',300000,null,'300.000–400.000đ',180),
  ('an-curly-perm','Uốn xoăn','Thời gian thực hiện 2–3,5 giờ.',350000,null,'350.000–450.000đ',210),
  ('an-ruffled-perm','Uốn Ruffled','Thời gian thực hiện 2,5–4 giờ.',400000,null,'400.000–450.000đ',240),
  ('an-texture-perm','Uốn Texture','Thời gian thực hiện 2,5–4 giờ.',400000,null,'400.000–450.000đ',240),
  ('an-premlock-perm','Uốn Prelock','Thời gian thực hiện 3–5 giờ.',800000,null,'800.000–1.200.000đ',300),
  ('an-afro-perm','Uốn Afro','Thời gian thực hiện 3–6 giờ.',1000000,null,'1.000.000–1.500.000đ',360),
  ('an-hair-bleach','Tẩy tóc','Tính theo mỗi lần xử lý. Thời gian thực hiện 1,5–3 giờ.',250000,null,'250.000đ / lần',180),
  ('an-root-bleaching','Tẩy chân tóc mọc mới','Thời gian thực hiện 1,5–3 giờ.',500000,null,'500.000–900.000đ',180),
  ('an-black-dye','Nhuộm tóc đen','Thời gian thực hiện 1–1,5 giờ.',150000,null,'150.000–250.000đ',90),
  ('an-beard-dye','Nhuộm râu','Thời gian thực hiện 30–45 phút.',100000,null,'100.000–200.000đ',45)
) as v(id,name,description,price,walk_in_price,price_label,minutes)
where s.branch_id='an-thuong' and s.id=v.id;

insert into public.services (id,branch_id,name,description,price,walk_in_price,price_label,duration_minutes,service_category,is_bookable,is_price_visible)
values
 ('an-hairline-touch-up','an-thuong','Bấm viền tóc','Bấm viền tóc.',100000,null,null,25,'barber',true,true),
 ('an-combo-haircut-wash','an-thuong','Cắt tóc + gội đầu','Cắt tóc và gội đầu.',230000,250000,null,60,'barber',true,true),
 ('an-fashion-color','an-thuong','Nhuộm màu thời trang','Thời gian thực hiện 1,5–3 giờ.',250000,null,'250.000–350.000đ',180,'barber',true,true),
 ('an-afro-wash','an-thuong','Gội Afro cơ bản','Thời gian thực hiện 20–30 phút.',70000,null,null,30,'afro',true,true),
 ('an-afro-wash-care','an-thuong','Gội + dưỡng Afro cơ bản','Thời gian thực hiện 30–45 phút.',100000,null,null,45,'afro',true,true),
 ('an-afro-blow-dry','an-thuong','Gội Afro + sấy stretch','Thời gian thực hiện 45–60 phút.',150000,null,null,60,'afro',true,true),
 ('an-afro-professional-blowout','an-thuong','Sấy Afro chuyên dụng','Thời gian thực hiện 45–75 phút.',200000,null,null,75,'afro',true,true),
 ('an-afro-deep-treatment','an-thuong','Ủ kem chuyên sâu','Thời gian thực hiện 50–75 phút.',200000,null,null,75,'afro',true,true),
 ('an-afro-signature-care','an-thuong','Signature Afro Care','Gội, ủ kem, dưỡng và tạo kiểu. Thời gian thực hiện 90–120 phút.',400000,null,null,120,'afro',true,true),
 ('an-afro-finger-comb-coil','an-thuong','Finger / comb coil','Tạo coil thủ công; thời gian tùy thực tế.',420000,null,'420.000đ / giờ',60,'afro',true,true)
on conflict (id) do update set name=excluded.name,description=excluded.description,price=excluded.price,
 walk_in_price=excluded.walk_in_price,price_label=excluded.price_label,duration_minutes=excluded.duration_minutes,
 service_category=excluded.service_category,is_bookable=excluded.is_bookable,is_price_visible=excluded.is_price_visible
where services.branch_id='an-thuong';

-- Superseded, ambiguously priced Afro wash remains available to historic bookings.
update public.services set is_bookable=false,is_price_visible=false
where id='an-afro-wash-blowdry' and branch_id='an-thuong';
insert into public.barber_services (barber_id,service_id)
select b.id,s.id from public.barbers b join public.services s on s.branch_id=b.branch_id
where b.branch_id='an-thuong' and s.id in ('an-hairline-touch-up','an-combo-haircut-wash','an-fashion-color',
 'an-afro-wash','an-afro-wash-care','an-afro-blow-dry','an-afro-professional-blowout','an-afro-deep-treatment','an-afro-signature-care','an-afro-finger-comb-coil')
on conflict do nothing;
commit;
