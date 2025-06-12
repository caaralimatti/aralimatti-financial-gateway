
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { Task } from '@/types/task';
import { getStatusColor, getPriorityColor } from '@/utils/taskUtils';

interface TaskListItemStatusProps {
  task: Task;
}

const TaskListItemStatus: React.FC<TaskListItemStatusProps> = ({ task }) => {
  return (
    <>
      {/* Status & Priority */}
      <div className="flex flex-col gap-1">
        <Badge className={`text-xs w-fit ${getStatusColor(task.status)}`}>
          {task.status.replace('_', ' ').toUpperCase()}
        </Badge>
        <Badge className={`text-xs w-fit ${getPriorityColor(task.priority)}`}>
          {task.priority.toUpperCase()}
        </Badge>
      </div>

      {/* Assigned To */}
      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
        <User className="h-3 w-3" />
        <span>{task.assigned_to?.full_name || task.assigned_to?.email || 'Unassigned'}</span>
      </div>
    </>
  );
};

export default TaskListItemStatus;
