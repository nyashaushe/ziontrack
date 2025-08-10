-- Run in Supabase SQL Editor

-- Units (seed with your 9 units)
create table if not exists units (
  id text primary key,
  name text not null,
  type text check (type in ('ward','branch')) not null,
  stake text not null
);

-- Indicator entries
create table if not exists indicator_entries (
  id uuid primary key default gen_random_uuid(),
  unit_id text references units(id) not null,
  indicator_key text not null,
  period_start date not null,
  value integer not null,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- Basic RLS
alter table indicator_entries enable row level security;

-- Policies (example: everyone can read for now; tighten later with roles)
create policy "read entries" on indicator_entries
for select
to authenticated
using (true);

create policy "insert own" on indicator_entries
for insert
to authenticated
with check (auth.uid() = created_by or created_by is null);

-- Seed units
insert into units (id,name,type,stake) values
('domboramwari-branch','Domboramwari Branch','branch','Harare Zimbabwe Stake'),
('epworth-ward','Epworth Ward','ward','Harare Zimbabwe Stake'),
('queensdale-ward','Queensdale Ward','ward','Harare Zimbabwe Stake'),
('mbare-1-ward','Mbare 1 Ward','ward','Harare Zimbabwe Stake'),
('mbare-2-ward','Mbare 2 Ward','ward','Harare Zimbabwe Stake'),
('highfield-ward','Highfield Ward','ward','Harare Zimbabwe Stake'),
('glenview-2nd-ward','Glenview 2nd Ward','ward','Harare Zimbabwe Stake'),
('kambuzuma-branch','Kambuzuma Branch','branch','Harare Zimbabwe Stake'),
('solomio-branch','Solomio','branch','Harare Zimbabwe Stake')
on conflict (id) do nothing;
