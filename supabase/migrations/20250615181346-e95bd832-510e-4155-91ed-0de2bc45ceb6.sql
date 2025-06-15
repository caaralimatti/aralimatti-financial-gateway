
-- Trigger function for document upload notifications
CREATE OR REPLACE FUNCTION notify_document_upload() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
DECLARE
  client_profile_id uuid;
  client_name text;
  uploader_name text;
  uploader_role text;
BEGIN
  -- Only notify for new documents that are shared with client
  IF NEW.shared_with_client = true THEN
    -- Get client's profile ID
    SELECT primary_portal_user_profile_id, name 
    INTO client_profile_id, client_name
    FROM public.clients 
    WHERE id = NEW.client_id;
    
    -- Get uploader details
    SELECT full_name, role 
    INTO uploader_name, uploader_role
    FROM public.profiles 
    WHERE id = NEW.uploaded_by;
    
    -- Only notify if client has a portal user
    IF client_profile_id IS NOT NULL THEN
      PERFORM public.create_notification(
        client_profile_id,
        'New Document Available',
        CASE 
          WHEN uploader_role = 'admin' THEN 'An administrator has uploaded a new document: ' || COALESCE(NEW.description, NEW.file_name)
          WHEN uploader_role = 'staff' THEN COALESCE(uploader_name, 'A staff member') || ' has uploaded a new document: ' || COALESCE(NEW.description, NEW.file_name)
          ELSE 'A new document has been uploaded: ' || COALESCE(NEW.description, NEW.file_name)
        END,
        'document_upload',
        '/documents',
        jsonb_build_object(
          'document_id', NEW.id,
          'client_id', NEW.client_id,
          'file_name', NEW.file_name,
          'uploaded_by', NEW.uploaded_by,
          'uploaded_by_role', NEW.uploaded_by_role
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for document uploads
DROP TRIGGER IF EXISTS trigger_notify_document_upload ON public.client_attachments;
CREATE TRIGGER trigger_notify_document_upload
  AFTER INSERT ON public.client_attachments
  FOR EACH ROW
  EXECUTE FUNCTION notify_document_upload();

-- Trigger function for task status changes
CREATE OR REPLACE FUNCTION notify_task_status_change() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
DECLARE
  assigned_user_id uuid;
  client_profile_id uuid;
  task_creator_id uuid;
  assigned_user_name text;
  client_name text;
  task_creator_name text;
BEGIN
  -- Only notify on status changes, not new tasks
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Get assigned user details
    SELECT id, full_name INTO assigned_user_id, assigned_user_name
    FROM public.profiles 
    WHERE id = NEW.assigned_to_profile_id;
    
    -- Get task creator details
    SELECT id, full_name INTO task_creator_id, task_creator_name
    FROM public.profiles 
    WHERE id = NEW.created_by_profile_id;
    
    -- Notify assigned user (if not the one making the change)
    IF assigned_user_id != auth.uid() THEN
      PERFORM public.create_notification(
        assigned_user_id,
        'Task Status Updated',
        'Task "' || NEW.title || '" status changed to: ' || NEW.status,
        'task_status_change',
        '/tasks',
        jsonb_build_object(
          'task_id', NEW.id,
          'old_status', OLD.status,
          'new_status', NEW.status,
          'client_id', NEW.client_id
        )
      );
    END IF;
    
    -- If task has a client, notify the client's portal user
    IF NEW.client_id IS NOT NULL THEN
      SELECT primary_portal_user_profile_id, name 
      INTO client_profile_id, client_name
      FROM public.clients 
      WHERE id = NEW.client_id;
      
      IF client_profile_id IS NOT NULL AND client_profile_id != auth.uid() THEN
        PERFORM public.create_notification(
          client_profile_id,
          'Task Status Updated',
          'Your task "' || NEW.title || '" status changed to: ' || NEW.status,
          'task_status_change',
          '/tasks',
          jsonb_build_object(
            'task_id', NEW.id,
            'old_status', OLD.status,
            'new_status', NEW.status,
            'client_id', NEW.client_id
          )
        );
      END IF;
    END IF;
    
    -- Notify task creator (if different from assigned user and current user)
    IF task_creator_id != assigned_user_id AND task_creator_id != auth.uid() THEN
      PERFORM public.create_notification(
        task_creator_id,
        'Task Status Updated',
        'Task "' || NEW.title || '" status changed to: ' || NEW.status,
        'task_status_change',
        '/tasks',
        jsonb_build_object(
          'task_id', NEW.id,
          'old_status', OLD.status,
          'new_status', NEW.status,
          'client_id', NEW.client_id
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for task status changes
DROP TRIGGER IF EXISTS trigger_notify_task_status_change ON public.tasks;
CREATE TRIGGER trigger_notify_task_status_change
  AFTER UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION notify_task_status_change();

-- Trigger function for new announcements
CREATE OR REPLACE FUNCTION notify_new_announcement() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Only notify for active announcements
  IF NEW.is_active = true THEN
    -- Notify based on target audience
    FOR user_record IN 
      SELECT id, role 
      FROM public.profiles 
      WHERE is_active = true
      AND (
        (NEW.target_audience = 'all') OR
        (NEW.target_audience = 'staff_portal' AND role IN ('staff', 'admin', 'super_admin')) OR
        (NEW.target_audience = 'client_portal' AND role = 'client')
      )
    LOOP
      PERFORM public.create_notification(
        user_record.id,
        'New Announcement',
        NEW.title,
        'announcement',
        '/announcements',
        jsonb_build_object(
          'announcement_id', NEW.id,
          'target_audience', NEW.target_audience,
          'priority', NEW.priority
        )
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new announcements
DROP TRIGGER IF EXISTS trigger_notify_new_announcement ON public.announcements;
CREATE TRIGGER trigger_notify_new_announcement
  AFTER INSERT ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_announcement();
