
-- Add ON DELETE CASCADE constraints for proper client deletion
-- First, let's add the cascading constraints for client-related tables

-- Client attachments
ALTER TABLE public.client_attachments 
DROP CONSTRAINT IF EXISTS client_attachments_client_id_fkey,
ADD CONSTRAINT client_attachments_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

-- Client contact persons
ALTER TABLE public.client_contact_persons 
DROP CONSTRAINT IF EXISTS client_contact_persons_client_id_fkey,
ADD CONSTRAINT client_contact_persons_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

-- Client custom fields
ALTER TABLE public.client_custom_fields 
DROP CONSTRAINT IF EXISTS client_custom_fields_client_id_fkey,
ADD CONSTRAINT client_custom_fields_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

-- Client group memberships
ALTER TABLE public.client_group_memberships 
DROP CONSTRAINT IF EXISTS client_group_memberships_client_id_fkey,
ADD CONSTRAINT client_group_memberships_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

-- Client IT returns
ALTER TABLE public.client_it_returns 
DROP CONSTRAINT IF EXISTS client_it_returns_client_id_fkey,
ADD CONSTRAINT client_it_returns_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

-- Invoices
ALTER TABLE public.invoices 
DROP CONSTRAINT IF EXISTS invoices_client_id_fkey,
ADD CONSTRAINT invoices_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

-- Invoice line items (cascade from invoices)
ALTER TABLE public.invoice_line_items 
DROP CONSTRAINT IF EXISTS invoice_line_items_invoice_id_fkey,
ADD CONSTRAINT invoice_line_items_invoice_id_fkey 
FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;

-- Payments (cascade from invoices)
ALTER TABLE public.payments 
DROP CONSTRAINT IF EXISTS payments_invoice_id_fkey,
ADD CONSTRAINT payments_invoice_id_fkey 
FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;

-- Tasks
ALTER TABLE public.tasks 
DROP CONSTRAINT IF EXISTS tasks_client_id_fkey,
ADD CONSTRAINT tasks_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

-- Sub tasks (cascade from tasks)
ALTER TABLE public.sub_tasks 
DROP CONSTRAINT IF EXISTS sub_tasks_task_id_fkey,
ADD CONSTRAINT sub_tasks_task_id_fkey 
FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;

-- Task attachments (cascade from tasks)
ALTER TABLE public.task_attachments 
DROP CONSTRAINT IF EXISTS task_attachments_task_id_fkey,
ADD CONSTRAINT task_attachments_task_id_fkey 
FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;

-- Task comments (cascade from tasks)
ALTER TABLE public.task_comments 
DROP CONSTRAINT IF EXISTS task_comments_task_id_fkey,
ADD CONSTRAINT task_comments_task_id_fkey 
FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;

-- Time entries (cascade from tasks and clients)
ALTER TABLE public.time_entries 
DROP CONSTRAINT IF EXISTS time_entries_task_id_fkey,
ADD CONSTRAINT time_entries_task_id_fkey 
FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;

ALTER TABLE public.time_entries 
DROP CONSTRAINT IF EXISTS time_entries_client_id_fkey,
ADD CONSTRAINT time_entries_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

-- Client portal user profile deletion
ALTER TABLE public.clients 
DROP CONSTRAINT IF EXISTS clients_primary_portal_user_profile_id_fkey,
ADD CONSTRAINT clients_primary_portal_user_profile_id_fkey 
FOREIGN KEY (primary_portal_user_profile_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Create a function to handle client deletion with portal user cleanup
CREATE OR REPLACE FUNCTION delete_client_with_portal_user(client_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    portal_user_id uuid;
BEGIN
    -- Get the portal user ID before deletion
    SELECT primary_portal_user_profile_id INTO portal_user_id
    FROM public.clients 
    WHERE id = client_uuid;
    
    -- Delete the client (this will cascade to all related records)
    DELETE FROM public.clients WHERE id = client_uuid;
    
    -- If there was a portal user, delete the profile and auth user
    IF portal_user_id IS NOT NULL THEN
        -- Delete from profiles (this should cascade to auth.users via trigger)
        DELETE FROM public.profiles WHERE id = portal_user_id AND role = 'client';
    END IF;
    
    RETURN true;
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$;
