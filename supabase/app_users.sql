create extension if not exists pgcrypto;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.app_users disable row level security;
