
import React from 'react';
import { ClientCalendarData } from '@/types/clientCalendar';
import TaskCalendarDay from './TaskCalendarDay';

interface TaskCalendarGridProps {
  days: (Date | null)[];
  calendarData: ClientCalendarData;
  expandedDays: Set<string>;
  onToggleExpansion: (dateString: string) => void;
  onTaskClick: (taskId: string) => void;
}

const TaskCalendarGrid: React.FC<TaskCalendarGridProps> = ({
  days,
  calendarData,
  expandedDays,
  onToggleExpansion,
  onTaskClick
}) => {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
      {days.map((day, index) => (
        <TaskCalendarDay
          key={index}
          day={day}
          calendarData={calendarData}
          expandedDays={expandedDays}
          onToggleExpansion={onToggleExpansion}
          onTaskClick={onTaskClick}
        />
      ))}
    </div>
  );
};

export default TaskCalendarGrid;
