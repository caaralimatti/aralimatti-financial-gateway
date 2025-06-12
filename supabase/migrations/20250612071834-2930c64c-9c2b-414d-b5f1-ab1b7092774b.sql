
-- Create system_settings table for configurable application settings
CREATE TABLE public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_activity_log table for tracking admin actions
CREATE TABLE public.admin_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  metadata JSONB
);

-- Enable RLS on system_settings (admin only access)
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage system settings
CREATE POLICY "Allow admins full access to system settings" 
ON public.system_settings FOR ALL 
USING (public.is_current_user_admin());

-- Enable RLS on admin_activity_log (admin read access)
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to read activity logs
CREATE POLICY "Allow admins to read activity logs" 
ON public.admin_activity_log FOR SELECT 
USING (public.is_current_user_admin());

-- Create policy for the system to insert activity logs
CREATE POLICY "Allow system to insert activity logs" 
ON public.admin_activity_log FOR INSERT 
WITH CHECK (true);

-- Create trigger for updating system_settings updated_at
CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON public.system_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default system settings
INSERT INTO public.system_settings (key, value, description) VALUES
('site_name', '"Admin Portal"', 'The name of the application'),
('contact_email', '"admin@example.com"', 'Primary contact email for the application'),
('new_user_default_role', '"client"', 'Default role assigned to new users'),
('password_min_length', '8', 'Minimum password length requirement'),
('session_timeout_hours', '24', 'Session timeout duration in hours'),
('user_registration_enabled', 'true', 'Whether new user registration is enabled'),
('email_notifications_enabled', 'true', 'Whether email notifications are enabled'),
('default_task_priority', '"medium"', 'Default priority for new tasks')
ON CONFLICT (key) DO NOTHING;
