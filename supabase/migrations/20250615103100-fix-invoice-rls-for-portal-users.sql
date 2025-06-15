
-- Update RLS policy for clients to view their invoices via portal user
DROP POLICY IF EXISTS "Clients can view their own invoices" ON public.invoices;

CREATE POLICY "Clients can view their own invoices" ON public.invoices
    FOR SELECT USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'client' AND
        client_id IN (
            SELECT id FROM public.clients 
            WHERE working_user_id = auth.uid() 
               OR primary_portal_user_profile_id = auth.uid()
        )
    );
