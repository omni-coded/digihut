-- DigiHut website: enquiry storage + team admin access.
-- Run this once in Supabase → SQL Editor. Safe to run again.

-- 1. Leads from the website forms --------------------------------------------
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  type          text not null default 'enquiry',
  status        text not null default 'new',
  name          text not null,
  business_name text,
  phone         text not null,
  category      text,
  services      text[] not null default '{}',
  city          text,
  message       text,
  language      text,
  source        text,
  audit_score   int,
  ip_hash       text            -- salted hash set by the submit-lead function; never the raw IP
);

alter table public.leads add column if not exists ip_hash text;

-- Field rules. Enforced by the database itself, so they hold even if someone
-- skips the website and calls the API directly.
alter table public.leads drop constraint if exists leads_rules;
alter table public.leads add constraint leads_rules check (
      type in ('enquiry', 'callback')
  and status in ('new', 'contacted', 'converted', 'closed')
  and char_length(name) between 2 and 120
  and name !~ '[<>]'
  and phone ~ '^[6-9][0-9]{9}$'
  and (business_name is null or char_length(business_name) <= 160)
  and (category is null or category in ('restaurants','clothing','general','salons','coaching','clinics','electronics','jewellery','events','home','other'))
  and cardinality(services) <= 7
  and services <@ array['presence','branding','social','marketing','management','insights','unsure']::text[]
  and (city is null or char_length(city) <= 80)
  and (message is null or char_length(message) <= 1200)
  and (language is null or language in ('en', 'hi'))
  and (source is null or source ~ '^[a-z0-9-]{1,60}$')
  and (audit_score is null or audit_score between 0 and 100)
  and (ip_hash is null or ip_hash ~ '^[0-9a-f]{64}$')
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_phone_idx on public.leads (phone, created_at desc);
create index if not exists leads_ip_idx on public.leads (ip_hash, created_at desc);

-- 2. Flood protection ---------------------------------------------------------
-- Rejects (with HTTP 429) a 4th enquiry from the same phone number within 24
-- hours, and more than 15 enquiries site-wide in any 5 minutes. Raise the
-- limits if real traffic ever needs it.
create or replace function public.leads_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.leads
        where phone = new.phone and created_at > now() - interval '24 hours') >= 3 then
    raise sqlstate 'PT429' using message = 'rate_limited_phone';
  end if;
  if (select count(*) from public.leads
        where created_at > now() - interval '5 minutes') >= 15 then
    raise sqlstate 'PT429' using message = 'rate_limited_global';
  end if;
  -- Visitors can never choose these values themselves.
  new.status := 'new';
  new.created_at := now();
  return new;
end;
$$;

drop trigger if exists leads_rate_limit on public.leads;
create trigger leads_rate_limit
  before insert on public.leads
  for each row execute function public.leads_rate_limit();

-- 3. Who counts as a DigiHut team member ------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);

-- 4. Row Level Security -------------------------------------------------------
alter table public.leads enable row level security;
alter table public.admins enable row level security;

-- Visitors (anon key) may only INSERT new leads, never read, change or delete them.
-- Once you set up the spam check (submit-lead function), run lockdown.sql to
-- remove this policy so ALL enquiries must pass the spam check.
drop policy if exists "Anyone can submit a lead" on public.leads;
create policy "Anyone can submit a lead"
  on public.leads for insert
  to anon, authenticated
  with check (status = 'new' and ip_hash is null);

-- Only signed-in admins can read and update leads. Nobody can delete from the browser.
drop policy if exists "Admins can read leads" on public.leads;
create policy "Admins can read leads"
  on public.leads for select
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "Admins can update leads" on public.leads;
create policy "Admins can update leads"
  on public.leads for update
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- Admins can only change the status column from the browser.
revoke update, delete, truncate on public.leads from anon, authenticated;
revoke insert, update, delete, truncate on public.admins from anon, authenticated;
grant update (status) on public.leads to authenticated;

drop policy if exists "Admins can see admins" on public.admins;
create policy "Admins can see admins"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());

-- 5. Add a team member -------------------------------------------------------
-- a) Supabase → Authentication → Users → "Add user" (email + strong password).
-- b) Copy that user's id and run:
--    insert into public.admins (user_id) values ('PASTE-USER-ID-HERE');

-- 6. "My Shop" profiles (shop-owner accounts) ---------------------------------
-- One row per signed-in shop owner. Owners can only see and change their own
-- row; DigiHut admins can read all rows.
create table if not exists public.shop_profiles (
  user_id       uuid primary key references auth.users (id) on delete cascade,
  updated_at    timestamptz not null default now(),
  business_type text not null,
  sells         text,
  city          text,
  shop_age      text,
  goals         text[] not null default '{}',
  done          text[] not null default '{}',
  language      text
);

alter table public.shop_profiles drop constraint if exists shop_profiles_rules;
alter table public.shop_profiles add constraint shop_profiles_rules check (
      business_type in ('restaurants','clothing','general','salons','coaching','clinics','electronics','jewellery','events','home','other')
  and (sells is null or (char_length(sells) <= 200 and sells !~ '[<>]'))
  and (city is null or (char_length(city) <= 80 and city !~ '[<>]'))
  and (shop_age is null or shop_age in ('new', 'mid', 'old'))
  and cardinality(goals) <= 5
  and goals <@ array['walkins','orders','regulars','professional','time']::text[]
  and cardinality(done) <= 20
  and (language is null or language in ('en', 'hi'))
);

create or replace function public.shop_profiles_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists shop_profiles_touch on public.shop_profiles;
create trigger shop_profiles_touch before insert or update on public.shop_profiles
  for each row execute function public.shop_profiles_touch();

alter table public.shop_profiles enable row level security;
revoke all on public.shop_profiles from anon;
revoke truncate on public.shop_profiles from authenticated;

drop policy if exists "Owners manage their own shop" on public.shop_profiles;
create policy "Owners manage their own shop"
  on public.shop_profiles for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Admins can read shops" on public.shop_profiles;
create policy "Admins can read shops"
  on public.shop_profiles for select
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));
