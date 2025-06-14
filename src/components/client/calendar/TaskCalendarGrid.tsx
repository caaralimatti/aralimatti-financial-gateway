
import React from 'react';
import { Button } from '@/components/ui/button';
import { ClientCalendarData } from '@/types/clientCalendar';
import TaskCalendarDay from './TaskCalendarDay';

interface TaskCalendarGridProps {
  days: Date[];
  calendarData: ClientCalendarData;
  expandedDays: Set<string>;
  onToggleExpansion: (date: string) => void;
  onTaskClick: (taskId: string) => void;
  onShowMoreTasks?: (date: string, events: any[]) => void;
}

const TaskCalendarGrid: React.FC<TaskCalendarGridProps> = ({
  days,
  calendarData,
  expandedDays,
  onToggleExpansion,
  onTaskClick,
  onShowMoreTasks
}) => {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="grid grid-cols-7 gap-1 p-4">
      {/* Header row */}
      {weekDays.map((day) => (
        <div key={day} className="p-2 text-center font-medium text-gray-500 dark:text-gray-400">
          {day}
        </div>
      ))}
      
      {/* Calendar days */}
      {days.map((day) => {
        const dateKey = day.toISOString().split('T')[0];
        const dayTasks = calendarData[dateKey] || [];
        const isExpanded = expandedDays.has(dateKey);
        const maxVisibleTasks = 3;
        const hasMoreTasks = dayTasks.length > maxVisibleTasks;
        const visibleTasks = isExpanded ? dayTasks : dayTasks.slice(0, maxVisibleTasks);
        const hiddenTasksCount = dayTasks.length - maxVisibleTasks;

        return (
          <TaskCalendarDay
            key={dateKey}
            date={day}
            tasks={visibleTasks}
            hasMoreTasks={hasMoreTasks && !isExpanded}
            hiddenTasksCount={hiddenTasksCount}
            onTaskClick={onTaskClick}
            onToggleExpansion={onToggleExpansion}
            onShowMoreTasks={onShowMoreTasks}
            allTasks={dayTasks}
          />
        );
      })}
    </div>
  );
};

export default TaskCalendarGrid;
