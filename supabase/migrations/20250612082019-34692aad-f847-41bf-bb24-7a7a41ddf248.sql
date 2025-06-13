
-- Add last_login_at column to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN last_login_at TIMESTAMP WITH TIME ZONE;

-- Add a comment to document the column
COMMENT ON COLUMN public.profiles.last_login_at IS 'Timestamp of the user''s last successful login';
