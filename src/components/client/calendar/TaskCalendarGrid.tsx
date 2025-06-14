
import React from 'react';
import { ClientCalendarData, ClientCalendarTask } from '@/types/clientCalendar';
import TaskCalendarDay from './TaskCalendarDay';

interface TaskCalendarGridProps {
  days: (Date | null)[];
  calendarData: ClientCalendarData;
  expandedDays: Set<string>;
  onToggleExpansion: (dateString: string) => void;
  onTaskClick: (eventId: string) => void;
}

const TaskCalendarGrid: React.FC<TaskCalendarGridProps> = ({
  days,
  calendarData,
  expandedDays,
  onToggleExpansion,
  onTaskClick
}) => {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getTasksForDate = (date: Date | null): ClientCalendarTask[] => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return calendarData[dateString] || [];
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="grid grid-cols-7 gap-0 border rounded-lg overflow-hidden">
      {/* Week day headers */}
      {weekDays.map((day) => (
        <div
          key={day}
          className="p-3 text-center font-medium bg-gray-50 dark:bg-gray-800 border-b border-r text-gray-700 dark:text-gray-300"
        >
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {days.map((date, index) => {
        const tasksForDate = getTasksForDate(date);
        const dateString = date?.toISOString().split('T')[0] || '';
        const isExpanded = expandedDays.has(dateString);
        
        return (
          <TaskCalendarDay
            key={index}
            date={date}
            tasks={tasksForDate}
            isToday={isToday(date)}
            isExpanded={isExpanded}
            onToggleExpansion={onToggleExpansion}
            onTaskClick={onTaskClick}
          />
        );
      })}
    </div>
  );
};

export default TaskCalendarGrid;
