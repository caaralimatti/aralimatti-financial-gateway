
-- Create the dsc_certificates table
CREATE TABLE public.dsc_certificates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    certificate_holder_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    serial_number TEXT UNIQUE NOT NULL,
    issuing_authority TEXT NOT NULL,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    storage_location TEXT,
    pin TEXT,
    contact_person_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    received_date TIMESTAMP WITH TIME ZONE NOT NULL,
    given_date TIMESTAMP WITH TIME ZONE,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add enable_dsc_tab column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN enable_dsc_tab BOOLEAN NOT NULL DEFAULT false;

-- Create trigger to update updated_at column
CREATE TRIGGER update_dsc_certificates_updated_at
    BEFORE UPDATE ON public.dsc_certificates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on dsc_certificates table
ALTER TABLE public.dsc_certificates ENABLE ROW LEVEL SECURITY;

-- Admin Policy: Full access for admins
CREATE POLICY "Admins can manage all DSC certificates"
ON public.dsc_certificates
FOR ALL
TO authenticated
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

-- Staff Policy: Full read access, can insert, can update records they manage
CREATE POLICY "Staff can view all DSC certificates"
ON public.dsc_certificates
FOR SELECT
TO authenticated
USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
);

CREATE POLICY "Staff can create DSC certificates"
ON public.dsc_certificates
FOR INSERT
TO authenticated
WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
);

CREATE POLICY "Staff can update DSC certificates they manage"
ON public.dsc_certificates
FOR UPDATE
TO authenticated
USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
    AND (
        contact_person_id = auth.uid()
        OR public.is_current_user_admin()
    )
)
WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
    AND (
        contact_person_id = auth.uid()
        OR public.is_current_user_admin()
    )
);

-- Client Policy: Can only view their own DSC certificates
CREATE POLICY "Clients can view their own DSC certificates"
ON public.dsc_certificates
FOR SELECT
TO authenticated
USING (
    certificate_holder_profile_id = auth.uid()
    AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'client'
);
