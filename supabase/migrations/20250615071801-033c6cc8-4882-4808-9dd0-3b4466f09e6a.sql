
-- Add primary_portal_user_profile_id column to public.clients table
ALTER TABLE public.clients 
ADD COLUMN primary_portal_user_profile_id UUID REFERENCES public.profiles(id);

-- Add unique constraint to ensure one profile can only be primary for one client
ALTER TABLE public.clients 
ADD CONSTRAINT fk_unique_primary_portal_user UNIQUE (primary_portal_user_profile_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_clients_primary_portal_user 
ON public.clients(primary_portal_user_profile_id);
