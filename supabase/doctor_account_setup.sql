alter table public.app_users
  add column if not exists role text not null default 'patient';

alter table public.app_users
  add column if not exists doctor_id uuid references public.doctors(id) on delete set null;

insert into public.app_users (
  full_name,
  email,
  password_hash,
  role,
  doctor_id
)
values (
  'Dr. Sarah Johnson',
  'dr.sarah@shpemedical.org',
  'b452045e2c808cdda1a8f6cc24ed6c59:9c5510e1f90b3341e56fcde0b2f91e8c09e8c6f28d5e3f4f0f639a0ce255978c839c096c67d005d922be2b414b818a77cbeded7efd9df0163121a7336dba41ae',
  'doctor',
  'd0000000-0000-0000-0000-000000000001'
)
on conflict (email) do update
set
  full_name = excluded.full_name,
  password_hash = excluded.password_hash,
  role = excluded.role,
  doctor_id = excluded.doctor_id;
