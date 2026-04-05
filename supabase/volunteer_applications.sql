create extension if not exists pgcrypto;

create table if not exists public.volunteer_applications (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone_number text,
  medical_license_number text not null,
  licensing_state text not null,
  primary_specialty text not null,
  years_of_experience text,
  languages text[] not null default '{}',
  availability text[] not null default '{}',
  hours_per_month text,
  motivation text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by_user_id uuid references public.app_users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.volunteer_applications disable row level security;
