
-- Create ENUM types for automation rules
CREATE TYPE public.automation_trigger_type AS ENUM (
  'task_created',
  'task_status_changed',
  'task_deadline_approaching',
  'task_overdue',
  'document_uploaded',
  'document_status_changed',
  'client_created',
  'client_status_changed',
  'invoice_created',
  'invoice_overdue',
  'payment_received',
  'compliance_deadline_approaching',
  'dsc_expiring',
  'user_login',
  'scheduled_time'
);

CREATE TYPE public.automation_action_type AS ENUM (
  'send_email_notification',
  'create_task',
  'update_task_status',
  'create_notification',
  'send_sms',
  'assign_task',
  'update_client_status',
  'create_reminder',
  'escalate_task',
  'generate_report'
);

-- Create the automation_rules table
CREATE TABLE public.automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic rule information
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Trigger configuration
  trigger_type automation_trigger_type NOT NULL,
  trigger_conditions JSONB, -- Store flexible conditions as JSON
  
  -- Action configuration
  action_type automation_action_type NOT NULL,
  action_parameters JSONB, -- Store action-specific parameters as JSON
  
  -- Timing and frequency
  delay_minutes INTEGER DEFAULT 0, -- Delay before executing action
  frequency_type TEXT DEFAULT 'once', -- 'once', 'daily', 'weekly', 'monthly'
  frequency_value INTEGER DEFAULT 1, -- For recurring actions
  
  -- Priority and execution
  priority INTEGER DEFAULT 0, -- Higher number = higher priority
  max_executions INTEGER, -- Limit number of times rule can execute
  execution_count INTEGER DEFAULT 0, -- Track how many times executed
  
  -- Audit and management
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  last_executed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  tags TEXT[], -- For categorizing and filtering rules
  metadata JSONB -- Additional flexible data storage
);

-- Add indexes for performance
CREATE INDEX idx_automation_rules_trigger_type ON public.automation_rules(trigger_type);
CREATE INDEX idx_automation_rules_is_active ON public.automation_rules(is_active);
CREATE INDEX idx_automation_rules_created_by ON public.automation_rules(created_by);
CREATE INDEX idx_automation_rules_priority ON public.automation_rules(priority DESC);

-- Enable RLS
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for automation_rules
-- Only admin users can view automation rules
CREATE POLICY "Admins can view all automation rules" 
ON public.automation_rules 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only admin users can create automation rules
CREATE POLICY "Admins can create automation rules" 
ON public.automation_rules 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only admin users can update automation rules
CREATE POLICY "Admins can update automation rules" 
ON public.automation_rules 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only admin users can delete automation rules
CREATE POLICY "Admins can delete automation rules" 
ON public.automation_rules 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_automation_rules_updated_at
  BEFORE UPDATE ON public.automation_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE public.automation_rules IS 'Stores automation rule definitions for triggering actions based on system events';
COMMENT ON COLUMN public.automation_rules.trigger_conditions IS 'JSON object storing flexible conditions for when the rule should trigger';
COMMENT ON COLUMN public.automation_rules.action_parameters IS 'JSON object storing parameters specific to the action being performed';
COMMENT ON COLUMN public.automation_rules.frequency_type IS 'How often the rule can execute: once, daily, weekly, monthly';
COMMENT ON COLUMN public.automation_rules.delay_minutes IS 'Minutes to wait before executing the action after trigger condition is met';
COMMENT ON COLUMN public.automation_rules.max_executions IS 'Maximum number of times this rule can execute (NULL for unlimited)';
