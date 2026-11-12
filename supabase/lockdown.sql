-- Run this ONLY after the submit-lead Edge Function is deployed and
-- VITE_TURNSTILE_SITE_KEY is set on the website.
--
-- It removes direct form inserts, so every enquiry must go through the
-- function and pass the spam check. Scripts that call the API directly
-- with the public key will then be refused.

drop policy if exists "Anyone can submit a lead" on public.leads;
revoke insert on public.leads from anon;

-- To undo (go back to direct inserts without the spam check):
-- grant insert on public.leads to anon;
-- create policy "Anyone can submit a lead" on public.leads for insert
--   to anon, authenticated with check (status = 'new' and ip_hash is null);
