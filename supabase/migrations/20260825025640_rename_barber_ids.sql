-- Align barber IDs with the names currently used in the booking catalogue.
-- Four rows had been moved to a branch whose services they cannot perform.
-- This restores each barber to the branch matching their existing service
-- mappings, then changes identifiers without losing any booking history.

lock table public.barbers, public.barber_services, public.bookings in share row exclusive mode;

do $$
begin
  if (
    select count(*)
    from public.barbers barber
    join (
      values
        ('kai-loc', 'HUY'),
        ('minh-fade', 'VĂN HUY'),
        ('ryo-beard', 'TÌNH'),
        ('linh-color', 'PHÚC'),
        ('bao-crop', 'THUẬN'),
        ('son-line', 'KIÊN'),
        ('hieu-wave', 'DUY'),
        ('khoa-blend', 'WIN DREAD')
    ) as expected(id, name) on expected.id = barber.id and expected.name = barber.name
  ) <> 8 then
    raise exception 'Barber names or IDs no longer match the intended rename set.';
  end if;

  if exists (
    select 1
    from public.barbers barber
    where barber.id in ('huy', 'van-huy', 'tinh', 'phuc', 'thuan', 'kien', 'duy', 'win-dread')
  ) then
    raise exception 'A target barber ID already exists.';
  end if;
end;
$$;

with remap(old_id, new_id, branch_id) as (
  values
    ('kai-loc', 'huy', 'an-thuong'),
    ('minh-fade', 'van-huy', 'chuong-duong'),
    ('ryo-beard', 'tinh', 'chuong-duong'),
    ('linh-color', 'phuc', 'an-thuong'),
    ('bao-crop', 'thuan', 'chuong-duong'),
    ('son-line', 'kien', 'an-thuong'),
    ('hieu-wave', 'duy', 'chuong-duong'),
    ('khoa-blend', 'win-dread', 'an-thuong')
)
update public.barbers barber
set branch_id = remap.branch_id
from remap
where barber.id = remap.old_id;

with remap(old_id, new_id) as (
  values
    ('kai-loc', 'huy'),
    ('minh-fade', 'van-huy'),
    ('ryo-beard', 'tinh'),
    ('linh-color', 'phuc'),
    ('bao-crop', 'thuan'),
    ('son-line', 'kien'),
    ('hieu-wave', 'duy'),
    ('khoa-blend', 'win-dread')
)
insert into public.barbers (
  id, branch_id, name, email, avatar, title, specialties, working_hours, created_at, updated_at
)
select
  remap.new_id,
  barber.branch_id,
  barber.name,
  barber.email,
  barber.avatar,
  barber.title,
  barber.specialties,
  barber.working_hours,
  barber.created_at,
  barber.updated_at
from public.barbers barber
join remap on remap.old_id = barber.id;

with remap(old_id, new_id) as (
  values
    ('kai-loc', 'huy'),
    ('minh-fade', 'van-huy'),
    ('ryo-beard', 'tinh'),
    ('linh-color', 'phuc'),
    ('bao-crop', 'thuan'),
    ('son-line', 'kien'),
    ('hieu-wave', 'duy'),
    ('khoa-blend', 'win-dread')
)
insert into public.barber_services (barber_id, service_id)
select remap.new_id, mapping.service_id
from public.barber_services mapping
join remap on remap.old_id = mapping.barber_id;

-- Historical bookings may reference retired services. The validator correctly
-- protects new bookings, but it must not reject this identifier-only rewrite.
alter table public.bookings disable trigger bookings_validate_catalog;

with remap(old_id, new_id) as (
  values
    ('kai-loc', 'huy'),
    ('minh-fade', 'van-huy'),
    ('ryo-beard', 'tinh'),
    ('linh-color', 'phuc'),
    ('bao-crop', 'thuan'),
    ('son-line', 'kien'),
    ('hieu-wave', 'duy'),
    ('khoa-blend', 'win-dread')
)
update public.bookings booking
set barber_id = remap.new_id
from remap
where booking.barber_id = remap.old_id;

alter table public.bookings enable trigger bookings_validate_catalog;

delete from public.barber_services
where barber_id in ('kai-loc', 'minh-fade', 'ryo-beard', 'linh-color', 'bao-crop', 'son-line', 'hieu-wave', 'khoa-blend');

delete from public.barbers
where id in ('kai-loc', 'minh-fade', 'ryo-beard', 'linh-color', 'bao-crop', 'son-line', 'hieu-wave', 'khoa-blend');

do $$
begin
  if exists (
    select 1
    from public.barber_services mapping
    join public.barbers barber on barber.id = mapping.barber_id
    join public.services service on service.id = mapping.service_id
    where barber.branch_id is distinct from service.branch_id
       or not service.is_bookable
  ) then
    raise exception 'A barber/service mapping is not valid for its branch.';
  end if;

  if exists (
    select 1
    from public.bookings
    where barber_id in ('kai-loc', 'minh-fade', 'ryo-beard', 'linh-color', 'bao-crop', 'son-line', 'hieu-wave', 'khoa-blend')
  ) then
    raise exception 'A booking still refers to a retired barber ID.';
  end if;
end;
$$;
