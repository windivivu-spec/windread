create extension if not exists btree_gist;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'booking_status') then
    create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
  end if;
end $$;

create table if not exists public.branches (
  id text primary key,
  name text not null,
  address text not null,
  phone text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id text primary key,
  name text not null,
  description text not null,
  price integer not null check (price >= 0),
  duration_minutes integer not null check (duration_minutes > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.barbers (
  id text primary key,
  branch_id text not null references public.branches(id) on delete cascade,
  name text not null,
  email text,
  avatar text not null default '/images/barber-portrait-v2.png',
  title text not null,
  specialties text[] not null default '{}',
  working_hours jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.barber_services (
  barber_id text not null references public.barbers(id) on delete cascade,
  service_id text not null references public.services(id) on delete cascade,
  primary key (barber_id, service_id)
);

create table if not exists public.bookings (
  id text primary key,
  branch_id text not null references public.branches(id),
  service_id text not null references public.services(id),
  barber_id text not null references public.barbers(id),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  note text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status booking_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time > start_time)
);

create index if not exists bookings_start_time_idx on public.bookings (start_time);
create index if not exists bookings_branch_start_idx on public.bookings (branch_id, start_time);
create index if not exists bookings_barber_status_idx on public.bookings (barber_id, status);
create index if not exists barbers_branch_idx on public.barbers (branch_id);

alter table public.barbers add column if not exists email text;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.prevent_booking_overlap()
returns trigger
language plpgsql
as $$
begin
  if new.status <> 'cancelled' and exists (
    select 1
    from public.bookings existing
    where existing.barber_id = new.barber_id
      and existing.status <> 'cancelled'
      and existing.id <> new.id
      and new.start_time < existing.end_time + interval '10 minutes'
      and new.end_time + interval '10 minutes' > existing.start_time
  ) then
    raise exception 'Booking overlaps an existing appointment for this barber.';
  end if;

  return new;
end;
$$;

drop trigger if exists branches_set_updated_at on public.branches;
create trigger branches_set_updated_at
before update on public.branches
for each row execute function public.set_updated_at();

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists barbers_set_updated_at on public.barbers;
create trigger barbers_set_updated_at
before update on public.barbers
for each row execute function public.set_updated_at();

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

drop trigger if exists bookings_prevent_overlap on public.bookings;
create trigger bookings_prevent_overlap
before insert or update on public.bookings
for each row execute function public.prevent_booking_overlap();

alter table public.branches enable row level security;
alter table public.services enable row level security;
alter table public.barbers enable row level security;
alter table public.barber_services enable row level security;
alter table public.bookings enable row level security;

insert into public.branches (id, name, address, phone) values
  ('an-thuong', 'Cơ sở 1', '35 - 37 An Thượng 29, Ngũ Hành Sơn, Đà Nẵng', '0393549656'),
  ('chuong-duong', 'Cơ sở 2', '223 Chương Dương, Ngũ Hành Sơn, Đà Nẵng', '0393549656')
on conflict (id) do update set
  name = excluded.name,
  address = excluded.address,
  phone = excluded.phone;

insert into public.services (id, name, description, price, duration_minutes) values
  ('haircut', 'Cắt tóc', 'Classic cut, crop hoặc fade gọn theo form mặt.', 220000, 30),
  ('wash-cut', 'Cắt + gội', 'Cắt tóc, gội sạch và finish bằng sản phẩm giữ nếp nhẹ.', 280000, 45),
  ('shave', 'Cạo mặt', 'Khăn nóng, dao cạo classic và balm làm dịu da.', 180000, 30),
  ('perm', 'Uốn tóc', 'Tư vấn texture, uốn form và chăm tóc sau xử lý.', 750000, 90),
  ('color', 'Nhuộm tóc', 'Nhuộm tone street, highlight hoặc xử lý màu theo nền tóc.', 900000, 120),
  ('custom-combo', 'Combo tùy chỉnh', 'Crew tư vấn combo dread, fade, beard hoặc treatment theo nhu cầu.', 650000, 90),
  ('fix-dread', 'Fix Dread', 'Bảo dưỡng chân dread, siết form và làm gọn phần tóc bung.', 650000, 90),
  ('dread-lock', 'Dread Lock', 'Tư vấn form dread, chia section và tạo lock theo nền tóc hiện tại.', 900000, 120),
  ('braids', 'Braids', 'Tết braids gọn, giữ form chắc và finish theo style cá nhân.', 850000, 120)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  duration_minutes = excluded.duration_minutes;

insert into public.barbers (id, branch_id, name, email, avatar, title, specialties, working_hours) values
  (
    'kai-loc',
    'an-thuong',
    'Kai Loc',
    'kai.loc@windread.vn',
    '/images/barber/barber1.png',
    'Locs Expert',
    array['Locs', 'Uốn texture', 'Combo street reset'],
    '{"monday":{"start":"10:00","end":"21:00"},"tuesday":{"start":"10:00","end":"21:00"},"wednesday":{"start":"10:00","end":"21:00"},"thursday":{"start":"10:00","end":"21:00"},"friday":{"start":"10:00","end":"21:00"},"saturday":{"start":"10:00","end":"21:00"},"sunday":{"start":"12:00","end":"18:00"}}'
  ),
  (
    'minh-fade',
    'chuong-duong',
    'Minh Fade',
    'minh.fade@windread.vn',
    '/images/barber/barber2.png',
    'Fade Specialist',
    array['Clean fade', 'Classic cut', 'Line up'],
    '{"monday":{"start":"10:00","end":"21:00"},"tuesday":{"start":"10:00","end":"21:00"},"wednesday":{"start":"10:00","end":"21:00"},"thursday":{"start":"10:00","end":"21:00"},"friday":{"start":"10:00","end":"21:00"},"saturday":{"start":"10:00","end":"21:00"},"sunday":{"start":"12:00","end":"18:00"}}'
  ),
  (
    'ryo-beard',
    'chuong-duong',
    'Ryo Beard',
    'ryo.beard@windread.vn',
    '/images/barber/barber3.png',
    'Beard & Shave',
    array['Hot towel', 'Cạo mặt', 'Beard shape'],
    '{"monday":{"start":"10:00","end":"21:00"},"tuesday":{"start":"10:00","end":"21:00"},"wednesday":{"start":"10:00","end":"21:00"},"thursday":{"start":"10:00","end":"21:00"},"friday":{"start":"10:00","end":"21:00"},"saturday":{"start":"10:00","end":"21:00"},"sunday":{"start":"12:00","end":"18:00"}}'
  ),
  (
    'linh-color',
    'an-thuong',
    'Linh Color',
    'linh.color@windread.vn',
    '/images/barber/barber4.png',
    'Color Artist',
    array['Nhuộm tóc', 'Uốn tóc', 'Treatment'],
    '{"monday":{"start":"10:00","end":"21:00"},"tuesday":{"start":"10:00","end":"21:00"},"wednesday":{"start":"10:00","end":"21:00"},"thursday":{"start":"10:00","end":"21:00"},"friday":{"start":"10:00","end":"21:00"},"saturday":{"start":"10:00","end":"21:00"},"sunday":{"start":"12:00","end":"18:00"}}'
  ),
  (
    'bao-crop',
    'chuong-duong',
    'Bao Crop',
    'bao.crop@windread.vn',
    '/images/barber/barber5.png',
    'Crop & Texture',
    array['Textured crop', 'Layer gọn', 'Wash finish'],
    '{"monday":{"start":"10:00","end":"21:00"},"tuesday":{"start":"10:00","end":"21:00"},"wednesday":{"start":"10:00","end":"21:00"},"thursday":{"start":"10:00","end":"21:00"},"friday":{"start":"10:00","end":"21:00"},"saturday":{"start":"10:00","end":"21:00"},"sunday":{"start":"12:00","end":"18:00"}}'
  ),
  (
    'son-line',
    'an-thuong',
    'Son Line',
    'son.line@windread.vn',
    '/images/barber/barber6.png',
    'Line-up Artist',
    array['Line up', 'Skin fade', 'Cạo mặt'],
    '{"monday":{"start":"10:00","end":"21:00"},"tuesday":{"start":"10:00","end":"21:00"},"wednesday":{"start":"10:00","end":"21:00"},"thursday":{"start":"10:00","end":"21:00"},"friday":{"start":"10:00","end":"21:00"},"saturday":{"start":"10:00","end":"21:00"},"sunday":{"start":"12:00","end":"18:00"}}'
  ),
  (
    'hieu-wave',
    'chuong-duong',
    'Hieu Wave',
    'hieu.wave@windread.vn',
    '/images/barber/barber7.png',
    'Wave Stylist',
    array['Uốn tóc', 'Nhuộm tone trầm', 'Treatment'],
    '{"monday":{"start":"10:00","end":"21:00"},"tuesday":{"start":"10:00","end":"21:00"},"wednesday":{"start":"10:00","end":"21:00"},"thursday":{"start":"10:00","end":"21:00"},"friday":{"start":"10:00","end":"21:00"},"saturday":{"start":"10:00","end":"21:00"},"sunday":{"start":"12:00","end":"18:00"}}'
  )
on conflict (id) do update set
  branch_id = excluded.branch_id,
  name = excluded.name,
  email = excluded.email,
  avatar = excluded.avatar,
  title = excluded.title,
  specialties = excluded.specialties,
  working_hours = excluded.working_hours;

insert into public.barber_services (barber_id, service_id)
select barber.id, service.id
from public.barbers barber
cross join public.services service
where barber.id in (
  'kai-loc',
  'minh-fade',
  'ryo-beard',
  'linh-color',
  'bao-crop',
  'son-line',
  'hieu-wave'
)
on conflict do nothing;
