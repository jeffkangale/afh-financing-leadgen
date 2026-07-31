-- Run this in the Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(trim(name)) between 2 and 150),
  business_name text null check (business_name is null or char_length(trim(business_name)) <= 150),
  email text null check (email is null or char_length(trim(email)) between 3 and 200),
  phone text null check (phone is null or char_length(trim(phone)) <= 40),
  contact text null check (contact is null or char_length(trim(contact)) <= 200),
  business_status text null check (business_status is null or char_length(trim(business_status)) <= 60),
  city text null check (city is null or char_length(trim(city)) <= 100),
  state text null check (state is null or char_length(trim(state)) <= 60),
  financing_need text not null check (
    financing_need in (
      'purchase', 'construction_renovation', 'payroll',
      'working_capital', 'equipment', 'not_sure', 'other'
    )
  ),
  estimated_amount text null check (estimated_amount is null or char_length(trim(estimated_amount)) <= 100),
  timeline text null check (timeline is null or char_length(trim(timeline)) <= 100),
  funding_needed_by text null check (funding_needed_by is null or char_length(trim(funding_needed_by)) <= 60),
  property_under_contract text null check (property_under_contract is null or char_length(trim(property_under_contract)) <= 60),
  next_payroll_date date null,
  payroll_amount_needed text null check (payroll_amount_needed is null or char_length(trim(payroll_amount_needed)) <= 100),
  referral_source text null check (referral_source is null or char_length(trim(referral_source)) <= 60),
  notes text null check (notes is null or char_length(notes) <= 3000)
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

-- No public SELECT, UPDATE, or DELETE access is granted.
-- Review submitted leads directly in the Supabase dashboard.
