-- Adds the fields needed for the expanded lead form (business name, email,
-- phone, estimated amount, timeline) and the payroll-funding financing path.
-- `contact` and `notes` are kept as-is for backward compatibility.

alter table public.leads add column if not exists business_name text null
  check (business_name is null or char_length(trim(business_name)) <= 150);

alter table public.leads add column if not exists email text null
  check (email is null or char_length(trim(email)) between 3 and 200);

alter table public.leads add column if not exists phone text null
  check (phone is null or char_length(trim(phone)) <= 40);

alter table public.leads add column if not exists estimated_amount text null
  check (estimated_amount is null or char_length(trim(estimated_amount)) <= 100);

alter table public.leads add column if not exists timeline text null
  check (timeline is null or char_length(trim(timeline)) <= 100);

alter table public.leads alter column contact drop not null;

-- Drop whatever check constraint currently governs financing_need (its
-- auto-generated name may vary) and replace it with the expanded set that
-- includes the new payroll and other options.
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
  financing_need in ('purchase', 'construction_renovation', 'payroll', 'not_sure', 'other')
);
