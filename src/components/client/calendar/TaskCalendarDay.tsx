
import React from 'react';
import { CalendarTask } from '@/services/calendarService';
import TaskCalendarTask from './TaskCalendarTask';

interface TaskCalendarDayProps {
  date: Date | null;
  tasks: CalendarTask[];
  isToday: boolean;
  isExpanded: boolean;
  onToggleExpansion: (dateString: string) => void;
  onTaskClick: (taskId: string) => void;
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

  return (
    <div
      className={`min-h-32 p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${
        isToday ? 'ring-2 ring-primary bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
    >
      <div className={`text-sm font-medium mb-2 ${
        isToday ? 'text-primary font-bold' : 'text-gray-900 dark:text-white'
      }`}>
        {date.getDate()}
      </div>
      
      <div className="space-y-1">
        {visibleTasks.map(task => (
          <TaskCalendarTask
            key={task.id}
            task={task}
            onTaskClick={onTaskClick}
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
