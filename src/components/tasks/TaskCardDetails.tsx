
import React from 'react';
import { Calendar, User, MessageSquare, Paperclip } from 'lucide-react';
import { Task } from '@/types/task';
import { formatDate, isOverdue } from '@/utils/taskUtils';

interface TaskCardDetailsProps {
  task: Task;
}

const TaskCardDetails: React.FC<TaskCardDetailsProps> = ({ task }) => {
  const taskIsOverdue = isOverdue(task.deadline_date);
  const isNearDeadline = task.deadline_date && new Date(task.deadline_date) <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) && task.status !== 'completed';

  return (
    <div className="space-y-2">
      {/* Deadline */}
      <div className="flex items-center gap-1 text-xs">
        <Calendar className="h-3 w-3" />
        <span className={`${taskIsOverdue ? 'text-red-600 font-medium' : isNearDeadline ? 'text-orange-600' : 'text-gray-600 dark:text-gray-400'}`}>
          Due: {formatDate(task.deadline_date)}
        </span>
      </div>

      {/* Assignment */}
      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
        <User className="h-3 w-3" />
        <span>Assigned to: {task.assigned_to?.full_name || task.assigned_to?.email || 'Unassigned'}</span>
      </div>

      {/* Comments and Attachments */}
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
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
  );
};

export default TaskCardDetails;
