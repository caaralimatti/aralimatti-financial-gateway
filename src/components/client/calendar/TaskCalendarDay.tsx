
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ClientCalendarTask } from '@/types/clientCalendar';
import TaskCalendarTask from './TaskCalendarTask';

interface TaskCalendarDayProps {
  date: Date | null;
  tasks: ClientCalendarTask[];
  isToday: boolean;
  isExpanded: boolean;
  onToggleExpansion: (dateString: string) => void;
  onTaskClick: (eventId: string) => void;
}

const TaskCalendarDay = ({ 
  date, 
  tasks, 
  isToday, 
  isExpanded, 
  onToggleExpansion, 
  onTaskClick 
}: TaskCalendarDayProps) => {
  if (!date) {
    return (
      <div className="min-h-32 p-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" />
    );
  }

  const dateString = date.toISOString().split('T')[0];
  const visibleTasks = isExpanded ? tasks : tasks.slice(0, 3);
  const hiddenTasksCount = tasks.length - 3;
  const hasMoreTasks = tasks.length > 3;

  return (
    <div className={`min-h-[120px] border-r border-b p-2 ${
      isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : 'bg-white dark:bg-gray-900'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${
          isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : 'text-gray-900 dark:text-gray-100'
        }`}>
          {date.getDate()}
        </span>
        {hasMoreTasks && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleExpansion(dateString)}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>

      <div className="space-y-1">
        {visibleTasks.map(task => (
          <TaskCalendarTask
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task.id)}
          />
        ))}
        
        {!isExpanded && hiddenTasksCount > 0 && (
          <button
            onClick={() => onToggleExpansion(dateString)}
            className="text-xs text-primary hover:text-primary/80 underline w-full text-left"
          >
            +{hiddenTasksCount} more
          </button>
        )}
        
        {isExpanded && hiddenTasksCount > 0 && (
          <button
            onClick={() => onToggleExpansion(dateString)}
            className="text-xs text-gray-500 hover:text-gray-700 underline w-full text-left"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCalendarDay;
