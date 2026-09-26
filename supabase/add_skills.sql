-- Run this to add custom skills to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_skills JSONB DEFAULT '{}'::jsonb;
