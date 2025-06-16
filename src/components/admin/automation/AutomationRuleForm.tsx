
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TriggerConditionsForm from './TriggerConditionsForm';
import ActionParametersForm from './ActionParametersForm';

const automationRuleSchema = z.object({
  name: z.string().min(1, 'Rule name is required'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  trigger_type: z.string().min(1, 'Trigger type is required'),
  trigger_conditions: z.any().optional(),
  action_type: z.string().min(1, 'Action type is required'),
  action_parameters: z.any().optional(),
  delay_minutes: z.number().min(0).default(0),
  frequency_type: z.string().default('once'),
  frequency_value: z.number().min(1).default(1),
  priority: z.number().default(0),
  max_executions: z.number().min(1).optional().nullable(),
  tags: z.array(z.string()).optional(),
  metadata: z.any().optional(),
});

type AutomationRuleFormData = z.infer<typeof automationRuleSchema>;

interface AutomationRuleFormProps {
  initialData?: any;
  onSuccess: () => void;
}

const triggerTypes = [
  { value: 'task_created', label: 'Task Created' },
  { value: 'task_status_changed', label: 'Task Status Changed' },
  { value: 'task_deadline_approaching', label: 'Task Deadline Approaching' },
  { value: 'task_overdue', label: 'Task Overdue' },
  { value: 'document_uploaded', label: 'Document Uploaded' },
  { value: 'document_status_changed', label: 'Document Status Changed' },
  { value: 'client_created', label: 'Client Created' },
  { value: 'client_status_changed', label: 'Client Status Changed' },
  { value: 'invoice_created', label: 'Invoice Created' },
  { value: 'invoice_overdue', label: 'Invoice Overdue' },
  { value: 'payment_received', label: 'Payment Received' },
  { value: 'compliance_deadline_approaching', label: 'Compliance Deadline Approaching' },
  { value: 'dsc_expiring', label: 'DSC Expiring' },
  { value: 'user_login', label: 'User Login' },
  { value: 'scheduled_time', label: 'Scheduled Time' },
];

const actionTypes = [
  { value: 'send_email_notification', label: 'Send Email Notification' },
  { value: 'create_task', label: 'Create Task' },
  { value: 'update_task_status', label: 'Update Task Status' },
  { value: 'create_notification', label: 'Create Notification' },
  { value: 'send_sms', label: 'Send SMS' },
  { value: 'assign_task', label: 'Assign Task' },
  { value: 'update_client_status', label: 'Update Client Status' },
  { value: 'create_reminder', label: 'Create Reminder' },
  { value: 'escalate_task', label: 'Escalate Task' },
  { value: 'generate_report', label: 'Generate Report' },
];

const frequencyTypes = [
  { value: 'once', label: 'Once' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const AutomationRuleForm: React.FC<AutomationRuleFormProps> = ({
  initialData,
  onSuccess,
}) => {
  const [tagInput, setTagInput] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AutomationRuleFormData>({
    resolver: zodResolver(automationRuleSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      is_active: initialData?.is_active ?? true,
      trigger_type: initialData?.trigger_type || '',
      trigger_conditions: initialData?.trigger_conditions || {},
      action_type: initialData?.action_type || '',
      action_parameters: initialData?.action_parameters || {},
      delay_minutes: initialData?.delay_minutes || 0,
      frequency_type: initialData?.frequency_type || 'once',
      frequency_value: initialData?.frequency_value || 1,
      priority: initialData?.priority || 0,
      max_executions: initialData?.max_executions || null,
      tags: initialData?.tags || [],
      metadata: initialData?.metadata || {},
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: AutomationRuleFormData) => {
      const { error } = await supabase
        .from('automation_rules')
        .insert([{
          ...data,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
      toast({
        title: "Success",
        description: "Automation rule created successfully.",
      });
      onSuccess();
    },
    onError: (error) => {
      console.error('Error creating automation rule:', error);
      toast({
        title: "Error",
        description: "Failed to create automation rule.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: AutomationRuleFormData) => {
      const { error } = await supabase
        .from('automation_rules')
        .update(data)
        .eq('id', initialData?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
      toast({
        title: "Success",
        description: "Automation rule updated successfully.",
      });
      onSuccess();
    },
    onError: (error) => {
      console.error('Error updating automation rule:', error);
      toast({
        title: "Error",
        description: "Failed to update automation rule.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AutomationRuleFormData) => {
    if (initialData?.id) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const watchedTriggerType = form.watch('trigger_type');
  const watchedActionType = form.watch('action_type');
  const watchedTags = form.watch('tags') || [];

  const addTag = () => {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      form.setValue('tags', [...watchedTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue('tags', watchedTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rule Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter rule name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter rule description (optional)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active</FormLabel>
                  <FormDescription>
                    Enable this rule to start processing triggers
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Trigger Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Trigger Configuration</h3>
          
          <FormField
            control={form.control}
            name="trigger_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trigger Event *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger event" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {triggerTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchedTriggerType && (
            <TriggerConditionsForm 
              triggerType={watchedTriggerType}
              value={form.watch('trigger_conditions')}
              onChange={(conditions) => form.setValue('trigger_conditions', conditions)}
            />
          )}
        </div>

        {/* Action Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Action Configuration</h3>
          
          <FormField
            control={form.control}
            name="action_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Action Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {actionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchedActionType && (
            <ActionParametersForm 
              actionType={watchedActionType}
              value={form.watch('action_parameters')}
              onChange={(parameters) => form.setValue('action_parameters', parameters)}
            />
          )}
        </div>

        {/* Timing and Frequency */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Timing and Frequency</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="delay_minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delay (minutes)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Wait time before executing action
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frequency_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {frequencyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frequency_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency Value</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormDescription>
                    Every X {form.watch('frequency_type')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Advanced Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Higher numbers have higher priority
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_executions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Executions</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min="1"
                      placeholder="Unlimited"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormDescription>
                    Limit number of times rule can execute
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <FormLabel>Tags</FormLabel>
            <div className="flex gap-2">
              <Input
                placeholder="Add tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {watchedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {initialData?.id ? 'Update Rule' : 'Create Rule'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AutomationRuleForm;
