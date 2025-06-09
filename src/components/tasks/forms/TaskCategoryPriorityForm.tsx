
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskCategoryPriorityFormProps {
  categoryId: string;
  priority: 'high' | 'medium' | 'low';
  categories: any[];
  onCategoryChange: (value: string) => void;
  onPriorityChange: (value: 'high' | 'medium' | 'low') => void;
}

const TaskCategoryPriorityForm: React.FC<TaskCategoryPriorityFormProps> = ({
  categoryId,
  priority,
  categories,
  onCategoryChange,
  onPriorityChange,
}) => {
  return (
    <>
      {/* Category */}
      <div>
        <Label htmlFor="category">Category *</Label>
        <Select value={categoryId} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Priority */}
      <div>
        <Label htmlFor="priority">Priority *</Label>
        <Select value={priority} onValueChange={onPriorityChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default TaskCategoryPriorityForm;
