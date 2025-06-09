
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TaskBasicDetailsFormProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const TaskBasicDetailsForm: React.FC<TaskBasicDetailsFormProps> = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}) => {
  return (
    <>
      {/* Task Title */}
      <div className="md:col-span-2">
        <Label htmlFor="title">Task Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g., Quarterly Audit for Alpha Corp"
          required
        />
      </div>

      {/* Description */}
      <div className="md:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Detailed explanation of the task"
          rows={3}
        />
      </div>
    </>
  );
};

export default TaskBasicDetailsForm;
