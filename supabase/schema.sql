-- TrackSubs schema — run this once in the Supabase SQL editor (or via the
-- Supabase CLI: `supabase db push`) on a fresh project.

create extension if not exists "pgcrypto";

create table if not exists public.subscriptions (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users (id) on delete cascade,
  name                  text not null check (char_length(trim(name)) > 0),
  category              text not null default 'Other',
  cost                  numeric(12, 2) not null check (cost >= 0),
  currency              text not null default 'USD',
  billing_cycle         text not null check (billing_cycle in ('weekly', 'monthly', 'quarterly', 'yearly', 'custom')),
  custom_interval_days  integer,
  next_renewal_date     date not null,
  start_date            date,
  vendor_url            text,
  notes                 text,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_next_renewal_idx on public.subscriptions (user_id, next_renewal_date);

-- Keep updated_at current on every edit.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row
  execute function public.set_updated_at();

-- Row Level Security: every user only ever sees and edits their own rows.
alter table public.subscriptions enable row level security;

drop policy if exists "Users can view own subscriptions" on public.subscriptions;
create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own subscriptions" on public.subscriptions;
create policy "Users can insert own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own subscriptions" on public.subscriptions;
create policy "Users can update own subscriptions"
  on public.subscriptions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own subscriptions" on public.subscriptions;
create policy "Users can delete own subscriptions"
  on public.subscriptions for delete
  using (auth.uid() = user_id);
