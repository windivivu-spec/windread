-- Store the verified experience and specialties supplied for the seven named barbers.
alter table public.barbers
  add column if not exists experience_years integer
  check (experience_years >= 0 and experience_years <= 100);

update public.barbers
set experience_years = 5,
    specialties = array['Haircut + Locs']::text[]
where id = 'duy';

update public.barbers
set experience_years = 5,
    specialties = array['Haircut | Beard Trim & Shape-Up']::text[]
where id = 'huy';

update public.barbers
set experience_years = 5,
    specialties = array['Haircut']::text[]
where id = 'kien';

update public.barbers
set experience_years = 1,
    specialties = array['Haircut', 'Dreadlock']::text[]
where id = 'phuc';

update public.barbers
set experience_years = 4,
    specialties = array['Haircut']::text[]
where id = 'thuan';

update public.barbers
set experience_years = 1,
    specialties = array['Haircut']::text[]
where id = 'tinh';

update public.barbers
set experience_years = 5,
    specialties = array['Afro Hair Braiding & Loc Artistry & Haircut']::text[]
where id = 'van-huy';
