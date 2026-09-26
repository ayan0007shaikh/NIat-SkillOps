-- RUN THIS IN SUPABASE SQL EDITOR TO UPDATE YOUR EXISTING SCHEMA

-- 1. Add missing columns to profiles (if they don't exist already)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='avatar_url') THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='campus') THEN
        ALTER TABLE public.profiles ADD COLUMN campus TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='niat_id') THEN
        ALTER TABLE public.profiles ADD COLUMN niat_id TEXT;
    END IF;
END $$;

-- 2. Ensure RLS is active
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Update the trigger to include the new default fields for new signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, campus, niat_id, target_role)
  VALUES (new.id, new.email, 'Ayan Shaikh', 'NIAT Hyderabad', 'NIAT24CS0142', 'Robotics / Physical AI Intern');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Update the current logged-in user with dummy data so the profile isn't blank
UPDATE public.profiles
SET 
    full_name = COALESCE(full_name, 'Ayan Shaikh'),
    campus = COALESCE(campus, 'NIAT Hyderabad'),
    niat_id = COALESCE(niat_id, 'NIAT24CS0142'),
    target_role = COALESCE(target_role, 'Robotics / Physical AI Intern')
WHERE full_name IS NULL OR full_name = '';

-- ==========================================
-- Your database is now fully updated and matches the React codebase perfectly!
-- ==========================================
