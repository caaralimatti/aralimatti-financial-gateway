
import React from 'react';
import { ClientCalendarData } from '@/types/clientCalendar';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import TaskCalendarTask from './TaskCalendarTask';

interface TaskCalendarDayProps {
  day: Date | null;
  calendarData: ClientCalendarData;
  expandedDays: Set<string>;
  onToggleExpansion: (dateString: string) => void;
  onTaskClick: (taskId: string) => void;
}

const TaskCalendarDay: React.FC<TaskCalendarDayProps> = ({
  day,
  calendarData,
  expandedDays,
  onToggleExpansion,
  onTaskClick
}) => {
  if (!day) {
    return <div className="min-h-[120px] border-r border-b bg-gray-50 dark:bg-gray-800"></div>;
  }

  const dateString = day.toISOString().split('T')[0];
  const dayTasks = calendarData[dateString] || [];
  const isToday = day.toDateString() === new Date().toDateString();
  const isExpanded = expandedDays.has(dateString);

  const visibleTasks = isExpanded ? dayTasks : dayTasks.slice(0, 2);
  const hasMoreTasks = dayTasks.length > 2;

  return (
    <div className={`min-h-[120px] border-r border-b p-2 ${
      isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : 'bg-white dark:bg-gray-900'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${
          isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : 'text-gray-900 dark:text-gray-100'
        }`}>
          {day.getDate()}
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
        {visibleTasks.map((task, index) => (
          <TaskCalendarTask
            key={`${task.id}-${index}`}
            task={task}
            onClick={() => onTaskClick(task.id)}
          />
        ))}
        {!isExpanded && hasMoreTasks && (
          <div className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer" 
               onClick={() => onToggleExpansion(dateString)}>
            +{dayTasks.length - 2} more
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCalendarDay;
