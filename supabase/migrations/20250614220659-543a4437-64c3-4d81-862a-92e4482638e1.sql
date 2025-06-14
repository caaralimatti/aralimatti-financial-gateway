
-- Create the admin_module_permissions table
CREATE TABLE public.admin_module_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    module_name TEXT NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT admin_module_permissions_unique_per_admin UNIQUE (admin_profile_id, module_name)
);

-- Enable Row Level Security
ALTER TABLE public.admin_module_permissions ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Super Admin: Full access to all permissions
CREATE POLICY "Super admins can manage all admin permissions" 
ON public.admin_module_permissions 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'super_admin'
    )
);

-- Admin: Can only view their own permissions
CREATE POLICY "Admins can view their own permissions" 
ON public.admin_module_permissions 
FOR SELECT 
USING (
    admin_profile_id = auth.uid() AND
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Populate initial data for existing admin users
INSERT INTO public.admin_module_permissions (admin_profile_id, module_name, is_enabled)
SELECT 
    p.id as admin_profile_id,
    module.name as module_name,
    true as is_enabled
FROM public.profiles p
CROSS JOIN (
    VALUES 
        ('user_management'),
        ('system_settings'),
        ('client_management_parent'),
        ('client_management_list'),
        ('client_management_add'),
        ('client_management_import'),
        ('client_management_bulk_edit'),
        ('task_management_parent'),
        ('task_management_overview'),
        ('task_management_calendar'),
        ('task_management_categories'),
        ('task_management_settings'),
        ('compliance_management'),
        ('announcements'),
        ('admin_activity_log'),
        ('dsc_management'),
        ('analytics'),
        ('billing_parent'),
        ('billing_invoices_list'),
        ('billing_time_tracking')
) AS module(name)
WHERE p.role = 'admin'
ON CONFLICT (admin_profile_id, module_name) DO NOTHING;

-- Create updated_at trigger
CREATE TRIGGER update_admin_module_permissions_updated_at
    BEFORE UPDATE ON public.admin_module_permissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
