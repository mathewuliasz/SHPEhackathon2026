create extension if not exists pgcrypto;

create table if not exists public.app_password_resets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.app_password_resets disable row level security;
