
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TaskDatesFormProps {
  startDate: string;
  deadlineDate: string;
  estimatedEffortHours: string;
  onStartDateChange: (value: string) => void;
  onDeadlineDateChange: (value: string) => void;
  onEstimatedEffortHoursChange: (value: string) => void;
}

const TaskDatesForm: React.FC<TaskDatesFormProps> = ({
  startDate,
  deadlineDate,
  estimatedEffortHours,
  onStartDateChange,
  onDeadlineDateChange,
  onEstimatedEffortHoursChange,
}) => {
  return (
    <>
      {/* Start Date */}
      <div>
        <Label htmlFor="start_date">Start Date</Label>
        <Input
          id="start_date"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
        />
      </div>

      {/* Deadline */}
      <div>
        <Label htmlFor="deadline_date">Deadline</Label>
        <Input
          id="deadline_date"
          type="date"
          value={deadlineDate}
          onChange={(e) => onDeadlineDateChange(e.target.value)}
        />
      </div>

      {/* Estimated Effort */}
      <div>
        <Label htmlFor="estimated_effort_hours">Estimated Effort (Hours)</Label>
        <Input
          id="estimated_effort_hours"
          type="number"
          step="0.5"
          min="0"
          value={estimatedEffortHours}
          onChange={(e) => onEstimatedEffortHoursChange(e.target.value)}
          placeholder="e.g., 8.5"
        />
      </div>
    </>
  );
};

export default TaskDatesForm;
