-- ════════════════════════════════════════════════════════════════════════
--  TajAttire — lock down the database and file storage
--
--  WHAT IT DOES
--    • Anyone can READ public site content (products, FAQ, settings …).
--    • Only listed admin accounts can CHANGE content or upload files.
--    • Visitors can still SEND enquiries, but cannot read anyone else's.
--    • Upload buckets get size and file-type limits.
--
--  HOW TO RUN (owner only — takes ~1 minute)
--    1. Edit the e-mail address in STEP 1 to the one you sign in with.
--    2. Supabase dashboard → SQL Editor → New query → paste this file → Run.
--    3. Supabase → Authentication → Sign In / Providers → turn OFF
--       "Allow new users to sign up" (so strangers can't create accounts).
--    4. Admin panel → Dashboard → "Protect your website" → Check again.
--
--  Safe to run more than once. It does not delete or change any content.
-- ════════════════════════════════════════════════════════════════════════

-- STEP 1 ─ who counts as an admin ───────────────────────────────────────
create table if not exists public.admin_users (
  email text primary key
);
alter table public.admin_users enable row level security;
-- RLS on with no policies = nobody can read or edit this list through the API

insert into public.admin_users (email)
values ('info@tajattire.in')            -- ← change to your admin sign-in e-mail
on conflict (email) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- STEP 2 ─ public content: read for everyone, write for admins ──────────
do $$
declare
  t text;
  p record;
begin
  foreach t in array array[
    'catalogue_items','testimonials','faq_items','stats','site_settings',
    'collections','how_it_works','sustainability_cards','marquee_tags',
    'instagram_images'
  ]
  loop
    if to_regclass('public.' || t) is null then
      raise notice 'skipping %, table not found', t;
      continue;
    end if;
    execute format('alter table public.%I enable row level security', t);
    -- remove every existing policy (older ones allowed anonymous writes)
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
      execute format('drop policy %I on public.%I', p.policyname, t);
    end loop;
    execute format('create policy "public read" on public.%I for select using (true)', t);
    execute format('create policy "admin insert" on public.%I for insert to authenticated with check (public.is_admin())', t);
    execute format('create policy "admin update" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('create policy "admin delete" on public.%I for delete to authenticated using (public.is_admin())', t);
  end loop;
end $$;

-- STEP 3 ─ enquiries: visitors may submit, only admins may read/delete ──
do $$
declare p record;
begin
  if to_regclass('public.enquiry_submissions') is not null then
    alter table public.enquiry_submissions enable row level security;
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'enquiry_submissions' loop
      execute format('drop policy %I on public.enquiry_submissions', p.policyname);
    end loop;
    create policy "visitor submit" on public.enquiry_submissions
      for insert to anon, authenticated
      with check (
        length(coalesce(name, '')) <= 200 and length(coalesce(email, '')) <= 200 and
        length(coalesce(phone, '')) <= 40 and length(coalesce(city, '')) <= 200 and
        length(coalesce(product, '')) <= 300 and length(coalesce(message, '')) <= 3000
      );
    create policy "admin read" on public.enquiry_submissions for select to authenticated using (public.is_admin());
    create policy "admin delete" on public.enquiry_submissions for delete to authenticated using (public.is_admin());
  end if;

  if to_regclass('public.factory_visit_requests') is not null then
    alter table public.factory_visit_requests enable row level security;
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'factory_visit_requests' loop
      execute format('drop policy %I on public.factory_visit_requests', p.policyname);
    end loop;
    create policy "admin read" on public.factory_visit_requests for select to authenticated using (public.is_admin());
    create policy "admin delete" on public.factory_visit_requests for delete to authenticated using (public.is_admin());
    -- (the website sends visit requests by e-mail, so no public insert is needed)
  end if;
end $$;

-- STEP 4 ─ file storage: public read, admin-only upload, with limits ────
update storage.buckets
set public = true,
    file_size_limit = 20971520,  -- 20 MB per image
    allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif','image/avif']
where id = 'product-images';

update storage.buckets
set public = true,
    file_size_limit = 52428800,  -- 50 MB (hero video / catalogue PDF)
    allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif','image/avif',
                               'video/mp4','video/webm','application/pdf']
where id = 'site-images';

do $$
declare p record;
begin
  -- only policies that touch this site's buckets, or that apply to every
  -- bucket (no bucket_id filter at all) — other buckets are left alone
  for p in
    select policyname from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and (
        coalesce(qual, '') || coalesce(with_check, '') ~ '(product-images|site-images)'
        or coalesce(qual, '') || coalesce(with_check, '') !~ 'bucket_id'
      )
  loop
    execute format('drop policy %I on storage.objects', p.policyname);
  end loop;
end $$;

create policy "public read site files" on storage.objects
  for select using (bucket_id in ('product-images','site-images'));
create policy "admin upload site files" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('product-images','site-images') and public.is_admin());
create policy "admin update site files" on storage.objects
  for update to authenticated
  using (bucket_id in ('product-images','site-images') and public.is_admin());
create policy "admin delete site files" on storage.objects
  for delete to authenticated
  using (bucket_id in ('product-images','site-images') and public.is_admin());
