
import React from 'react';
import { ClientCalendarTask } from '@/types/clientCalendar';
import TaskCalendarTask from './TaskCalendarTask';

interface TaskCalendarDayProps {
  date: Date;
  tasks: ClientCalendarTask[];
  hasMoreTasks: boolean;
  hiddenTasksCount: number;
  onTaskClick: (taskId: string) => void;
  onToggleExpansion: (date: string) => void;
  onShowMoreTasks?: (date: string, events: any[]) => void;
  allTasks: ClientCalendarTask[];
}

const TaskCalendarDay: React.FC<TaskCalendarDayProps> = ({
  date,
  tasks,
  hasMoreTasks,
  hiddenTasksCount,
  onTaskClick,
  onToggleExpansion,
  onShowMoreTasks,
  allTasks
}) => {
  const isToday = date.toDateString() === new Date().toDateString();
  const dateKey = date.toISOString().split('T')[0];
  
  const handleShowMore = () => {
    if (onShowMoreTasks) {
      onShowMoreTasks(dateKey, allTasks);
    } else {
      onToggleExpansion(dateKey);
    }
  };

  return (
    <div className={`min-h-24 p-1 border border-gray-200 dark:border-gray-700 ${
      isToday ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'
    }`}>
      <div className={`text-sm font-medium mb-1 ${
        isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
      }`}>
        {date.getDate()}
      </div>
      
      <div className="space-y-1">
        {tasks.map((task) => (
          <TaskCalendarTask
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task.id)}
          />
        ))}
        
        {hasMoreTasks && (
          <button
            onClick={handleShowMore}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer underline"
          >
            +{hiddenTasksCount} more
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCalendarDay;
