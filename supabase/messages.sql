-- ============================================
-- Run this in the Supabase SQL Editor
-- Adds user_id to appointments and creates messages table
-- ============================================

-- 1. Add user_id column to appointments
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES app_users(id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);

-- 2. Create messages table for consultation chats
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL REFERENCES appointments(id),
  sender_type text NOT NULL CHECK (sender_type IN ('patient', 'doctor')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public all messages') THEN
    CREATE POLICY "Public all messages" ON messages FOR ALL USING (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_messages_appointment_id ON messages(appointment_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(appointment_id, created_at);
