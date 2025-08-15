-- Add database indexes for performance optimization
-- These indexes will speed up frequently queried fields

-- Index for clients table
CREATE INDEX IF NOT EXISTS idx_clients_name ON public.clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_file_no ON public.clients(file_no);
CREATE INDEX IF NOT EXISTS idx_clients_primary_email ON public.clients(primary_email);
CREATE INDEX IF NOT EXISTS idx_clients_working_user_id ON public.clients(working_user_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients(created_at);

-- Index for tasks table
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to_profile_id ON public.tasks(assigned_to_profile_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by_profile_id ON public.tasks(created_by_profile_id);
CREATE INDEX IF NOT EXISTS idx_tasks_client_id ON public.tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON public.tasks(category_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline_date ON public.tasks(deadline_date);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks(created_at);

-- Index for notifications table
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_user_id ON public.notifications(recipient_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON public.notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_notification_type ON public.notifications(notification_type);

-- Index for client_attachments table
CREATE INDEX IF NOT EXISTS idx_client_attachments_client_id ON public.client_attachments(client_id);
CREATE INDEX IF NOT EXISTS idx_client_attachments_uploaded_by ON public.client_attachments(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_client_attachments_created_at ON public.client_attachments(created_at);
CREATE INDEX IF NOT EXISTS idx_client_attachments_document_status ON public.client_attachments(document_status);

-- Index for profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Index for automation_rules table
CREATE INDEX IF NOT EXISTS idx_automation_rules_trigger_type ON public.automation_rules(trigger_type);
CREATE INDEX IF NOT EXISTS idx_automation_rules_is_active ON public.automation_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_automation_rules_created_by ON public.automation_rules(created_by);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON public.tasks(assigned_to_profile_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_client_status ON public.tasks(client_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(recipient_user_id, read_at) WHERE read_at IS NULL;

-- Optimize RLS policy performance with function-based indexes
CREATE INDEX IF NOT EXISTS idx_clients_portal_user ON public.clients(primary_portal_user_profile_id) WHERE primary_portal_user_profile_id IS NOT NULL;