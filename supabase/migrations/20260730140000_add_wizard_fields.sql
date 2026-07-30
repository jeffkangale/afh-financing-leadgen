-- Adds the fields needed for the multi-step financing wizard: business
-- status/location, property specifics, financial snapshot, documents on
-- hand, consent, and the two new financing_need options (working capital,
-- equipment). Purely additive; existing columns and data are untouched.

alter table public.leads add column if not exists business_status text null
  check (business_status is null or char_length(trim(business_status)) <= 60);

alter table public.leads add column if not exists city text null
  check (city is null or char_length(trim(city)) <= 100);

alter table public.leads add column if not exists state text null
  check (state is null or char_length(trim(state)) <= 60);

alter table public.leads add column if not exists licensed_beds integer null
  check (licensed_beds is null or licensed_beds between 0 and 9999);

alter table public.leads add column if not exists property_address text null
  check (property_address is null or char_length(trim(property_address)) <= 300);

alter table public.leads add column if not exists purchase_price text null
  check (purchase_price is null or char_length(trim(purchase_price)) <= 100);

alter table public.leads add column if not exists down_payment text null
  check (down_payment is null or char_length(trim(down_payment)) <= 100);

alter table public.leads add column if not exists property_under_contract text null
  check (property_under_contract is null or char_length(trim(property_under_contract)) <= 60);

alter table public.leads add column if not exists next_payroll_date date null;

alter table public.leads add column if not exists payroll_amount_needed text null
  check (payroll_amount_needed is null or char_length(trim(payroll_amount_needed)) <= 100);

alter table public.leads add column if not exists annual_revenue text null
  check (annual_revenue is null or char_length(trim(annual_revenue)) <= 60);

alter table public.leads add column if not exists credit_score_range text null
  check (credit_score_range is null or char_length(trim(credit_score_range)) <= 60);

alter table public.leads add column if not exists existing_debt text null
  check (existing_debt is null or char_length(trim(existing_debt)) <= 20);

alter table public.leads add column if not exists documents_on_hand text[] null;

alter table public.leads add column if not exists additional_info text null
  check (additional_info is null or char_length(additional_info) <= 3000);

alter table public.leads add column if not exists referral_source text null
  check (referral_source is null or char_length(trim(referral_source)) <= 60);

alter table public.leads add column if not exists consent boolean not null default false;

-- Expand financing_need to include the wizard's new "working capital" and
-- "equipment" options, on top of the existing set.
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
