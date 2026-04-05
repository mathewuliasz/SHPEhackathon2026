-- Run this in the Supabase SQL Editor
-- Adds preferred_language column to app_users

ALTER TABLE app_users ADD COLUMN IF NOT EXISTS preferred_language text NOT NULL DEFAULT 'en';
