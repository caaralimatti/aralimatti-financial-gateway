
-- Create compliance_deadlines table
CREATE TABLE public.compliance_deadlines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deadline_date DATE NOT NULL,
  compliance_type TEXT NOT NULL,
  form_activity TEXT,
  description TEXT,
  relevant_fy_ay TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(deadline_date, compliance_type, form_activity)
);

-- Add trigger for updated_at
CREATE TRIGGER update_compliance_deadlines_updated_at 
  BEFORE UPDATE ON public.compliance_deadlines 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.compliance_deadlines ENABLE ROW LEVEL SECURITY;

-- Admin Policy: Full access for admins
CREATE POLICY "Admins can manage all compliance deadlines" 
ON public.compliance_deadlines 
FOR ALL 
USING (is_current_user_admin());

-- Staff Policy: Can view all compliance deadlines
CREATE POLICY "Staff can view compliance deadlines" 
ON public.compliance_deadlines 
FOR SELECT 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff');

-- Fix existing tasks RLS policies if they don't exist
DO $$
BEGIN
  -- Check if RLS is enabled on tasks table
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'tasks' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create tasks RLS policies (will not error if they already exist)
DO $$
BEGIN
  -- Admin Policy for tasks
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'tasks' 
    AND policyname = 'Admins can manage all tasks'
  ) THEN
    CREATE POLICY "Admins can manage all tasks" 
    ON public.tasks 
    FOR ALL 
    USING (is_current_user_admin());
  END IF;

  -- Staff Policy for viewing assigned tasks
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'tasks' 
    AND policyname = 'Staff can view assigned tasks'
  ) THEN
    CREATE POLICY "Staff can view assigned tasks" 
    ON public.tasks 
    FOR SELECT 
    USING (
      (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
      AND assigned_to_profile_id = auth.uid()
    );
  END IF;

  -- Staff Policy for updating assigned tasks
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'tasks' 
    AND policyname = 'Staff can update assigned tasks'
  ) THEN
    CREATE POLICY "Staff can update assigned tasks" 
    ON public.tasks 
    FOR UPDATE 
    USING (
      (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
      AND assigned_to_profile_id = auth.uid()
    );
  END IF;

  -- Client Policy for viewing their tasks
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'tasks' 
    AND policyname = 'Clients can view their tasks'
  ) THEN
    CREATE POLICY "Clients can view their tasks" 
    ON public.tasks 
    FOR SELECT 
    USING (
      (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'client'
      AND assigned_to_profile_id = auth.uid()
    );
  END IF;
END $$;
