
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface TaskOptionsFormProps {
  isBillable: boolean;
  onIsBillableChange: (checked: boolean) => void;
}

const TaskOptionsForm: React.FC<TaskOptionsFormProps> = ({
  isBillable,
  onIsBillableChange,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="is_billable"
        checked={isBillable}
        onCheckedChange={onIsBillableChange}
      />
      <Label htmlFor="is_billable">This task is billable</Label>
    </div>
  );
};

export default TaskOptionsForm;
