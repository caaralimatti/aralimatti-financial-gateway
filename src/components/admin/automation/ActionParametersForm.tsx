
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormLabel, FormDescription } from '@/components/ui/form';

interface ActionParametersFormProps {
  actionType: string;
  value: any;
  onChange: (parameters: any) => void;
}

const taskStatuses = [
  { value: 'to_do', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const assignmentTargets = [
  { value: 'admin', label: 'Admin Role' },
  { value: 'client_assigned_staff', label: "Client's Assigned Staff" },
  { value: 'task_creator', label: 'Task Creator' },
  { value: 'specific_user', label: 'Specific User' },
];

const recipientTypes = [
  { value: 'client', label: 'Client' },
  { value: 'assigned_staff', label: 'Assigned Staff' },
  { value: 'admin', label: 'Admin' },
  { value: 'all_staff', label: 'All Staff' },
];

const ActionParametersForm: React.FC<ActionParametersFormProps> = ({
  actionType,
  value = {},
  onChange,
}) => {
  const updateParameter = (key: string, newValue: any) => {
    onChange({
      ...value,
      [key]: newValue,
    });
  };

  const renderParametersForm = () => {
    switch (actionType) {
      case 'create_task':
        return (
          <div className="space-y-4">
            <div>
              <FormLabel>Task Name Template</FormLabel>
              <Input
                placeholder="e.g., Follow up on client_name"
                value={value.task_name || ''}
                onChange={(e) => updateParameter('task_name', e.target.value)}
              />
              <FormDescription>
                Use double curly braces around client_name, trigger_date for dynamic values
              </FormDescription>
            </div>
            <div>
              <FormLabel>Task Description Template</FormLabel>
              <Textarea
                placeholder="e.g., Automatic follow-up task created for client_name"
                value={value.task_description || ''}
                onChange={(e) => updateParameter('task_description', e.target.value)}
              />
            </div>
            <div>
              <FormLabel>Assign To</FormLabel>
              <Select 
                value={value.assign_to || ''} 
                onValueChange={(val) => updateParameter('assign_to', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignment target" />
                </SelectTrigger>
                <SelectContent>
                  {assignmentTargets.map((target) => (
                    <SelectItem key={target.value} value={target.value}>
                      {target.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <FormLabel>Due Date Offset (days)</FormLabel>
              <Input
                type="number"
                min="0"
                placeholder="7"
                value={value.due_date_offset || ''}
                onChange={(e) => updateParameter('due_date_offset', parseInt(e.target.value) || 7)}
              />
              <FormDescription>
                Task will be due this many days after trigger
              </FormDescription>
            </div>
          </div>
        );

      case 'send_email_notification':
      case 'create_notification':
        return (
          <div className="space-y-4">
            <div>
              <FormLabel>Recipient</FormLabel>
              <Select 
                value={value.recipient || ''} 
                onValueChange={(val) => updateParameter('recipient', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  {recipientTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <FormLabel>Title Template</FormLabel>
              <Input
                placeholder="e.g., Task Update: task_name"
                value={value.title || ''}
                onChange={(e) => updateParameter('title', e.target.value)}
              />
            </div>
            <div>
              <FormLabel>Message Template</FormLabel>
              <Textarea
                placeholder="e.g., Your task task_name is due on due_date"
                value={value.message || ''}
                onChange={(e) => updateParameter('message', e.target.value)}
              />
              <FormDescription>
                Use double curly braces around task_name, client_name, due_date for dynamic values
              </FormDescription>
            </div>
          </div>
        );

      case 'update_task_status':
        return (
          <div>
            <FormLabel>New Status</FormLabel>
            <Select 
              value={value.new_status || ''} 
              onValueChange={(val) => updateParameter('new_status', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {taskStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'assign_task':
        return (
          <div className="space-y-4">
            <div>
              <FormLabel>Assign To</FormLabel>
              <Select 
                value={value.assign_to || ''} 
                onValueChange={(val) => updateParameter('assign_to', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignment target" />
                </SelectTrigger>
                <SelectContent>
                  {assignmentTargets.map((target) => (
                    <SelectItem key={target.value} value={target.value}>
                      {target.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'escalate_task':
        return (
          <div className="space-y-4">
            <div>
              <FormLabel>Escalate To</FormLabel>
              <Select 
                value={value.escalate_to || ''} 
                onValueChange={(val) => updateParameter('escalate_to', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select escalation target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="senior_staff">Senior Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <FormLabel>Escalation Message</FormLabel>
              <Textarea
                placeholder="e.g., Task task_name requires urgent attention"
                value={value.escalation_message || ''}
                onChange={(e) => updateParameter('escalation_message', e.target.value)}
              />
            </div>
          </div>
        );

      case 'send_sms':
        return (
          <div className="space-y-4">
            <div>
              <FormLabel>Recipient</FormLabel>
              <Select 
                value={value.recipient || ''} 
                onValueChange={(val) => updateParameter('recipient', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  {recipientTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <FormLabel>SMS Message Template</FormLabel>
              <Textarea
                placeholder="e.g., Reminder: task_name is due due_date"
                value={value.sms_message || ''}
                onChange={(e) => updateParameter('sms_message', e.target.value)}
                maxLength={160}
              />
              <FormDescription>
                SMS messages are limited to 160 characters
              </FormDescription>
            </div>
          </div>
        );

      case 'update_client_status':
        return (
          <div>
            <FormLabel>New Client Status</FormLabel>
            <Select 
              value={value.new_status || ''} 
              onValueChange={(val) => updateParameter('new_status', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 'create_reminder':
        return (
          <div className="space-y-4">
            <div>
              <FormLabel>Reminder Title</FormLabel>
              <Input
                placeholder="e.g., Upcoming deadline for client_name"
                value={value.reminder_title || ''}
                onChange={(e) => updateParameter('reminder_title', e.target.value)}
              />
            </div>
            <div>
              <FormLabel>Reminder Message</FormLabel>
              <Textarea
                placeholder="e.g., Don't forget about task_name due on due_date"
                value={value.reminder_message || ''}
                onChange={(e) => updateParameter('reminder_message', e.target.value)}
              />
            </div>
            <div>
              <FormLabel>Reminder Date Offset (days)</FormLabel>
              <Input
                type="number"
                min="0"
                placeholder="1"
                value={value.reminder_offset || ''}
                onChange={(e) => updateParameter('reminder_offset', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        );

      case 'generate_report':
        return (
          <div className="space-y-4">
            <div>
              <FormLabel>Report Type</FormLabel>
              <Select 
                value={value.report_type || ''} 
                onValueChange={(val) => updateParameter('report_type', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task_summary">Task Summary</SelectItem>
                  <SelectItem value="client_activity">Client Activity</SelectItem>
                  <SelectItem value="compliance_status">Compliance Status</SelectItem>
                  <SelectItem value="overdue_tasks">Overdue Tasks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <FormLabel>Send Report To</FormLabel>
              <Select 
                value={value.send_to || ''} 
                onValueChange={(val) => updateParameter('send_to', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="all_staff">All Staff</SelectItem>
                  <SelectItem value="managers">Managers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <FormDescription>
              No additional parameters required for this action type.
            </FormDescription>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <FormLabel>Action Parameters</FormLabel>
      {renderParametersForm()}
    </div>
  );
};

export default ActionParametersForm;
