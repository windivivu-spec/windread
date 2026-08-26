-- Move the current barber roster to the requested branches and replace the
-- moved barbers' capabilities with services from the target branch catalogue.
-- Historical bookings remain unchanged.

lock table public.barbers, public.barber_services, public.bookings in share row exclusive mode;

do $$
begin
  if (
    select count(*)
    from public.barbers
    where (id, name) in (
      ('duy', 'DUY'), ('thuan', 'THUẬN'), ('phuc', 'PHÚC'), ('win-dread', 'WIN DREAD'),
      ('huy', 'HUY'), ('van-huy', 'VĂN HUY'), ('tinh', 'TÌNH'), ('kien', 'KIÊN')
    )
  ) <> 8 then
    raise exception 'The expected barber roster is no longer present.';
  end if;
end;
$$;

update public.barbers
set branch_id = case id
  when 'duy' then 'an-thuong'
  when 'thuan' then 'an-thuong'
  when 'phuc' then 'an-thuong'
  when 'win-dread' then 'an-thuong'
  when 'huy' then 'chuong-duong'
  when 'van-huy' then 'chuong-duong'
  when 'tinh' then 'chuong-duong'
  when 'kien' then 'chuong-duong'
end
where id in ('duy', 'thuan', 'phuc', 'win-dread', 'huy', 'van-huy', 'tinh', 'kien');

delete from public.barber_services
where barber_id in ('duy', 'thuan', 'huy', 'kien');

insert into public.barber_services (barber_id, service_id)
select mapping.barber_id, mapping.service_id
from (
  values
    ('duy', 'an-hair-restore'), ('duy', 'an-hair-pressed-down'), ('duy', 'an-basic-perm'),
    ('duy', 'an-curly-perm'), ('duy', 'an-ruffled-perm'), ('duy', 'an-texture-perm'),
    ('duy', 'an-premlock-perm'), ('duy', 'an-afro-perm'), ('duy', 'an-hair-bleach'),
    ('duy', 'an-root-bleaching'), ('duy', 'an-black-dye'),
    ('thuan', 'an-haircut-styling'), ('thuan', 'an-hair-styling'), ('thuan', 'an-hair-washing'),
    ('thuan', 'an-basic-hair-tattoo'), ('thuan', 'an-hair-pressed-down'), ('thuan', 'an-basic-perm'),
    ('huy', 'cd-haircut'), ('huy', 'cd-sides-back-fade'), ('huy', 'cd-long-haircut'),
    ('huy', 'cd-wash-blowdry'), ('huy', 'cd-hair-washing'), ('huy', 'cd-haircut-expert'),
    ('kien', 'cd-haircut'), ('kien', 'cd-sides-back-fade'), ('kien', 'cd-long-haircut'),
    ('kien', 'cd-wash-blowdry'), ('kien', 'cd-basic-hair-tattoo'), ('kien', 'cd-hair-washing'),
    ('kien', 'cd-haircut-expert'), ('kien', 'cd-beard-trim'), ('kien', 'cd-basic-beard-trim-line-up'),
    ('kien', 'cd-full-head-face-shave'), ('kien', 'cd-hot-towel-shave'), ('kien', 'cd-beard-coloring'),
    ('kien', 'cd-basic-beard-coloring')
) as mapping(barber_id, service_id)
join public.barbers barber on barber.id = mapping.barber_id
join public.services service on service.id = mapping.service_id
  and service.branch_id = barber.branch_id
  and service.is_bookable;

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

  if (
    select count(*)
    from public.barbers
    where (branch_id = 'an-thuong' and id in ('duy', 'thuan', 'phuc', 'win-dread'))
       or (branch_id = 'chuong-duong' and id in ('huy', 'van-huy', 'tinh', 'kien'))
  ) <> 8 then
    raise exception 'Barbers are not assigned to the requested branches.';
  end if;
end;
$$;
