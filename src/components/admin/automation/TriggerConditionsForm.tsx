
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
            <div>
              <FormLabel>From Status (Optional)</FormLabel>
              <Select 
                value={value.from_status || ''} 
                onValueChange={(val) => updateCondition('from_status', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any status</SelectItem>
                  {taskStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Only trigger when task changes from this specific status
              </FormDescription>
            </div>
            <div>
              <FormLabel>To Status (Optional)</FormLabel>
              <Select 
                value={value.to_status || ''} 
                onValueChange={(val) => updateCondition('to_status', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any status</SelectItem>
                  {taskStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Only trigger when task changes to this specific status
              </FormDescription>
            </div>
          </div>
        );

      case 'task_deadline_approaching':
        return (
          <div>
            <FormLabel>Days Before Deadline</FormLabel>
            <Input
              type="number"
              min="1"
              max="30"
              placeholder="1"
              value={value.days_before || ''}
              onChange={(e) => updateCondition('days_before', parseInt(e.target.value) || 1)}
            />
            <FormDescription>
              Trigger when task deadline is this many days away
            </FormDescription>
          </div>
        );

      case 'task_overdue':
        return (
          <div>
            <FormLabel>Days Overdue</FormLabel>
            <Input
              type="number"
              min="1"
              max="30"
              placeholder="1"
              value={value.days_overdue || ''}
              onChange={(e) => updateCondition('days_overdue', parseInt(e.target.value) || 1)}
            />
            <FormDescription>
              Trigger when task is overdue by this many days
            </FormDescription>
          </div>
        );

      case 'client_created':
        return (
          <div>
            <FormLabel>Client Type (Optional)</FormLabel>
            <Select 
              value={value.client_type || ''} 
              onValueChange={(val) => updateCondition('client_type', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any client type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any client type</SelectItem>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Proprietorship">Proprietorship</SelectItem>
                <SelectItem value="Partnership">Partnership</SelectItem>
                <SelectItem value="LLP">LLP</SelectItem>
                <SelectItem value="Company">Company</SelectItem>
                <SelectItem value="Trust">Trust</SelectItem>
                <SelectItem value="Society">Society</SelectItem>
                <SelectItem value="HUF">HUF</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Only trigger for clients of this specific type
            </FormDescription>
          </div>
        );

      case 'invoice_overdue':
        return (
          <div>
            <FormLabel>Days Overdue</FormLabel>
            <Input
              type="number"
              min="1"
              max="90"
              placeholder="7"
              value={value.days_overdue || ''}
              onChange={(e) => updateCondition('days_overdue', parseInt(e.target.value) || 7)}
            />
            <FormDescription>
              Trigger when invoice is overdue by this many days
            </FormDescription>
          </div>
        );

      case 'dsc_expiring':
        return (
          <div>
            <FormLabel>Days Before Expiry</FormLabel>
            <Input
              type="number"
              min="1"
              max="90"
              placeholder="30"
              value={value.days_before_expiry || ''}
              onChange={(e) => updateCondition('days_before_expiry', parseInt(e.target.value) || 30)}
            />
            <FormDescription>
              Trigger when DSC expires in this many days
            </FormDescription>
          </div>
        );

      case 'scheduled_time':
        return (
          <div className="space-y-4">
            <div>
              <FormLabel>Time</FormLabel>
              <Input
                type="time"
                value={value.scheduled_time || ''}
                onChange={(e) => updateCondition('scheduled_time', e.target.value)}
              />
              <FormDescription>
                Time of day to trigger (24-hour format)
              </FormDescription>
            </div>
            <div>
              <FormLabel>Days of Week</FormLabel>
              <Select 
                value={value.days_of_week || ''} 
                onValueChange={(val) => updateCondition('days_of_week', val)}
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
