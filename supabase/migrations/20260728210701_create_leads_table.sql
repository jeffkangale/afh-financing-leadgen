create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  contact text not null,
  financing_need text not null check (
    financing_need in (
      'purchase',
      'construction_renovation',
      'not_sure'
    )
  ),
  notes text
);

alter table public.leads enable row level security;

revoke all on table public.leads from anon;
revoke all on table public.leads from authenticated;

grant insert on table public.leads to anon;

create policy "Public can submit financing leads"
on public.leads
for insert
to anon
with check (true);