-- Allow bookings every day from 09:00 to 18:00; appointments must finish by 18:00.
update public.barbers
set working_hours = jsonb_build_object(
  'monday', jsonb_build_object('start', '09:00', 'end', '18:00'),
  'tuesday', jsonb_build_object('start', '09:00', 'end', '18:00'),
  'wednesday', jsonb_build_object('start', '09:00', 'end', '18:00'),
  'thursday', jsonb_build_object('start', '09:00', 'end', '18:00'),
  'friday', jsonb_build_object('start', '09:00', 'end', '18:00'),
  'saturday', jsonb_build_object('start', '09:00', 'end', '18:00'),
  'sunday', jsonb_build_object('start', '09:00', 'end', '18:00')
);
