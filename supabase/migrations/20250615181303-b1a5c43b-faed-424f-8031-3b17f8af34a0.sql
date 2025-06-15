
-- Create notifications table
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  notification_type text NOT NULL, -- 'document_upload', 'task_status_change', 'announcement', 'invoice_status_change', 'task_due_soon', etc.
  link text, -- Optional URL to navigate to when notification is clicked
  read_at timestamp with time zone, -- NULL = unread, NOT NULL = read
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  metadata jsonb -- Additional data related to the notification (e.g., document_id, task_id, etc.)
);

-- Create index for better performance on queries
CREATE INDEX idx_notifications_recipient_user_id ON public.notifications(recipient_user_id);
CREATE INDEX idx_notifications_read_at ON public.notifications(read_at);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON public.notifications(notification_type);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only SELECT their own notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
TO authenticated
USING (recipient_user_id = auth.uid());

-- RLS Policy: Users can only UPDATE their own notifications (for marking as read)
CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
TO authenticated
USING (recipient_user_id = auth.uid())
WITH CHECK (recipient_user_id = auth.uid());

-- RLS Policy: Users can only DELETE their own notifications
CREATE POLICY "Users can delete their own notifications" 
ON public.notifications 
FOR DELETE 
TO authenticated
USING (recipient_user_id = auth.uid());

-- RLS Policy: Only service role and specific functions can INSERT notifications
-- This prevents users from creating arbitrary notifications for others
CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Allow service role to insert
  auth.jwt() ->> 'role' = 'service_role'
  -- Or allow specific functions via function context
  OR current_setting('request.jwt.claims', true)::json ->> 'role' = 'service_role'
);

-- Create a helper function to create notifications (will be used by triggers)
CREATE OR REPLACE FUNCTION public.create_notification(
  p_recipient_user_id uuid,
  p_title text,
  p_message text,
  p_notification_type text,
  p_link text DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO public.notifications (
    recipient_user_id,
    title,
    message,
    notification_type,
    link,
    metadata
  ) VALUES (
    p_recipient_user_id,
    p_title,
    p_message,
    p_notification_type,
    p_link,
    p_metadata
  )
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;
