-- WINDREAD working hours: all barbers are bookable from 09:00 through 19:00.
update public.barbers
set working_hours = jsonb_build_object(
  'monday', jsonb_build_object('start', '09:00', 'end', '19:00'),
  'tuesday', jsonb_build_object('start', '09:00', 'end', '19:00'),
  'wednesday', jsonb_build_object('start', '09:00', 'end', '19:00'),
  'thursday', jsonb_build_object('start', '09:00', 'end', '19:00'),
  'friday', jsonb_build_object('start', '09:00', 'end', '19:00'),
  'saturday', jsonb_build_object('start', '09:00', 'end', '19:00'),
  'sunday', jsonb_build_object('start', '09:00', 'end', '19:00')
);
