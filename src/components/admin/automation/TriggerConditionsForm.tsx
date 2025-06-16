
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormLabel, FormDescription } from '@/components/ui/form';

interface TriggerConditionsFormProps {
  triggerType: string;
  value: any;
  onChange: (conditions: any) => void;
}

const taskStatuses = [
  { value: 'to_do', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const documentTypes = [
  { value: 'tax_return', label: 'Tax Return' },
  { value: 'financial_statement', label: 'Financial Statement' },
  { value: 'compliance_document', label: 'Compliance Document' },
  { value: 'contract', label: 'Contract' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'other', label: 'Other' },
];

const TriggerConditionsForm: React.FC<TriggerConditionsFormProps> = ({
  triggerType,
  value = {},
  onChange,
}) => {
  const updateCondition = (key: string, newValue: any) => {
    onChange({
      ...value,
      [key]: newValue,
    });
  };

  const renderConditionsForm = () => {
    switch (triggerType) {
      case 'task_status_changed':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel>From Status</FormLabel>
                <Select 
                  value={value.from_status || ''} 
                  onValueChange={(val) => updateCondition('from_status', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Status</SelectItem>
                    {taskStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FormLabel>To Status</FormLabel>
                <Select 
                  value={value.to_status || ''} 
                  onValueChange={(val) => updateCondition('to_status', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target status" />
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
            </div>
          </div>
        );

      case 'task_deadline_approaching':
      case 'compliance_deadline_approaching':
        return (
          <div>
            <FormLabel>Days Before Deadline</FormLabel>
            <Input
              type="number"
              min="1"
              placeholder="7"
              value={value.days_before || ''}
              onChange={(e) => updateCondition('days_before', parseInt(e.target.value) || 7)}
            />
            <FormDescription>
              Trigger this many days before the deadline
            </FormDescription>
          </div>
        );

      case 'document_uploaded':
        return (
          <div>
            <FormLabel>Document Type</FormLabel>
            <Select 
              value={value.document_type || ''} 
              onValueChange={(val) => updateCondition('document_type', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Document Type</SelectItem>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'dsc_expiring':
        return (
          <div>
            <FormLabel>Days Before Expiry</FormLabel>
            <Input
              type="number"
              min="1"
              placeholder="30"
              value={value.days_before_expiry || ''}
              onChange={(e) => updateCondition('days_before_expiry', parseInt(e.target.value) || 30)}
            />
            <FormDescription>
              Trigger this many days before DSC expires
            </FormDescription>
          </div>
        );

      case 'scheduled_time':
        return (
          <div className="space-y-4">
            <div>
              <FormLabel>Schedule Time</FormLabel>
              <Input
                type="time"
                value={value.schedule_time || ''}
                onChange={(e) => updateCondition('schedule_time', e.target.value)}
              />
            </div>
            <div>
              <FormLabel>Schedule Days</FormLabel>
              <Select 
                value={value.schedule_days || ''} 
                onValueChange={(val) => updateCondition('schedule_days', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekdays">Weekdays</SelectItem>
                  <SelectItem value="weekends">Weekends</SelectItem>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'task_created':
      case 'task_overdue':
      case 'document_status_changed':
      case 'client_created':
      case 'client_status_changed':
      case 'invoice_created':
      case 'invoice_overdue':
      case 'payment_received':
      case 'user_login':
      default:
        return (
          <div>
            <FormDescription>
              No additional conditions required for this trigger type.
            </FormDescription>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <FormLabel>Trigger Conditions</FormLabel>
      {renderConditionsForm()}
    </div>
  );
};

export default TriggerConditionsForm;
