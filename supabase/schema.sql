-- Wickie Stat Consultancy — enquiries table
-- Run in Supabase: Dashboard → SQL Editor → New query → paste → Run.

create table if not exists public.enquiries (
  id                uuid primary key default gen_random_uuid(),
  reference         text not null unique,
  created_at        timestamptz not null default now(),
  full_name         text not null check (char_length(full_name) between 2 and 100),
  email             text not null check (char_length(email) <= 200),
  whatsapp          text not null check (char_length(whatsapp) <= 20),
  service           text not null check (char_length(service) <= 120),
  description       text not null check (char_length(description) between 10 and 2000),
  timeline          text not null check (char_length(timeline) <= 100),
  budget            text check (char_length(budget) <= 100),
  source            text not null check (source in ('chatbot', 'contact_form')),
  consent_given_at  timestamptz not null,
  -- Chat transcript is stored ONLY if the visitor ticked the optional box.
  transcript        jsonb,
  status            text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'won', 'closed'))
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);

-- Lock the table down: Row Level Security on, and NO public policies.
-- Only the server (service-role key, never sent to browsers) can read or write.
alter table public.enquiries enable row level security;

-- Data minimisation: delete enquiries that never became projects after 12 months.
-- Requires the pg_cron extension (Dashboard → Database → Extensions → pg_cron).
-- select cron.schedule('purge-old-enquiries', '0 3 * * *',
--   $$ delete from public.enquiries where status in ('new','closed') and created_at < now() - interval '12 months' $$);
