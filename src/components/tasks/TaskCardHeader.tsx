
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, AlertTriangle } from 'lucide-react';
import { Task } from '@/types/task';
import { isOverdue } from '@/utils/taskUtils';

interface TaskCardHeaderProps {
  task: Task;
  isSelected: boolean;
  onSelect: (taskId: string, selected: boolean) => void;
}

const TaskCardHeader: React.FC<TaskCardHeaderProps> = ({ task, isSelected, onSelect }) => {
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
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(task.id, !!checked)}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{getCategoryIcon(task.task_categories?.name)}</span>
            <Badge variant="outline" className="text-xs px-2 py-1">
              {task.id}
            </Badge>
            {taskIsOverdue && <AlertTriangle className="h-4 w-4 text-red-500" />}
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
            {task.title}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {task.client?.name || 'No client'}
          </p>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit Task</DropdownMenuItem>
          <DropdownMenuItem>Assign To</DropdownMenuItem>
          <DropdownMenuItem>Log Time</DropdownMenuItem>
          <DropdownMenuItem>Add Comment</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TaskCardHeader;
