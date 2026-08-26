-- Temporary default: every barber can be booked for every active service at
-- their own branch. Individual capabilities can be narrowed later.

lock table public.barbers, public.services, public.barber_services in share row exclusive mode;

delete from public.barber_services mapping
using public.barbers barber
where barber.id = mapping.barber_id;

insert into public.barber_services (barber_id, service_id)
select barber.id, service.id
from public.barbers barber
join public.services service
  on service.branch_id = barber.branch_id
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
    from public.barbers barber
    join public.services service
      on service.branch_id = barber.branch_id
     and service.is_bookable
    left join public.barber_services mapping
      on mapping.barber_id = barber.id
     and mapping.service_id = service.id
    where mapping.barber_id is null
  ) <> 0 then
    raise exception 'Every barber must be mapped to every bookable service at their branch.';
  end if;
end;
$$;
