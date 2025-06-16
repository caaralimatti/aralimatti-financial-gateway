
-- Create core automation execution function
CREATE OR REPLACE FUNCTION public.execute_automation_rule(
    p_trigger_type text,
    p_event_data jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
    -- Log the execution attempt
    RAISE NOTICE 'Executing automation rules for trigger: %, event: %', p_trigger_type, p_event_data;
    
    -- Find all active rules matching the trigger type
    FOR rule_record IN 
        SELECT * FROM public.automation_rules 
        WHERE trigger_type = p_trigger_type::automation_trigger_type 
        AND is_active = true
        AND (max_executions IS NULL OR execution_count < max_executions)
        ORDER BY priority DESC
    LOOP
        -- Initialize condition check
        condition_met := true;
        trigger_conditions := COALESCE(rule_record.trigger_conditions, '{}'::jsonb);
        
        -- Evaluate trigger conditions based on trigger type
        CASE p_trigger_type
            WHEN 'task_status_changed' THEN
                -- Check if status change matches condition
                IF trigger_conditions ? 'from_status' AND 
                   trigger_conditions->>'from_status' != p_event_data->>'old_status' THEN
                    condition_met := false;
                END IF;
                
                IF trigger_conditions ? 'to_status' AND 
                   trigger_conditions->>'to_status' != p_event_data->>'new_status' THEN
                    condition_met := false;
                END IF;
                
            WHEN 'task_deadline_approaching' THEN
                -- Check days before deadline condition
                IF trigger_conditions ? 'days_before' THEN
                    days_before := (trigger_conditions->>'days_before')::integer;
                    current_task_due_date := (p_event_data->>'deadline_date')::date;
                    
                    IF current_task_due_date - CURRENT_DATE != days_before THEN
                        condition_met := false;
                    END IF;
                END IF;
                
            WHEN 'client_created' THEN
                -- No specific conditions for client creation yet
                -- Could add client type conditions in the future
                NULL;
                
            ELSE
                -- For other trigger types, assume condition is met
                NULL;
        END CASE;
        
        -- If conditions are met, execute the action
        IF condition_met THEN
            action_params := COALESCE(rule_record.action_parameters, '{}'::jsonb);
            
            -- Get client name for placeholder replacement
            IF p_event_data ? 'client_id' THEN
                SELECT name INTO client_name 
                FROM public.clients 
                WHERE id = (p_event_data->>'client_id')::uuid;
            END IF;
            
            -- Get task title for placeholder replacement
            IF p_event_data ? 'task_id' THEN
                SELECT title INTO task_title 
                FROM public.tasks 
                WHERE id = (p_event_data->>'task_id')::uuid;
            END IF;
            
            -- Format due date for display
            IF p_event_data ? 'deadline_date' THEN
                due_date := to_char((p_event_data->>'deadline_date')::date, 'MM/DD/YYYY');
            END IF;
            
            -- Execute action based on action type
            CASE rule_record.action_type
                WHEN 'create_task' THEN
                    -- Build task name with placeholder replacement
                    task_name := COALESCE(action_params->>'task_name', 'Automated Task');
                    task_name := replace(task_name, '{{client_name}}', COALESCE(client_name, 'Unknown Client'));
                    task_name := replace(task_name, '{{trigger_date}}', CURRENT_DATE::text);
                    
                    -- Build task description with placeholder replacement
                    task_description := COALESCE(action_params->>'task_description', 'Automatically created task');
                    task_description := replace(task_description, '{{client_name}}', COALESCE(client_name, 'Unknown Client'));
                    task_description := replace(task_description, '{{task_name}}', COALESCE(task_title, 'Task'));
                    task_description := replace(task_description, '{{trigger_date}}', CURRENT_DATE::text);
                    
                    -- Determine assigned user
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
                            -- Default to first admin
                            SELECT id INTO assigned_user_id 
                            FROM public.profiles 
                            WHERE role = 'admin' 
                            ORDER BY created_at 
                            LIMIT 1;
                    END CASE;
                    
                    -- Get a default task category
                    IF NOT EXISTS (SELECT 1 FROM public.task_categories LIMIT 1) THEN
                        INSERT INTO public.task_categories (name, created_by_profile_id)
                        VALUES ('Automated Tasks', assigned_user_id);
                    END IF;
                    
                    -- Create the task
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
                    -- Build notification title with placeholder replacement
                    notification_title := COALESCE(action_params->>'title', 'Automated Notification');
                    notification_title := replace(notification_title, '{{client_name}}', COALESCE(client_name, 'Unknown Client'));
                    notification_title := replace(notification_title, '{{task_name}}', COALESCE(task_title, 'Task'));
                    
                    -- Build notification message with placeholder replacement
                    notification_message := COALESCE(action_params->>'message', 'Automated notification message');
                    notification_message := replace(notification_message, '{{client_name}}', COALESCE(client_name, 'Unknown Client'));
                    notification_message := replace(notification_message, '{{task_name}}', COALESCE(task_title, 'Task'));
                    notification_message := replace(notification_message, '{{due_date}}', COALESCE(due_date, 'Unknown Date'));
                    
                    -- Determine recipient
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
                            -- Default to admin
                            SELECT id INTO recipient_user_id 
                            FROM public.profiles 
                            WHERE role = 'admin' 
                            ORDER BY created_at 
                            LIMIT 1;
                    END CASE;
                    
                    -- Create notification if recipient found
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
                    -- Update task status if task_id is provided
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
            
            -- Update execution count and last executed time
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
$$;

-- Create function to check task deadlines for automation
CREATE OR REPLACE FUNCTION public.check_task_deadlines_for_automation()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    task_record RECORD;
    rule_record RECORD;
    days_before integer;
    event_data jsonb;
BEGIN
    -- Check for tasks with approaching deadlines based on automation rules
    FOR rule_record IN 
        SELECT * FROM public.automation_rules 
        WHERE trigger_type = 'task_deadline_approaching'
        AND is_active = true
        AND (max_executions IS NULL OR execution_count < max_executions)
    LOOP
        -- Get days before from trigger conditions
        days_before := COALESCE((rule_record.trigger_conditions->>'days_before')::integer, 1);
        
        -- Find tasks that match the deadline criteria
        FOR task_record IN
            SELECT t.*, c.name as client_name, p.full_name as assigned_to_name
            FROM public.tasks t
            LEFT JOIN public.clients c ON t.client_id = c.id
            LEFT JOIN public.profiles p ON t.assigned_to_profile_id = p.id
            WHERE t.deadline_date = CURRENT_DATE + days_before
            AND t.status NOT IN ('completed', 'cancelled')
        LOOP
            -- Build event data for the automation
            event_data := jsonb_build_object(
                'task_id', task_record.id,
                'task_title', task_record.title,
                'deadline_date', task_record.deadline_date,
                'assigned_to_profile_id', task_record.assigned_to_profile_id,
                'client_id', task_record.client_id,
                'days_before', days_before
            );
            
            -- Execute automation rule
            PERFORM public.execute_automation_rule('task_deadline_approaching', event_data);
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Completed task deadline automation check';
END;
$$;

-- Create trigger function for client creation
CREATE OR REPLACE FUNCTION public.trigger_client_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    event_data jsonb;
BEGIN
    -- Build event data
    event_data := jsonb_build_object(
        'client_id', NEW.id,
        'client_name', NEW.name,
        'client_type', NEW.client_type,
        'created_by', NEW.created_by,
        'working_user_id', NEW.working_user_id
    );
    
    -- Execute automation rules
    PERFORM public.execute_automation_rule('client_created', event_data);
    
    RETURN NEW;
END;
$$;

-- Create trigger function for task status changes
CREATE OR REPLACE FUNCTION public.trigger_task_status_changed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    event_data jsonb;
    client_name text;
BEGIN
    -- Only trigger if status actually changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        -- Get client name if client exists
        IF NEW.client_id IS NOT NULL THEN
            SELECT name INTO client_name FROM public.clients WHERE id = NEW.client_id;
        END IF;
        
        -- Build event data
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
        
        -- Execute automation rules
        PERFORM public.execute_automation_rule('task_status_changed', event_data);
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create the actual triggers
DROP TRIGGER IF EXISTS automation_client_created ON public.clients;
CREATE TRIGGER automation_client_created
    AFTER INSERT ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_client_created();

DROP TRIGGER IF EXISTS automation_task_status_changed ON public.tasks;
CREATE TRIGGER automation_task_status_changed
    AFTER UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_task_status_changed();

-- Enable pg_cron extension if not already enabled (may require superuser)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the task deadline check to run every hour
-- This may require additional permissions in Supabase
-- SELECT cron.schedule(
--     'check-task-deadlines',
--     '0 * * * *', -- Every hour at minute 0
--     $$
--     SELECT public.check_task_deadlines_for_automation();
--     $$
-- );
