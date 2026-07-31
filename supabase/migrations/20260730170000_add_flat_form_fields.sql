-- Adds the columns the current (post-wizard-revert) lead form actually
-- writes to: business status, city/state, funding timeline, conditional
-- property/payroll details, and referral source. Purely additive.
-- Also widens financing_need to include working_capital and equipment,
-- which this form's option list already sends.

alter table public.leads add column if not exists business_status text null
  check (business_status is null or char_length(trim(business_status)) <= 60);

alter table public.leads add column if not exists city text null
  check (city is null or char_length(trim(city)) <= 100);

alter table public.leads add column if not exists state text null
  check (state is null or char_length(trim(state)) <= 60);

alter table public.leads add column if not exists funding_needed_by text null
  check (funding_needed_by is null or char_length(trim(funding_needed_by)) <= 60);

alter table public.leads add column if not exists property_under_contract text null
  check (property_under_contract is null or char_length(trim(property_under_contract)) <= 60);

alter table public.leads add column if not exists next_payroll_date date null;

alter table public.leads add column if not exists payroll_amount_needed text null
  check (payroll_amount_needed is null or char_length(trim(payroll_amount_needed)) <= 100);

alter table public.leads add column if not exists referral_source text null
  check (referral_source is null or char_length(trim(referral_source)) <= 60);

do $$
declare
  con record;
begin
  for con in
    select conname from pg_constraint
    where conrelid = 'public.leads'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%financing_need%'
  loop
    execute format('alter table public.leads drop constraint %I', con.conname);
  end loop;
end $$;

alter table public.leads add constraint leads_financing_need_check check (
  financing_need in (
    'purchase', 'construction_renovation', 'payroll',
    'working_capital', 'equipment', 'not_sure', 'other'
  )
);
