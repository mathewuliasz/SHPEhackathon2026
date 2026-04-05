create table if not exists app_patient_context (
  user_id uuid primary key references app_users(id) on delete cascade,
  context_text text not null default '',
  updated_at timestamptz not null default now()
);
