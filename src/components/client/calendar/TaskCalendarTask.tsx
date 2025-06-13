
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { User, Building2 } from 'lucide-react';
import { CalendarTask } from '@/services/calendarService';

interface TaskCalendarTaskProps {
  task: CalendarTask;
  onTaskClick: (taskId: string) => void;
}

const TaskCalendarTask = ({ task, onTaskClick }: TaskCalendarTaskProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-orange-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityBorderColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-orange-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const taskElement = (
    <div
      className={`
        text-xs p-2 mb-1 rounded cursor-pointer transition-all hover:shadow-md
        bg-white dark:bg-gray-800 border-l-4 ${getPriorityBorderColor(task.priority)}
        hover:bg-gray-50 dark:hover:bg-gray-700
      `}
      onClick={() => onTaskClick(task.id)}
    >
      <div className="font-medium truncate text-gray-900 dark:text-white">
        {task.title}
      </div>
      {task.client_name && (
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mt-1">
          <Building2 className="w-3 h-3" />
          <span className="truncate">{task.client_name}</span>
        </div>
      )}
      <div className="flex items-center justify-between mt-1">
        <Badge className={`${getPriorityColor(task.priority)} text-xs px-1 py-0`}>
          {task.priority}
        </Badge>
        {task.assigned_to_name && (
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <User className="w-3 h-3" />
            <span className="truncate max-w-20">{task.assigned_to_name}</span>
          </div>
        )}
      </div>
    </div>
  );

  if (task.description || task.assigned_to_name) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {taskElement}
          </TooltipTrigger>
          <TooltipContent className="max-w-sm p-3">
            <div className="space-y-2">
              <div className="font-medium">{task.title}</div>
              {task.description && (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {task.description}
                </div>
              )}
              {task.assigned_to_name && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span>Assigned to: {task.assigned_to_name}</span>
                </div>
              )}
              {task.client_name && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4" />
                  <span>Client: {task.client_name}</span>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return taskElement;
};

export default TaskCalendarTask;
