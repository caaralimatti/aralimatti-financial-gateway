
-- Create staff_client_assignments table for many-to-many relationship
CREATE TABLE public.staff_client_assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  assigned_by uuid NOT NULL REFERENCES public.profiles(id),
  assigned_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(staff_profile_id, client_id)
);

-- Enable RLS on staff_client_assignments
ALTER TABLE public.staff_client_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for staff_client_assignments

-- 1. Admins and super_admins can manage all assignments
CREATE POLICY admin_manage_staff_assignments ON public.staff_client_assignments
FOR ALL TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
)
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
);

-- 2. Staff can only SELECT their own assignments (to see their assigned clients)
CREATE POLICY staff_view_own_assignments ON public.staff_client_assignments
FOR SELECT TO authenticated
USING (
  staff_profile_id = auth.uid() 
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
);

-- Update the existing clients RLS to use the new assignment table
-- First, let's update the working_user_id approach to use the new assignment system
-- We'll keep working_user_id for backward compatibility but also support the new system

-- Create a helper function to check if a staff member is assigned to a client
CREATE OR REPLACE FUNCTION public.is_staff_assigned_to_client(staff_id uuid, client_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff_client_assignments 
    WHERE staff_profile_id = staff_id AND client_id = client_id
  ) OR EXISTS (
    SELECT 1 FROM public.clients 
    WHERE id = client_id AND working_user_id = staff_id
  );
$$;

-- Update the existing staff RLS policies on client_attachments to use the new assignment system
DROP POLICY IF EXISTS staff_select_client_docs ON public.client_attachments;
DROP POLICY IF EXISTS staff_insert_client_docs ON public.client_attachments;
DROP POLICY IF EXISTS staff_update_client_docs ON public.client_attachments;
DROP POLICY IF EXISTS staff_delete_client_docs ON public.client_attachments;

-- Updated staff policies using the new assignment function
CREATE POLICY staff_select_client_docs ON public.client_attachments
FOR SELECT TO authenticated
USING (
  public.is_staff_assigned_to_client(auth.uid(), client_id)
  AND (
    uploaded_by_role = 'staff' OR shared_with_client IS TRUE
  )
  AND (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
  )
);

CREATE POLICY staff_insert_client_docs ON public.client_attachments
FOR INSERT TO authenticated
WITH CHECK (
  public.is_staff_assigned_to_client(auth.uid(), client_id)
  AND uploaded_by_role = 'staff'
  AND uploaded_by = auth.uid()
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
);

CREATE POLICY staff_update_client_docs ON public.client_attachments
FOR UPDATE TO authenticated
USING (
  public.is_staff_assigned_to_client(auth.uid(), client_id)
  AND uploaded_by_role = 'staff'
  AND uploaded_by = auth.uid()
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
);

CREATE POLICY staff_delete_client_docs ON public.client_attachments
FOR DELETE TO authenticated
USING (
  public.is_staff_assigned_to_client(auth.uid(), client_id)
  AND uploaded_by_role = 'staff'
  AND uploaded_by = auth.uid()
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
);
