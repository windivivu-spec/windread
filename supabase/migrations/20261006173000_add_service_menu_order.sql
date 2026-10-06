alter table public.services
  add column if not exists menu_order integer;

-- Preserve the existing curated order for every service and explicitly pin the
-- requested signature haircut first in the Chương Dương main-services group.
update public.services
set menu_order = 0
where id = 'cd-haircut-expert'
  and branch_id = 'chuong-duong';

create index if not exists services_branch_category_menu_order_idx
  on public.services (branch_id, service_category, menu_order);
