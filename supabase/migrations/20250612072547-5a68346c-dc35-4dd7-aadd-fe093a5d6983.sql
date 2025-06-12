
-- Add foreign key relationship between admin_activity_log and profiles
-- First, let's add a foreign key constraint to link admin_activity_log.user_id to profiles.id
ALTER TABLE public.admin_activity_log 
DROP CONSTRAINT IF EXISTS admin_activity_log_user_id_fkey;

ALTER TABLE public.admin_activity_log 
ADD CONSTRAINT admin_activity_log_user_id_profiles_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
