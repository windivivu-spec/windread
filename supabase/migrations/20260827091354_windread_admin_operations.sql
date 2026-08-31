-- WINDREAD operating admin: POS, cashbook, inventory, payroll, and access control.
-- This migration only adds tables around the existing public booking catalogue.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'admin_role') then
    create type public.admin_role as enum ('admin', 'manager', 'cashier', 'employee');
  end if;
  if not exists (select 1 from pg_type where typname = 'invoice_status') then
    create type public.invoice_status as enum ('draft', 'completed', 'voided', 'refunded');
  end if;
  if not exists (select 1 from pg_type where typname = 'sale_line_kind') then
    create type public.sale_line_kind as enum ('service', 'product', 'package', 'other');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_method') then
    create type public.payment_method as enum ('cash', 'bank_transfer', 'card', 'debt', 'other');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_direction') then
    create type public.payment_direction as enum ('in', 'out');
  end if;
  if not exists (select 1 from pg_type where typname = 'inventory_movement_kind') then
    create type public.inventory_movement_kind as enum ('opening', 'purchase', 'sale', 'return', 'adjustment');
  end if;
  if not exists (select 1 from pg_type where typname = 'cash_session_status') then
    create type public.cash_session_status as enum ('open', 'closed');
  end if;
  if not exists (select 1 from pg_type where typname = 'payroll_adjustment_kind') then
    create type public.payroll_adjustment_kind as enum ('bonus', 'penalty', 'advance', 'leave');
  end if;
  if not exists (select 1 from pg_type where typname = 'payroll_period_status') then
    create type public.payroll_period_status as enum ('open', 'closed', 'paid');
  end if;
end $$;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  name text not null,
  email text,
  note text,
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bookings add column if not exists customer_id uuid references public.customers(id);
create index if not exists bookings_customer_id_idx on public.bookings(customer_id);

create table if not exists public.staff_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  barber_id text unique references public.barbers(id) on delete set null,
  display_name text not null,
  role public.admin_role not null default 'employee',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_branch_access (
  staff_id uuid not null references public.staff_profiles(id) on delete cascade,
  branch_id text not null references public.branches(id) on delete cascade,
  primary key (staff_id, branch_id)
);

create table if not exists public.barber_compensation (
  barber_id text primary key references public.barbers(id) on delete cascade,
  default_commission_rate numeric(5,2) not null default 0 check (default_commission_rate between 0 and 100),
  base_salary integer not null default 0 check (base_salary >= 0),
  updated_at timestamptz not null default now()
);

insert into public.barber_compensation (barber_id)
select id from public.barbers
on conflict (barber_id) do nothing;

create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  branch_id text references public.branches(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique nulls not distinct (branch_id, name)
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  address text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  branch_id text not null references public.branches(id) on delete cascade,
  category_id uuid references public.product_categories(id) on delete set null,
  supplier_id uuid references public.suppliers(id) on delete set null,
  sku text not null,
  name text not null,
  sale_price integer not null check (sale_price >= 0),
  cost_price integer not null default 0 check (cost_price >= 0),
  stock_on_hand integer not null default 0 check (stock_on_hand >= 0),
  reorder_level integer not null default 0 check (reorder_level >= 0),
  unit text not null default 'sp',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (branch_id, sku)
);

create table if not exists public.service_packages (
  id uuid primary key default gen_random_uuid(),
  branch_id text not null references public.branches(id) on delete cascade,
  name text not null,
  sale_price integer not null check (sale_price >= 0),
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (branch_id, name)
);

create table if not exists public.service_package_items (
  package_id uuid not null references public.service_packages(id) on delete cascade,
  service_id text not null references public.services(id),
  quantity integer not null default 1 check (quantity > 0),
  primary key (package_id, service_id)
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  branch_id text not null references public.branches(id),
  customer_id uuid references public.customers(id),
  booking_id text references public.bookings(id),
  status public.invoice_status not null default 'draft',
  subtotal integer not null default 0 check (subtotal >= 0),
  discount_amount integer not null default 0 check (discount_amount >= 0),
  total_amount integer not null default 0 check (total_amount >= 0),
  note text,
  created_by uuid references public.staff_profiles(id),
  completed_at timestamptz,
  voided_at timestamptz,
  void_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (discount_amount <= subtotal),
  check ((status = 'completed' and completed_at is not null) or status <> 'completed')
);

create unique index if not exists invoices_one_active_booking_idx
  on public.invoices(booking_id)
  where booking_id is not null and status in ('completed', 'refunded');

create table if not exists public.invoice_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  kind public.sale_line_kind not null,
  catalog_id text,
  description text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price integer not null check (unit_price >= 0),
  discount_amount integer not null default 0 check (discount_amount >= 0),
  line_total integer not null check (line_total >= 0),
  created_at timestamptz not null default now(),
  check (discount_amount <= unit_price * quantity)
);

create table if not exists public.invoice_line_staff (
  id uuid primary key default gen_random_uuid(),
  invoice_line_id uuid not null references public.invoice_lines(id) on delete cascade,
  barber_id text not null references public.barbers(id),
  commission_rate numeric(5,2) not null check (commission_rate between 0 and 100),
  commission_amount integer not null check (commission_amount >= 0),
  reversed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (invoice_line_id, barber_id)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id),
  method public.payment_method not null,
  direction public.payment_direction not null default 'in',
  amount integer not null check (amount > 0),
  note text,
  created_by uuid references public.staff_profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id),
  branch_id text not null references public.branches(id),
  kind public.inventory_movement_kind not null,
  quantity_delta integer not null check (quantity_delta <> 0),
  unit_cost integer,
  reference_id uuid,
  note text,
  created_by uuid references public.staff_profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  branch_id text not null references public.branches(id),
  invoice_id uuid references public.invoices(id),
  payment_id uuid references public.payments(id),
  category text not null,
  direction public.payment_direction not null,
  method public.payment_method not null,
  amount integer not null check (amount > 0),
  note text,
  created_by uuid references public.staff_profiles(id),
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.cash_sessions (
  id uuid primary key default gen_random_uuid(),
  branch_id text not null references public.branches(id),
  business_date date not null,
  status public.cash_session_status not null default 'open',
  opening_balance integer not null default 0 check (opening_balance >= 0),
  expected_balance integer,
  counted_balance integer,
  variance integer,
  opened_by uuid references public.staff_profiles(id),
  closed_by uuid references public.staff_profiles(id),
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  close_note text,
  unique (branch_id, business_date)
);

create table if not exists public.payroll_periods (
  id uuid primary key default gen_random_uuid(),
  branch_id text not null references public.branches(id),
  period_start date not null,
  period_end date not null,
  status public.payroll_period_status not null default 'open',
  closed_by uuid references public.staff_profiles(id),
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (branch_id, period_start),
  check (period_end >= period_start)
);

create table if not exists public.payroll_adjustments (
  id uuid primary key default gen_random_uuid(),
  branch_id text not null references public.branches(id),
  barber_id text not null references public.barbers(id),
  occurred_on date not null default current_date,
  kind public.payroll_adjustment_kind not null,
  amount integer not null check (amount >= 0),
  note text not null,
  created_by uuid references public.staff_profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.payroll_payouts (
  id uuid primary key default gen_random_uuid(),
  payroll_period_id uuid not null references public.payroll_periods(id) on delete cascade,
  barber_id text not null references public.barbers(id),
  commission_amount integer not null default 0 check (commission_amount >= 0),
  bonus_amount integer not null default 0 check (bonus_amount >= 0),
  penalty_amount integer not null default 0 check (penalty_amount >= 0),
  advance_amount integer not null default 0 check (advance_amount >= 0),
  base_salary_amount integer not null default 0 check (base_salary_amount >= 0),
  total_amount integer not null default 0,
  paid_amount integer not null default 0 check (paid_amount >= 0),
  paid_at timestamptz,
  paid_by uuid references public.staff_profiles(id),
  note text,
  unique (payroll_period_id, barber_id)
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.staff_profiles(id),
  branch_id text references public.branches(id),
  entity_type text not null,
  entity_id text not null,
  action text not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create sequence if not exists public.windread_invoice_number_seq;

create index if not exists customers_name_phone_idx on public.customers(name, phone);
create index if not exists products_branch_active_idx on public.products(branch_id, is_active, name);
create index if not exists invoices_branch_completed_idx on public.invoices(branch_id, completed_at desc) where status = 'completed';
create index if not exists invoice_lines_invoice_idx on public.invoice_lines(invoice_id);
create index if not exists invoice_line_staff_barber_idx on public.invoice_line_staff(barber_id, reversed_at);
create index if not exists payments_invoice_idx on public.payments(invoice_id);
create index if not exists inventory_movements_product_created_idx on public.inventory_movements(product_id, created_at desc);
create index if not exists ledger_entries_branch_occurred_idx on public.ledger_entries(branch_id, occurred_at desc);
create index if not exists payroll_adjustments_branch_barber_date_idx on public.payroll_adjustments(branch_id, barber_id, occurred_on);

create or replace function public.windread_touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists customers_touch_updated_at on public.customers;
create trigger customers_touch_updated_at before update on public.customers
for each row execute function public.windread_touch_updated_at();
drop trigger if exists staff_profiles_touch_updated_at on public.staff_profiles;
create trigger staff_profiles_touch_updated_at before update on public.staff_profiles
for each row execute function public.windread_touch_updated_at();
drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at before update on public.products
for each row execute function public.windread_touch_updated_at();
drop trigger if exists service_packages_touch_updated_at on public.service_packages;
create trigger service_packages_touch_updated_at before update on public.service_packages
for each row execute function public.windread_touch_updated_at();
drop trigger if exists invoices_touch_updated_at on public.invoices;
create trigger invoices_touch_updated_at before update on public.invoices
for each row execute function public.windread_touch_updated_at();

create or replace function public.handle_new_windread_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.staff_profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', new.email, 'Nhân viên'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_windread on auth.users;
create trigger on_auth_user_created_windread
after insert on auth.users
for each row execute function public.handle_new_windread_user();

-- Existing web bookings become reusable customers without altering the booking record itself.
insert into public.customers (phone, name, email)
select distinct on (regexp_replace(customer_phone, '[^0-9]', '', 'g'))
  regexp_replace(customer_phone, '[^0-9]', '', 'g'),
  customer_name,
  customer_email
from public.bookings
where nullif(regexp_replace(customer_phone, '[^0-9]', '', 'g'), '') is not null
order by regexp_replace(customer_phone, '[^0-9]', '', 'g'), created_at asc
on conflict (phone) do update set
  name = excluded.name,
  email = coalesce(excluded.email, public.customers.email);

update public.bookings booking
set customer_id = customer.id
from public.customers customer
where booking.customer_id is null
  and customer.phone = regexp_replace(booking.customer_phone, '[^0-9]', '', 'g');

-- All sensitive admin tables remain server-mediated. Staff can only read their own profile/access row.
do $$
declare table_name text;
begin
  foreach table_name in array array[
    'customers', 'staff_profiles', 'staff_branch_access', 'barber_compensation',
    'product_categories', 'suppliers', 'products', 'service_packages', 'service_package_items',
    'invoices', 'invoice_lines', 'invoice_line_staff', 'payments', 'inventory_movements',
    'ledger_entries', 'cash_sessions', 'payroll_periods', 'payroll_adjustments',
    'payroll_payouts', 'audit_events'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on table public.%I from anon, authenticated', table_name);
  end loop;
end $$;

grant select on public.staff_profiles, public.staff_branch_access to authenticated;

drop policy if exists "staff read own profile" on public.staff_profiles;
create policy "staff read own profile" on public.staff_profiles
for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "staff read own branch access" on public.staff_branch_access;
create policy "staff read own branch access" on public.staff_branch_access
for select to authenticated using ((select auth.uid()) = staff_id);

-- Atomic POS checkout. The application invokes this only after server-side role checks.
create or replace function public.complete_windread_invoice(
  p_branch_id text,
  p_customer_phone text,
  p_customer_name text,
  p_customer_email text,
  p_booking_id text,
  p_note text,
  p_discount_amount integer,
  p_lines jsonb,
  p_payments jsonb,
  p_actor_id uuid
)
returns uuid
language plpgsql
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_invoice_id uuid := gen_random_uuid();
  v_invoice_number text;
  v_subtotal integer := 0;
  v_total integer;
  v_line jsonb;
  v_line_id uuid;
  v_product public.products%rowtype;
  v_service public.services%rowtype;
  v_package public.service_packages%rowtype;
  v_quantity integer;
  v_unit_price integer;
  v_line_discount integer;
  v_line_total integer;
  v_description text;
  v_kind public.sale_line_kind;
  v_catalog_id text;
  v_barber_id text;
  v_commission_rate numeric(5,2);
  v_payment jsonb;
  v_paid integer := 0;
  v_payment_id uuid;
  v_payment_method public.payment_method;
begin
  if p_branch_id is null or not exists (select 1 from public.branches where id = p_branch_id) then
    raise exception 'Chi nhánh không hợp lệ.' using errcode = '22023';
  end if;
  if jsonb_typeof(p_lines) <> 'array' or jsonb_array_length(p_lines) = 0 then
    raise exception 'Hóa đơn cần ít nhất một dòng bán hàng.' using errcode = '22023';
  end if;
  if coalesce(p_discount_amount, 0) < 0 then
    raise exception 'Giảm giá không hợp lệ.' using errcode = '22023';
  end if;
  if p_booking_id is not null and exists (
    select 1 from public.invoices where booking_id = p_booking_id and status in ('completed', 'refunded')
  ) then
    raise exception 'Booking này đã có hóa đơn.' using errcode = '23505';
  end if;

  if nullif(trim(coalesce(p_customer_phone, '')), '') is not null then
    insert into public.customers (phone, name, email)
    values (
      regexp_replace(p_customer_phone, '[^0-9]', '', 'g'),
      coalesce(nullif(trim(p_customer_name), ''), 'Khách vãng lai'),
      nullif(trim(p_customer_email), '')
    )
    on conflict (phone) do update set
      name = excluded.name,
      email = coalesce(excluded.email, public.customers.email)
    returning id into v_customer_id;
  end if;

  v_invoice_number := 'HD' || lpad(nextval('public.windread_invoice_number_seq')::text, 7, '0');
  insert into public.invoices (
    id, invoice_number, branch_id, customer_id, booking_id, status, note, created_by
  ) values (
    v_invoice_id, v_invoice_number, p_branch_id, v_customer_id, p_booking_id, 'draft', nullif(trim(p_note), ''), p_actor_id
  );

  for v_line in select value from jsonb_array_elements(p_lines)
  loop
    v_kind := (v_line ->> 'kind')::public.sale_line_kind;
    v_catalog_id := nullif(v_line ->> 'catalogId', '');
    v_quantity := coalesce((v_line ->> 'quantity')::integer, 1);
    v_line_discount := coalesce((v_line ->> 'discountAmount')::integer, 0);
    if v_quantity <= 0 or v_line_discount < 0 then
      raise exception 'Số lượng hoặc giảm giá không hợp lệ.' using errcode = '22023';
    end if;

    if v_kind = 'service' then
      select * into v_service from public.services
      where id = v_catalog_id and branch_id = p_branch_id and is_bookable;
      if not found then raise exception 'Dịch vụ không tồn tại hoặc không bán tại chi nhánh.' using errcode = '22023'; end if;
      v_unit_price := v_service.price;
      v_description := v_service.name;
    elsif v_kind = 'product' then
      select * into v_product from public.products
      where id = v_catalog_id::uuid and branch_id = p_branch_id and is_active
      for update;
      if not found then raise exception 'Sản phẩm không tồn tại hoặc đã ngừng bán.' using errcode = '22023'; end if;
      if v_product.stock_on_hand < v_quantity then
        raise exception 'Sản phẩm % không đủ tồn kho.', v_product.name using errcode = '22023';
      end if;
      v_unit_price := v_product.sale_price;
      v_description := v_product.name;
    elsif v_kind = 'package' then
      select * into v_package from public.service_packages
      where id = v_catalog_id::uuid and branch_id = p_branch_id and is_active;
      if not found then raise exception 'Gói dịch vụ không tồn tại hoặc đã ngừng bán.' using errcode = '22023'; end if;
      v_unit_price := v_package.sale_price;
      v_description := v_package.name;
    elsif v_kind = 'other' then
      v_unit_price := coalesce((v_line ->> 'unitPrice')::integer, 0);
      v_description := nullif(trim(v_line ->> 'description'), '');
      if v_description is null or v_unit_price < 0 then
        raise exception 'Khoản thu khác không hợp lệ.' using errcode = '22023';
      end if;
    end if;

    if v_line_discount > v_unit_price * v_quantity then
      raise exception 'Giảm giá dòng không thể lớn hơn giá trị dòng.' using errcode = '22023';
    end if;
    v_line_total := v_unit_price * v_quantity - v_line_discount;
    v_subtotal := v_subtotal + v_unit_price * v_quantity;

    insert into public.invoice_lines (invoice_id, kind, catalog_id, description, quantity, unit_price, discount_amount, line_total)
    values (v_invoice_id, v_kind, v_catalog_id, v_description, v_quantity, v_unit_price, v_line_discount, v_line_total)
    returning id into v_line_id;

    if v_kind = 'product' then
      update public.products set stock_on_hand = stock_on_hand - v_quantity where id = v_product.id;
      insert into public.inventory_movements (product_id, branch_id, kind, quantity_delta, unit_cost, reference_id, note, created_by)
      values (v_product.id, p_branch_id, 'sale', -v_quantity, v_product.cost_price, v_invoice_id, v_description, p_actor_id);
    end if;

    v_barber_id := nullif(v_line ->> 'barberId', '');
    if v_barber_id is not null then
      if not exists (select 1 from public.barbers where id = v_barber_id and branch_id = p_branch_id) then
        raise exception 'Nhân viên được xếp không thuộc chi nhánh.' using errcode = '22023';
      end if;
      select default_commission_rate into v_commission_rate from public.barber_compensation where barber_id = v_barber_id;
      insert into public.invoice_line_staff (invoice_line_id, barber_id, commission_rate, commission_amount)
      values (v_line_id, v_barber_id, coalesce(v_commission_rate, 0), round(v_line_total * coalesce(v_commission_rate, 0) / 100.0));
    end if;
  end loop;

  v_total := v_subtotal - coalesce(p_discount_amount, 0);
  if v_total < 0 then raise exception 'Giảm giá hóa đơn không hợp lệ.' using errcode = '22023'; end if;
  if jsonb_typeof(p_payments) <> 'array' or jsonb_array_length(p_payments) = 0 then
    raise exception 'Cần chọn phương thức thanh toán.' using errcode = '22023';
  end if;
  for v_payment in select value from jsonb_array_elements(p_payments)
  loop
    v_payment_method := (v_payment ->> 'method')::public.payment_method;
    if coalesce((v_payment ->> 'amount')::integer, 0) <= 0 then
      raise exception 'Số tiền thanh toán phải lớn hơn 0.' using errcode = '22023';
    end if;
    v_paid := v_paid + (v_payment ->> 'amount')::integer;
  end loop;
  if v_paid <> v_total then
    raise exception 'Tổng thanh toán phải bằng tổng hóa đơn.' using errcode = '22023';
  end if;

  update public.invoices
  set status = 'completed', subtotal = v_subtotal, discount_amount = coalesce(p_discount_amount, 0),
      total_amount = v_total, completed_at = now()
  where id = v_invoice_id;

  for v_payment in select value from jsonb_array_elements(p_payments)
  loop
    v_payment_method := (v_payment ->> 'method')::public.payment_method;
    insert into public.payments (invoice_id, method, amount, note, created_by)
    values (v_invoice_id, v_payment_method, (v_payment ->> 'amount')::integer, nullif(trim(v_payment ->> 'note'), ''), p_actor_id)
    returning id into v_payment_id;
    insert into public.ledger_entries (branch_id, invoice_id, payment_id, category, direction, method, amount, note, created_by)
    values (p_branch_id, v_invoice_id, v_payment_id, 'Bán hàng', 'in', v_payment_method, (v_payment ->> 'amount')::integer, v_invoice_number, p_actor_id);
  end loop;

  if p_booking_id is not null then
    update public.bookings set status = 'completed' where id = p_booking_id and status <> 'cancelled';
  end if;
  insert into public.audit_events (actor_id, branch_id, entity_type, entity_id, action, detail)
  values (p_actor_id, p_branch_id, 'invoice', v_invoice_id::text, 'completed', jsonb_build_object('invoiceNumber', v_invoice_number, 'total', v_total));
  return v_invoice_id;
end;
$$;

create or replace function public.refund_windread_invoice(
  p_invoice_id uuid,
  p_reason text,
  p_actor_id uuid
)
returns void
language plpgsql
set search_path = public
as $$
declare
  v_invoice public.invoices%rowtype;
  v_line record;
  v_payment record;
  v_payment_id uuid;
begin
  select * into v_invoice from public.invoices where id = p_invoice_id for update;
  if not found or v_invoice.status <> 'completed' then
    raise exception 'Chỉ có thể hoàn tiền hóa đơn đã hoàn tất.' using errcode = '22023';
  end if;
  if nullif(trim(coalesce(p_reason, '')), '') is null then
    raise exception 'Cần nhập lý do hoàn tiền.' using errcode = '22023';
  end if;
  update public.invoices set status = 'refunded', voided_at = now(), void_reason = trim(p_reason) where id = p_invoice_id;
  update public.invoice_line_staff set reversed_at = now()
  where invoice_line_id in (select id from public.invoice_lines where invoice_id = p_invoice_id) and reversed_at is null;
  for v_line in
    select line.*, product.id as product_id, product.cost_price
    from public.invoice_lines line
    join public.products product on line.kind = 'product' and product.id::text = line.catalog_id
    where line.invoice_id = p_invoice_id
  loop
    update public.products set stock_on_hand = stock_on_hand + v_line.quantity where id = v_line.product_id;
    insert into public.inventory_movements (product_id, branch_id, kind, quantity_delta, unit_cost, reference_id, note, created_by)
    values (v_line.product_id, v_invoice.branch_id, 'return', v_line.quantity, v_line.cost_price, p_invoice_id, p_reason, p_actor_id);
  end loop;
  for v_payment in select * from public.payments where invoice_id = p_invoice_id and direction = 'in'
  loop
    insert into public.payments (invoice_id, method, direction, amount, note, created_by)
    values (p_invoice_id, v_payment.method, 'out', v_payment.amount, p_reason, p_actor_id)
    returning id into v_payment_id;
    insert into public.ledger_entries (branch_id, invoice_id, payment_id, category, direction, method, amount, note, created_by)
    values (v_invoice.branch_id, p_invoice_id, v_payment_id, 'Hoàn tiền hóa đơn', 'out', v_payment.method, v_payment.amount, p_reason, p_actor_id);
  end loop;
  insert into public.audit_events (actor_id, branch_id, entity_type, entity_id, action, detail)
  values (p_actor_id, v_invoice.branch_id, 'invoice', p_invoice_id::text, 'refunded', jsonb_build_object('reason', p_reason));
end;
$$;

create or replace function public.close_windread_cash_session(
  p_session_id uuid,
  p_counted_balance integer,
  p_note text,
  p_actor_id uuid
)
returns public.cash_sessions
language plpgsql
set search_path = public
as $$
declare
  v_session public.cash_sessions%rowtype;
  v_expected integer;
begin
  select * into v_session from public.cash_sessions where id = p_session_id for update;
  if not found or v_session.status <> 'open' then
    raise exception 'Quỹ này không còn mở.' using errcode = '22023';
  end if;
  if p_counted_balance < 0 then raise exception 'Tiền đếm thực tế không hợp lệ.' using errcode = '22023'; end if;
  select v_session.opening_balance + coalesce(sum(case when direction = 'in' then amount else -amount end), 0)
  into v_expected
  from public.ledger_entries
  where branch_id = v_session.branch_id
    and method = 'cash'
    and occurred_at >= v_session.opened_at
    and occurred_at <= now();
  update public.cash_sessions
  set status = 'closed', expected_balance = v_expected, counted_balance = p_counted_balance,
      variance = p_counted_balance - v_expected, close_note = nullif(trim(p_note), ''), closed_by = p_actor_id, closed_at = now()
  where id = p_session_id
  returning * into v_session;
  insert into public.audit_events (actor_id, branch_id, entity_type, entity_id, action, detail)
  values (p_actor_id, v_session.branch_id, 'cash_session', p_session_id::text, 'closed', jsonb_build_object('variance', v_session.variance));
  return v_session;
end;
$$;

create or replace function public.close_windread_payroll_period(
  p_branch_id text,
  p_period_start date,
  p_period_end date,
  p_actor_id uuid
)
returns uuid
language plpgsql
set search_path = public
as $$
declare
  v_period_id uuid;
  v_existing_status public.payroll_period_status;
  v_barber record;
  v_commission integer;
  v_bonus integer;
  v_penalty integer;
  v_advance integer;
  v_total integer;
begin
  if p_period_end < p_period_start then
    raise exception 'Kỳ lương không hợp lệ.' using errcode = '22023';
  end if;
  insert into public.payroll_periods (branch_id, period_start, period_end, status)
  values (p_branch_id, p_period_start, p_period_end, 'open')
  on conflict (branch_id, period_start) do update set period_end = excluded.period_end
  returning id, status into v_period_id, v_existing_status;
  if v_existing_status in ('closed', 'paid') then
    raise exception 'Kỳ lương đã được khóa.' using errcode = '22023';
  end if;

  for v_barber in
    select barber.id, coalesce(compensation.base_salary, 0) as base_salary
    from public.barbers barber
    left join public.barber_compensation compensation on compensation.barber_id = barber.id
    where barber.branch_id = p_branch_id
  loop
    select coalesce(sum(staff.commission_amount), 0) into v_commission
    from public.invoice_line_staff staff
    join public.invoice_lines line on line.id = staff.invoice_line_id
    join public.invoices invoice on invoice.id = line.invoice_id
    where staff.barber_id = v_barber.id
      and staff.reversed_at is null
      and invoice.branch_id = p_branch_id
      and invoice.status = 'completed'
      and invoice.completed_at >= p_period_start::timestamptz
      and invoice.completed_at < (p_period_end + 1)::timestamptz;
    select
      coalesce(sum(amount) filter (where kind = 'bonus'), 0),
      coalesce(sum(amount) filter (where kind = 'penalty'), 0),
      coalesce(sum(amount) filter (where kind = 'advance'), 0)
    into v_bonus, v_penalty, v_advance
    from public.payroll_adjustments
    where branch_id = p_branch_id
      and barber_id = v_barber.id
      and occurred_on between p_period_start and p_period_end;
    v_total := v_barber.base_salary + v_commission + v_bonus - v_penalty - v_advance;
    insert into public.payroll_payouts (
      payroll_period_id, barber_id, commission_amount, bonus_amount, penalty_amount, advance_amount, base_salary_amount, total_amount
    ) values (
      v_period_id, v_barber.id, v_commission, v_bonus, v_penalty, v_advance, v_barber.base_salary, v_total
    ) on conflict (payroll_period_id, barber_id) do update set
      commission_amount = excluded.commission_amount,
      bonus_amount = excluded.bonus_amount,
      penalty_amount = excluded.penalty_amount,
      advance_amount = excluded.advance_amount,
      base_salary_amount = excluded.base_salary_amount,
      total_amount = excluded.total_amount
    where public.payroll_payouts.paid_at is null;
  end loop;
  update public.payroll_periods set status = 'closed', closed_by = p_actor_id, closed_at = now() where id = v_period_id;
  insert into public.audit_events (actor_id, branch_id, entity_type, entity_id, action, detail)
  values (p_actor_id, p_branch_id, 'payroll_period', v_period_id::text, 'closed', jsonb_build_object('start', p_period_start, 'end', p_period_end));
  return v_period_id;
end;
$$;

revoke all on function public.handle_new_windread_user() from public;
revoke all on function public.complete_windread_invoice(text, text, text, text, text, text, integer, jsonb, jsonb, uuid) from public, anon, authenticated;
revoke all on function public.refund_windread_invoice(uuid, text, uuid) from public, anon, authenticated;
revoke all on function public.close_windread_cash_session(uuid, integer, text, uuid) from public, anon, authenticated;
revoke all on function public.close_windread_payroll_period(text, date, date, uuid) from public, anon, authenticated;
grant execute on function public.complete_windread_invoice(text, text, text, text, text, text, integer, jsonb, jsonb, uuid) to service_role;
grant execute on function public.refund_windread_invoice(uuid, text, uuid) to service_role;
grant execute on function public.close_windread_cash_session(uuid, integer, text, uuid) to service_role;
grant execute on function public.close_windread_payroll_period(text, date, date, uuid) to service_role;
