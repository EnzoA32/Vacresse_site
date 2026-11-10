-- FC Vacresse : base de données Supabase. À coller dans Supabase > SQL Editor > Run.
create extension if not exists pgcrypto;

create table if not exists teams (id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, sort_order int default 0, staff text, rbfa_url text);
create table if not exists trainings (id uuid primary key default gen_random_uuid(), team_id uuid not null references teams(id) on delete cascade, day text not null, time text, place text);
create table if not exists players (id uuid primary key default gen_random_uuid(), team_id uuid not null references teams(id) on delete cascade, first_name text not null, last_name text not null, number int, position text, photo_url text, matches_played int, goals int);
create table if not exists matches (id uuid primary key default gen_random_uuid(), team_id uuid not null references teams(id) on delete cascade, opponent text not null, starts_at timestamptz not null, home boolean default true, place text, status text default 'À venir', score_us int, score_them int, opponent_logo_url text);
create table if not exists events (id uuid primary key default gen_random_uuid(), title text not null, date date not null, time text, place text, description text, image_url text, link_url text, published boolean default true);
create table if not exists people (id uuid primary key default gen_random_uuid(), grp text not null check (grp in ('president','coordinateur','comite','coach')), name text not null, role text, phone text, photo_url text, sort_order int default 0);
create table if not exists club_photos (id uuid primary key default gen_random_uuid(), image_url text not null, title text, category text, sort_order int default 0);
create table if not exists sponsors (id uuid primary key default gen_random_uuid(), name text not null, logo_url text, url text, sort_order int default 0);
create table if not exists slides (id uuid primary key default gen_random_uuid(), image_url text not null, title text not null, text text, link text, cta text, sort_order int default 0);
create table if not exists staff_users (email text primary key);

-- Qui peut modifier : les adresses e-mail listées dans staff_users
create or replace function public.is_staff() returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from staff_users where lower(email) = lower(auth.jwt() ->> 'email')) $$;

do $$ declare t text; begin
  foreach t in array array['teams','trainings','players','matches','events','people','club_photos','sponsors','slides'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "lecture publique" on %I', t);
    execute format('drop policy if exists "écriture staff" on %I', t);
    if t = 'events' then execute 'create policy "lecture publique" on events for select using (published or public.is_staff())';
    else execute format('create policy "lecture publique" on %I for select using (true)', t); end if;
    execute format('create policy "écriture staff" on %I for all to authenticated using (public.is_staff()) with check (public.is_staff())', t);
  end loop;
end $$;
alter table staff_users enable row level security;
drop policy if exists "staff lit staff" on staff_users;
create policy "staff lit staff" on staff_users for select to authenticated using (public.is_staff());

-- Photos : bucket public, écriture réservée au staff
insert into storage.buckets (id, name, public) values ('photos', 'photos', true) on conflict (id) do nothing;
drop policy if exists "photos lecture" on storage.objects; drop policy if exists "photos écriture staff" on storage.objects;
create policy "photos lecture" on storage.objects for select using (bucket_id = 'photos');
create policy "photos écriture staff" on storage.objects for all to authenticated using (bucket_id = 'photos' and public.is_staff()) with check (bucket_id = 'photos' and public.is_staff());

-- Les 15 équipes
insert into teams (name, slug, sort_order) values
('Équipe première A','premiere-a',1),('Équipe première B','premiere-b',2),('Réserve','reserve',3),('U17 A','u17-a',4),('U17 B','u17-b',5),('U15','u15',6),('U14','u14',7),
('U12','u12',8),('U11','u11',9),('U10','u10',10),('U9','u9',11),('U8 A','u8-a',12),('U8 B','u8-b',13),('U7','u7',14),('U6','u6',15)
on conflict (slug) do nothing;

-- À FAIRE : remplacer par l'adresse e-mail de l'administrateur (même adresse que son compte Supabase Auth)
-- insert into staff_users (email) values ('votre.adresse@exemple.be');

-- Si la table players existe déjà (base créée avec une version précédente), exécuter une fois :
-- alter table players add column if not exists matches_played int, add column if not exists goals int;
