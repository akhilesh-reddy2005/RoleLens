-- RoleLens database schema (Supabase / PostgreSQL)
-- Run inside the Supabase SQL editor, in order.

create extension if not exists "pgcrypto";

-- ============================================================
-- profiles
-- ============================================================
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  password_hash text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- resumes
-- ============================================================
create table if not exists resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_size integer not null,
  mime_type text not null,
  parsed_name text,
  parsed_email text,
  parsed_phone text,
  raw_text text,
  created_at timestamptz not null default now()
);

create index if not exists idx_resumes_user_id on resumes(user_id);

-- ============================================================
-- resume_analysis
-- ============================================================
create table if not exists resume_analysis (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  resume_id uuid not null references resumes(id) on delete cascade,
  resume_score integer not null check (resume_score between 0 and 100),
  ats_score integer not null check (ats_score between 0 and 100),
  strengths text[] not null default '{}',
  weaknesses text[] not null default '{}',
  career_roadmap text[] not null default '{}',
  current_skills text[] not null default '{}',
  missing_skills text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_resume_analysis_user_id on resume_analysis(user_id);
create index if not exists idx_resume_analysis_resume_id on resume_analysis(resume_id);

-- ============================================================
-- recommended_roles
-- ============================================================
create table if not exists recommended_roles (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references resume_analysis(id) on delete cascade,
  role text not null,
  match_percentage integer not null check (match_percentage between 0 and 100),
  confidence text not null check (confidence in ('High', 'Medium', 'Low')),
  reason text not null
);

create index if not exists idx_recommended_roles_analysis_id on recommended_roles(analysis_id);

-- ============================================================
-- skills (reference / master list, optional taxonomy)
-- ============================================================
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  category text
);

-- ============================================================
-- career_paths (reference data for roadmap templates)
-- ============================================================
create table if not exists career_paths (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  current_level text,
  intermediate_skills text[] default '{}',
  advanced_skills text[] default '{}',
  target_job text
);

-- ============================================================
-- activity_logs
-- ============================================================
create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  action text not null,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_logs_user_id on activity_logs(user_id);

-- ============================================================
-- Row Level Security
-- Note: the backend uses the Supabase service role key, which bypasses RLS.
-- RLS below protects data if the anon/public key is ever used directly
-- (e.g. future direct-from-frontend reads).
-- ============================================================
alter table profiles enable row level security;
alter table resumes enable row level security;
alter table resume_analysis enable row level security;
alter table recommended_roles enable row level security;
alter table activity_logs enable row level security;

create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can view own resumes" on resumes
  for select using (auth.uid() = user_id);

create policy "Users can view own analysis" on resume_analysis
  for select using (auth.uid() = user_id);

create policy "Users can view own activity" on activity_logs
  for select using (auth.uid() = user_id);

-- ============================================================
-- Storage bucket
-- Create manually in Supabase Dashboard > Storage, or via SQL below.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

create policy "Users can access own resume files"
  on storage.objects for select
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);
