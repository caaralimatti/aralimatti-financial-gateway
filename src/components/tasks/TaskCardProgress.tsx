
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock, DollarSign } from 'lucide-react';
import { Task } from '@/types/task';
import { getTaskProgress } from '@/utils/taskUtils';

interface TaskCardProgressProps {
  task: Task;
}

const TaskCardProgress: React.FC<TaskCardProgressProps> = ({ task }) => {
  const subTaskProgress = getTaskProgress(task);
  
  // Calculate logged hours (mock data for now)
  const loggedHours = 4.5;
  const estimatedHours = task.estimated_effort_hours || 8;

  return (
    <div className="space-y-3">
      {/* Progress */}
      {task.sub_tasks.length > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Subtasks Progress</span>
            <span>{task.sub_tasks.filter(st => st.is_completed).length}/{task.sub_tasks.length}</span>
          </div>
          <Progress value={subTaskProgress} className="h-1" />
        </div>
      )}

      {/* Time Tracking */}
      <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{loggedHours}h / {estimatedHours}h</span>
        </div>
        {task.is_billable && (
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span>${(loggedHours * 50).toFixed(0)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCardProgress;
