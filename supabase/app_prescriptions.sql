create extension if not exists pgcrypto;

create table if not exists public.app_prescriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  medication text not null,
  dosage text not null,
  start_date date not null,
  end_date date not null,
  doctor text not null,
  status text not null check (status in ('Active', 'Expired', 'Pending')),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists app_prescriptions_user_id_idx
  on public.app_prescriptions(user_id, created_at desc);

alter table public.app_prescriptions disable row level security;
