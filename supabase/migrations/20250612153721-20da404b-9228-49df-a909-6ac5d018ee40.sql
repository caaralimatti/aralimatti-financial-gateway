
-- Drop all existing policies on dsc_certificates
DROP POLICY IF EXISTS "Admins can manage all DSC certificates" ON public.dsc_certificates;
DROP POLICY IF EXISTS "Staff can view all DSC certificates" ON public.dsc_certificates;
DROP POLICY IF EXISTS "Staff can create DSC certificates" ON public.dsc_certificates;
DROP POLICY IF EXISTS "Staff can update DSC certificates they manage" ON public.dsc_certificates;
DROP POLICY IF EXISTS "Staff can update DSC certificates" ON public.dsc_certificates;
DROP POLICY IF EXISTS "Staff can insert DSC certificates" ON public.dsc_certificates;
DROP POLICY IF EXISTS "Clients can view their own DSC certificates" ON public.dsc_certificates;

-- Now we can safely drop the contact_person_id column
ALTER TABLE public.dsc_certificates 
DROP COLUMN IF EXISTS contact_person_id;

-- Fix the DSC certificates table schema
ALTER TABLE public.dsc_certificates 
ALTER COLUMN serial_number DROP NOT NULL;

ALTER TABLE public.dsc_certificates 
ALTER COLUMN issuing_authority DROP NOT NULL;

-- Add new contact person fields
ALTER TABLE public.dsc_certificates 
ADD COLUMN IF NOT EXISTS contact_person_phone TEXT;

ALTER TABLE public.dsc_certificates 
ADD COLUMN IF NOT EXISTS contact_person_name TEXT;

-- Recreate RLS policies
CREATE POLICY "Admin can manage all DSC certificates" 
ON public.dsc_certificates 
FOR ALL 
USING (is_current_user_admin());

CREATE POLICY "Staff can view all DSC certificates" 
ON public.dsc_certificates 
FOR SELECT 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff');

CREATE POLICY "Staff can manage DSC certificates" 
ON public.dsc_certificates 
FOR ALL 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff');

CREATE POLICY "Clients can view their own DSC certificates" 
ON public.dsc_certificates 
FOR SELECT 
USING (certificate_holder_profile_id = auth.uid());
