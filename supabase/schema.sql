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

create table if not exists public.discount_codes (
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
  constraint discount_codes_dates_valid check (starts_at is null or ends_at is null or starts_at <= ends_at),
  constraint discount_codes_usage_valid check (usage_limit is null or usage_limit >= 0),
  constraint discount_codes_used_count_valid check (used_count >= 0)
);

create index if not exists discount_codes_code_idx on public.discount_codes (code);
create index if not exists discount_codes_active_idx on public.discount_codes (active);

-- Customer Benefits / Loyalty Program
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  username text not null unique,
  purchases_count integer not null default 0,
  purchase_dates text[] not null default '{}',
  last_updated timestamptz not null default now(),
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_loyalty_purchases (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  purchase_date timestamptz not null default now(),
  -- Tracks which "loyalty card" this belongs to (1 for the first 10, 2 for the next 10, etc.)
  card_number integer not null default 1, 
  created_at timestamptz not null default now()
);

create index if not exists customers_username_idx on public.customers (username);
create index if not exists customer_loyalty_purchases_customer_id_idx on public.customer_loyalty_purchases (customer_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists discount_codes_set_updated_at on public.discount_codes;
create trigger discount_codes_set_updated_at
before update on public.discount_codes
for each row execute function public.set_updated_at();

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

insert into public.discount_codes (code, type, value, max_discount, min_subtotal, active)
values ('787', 'percentage', 7, 787, 1, true)
on conflict (code) do nothing;

create table if not exists public.loyalty_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  steps integer not null default 1,
  is_used boolean not null default false,
  used_by_customer_id uuid references public.customers(id),
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists loyalty_codes_code_idx on public.loyalty_codes (code);
create index if not exists loyalty_codes_is_used_idx on public.loyalty_codes (is_used);
