
-- Drop the existing staff DELETE policy that has the security vulnerability
DROP POLICY IF EXISTS staff_delete_client_docs ON public.client_attachments;

-- Create a new, secure DELETE policy for staff that explicitly prevents deleting admin documents
CREATE POLICY staff_delete_client_docs ON public.client_attachments
FOR DELETE TO authenticated
USING (
  -- Staff can only delete documents for their assigned clients
  public.is_staff_assigned_to_client(auth.uid(), client_id)
  -- AND they must be staff role
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
  -- AND they can ONLY delete documents they uploaded themselves (not admin documents)
  AND uploaded_by = auth.uid()
  -- AND the document must have been uploaded by staff role (double security check)
  AND uploaded_by_role = 'staff'
);

-- Drop and recreate the admin DELETE policy to ensure it's properly configured
DROP POLICY IF EXISTS admin_delete_client_docs ON public.client_attachments;

-- Create admin/super_admin DELETE policy
CREATE POLICY admin_delete_client_docs ON public.client_attachments
FOR DELETE TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
);
