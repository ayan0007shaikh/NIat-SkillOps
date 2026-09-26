-- Run this in Supabase SQL Editor to update the trigger to use the new dynamic sign-up data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    niat_id, 
    campus, 
    target_role
  )
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Student'), 
    COALESCE(new.raw_user_meta_data->>'niat_id', ''), 
    COALESCE(new.raw_user_meta_data->>'campus', ''), 
    'Robotics / Physical AI Intern'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
