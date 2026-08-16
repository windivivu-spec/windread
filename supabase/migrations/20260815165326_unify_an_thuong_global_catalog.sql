-- Use the An Thuong price list as the only bookable catalogue across both
-- branches. The preceding branch-service migration creates the `an-*` rows;
-- historical services and bookings are retained but are no longer sellable.
alter table public.services
  add column if not exists is_bookable boolean not null default false;

update public.services
set is_bookable = false;

update public.services
set is_bookable = true
where id in (
  'an-dreadlock', 'an-single-dread', 'an-pair-dreads', 'an-cornrow', 'an-cornrow-10-16',
  'an-braids-men', 'an-braids-women', 'an-locs-styling',
  'an-maintenance-1-worker-first-hour', 'an-maintenance-1-worker-additional-hour',
  'an-maintenance-2-workers-first-hour', 'an-maintenance-2-workers-second-hour', 'an-maintenance-2-workers-additional-hour',
  'an-basic-perm', 'an-curly-perm', 'an-ruffled-perm', 'an-texture-perm', 'an-premlock-perm', 'an-afro-perm',
  'an-hair-bleach', 'an-root-bleaching', 'an-hair-pressed-down', 'an-hair-restore',
  'an-beard-dye', 'an-black-dye', 'an-haircut-styling', 'an-hot-cold-towel-shave',
  'an-basic-beard-trim-side', 'an-hair-styling', 'an-hair-washing', 'an-locs-washing',
  'an-afro-wash-blowdry', 'an-basic-hair-tattoo', 'an-gentlemans-set-1',
  'an-gentlemans-set-2', 'an-vip-gentlemans-combo'
);

do $$
begin
  if not exists (select 1 from public.services where id = 'an-haircut-styling' and is_bookable) then
    raise exception 'The shared An Thuong catalogue is missing. Apply 202608101100_branch_service_catalog first.';
  end if;
end;
$$;

-- Service capability stays specific to each barber even though the prices are
-- common. Rebuild only active crew mappings; historic bookings keep their own
-- service IDs and remain intact.
delete from public.barber_services
where barber_id in (
  'kai-loc', 'minh-fade', 'ryo-beard', 'linh-color',
  'bao-crop', 'son-line', 'hieu-wave', 'khoa-blend'
);

insert into public.barber_services (barber_id, service_id)
select mapping.barber_id, mapping.service_id
from (
  values
    ('kai-loc', 'an-dreadlock'), ('kai-loc', 'an-single-dread'), ('kai-loc', 'an-pair-dreads'),
    ('kai-loc', 'an-cornrow'), ('kai-loc', 'an-cornrow-10-16'), ('kai-loc', 'an-braids-men'),
    ('kai-loc', 'an-braids-women'), ('kai-loc', 'an-locs-styling'), ('kai-loc', 'an-locs-washing'),
    ('kai-loc', 'an-maintenance-1-worker-first-hour'), ('kai-loc', 'an-maintenance-1-worker-additional-hour'),
    ('kai-loc', 'an-maintenance-2-workers-first-hour'), ('kai-loc', 'an-maintenance-2-workers-second-hour'),
    ('kai-loc', 'an-maintenance-2-workers-additional-hour'),
    ('linh-color', 'an-basic-perm'), ('linh-color', 'an-curly-perm'), ('linh-color', 'an-ruffled-perm'),
    ('linh-color', 'an-texture-perm'), ('linh-color', 'an-premlock-perm'), ('linh-color', 'an-afro-perm'),
    ('linh-color', 'an-hair-bleach'), ('linh-color', 'an-root-bleaching'), ('linh-color', 'an-hair-pressed-down'),
    ('linh-color', 'an-hair-restore'), ('linh-color', 'an-black-dye'), ('linh-color', 'an-locs-styling'),
    ('linh-color', 'an-braids-men'), ('linh-color', 'an-braids-women'),
    ('khoa-blend', 'an-basic-perm'), ('khoa-blend', 'an-curly-perm'), ('khoa-blend', 'an-ruffled-perm'),
    ('khoa-blend', 'an-texture-perm'), ('khoa-blend', 'an-premlock-perm'), ('khoa-blend', 'an-afro-perm'),
    ('khoa-blend', 'an-hair-bleach'), ('khoa-blend', 'an-root-bleaching'), ('khoa-blend', 'an-hair-pressed-down'),
    ('khoa-blend', 'an-hair-restore'), ('khoa-blend', 'an-black-dye'), ('khoa-blend', 'an-locs-styling'),
    ('khoa-blend', 'an-braids-men'), ('khoa-blend', 'an-braids-women'),
    ('son-line', 'an-haircut-styling'), ('son-line', 'an-hot-cold-towel-shave'),
    ('son-line', 'an-basic-beard-trim-side'), ('son-line', 'an-hair-styling'), ('son-line', 'an-hair-washing'),
    ('son-line', 'an-afro-wash-blowdry'), ('son-line', 'an-basic-hair-tattoo'), ('son-line', 'an-beard-dye'),
    ('son-line', 'an-gentlemans-set-1'), ('son-line', 'an-gentlemans-set-2'), ('son-line', 'an-vip-gentlemans-combo'),
    ('son-line', 'an-locs-styling'), ('son-line', 'an-cornrow'), ('son-line', 'an-single-dread'),
    ('son-line', 'an-maintenance-2-workers-first-hour'), ('son-line', 'an-maintenance-2-workers-second-hour'),
    ('son-line', 'an-maintenance-2-workers-additional-hour'),
    ('minh-fade', 'an-haircut-styling'), ('minh-fade', 'an-hair-styling'),
    ('minh-fade', 'an-basic-hair-tattoo'), ('minh-fade', 'an-hair-washing'),
    ('ryo-beard', 'an-haircut-styling'), ('ryo-beard', 'an-basic-beard-trim-side'),
    ('ryo-beard', 'an-hot-cold-towel-shave'), ('ryo-beard', 'an-beard-dye'),
    ('bao-crop', 'an-haircut-styling'), ('bao-crop', 'an-hair-styling'),
    ('bao-crop', 'an-basic-hair-tattoo'), ('bao-crop', 'an-hair-washing'),
    ('bao-crop', 'an-hair-pressed-down'), ('bao-crop', 'an-basic-perm'),
    ('hieu-wave', 'an-hair-restore'), ('hieu-wave', 'an-hair-pressed-down'),
    ('hieu-wave', 'an-basic-perm'), ('hieu-wave', 'an-curly-perm'), ('hieu-wave', 'an-ruffled-perm'),
    ('hieu-wave', 'an-premlock-perm'), ('hieu-wave', 'an-afro-perm'), ('hieu-wave', 'an-hair-bleach'),
    ('hieu-wave', 'an-root-bleaching'), ('hieu-wave', 'an-black-dye')
) as mapping(barber_id, service_id)
join public.barbers barber on barber.id = mapping.barber_id
join public.services service on service.id = mapping.service_id and service.is_bookable;

create index if not exists services_bookable_price_idx
  on public.services (is_bookable, price)
  where is_bookable;
