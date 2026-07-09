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
-- live_jobs
-- Shared cache of postings fetched from external job APIs (Remotive,
-- Arbeitnow, optionally Adzuna/JSearch). Refreshed periodically by a
-- background job on the backend; not user-scoped.
-- ============================================================
create table if not exists live_jobs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  external_id text not null,
  title text not null,
  company_name text not null,
  company_logo text,
  location text,
  remote_type text check (remote_type in ('Remote', 'Hybrid', 'Onsite')),
  employment_type text,
  experience_level text,
  salary_min integer,
  salary_max integer,
  salary_currency text,
  description text,
  skills_extracted text[] not null default '{}',
  apply_url text not null,
  posted_at timestamptz,
  fetched_at timestamptz not null default now(),
  unique (source, external_id)
);

create index if not exists idx_live_jobs_posted_at on live_jobs(posted_at desc);
create index if not exists idx_live_jobs_company on live_jobs(company_name);
create index if not exists idx_live_jobs_location on live_jobs(location);
create index if not exists idx_live_jobs_skills on live_jobs using gin(skills_extracted);

-- ============================================================
-- saved_jobs
-- ============================================================
create table if not exists saved_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  job_id uuid not null references live_jobs(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, job_id)
);

create index if not exists idx_saved_jobs_user_id on saved_jobs(user_id);

-- ============================================================
-- job_match_explanations
-- Per-(user, job) cached match score + Gemini explanation, so the AI
-- explanation is generated once per pair rather than on every view.
-- ============================================================
create table if not exists job_match_explanations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  job_id uuid not null references live_jobs(id) on delete cascade,
  match_percentage integer not null check (match_percentage between 0 and 100),
  matched_skills text[] not null default '{}',
  missing_skills text[] not null default '{}',
  explanation text not null,
  created_at timestamptz not null default now(),
  unique (user_id, job_id)
);

create index if not exists idx_job_match_explanations_user_id on job_match_explanations(user_id);

-- ============================================================
-- job_notifications
-- Created by the background refresh job when a newly-fetched posting
-- matches a user's latest resume skills above the notify threshold.
-- ============================================================
create table if not exists job_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  job_id uuid not null references live_jobs(id) on delete cascade,
  match_percentage integer not null check (match_percentage between 0 and 100),
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, job_id)
);

create index if not exists idx_job_notifications_user_id on job_notifications(user_id, is_read);

alter table live_jobs enable row level security;
alter table saved_jobs enable row level security;
alter table job_match_explanations enable row level security;
alter table job_notifications enable row level security;

create policy "Anyone can view live jobs" on live_jobs
  for select using (true);

create policy "Users can view own saved jobs" on saved_jobs
  for select using (auth.uid() = user_id);

create policy "Users can view own job match explanations" on job_match_explanations
  for select using (auth.uid() = user_id);

create policy "Users can view own job notifications" on job_notifications
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
