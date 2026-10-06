-- Retire the standalone Chương Dương haircut option from new appointments.
-- Keep the service row so existing bookings retain their historical reference.
update public.services
set is_bookable = false
where id = 'cd-haircut'
  and branch_id = 'chuong-duong';

delete from public.barber_services
where service_id = 'cd-haircut';
