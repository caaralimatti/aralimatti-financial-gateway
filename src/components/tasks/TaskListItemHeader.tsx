
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { Task } from '@/types/task';
import { isOverdue } from '@/utils/taskUtils';

interface TaskListItemHeaderProps {
  task: Task;
}

const TaskListItemHeader: React.FC<TaskListItemHeaderProps> = ({ task }) => {
  const getCategoryIcon = (categoryName: string | undefined) => {
    if (!categoryName) return '📄';
    switch (categoryName.toLowerCase()) {
      case 'gst': return '📊';
      case 'roc': return '🏢';
      case 'itr': return '💰';
      case 'audit': return '🔍';
      case 'compliance': return '📋';
      default: return '📄';
    }
  };

  const taskIsOverdue = isOverdue(task.deadline_date);

  return (
    <div className="md:col-span-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm">{getCategoryIcon(task.task_categories?.name)}</span>
        <Badge variant="outline" className="text-xs">
          {task.id}
        </Badge>
        {taskIsOverdue && <AlertTriangle className="h-4 w-4 text-red-500" />}
      </div>
      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
        {task.title}
      </h3>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        {task.client?.name || 'No client'}
      </p>
    </div>
  );
};

export default TaskListItemHeader;
