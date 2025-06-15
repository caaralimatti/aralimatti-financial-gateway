
-- Add password management columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_password_change TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS temporary_password_hash TEXT,
ADD COLUMN IF NOT EXISTS temp_password_expires_at TIMESTAMP WITH TIME ZONE;

-- Create index on temp_password_expires_at for efficient cleanup
CREATE INDEX IF NOT EXISTS idx_profiles_temp_password_expires 
ON public.profiles(temp_password_expires_at) 
WHERE temp_password_expires_at IS NOT NULL;

-- Create function to clean up expired temporary passwords
CREATE OR REPLACE FUNCTION cleanup_expired_temp_passwords()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET temporary_password_hash = NULL, 
      temp_password_expires_at = NULL
  WHERE temp_password_expires_at < NOW();
END;
$$;

-- Create trigger to update last_password_change when user changes password
CREATE OR REPLACE FUNCTION update_last_password_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only update if this is a password change operation (not profile updates)
  IF OLD.id IS NOT NULL AND NEW.id = OLD.id THEN
    NEW.last_password_change = NOW();
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'trigger_update_last_password_change'
  ) THEN
    CREATE TRIGGER trigger_update_last_password_change
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_last_password_change();
  END IF;
END
$$;
