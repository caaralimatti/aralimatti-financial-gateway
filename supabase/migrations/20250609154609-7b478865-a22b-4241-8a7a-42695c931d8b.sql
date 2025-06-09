
-- Add is_active column to profiles table
ALTER TABLE public.profiles ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- Create a security definer function to check if current user is active
CREATE OR REPLACE FUNCTION public.is_user_active()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE((SELECT is_active FROM public.profiles WHERE id = auth.uid()), FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create a security definer function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin', FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Update profiles RLS policies
DROP POLICY IF EXISTS "Allow authenticated users to read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow admins full access to profiles" ON public.profiles;

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile only if they are active
CREATE POLICY "Allow active users to read their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id AND is_active = TRUE);

-- Allow admins full access to all profiles
CREATE POLICY "Allow admins full access to profiles" 
ON public.profiles FOR ALL 
USING (public.is_current_user_admin());

-- Update other tables to enforce active user requirement
-- Update clients table policies
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow active users to access clients" ON public.clients;
CREATE POLICY "Allow active users to access clients" 
ON public.clients FOR ALL 
USING (public.is_user_active() AND (public.is_current_user_admin() OR created_by = auth.uid()));

-- Update tasks table policies  
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow active users to access tasks" ON public.tasks;
CREATE POLICY "Allow active users to access tasks" 
ON public.tasks FOR ALL 
USING (public.is_user_active() AND (public.is_current_user_admin() OR assigned_to_profile_id = auth.uid() OR created_by_profile_id = auth.uid()));

-- Update client_attachments table policies
ALTER TABLE public.client_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow active users to access client attachments" ON public.client_attachments;
CREATE POLICY "Allow active users to access client attachments" 
ON public.client_attachments FOR ALL 
USING (public.is_user_active() AND (public.is_current_user_admin() OR uploaded_by = auth.uid()));

-- Update task_attachments table policies
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow active users to access task attachments" ON public.task_attachments;
CREATE POLICY "Allow active users to access task attachments" 
ON public.task_attachments FOR ALL 
USING (public.is_user_active() AND (public.is_current_user_admin() OR uploaded_by_profile_id = auth.uid()));

-- Update other related tables
ALTER TABLE public.client_contact_persons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow active users to access contact persons" ON public.client_contact_persons;
CREATE POLICY "Allow active users to access contact persons" 
ON public.client_contact_persons FOR ALL 
USING (public.is_user_active() AND public.is_current_user_admin());

ALTER TABLE public.client_groups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow active users to access client groups" ON public.client_groups;
CREATE POLICY "Allow active users to access client groups" 
ON public.client_groups FOR ALL 
USING (public.is_user_active() AND (public.is_current_user_admin() OR created_by = auth.uid()));

ALTER TABLE public.task_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow active users to access task categories" ON public.task_categories;
CREATE POLICY "Allow active users to access task categories" 
ON public.task_categories FOR ALL 
USING (public.is_user_active());

ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow active users to access task comments" ON public.task_comments;
CREATE POLICY "Allow active users to access task comments" 
ON public.task_comments FOR ALL 
USING (public.is_user_active() AND (public.is_current_user_admin() OR commented_by_profile_id = auth.uid()));

ALTER TABLE public.sub_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow active users to access sub tasks" ON public.sub_tasks;
CREATE POLICY "Allow active users to access sub tasks" 
ON public.sub_tasks FOR ALL 
USING (public.is_user_active());
