create extension if not exists pgcrypto;

create table if not exists public.app_reviews (
  id uuid primary key default gen_random_uuid(),
  name text,
  location text,
  content text not null,
  rating integer not null check (rating between 1 and 5),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.app_reviews disable row level security;
