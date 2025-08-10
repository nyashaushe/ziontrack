-- Profiles table maps Supabase auth user -> app role
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text check (role in ('stake-leader','unit-leader','viewer')) not null default 'viewer',
  created_at timestamptz not null default now()
);

-- User can have multiple unit role assignments (for leaders over multiple units)
create table if not exists user_unit_roles (
  user_id uuid references auth.users(id) on delete cascade,
  unit_id text references units(id) on delete cascade,
  role text check (role in ('stake-leader','unit-leader','viewer')) not null,
  primary key (user_id, unit_id)
);

-- Helper functions for RLS
create or replace function is_stake_leader(uid uuid)
returns boolean language sql stable as $$
  select exists(select 1 from profiles p where p.id = uid and p.role = 'stake-leader')
$$;

create or replace function user_has_unit_access(uid uuid, target_unit text)
returns boolean language sql stable as $$
  -- Stake leaders can see all
  select is_stake_leader(uid)
  or exists(select 1 from user_unit_roles r where r.user_id = uid and r.unit_id = target_unit)
$$;

-- Tighten indicator_entries RLS
drop policy if exists "read entries" on indicator_entries;
drop policy if exists "insert own" on indicator_entries;

alter table indicator_entries enable row level security;

-- Read: authenticated and has access to the row's unit (or stake leader)
create policy "read entries by unit access" on indicator_entries
for select
to authenticated
using ( user_has_unit_access(auth.uid(), unit_id) );

-- Insert: authenticated and has access to the target unit, stamp created_by
create policy "insert by unit access" on indicator_entries
for insert
to authenticated
with check ( user_has_unit_access(auth.uid(), unit_id) );

-- Update: only creators or leaders with access to that unit
create policy "update by access or creator" on indicator_entries
for update
to authenticated
using ( user_has_unit_access(auth.uid(), unit_id) or auth.uid() = created_by )
with check ( user_has_unit_access(auth.uid(), unit_id) or auth.uid() = created_by );

-- Optional: create a materialized view for stake rollups (you can refresh on a schedule)
drop materialized view if exists mv_rollup_last_90;
create materialized view mv_rollup_last_90 as
select
  unit_id,
  indicator_key,
  sum(value) as total_value,
  min(period_start) as start_date,
  max(period_start) as end_date
from indicator_entries
where period_start >= (current_date - interval '90 days')
group by unit_id, indicator_key;

-- Grant selects to authenticated (RLS does not apply to materialized views)
grant select on mv_rollup_last_90 to authenticated;
