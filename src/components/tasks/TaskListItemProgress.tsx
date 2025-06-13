
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock, DollarSign, Calendar, MessageSquare, Paperclip } from 'lucide-react';
import { Task } from '@/types/task';
import { getTaskProgress, formatDate, isOverdue } from '@/utils/taskUtils';

interface TaskListItemProgressProps {
  task: Task;
}

const TaskListItemProgress: React.FC<TaskListItemProgressProps> = ({ task }) => {
  const subTaskProgress = getTaskProgress(task);
  const taskIsOverdue = isOverdue(task.deadline_date);
  const isNearDeadline = task.deadline_date && new Date(task.deadline_date) <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) && task.status !== 'completed';

  // Calculate logged hours (mock data for now)
  const loggedHours = 4.5;
  const estimatedHours = task.estimated_effort_hours || 8;

  return (
    <>
      {/* Progress & Time */}
      <div className="space-y-1">
        {task.sub_tasks.length > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Progress</span>
              <span>{task.sub_tasks.filter(st => st.is_completed).length}/{task.sub_tasks.length}</span>
            </div>
            <Progress value={subTaskProgress} className="h-1" />
          </div>
        )}
        
        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
          <Clock className="h-3 w-3" />
          <span>{loggedHours}h / {estimatedHours}h</span>
          {task.is_billable && (
            <>
              <DollarSign className="h-3 w-3 ml-2" />
              <span>${(loggedHours * 50).toFixed(0)}</span>
            </>
          )}
        </div>
      </div>

      {/* Deadline & Actions */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs">
            <Calendar className="h-3 w-3" />
            <span className={`${taskIsOverdue ? 'text-red-600 font-medium' : isNearDeadline ? 'text-orange-600' : 'text-gray-600 dark:text-gray-400'}`}>
              {formatDate(task.deadline_date)}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{task.task_comments.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <Paperclip className="h-3 w-3" />
              <span>{task.task_attachments.length}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskListItemProgress;
