
import React from 'react';
import { ClientCalendarTask } from '@/types/clientCalendar';

interface TaskCalendarTaskProps {
  task: ClientCalendarTask;
  onClick: () => void;
}

const TaskCalendarTask: React.FC<TaskCalendarTaskProps> = ({ task, onClick }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'pending_approval':
        return 'bg-yellow-500';
      case 'on_hold':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const colorClass = getPriorityColor(task.priority);

  return (
    <div
      className={`p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity border ${colorClass}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`}></div>
        <div className="font-medium truncate flex-1">
          {task.title}
        </div>
      </div>
      {task.client_name && (
        <div className="text-xs opacity-75 truncate mt-0.5">
          {task.client_name}
        </div>
      )}
    </div>
  );
};

export default TaskCalendarTask;
