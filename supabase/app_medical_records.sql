create extension if not exists pgcrypto;

create table if not exists public.app_medical_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  title text not null,
  doctor text,
  record_date date not null,
  summary text not null,
  status text not null check (status in ('Normal', 'Borderline', 'Reviewed', 'Needs Attention')),
  category text not null check (category in ('lab_results', 'visit_history', 'uploads')),
  source_file_name text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists app_medical_records_user_id_idx
  on public.app_medical_records(user_id, record_date desc, created_at desc);

alter table public.app_medical_records disable row level security;
