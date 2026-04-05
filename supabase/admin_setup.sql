alter table public.app_users
  add column if not exists role text not null default 'patient';

update public.app_users
set role = 'admin'
where email = 'admin@example.com';

update public.app_users
set role = 'doctor',
    doctor_id = '<doctor-profile-id>'
where email = 'doctor@example.com';
