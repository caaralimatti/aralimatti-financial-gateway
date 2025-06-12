
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';
import { Task } from '@/types/task';
import { getStatusColor, getPriorityColor } from '@/utils/taskUtils';

interface TaskCardBadgesProps {
  task: Task;
}

const TaskCardBadges: React.FC<TaskCardBadgesProps> = ({ task }) => {
  return (
    <div className="flex gap-2 mt-2">
      <Badge className={`text-xs ${getStatusColor(task.status)}`}>
        {task.status.replace('_', ' ').toUpperCase()}
      </Badge>
      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
        {task.priority.toUpperCase()}
      </Badge>
      {task.is_billable && (
        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
          <DollarSign className="h-3 w-3 mr-1" />
          Billable
        </Badge>
      )}
    </div>
  );
};

export default TaskCardBadges;
