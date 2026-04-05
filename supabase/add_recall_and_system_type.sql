-- ============================================
-- Run this in the Supabase SQL Editor
-- Adds recall_bot_id to appointments and expands sender_type to allow 'system'
-- ============================================

-- 1. Add recall_bot_id column to appointments
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS recall_bot_id text DEFAULT NULL;

-- 2. Expand sender_type CHECK to allow 'system' messages (AI-generated summaries)
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_type_check;
ALTER TABLE messages ADD CONSTRAINT messages_sender_type_check
  CHECK (sender_type IN ('patient', 'doctor', 'system'));
