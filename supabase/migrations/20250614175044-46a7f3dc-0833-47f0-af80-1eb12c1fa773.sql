
-- Create a system setting to store the super admin credentials hash
INSERT INTO system_settings (key, value, description) 
VALUES (
  'super_admin_credentials', 
  '{"username": "superadmin", "password_hash": "$2b$10$example_hash_here"}',
  'Super admin login credentials (hashed)'
) ON CONFLICT (key) DO NOTHING;

-- Create enhanced audit logging table for super admin actions
CREATE TABLE public.super_admin_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  super_admin_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  target_resource TEXT,
  target_id UUID,
  description TEXT NOT NULL,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on super admin audit log (only super admins can view)
ALTER TABLE public.super_admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policy for super admin audit log access
CREATE POLICY "Super admins can view audit logs" 
ON public.super_admin_audit_log 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);

-- Add trigger for updated_at on super admin audit log
CREATE TRIGGER update_super_admin_audit_log_updated_at
  BEFORE UPDATE ON public.super_admin_audit_log
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $function$
BEGIN
  RETURN COALESCE((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin', FALSE);
END;
$function$;

-- Create function to exclude super admins from regular user queries
CREATE OR REPLACE FUNCTION public.get_manageable_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  role user_role,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  last_login_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.is_active,
    p.created_at,
    p.updated_at,
    p.last_login_at
  FROM public.profiles p
  WHERE p.role != 'super_admin'
  ORDER BY p.created_at DESC;
END;
$function$;
