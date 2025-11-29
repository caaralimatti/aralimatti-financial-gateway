-- Fix: Function Search Path Mutable
-- Add SET search_path to all SECURITY DEFINER functions to prevent search path manipulation attacks

-- Fix check_task_deadlines_for_automation
CREATE OR REPLACE FUNCTION public.check_task_deadlines_for_automation()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
    task_record RECORD;
    rule_record RECORD;
    days_before integer;
    event_data jsonb;
BEGIN
    FOR rule_record IN 
        SELECT * FROM public.automation_rules 
        WHERE trigger_type = 'task_deadline_approaching'
        AND is_active = true
        AND (max_executions IS NULL OR execution_count < max_executions)
    LOOP
        days_before := COALESCE((rule_record.trigger_conditions->>'days_before')::integer, 1);
        
        FOR task_record IN
            SELECT t.*, c.name as client_name, p.full_name as assigned_to_name
            FROM public.tasks t
            LEFT JOIN public.clients c ON t.client_id = c.id
            LEFT JOIN public.profiles p ON t.assigned_to_profile_id = p.id
            WHERE t.deadline_date = CURRENT_DATE + days_before
            AND t.status NOT IN ('completed', 'cancelled')
        LOOP
            event_data := jsonb_build_object(
                'task_id', task_record.id,
                'task_title', task_record.title,
                'deadline_date', task_record.deadline_date,
                'assigned_to_profile_id', task_record.assigned_to_profile_id,
                'client_id', task_record.client_id,
                'days_before', days_before
            );
            
            PERFORM public.execute_automation_rule('task_deadline_approaching', event_data);
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Completed task deadline automation check';
END;
$function$;

-- Fix cleanup_expired_temp_passwords
CREATE OR REPLACE FUNCTION public.cleanup_expired_temp_passwords()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  UPDATE public.profiles 
  SET temporary_password_hash = NULL, 
      temp_password_expires_at = NULL
  WHERE temp_password_expires_at < NOW();
END;
$function$;

-- Fix create_notification
CREATE OR REPLACE FUNCTION public.create_notification(p_recipient_user_id uuid, p_title text, p_message text, p_notification_type text, p_link text DEFAULT NULL::text, p_metadata jsonb DEFAULT NULL::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
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
$function$;

-- Fix delete_client_with_portal_user
CREATE OR REPLACE FUNCTION public.delete_client_with_portal_user(client_uuid uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
    portal_user_id uuid;
BEGIN
    SELECT primary_portal_user_profile_id INTO portal_user_id
    FROM public.clients 
    WHERE id = client_uuid;
    
    DELETE FROM public.clients WHERE id = client_uuid;
    
    IF portal_user_id IS NOT NULL THEN
        DELETE FROM public.profiles WHERE id = portal_user_id AND role = 'client';
    END IF;
    
    RETURN true;
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$function$;

-- Fix execute_automation_rule
CREATE OR REPLACE FUNCTION public.execute_automation_rule(p_trigger_type text, p_event_data jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
    rule_record RECORD;
    action_params jsonb;
    trigger_conditions jsonb;
    condition_met boolean;
    task_name text;
    task_description text;
    notification_title text;
    notification_message text;
    new_task_id uuid;
    client_name text;
    task_title text;
    due_date text;
    assigned_user_id uuid;
    recipient_user_id uuid;
    days_before integer;
    current_task_due_date date;
BEGIN
    RAISE NOTICE 'Executing automation rules for trigger: %, event: %', p_trigger_type, p_event_data;
    
    FOR rule_record IN 
        SELECT * FROM public.automation_rules 
        WHERE trigger_type = p_trigger_type::automation_trigger_type 
        AND is_active = true
        AND (max_executions IS NULL OR execution_count < max_executions)
        ORDER BY priority DESC
    LOOP
        condition_met := true;
        trigger_conditions := COALESCE(rule_record.trigger_conditions, '{}'::jsonb);
        
        CASE p_trigger_type
            WHEN 'task_status_changed' THEN
                IF trigger_conditions ? 'from_status' AND 
                   trigger_conditions->>'from_status' != p_event_data->>'old_status' THEN
                    condition_met := false;
                END IF;
                
                IF trigger_conditions ? 'to_status' AND 
                   trigger_conditions->>'to_status' != p_event_data->>'new_status' THEN
                    condition_met := false;
                END IF;
                
            WHEN 'task_deadline_approaching' THEN
                IF trigger_conditions ? 'days_before' THEN
                    days_before := (trigger_conditions->>'days_before')::integer;
                    current_task_due_date := (p_event_data->>'deadline_date')::date;
                    
                    IF current_task_due_date - CURRENT_DATE != days_before THEN
                        condition_met := false;
                    END IF;
                END IF;
                
            WHEN 'client_created' THEN
                NULL;
                
            ELSE
                NULL;
        END CASE;
        
        IF condition_met THEN
            action_params := COALESCE(rule_record.action_parameters, '{}'::jsonb);
            
            IF p_event_data ? 'client_id' THEN
                SELECT name INTO client_name 
                FROM public.clients 
                WHERE id = (p_event_data->>'client_id')::uuid;
            END IF;
            
            IF p_event_data ? 'task_id' THEN
                SELECT title INTO task_title 
                FROM public.tasks 
                WHERE id = (p_event_data->>'task_id')::uuid;
            END IF;
            
            IF p_event_data ? 'deadline_date' THEN
                due_date := to_char((p_event_data->>'deadline_date')::date, 'MM/DD/YYYY');
            END IF;
            
            CASE rule_record.action_type
                WHEN 'create_task' THEN
                    task_name := COALESCE(action_params->>'task_name', 'Automated Task');
                    task_name := replace(task_name, '{{client_name}}', COALESCE(client_name, 'Unknown Client'));
                    task_name := replace(task_name, '{{trigger_date}}', CURRENT_DATE::text);
                    
                    task_description := COALESCE(action_params->>'task_description', 'Automatically created task');
                    task_description := replace(task_description, '{{client_name}}', COALESCE(client_name, 'Unknown Client'));
                    task_description := replace(task_description, '{{task_name}}', COALESCE(task_title, 'Task'));
                    task_description := replace(task_description, '{{trigger_date}}', CURRENT_DATE::text);
                    
                    CASE action_params->>'assign_to'
                        WHEN 'admin' THEN
                            SELECT id INTO assigned_user_id 
                            FROM public.profiles 
                            WHERE role = 'admin' 
                            ORDER BY created_at 
                            LIMIT 1;
                        WHEN 'client_assigned_staff' THEN
                            IF p_event_data ? 'client_id' THEN
                                SELECT working_user_id INTO assigned_user_id 
                                FROM public.clients 
                                WHERE id = (p_event_data->>'client_id')::uuid;
                            END IF;
                        ELSE
                            SELECT id INTO assigned_user_id 
                            FROM public.profiles 
                            WHERE role = 'admin' 
                            ORDER BY created_at 
                            LIMIT 1;
                    END CASE;
                    
                    IF NOT EXISTS (SELECT 1 FROM public.task_categories LIMIT 1) THEN
                        INSERT INTO public.task_categories (name, created_by_profile_id)
                        VALUES ('Automated Tasks', assigned_user_id);
                    END IF;
                    
                    INSERT INTO public.tasks (
                        title,
                        description,
                        category_id,
                        priority,
                        status,
                        assigned_to_profile_id,
                        created_by_profile_id,
                        deadline_date,
                        client_id,
                        is_billable
                    ) VALUES (
                        task_name,
                        task_description,
                        (SELECT id FROM public.task_categories LIMIT 1),
                        'medium',
                        'to_do',
                        assigned_user_id,
                        assigned_user_id,
                        CASE 
                            WHEN action_params ? 'due_date_offset' THEN
                                CURRENT_DATE + (action_params->>'due_date_offset')::integer
                            ELSE
                                CURRENT_DATE + 7
                        END,
                        CASE 
                            WHEN p_event_data ? 'client_id' THEN
                                (p_event_data->>'client_id')::uuid
                            ELSE
                                NULL
                        END,
                        false
                    ) RETURNING id INTO new_task_id;
                    
                    RAISE NOTICE 'Created task % for rule %', new_task_id, rule_record.id;
                    
                WHEN 'create_notification' THEN
                    notification_title := COALESCE(action_params->>'title', 'Automated Notification');
                    notification_title := replace(notification_title, '{{client_name}}', COALESCE(client_name, 'Unknown Client'));
                    notification_title := replace(notification_title, '{{task_name}}', COALESCE(task_title, 'Task'));
                    
                    notification_message := COALESCE(action_params->>'message', 'Automated notification message');
                    notification_message := replace(notification_message, '{{client_name}}', COALESCE(client_name, 'Unknown Client'));
                    notification_message := replace(notification_message, '{{task_name}}', COALESCE(task_title, 'Task'));
                    notification_message := replace(notification_message, '{{due_date}}', COALESCE(due_date, 'Unknown Date'));
                    
                    CASE action_params->>'recipient'
                        WHEN 'client' THEN
                            IF p_event_data ? 'client_id' THEN
                                SELECT primary_portal_user_profile_id INTO recipient_user_id 
                                FROM public.clients 
                                WHERE id = (p_event_data->>'client_id')::uuid;
                            END IF;
                        WHEN 'assigned_staff' THEN
                            IF p_event_data ? 'assigned_to_profile_id' THEN
                                recipient_user_id := (p_event_data->>'assigned_to_profile_id')::uuid;
                            ELSIF p_event_data ? 'client_id' THEN
                                SELECT working_user_id INTO recipient_user_id 
                                FROM public.clients 
                                WHERE id = (p_event_data->>'client_id')::uuid;
                            END IF;
                        WHEN 'admin' THEN
                            SELECT id INTO recipient_user_id 
                            FROM public.profiles 
                            WHERE role = 'admin' 
                            ORDER BY created_at 
                            LIMIT 1;
                        ELSE
                            SELECT id INTO recipient_user_id 
                            FROM public.profiles 
                            WHERE role = 'admin' 
                            ORDER BY created_at 
                            LIMIT 1;
                    END CASE;
                    
                    IF recipient_user_id IS NOT NULL THEN
                        INSERT INTO public.notifications (
                            recipient_user_id,
                            title,
                            message,
                            notification_type,
                            metadata
                        ) VALUES (
                            recipient_user_id,
                            notification_title,
                            notification_message,
                            'automation',
                            jsonb_build_object(
                                'rule_id', rule_record.id,
                                'trigger_type', p_trigger_type,
                                'event_data', p_event_data
                            )
                        );
                        
                        RAISE NOTICE 'Created notification for user % from rule %', recipient_user_id, rule_record.id;
                    END IF;
                    
                WHEN 'update_task_status' THEN
                    IF p_event_data ? 'task_id' AND action_params ? 'new_status' THEN
                        UPDATE public.tasks 
                        SET status = (action_params->>'new_status')::text,
                            updated_at = now()
                        WHERE id = (p_event_data->>'task_id')::uuid;
                        
                        RAISE NOTICE 'Updated task % status to % from rule %', 
                            p_event_data->>'task_id', action_params->>'new_status', rule_record.id;
                    END IF;
                    
                ELSE
                    RAISE NOTICE 'Action type % not implemented yet', rule_record.action_type;
            END CASE;
            
            UPDATE public.automation_rules 
            SET execution_count = execution_count + 1,
                last_executed_at = now()
            WHERE id = rule_record.id;
            
        END IF;
    END LOOP;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error executing automation rule: %', SQLERRM;
END;
$function$;

-- Fix generate_invoice_number
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
 RETURNS text
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
    next_number INTEGER;
    invoice_number TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.invoices
    WHERE invoice_number ~ '^INV-[0-9]+$';
    
    invoice_number := 'INV-' || LPAD(next_number::TEXT, 6, '0');
    
    RETURN invoice_number;
END;
$function$;

-- Fix handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        CASE 
            WHEN NEW.raw_user_meta_data->>'role' = 'super_admin' THEN 'super_admin'::public.user_role
            WHEN NEW.raw_user_meta_data->>'role' = 'admin' THEN 'admin'::public.user_role
            WHEN NEW.raw_user_meta_data->>'role' = 'staff' THEN 'staff'::public.user_role
            ELSE 'client'::public.user_role
        END
    );
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$function$;

-- Fix is_current_user_admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN COALESCE((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin', FALSE);
END;
$function$;

-- Fix is_super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN COALESCE((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin', FALSE);
END;
$function$;

-- Fix is_user_active
CREATE OR REPLACE FUNCTION public.is_user_active()
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN COALESCE((SELECT is_active FROM public.profiles WHERE id = auth.uid()), FALSE);
END;
$function$;

-- Fix get_manageable_users
CREATE OR REPLACE FUNCTION public.get_manageable_users()
 RETURNS TABLE(id uuid, email text, full_name text, role user_role, is_active boolean, created_at timestamp with time zone, updated_at timestamp with time zone, last_login_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = public
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

-- Fix notify_document_upload
CREATE OR REPLACE FUNCTION public.notify_document_upload()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  client_profile_id uuid;
  client_name text;
  uploader_name text;
  uploader_role text;
BEGIN
  IF NEW.shared_with_client = true THEN
    SELECT primary_portal_user_profile_id, name 
    INTO client_profile_id, client_name
    FROM public.clients 
    WHERE id = NEW.client_id;
    
    SELECT full_name, role 
    INTO uploader_name, uploader_role
    FROM public.profiles 
    WHERE id = NEW.uploaded_by;
    
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
$function$;

-- Fix notify_new_announcement
CREATE OR REPLACE FUNCTION public.notify_new_announcement()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  user_record RECORD;
BEGIN
  IF NEW.is_active = true THEN
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
$function$;

-- Fix notify_task_status_change
CREATE OR REPLACE FUNCTION public.notify_task_status_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  assigned_user_id uuid;
  client_profile_id uuid;
  task_creator_id uuid;
  assigned_user_name text;
  client_name text;
  task_creator_name text;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    SELECT id, full_name INTO assigned_user_id, assigned_user_name
    FROM public.profiles 
    WHERE id = NEW.assigned_to_profile_id;
    
    SELECT id, full_name INTO task_creator_id, task_creator_name
    FROM public.profiles 
    WHERE id = NEW.created_by_profile_id;
    
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
$function$;

-- Fix trigger_client_created
CREATE OR REPLACE FUNCTION public.trigger_client_created()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
    event_data jsonb;
BEGIN
    event_data := jsonb_build_object(
        'client_id', NEW.id,
        'client_name', NEW.name,
        'client_type', NEW.client_type,
        'created_by', NEW.created_by,
        'working_user_id', NEW.working_user_id
    );
    
    PERFORM public.execute_automation_rule('client_created', event_data);
    
    RETURN NEW;
END;
$function$;

-- Fix trigger_task_status_changed
CREATE OR REPLACE FUNCTION public.trigger_task_status_changed()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
    event_data jsonb;
    client_name text;
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        IF NEW.client_id IS NOT NULL THEN
            SELECT name INTO client_name FROM public.clients WHERE id = NEW.client_id;
        END IF;
        
        event_data := jsonb_build_object(
            'task_id', NEW.id,
            'task_title', NEW.title,
            'old_status', OLD.status,
            'new_status', NEW.status,
            'assigned_to_profile_id', NEW.assigned_to_profile_id,
            'client_id', NEW.client_id,
            'client_name', client_name,
            'deadline_date', NEW.deadline_date
        );
        
        PERFORM public.execute_automation_rule('task_status_changed', event_data);
    END IF;
    
    RETURN NEW;
END;
$function$;