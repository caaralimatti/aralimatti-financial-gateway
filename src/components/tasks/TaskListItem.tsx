
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/types/task';
import { isOverdue } from '@/utils/taskUtils';
import TaskListItemHeader from './TaskListItemHeader';
import TaskListItemStatus from './TaskListItemStatus';
import TaskListItemProgress from './TaskListItemProgress';
import TaskListItemActions from './TaskListItemActions';

interface TaskListItemProps {
  task: Task;
  isSelected: boolean;
  onSelect: (taskId: string, selected: boolean) => void;
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task, isSelected, onSelect }) => {
  const taskIsOverdue = isOverdue(task.deadline_date);

  return (
    <Card className={`border transition-all duration-200 hover:shadow-md ${isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200 dark:border-gray-700'} ${taskIsOverdue ? 'border-red-300 bg-red-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Selection Checkbox */}
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(task.id, !!checked)}
          />

          {/* Task Info */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
            <TaskListItemHeader task={task} />
            <TaskListItemStatus task={task} />
            <TaskListItemProgress task={task} />
            <TaskListItemActions />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskListItem;
