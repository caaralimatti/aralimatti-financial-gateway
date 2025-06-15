
-- 1. Ensure RLS is enabled
ALTER TABLE public.client_attachments ENABLE ROW LEVEL SECURITY;

-- 2. Drop old staff policies if needed (PLACEHOLDER: will not error if none exist)
DROP POLICY IF EXISTS staff_select_client_docs ON public.client_attachments;
DROP POLICY IF EXISTS staff_insert_client_docs ON public.client_attachments;
DROP POLICY IF EXISTS staff_update_client_docs ON public.client_attachments;
DROP POLICY IF EXISTS staff_delete_client_docs ON public.client_attachments;

-- 3. Staff may SELECT attachments only for assigned clients and where allowed:
CREATE POLICY staff_select_client_docs ON public.client_attachments
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.clients
    WHERE clients.id = client_attachments.client_id
      AND clients.working_user_id = auth.uid()
  )
  AND (
    uploaded_by_role = 'staff' OR shared_with_client IS TRUE
  )
  AND (
    -- Only staff, not admin or super_admin; check via profiles
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
  )
);

-- 4. Staff may INSERT only for assigned clients, must set uploaded_by and role
CREATE POLICY staff_insert_client_docs ON public.client_attachments
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.clients
    WHERE clients.id = client_attachments.client_id
      AND clients.working_user_id = auth.uid()
  )
  AND uploaded_by_role = 'staff'
  AND uploaded_by = auth.uid()
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
);

-- 5. Staff may UPDATE only their own docs for assigned clients
CREATE POLICY staff_update_client_docs ON public.client_attachments
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.clients
    WHERE clients.id = client_attachments.client_id
      AND clients.working_user_id = auth.uid()
  )
  AND uploaded_by_role = 'staff'
  AND uploaded_by = auth.uid()
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
);

-- 6. Staff may DELETE only their own docs for assigned clients
CREATE POLICY staff_delete_client_docs ON public.client_attachments
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.clients
    WHERE clients.id = client_attachments.client_id
      AND clients.working_user_id = auth.uid()
  )
  AND uploaded_by_role = 'staff'
  AND uploaded_by = auth.uid()
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
);
