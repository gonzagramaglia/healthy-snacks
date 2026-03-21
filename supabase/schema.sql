-- Fresh setup for Snack Builder
-- Run in Supabase SQL Editor on a clean project.

create table if not exists public.orders (
  id text primary key,
  name text,
  email text not null,
  phone text not null,
  items jsonb not null default '[]'::jsonb,
  delivery_option text not null,
  delivery_address text,
  total_price numeric(12,2) not null default 0,
  total_mix_qty integer not null default 0,
  payment_method text,
  payment_link text,
  discount_code text,
  discount_amount numeric(12,2),
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_email_idx on public.orders (email);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type text not null check (type in ('percentage', 'fixed')),
  value numeric(12,2) not null check (value > 0),
  max_discount numeric(12,2),
  min_subtotal numeric(12,2),
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  usage_limit integer,
  used_count integer not null default 0,
  allowed_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint coupons_dates_valid check (starts_at is null or ends_at is null or starts_at <= ends_at),
  constraint coupons_usage_valid check (usage_limit is null or usage_limit >= 0),
  constraint coupons_used_count_valid check (used_count >= 0)
);

create index if not exists coupons_code_idx on public.coupons (code);
create index if not exists coupons_active_idx on public.coupons (active);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists coupons_set_updated_at on public.coupons;
create trigger coupons_set_updated_at
before update on public.coupons
for each row execute function public.set_updated_at();

-- Optional example coupon
insert into public.coupons (code, type, value, max_discount, min_subtotal, active)
values ('787', 'percentage', 7, 787, 1, true)
on conflict (code) do nothing;
