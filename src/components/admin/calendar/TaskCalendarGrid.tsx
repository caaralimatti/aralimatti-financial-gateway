
import React from 'react';
import { CalendarData, CalendarTask, CalendarCompliance } from '@/services/calendarService';
import TaskCalendarDay from './TaskCalendarDay';

interface TaskCalendarGridProps {
  days: (Date | null)[];
  currentDate: Date;
  calendarData: CalendarData;
  expandedDays: Set<string>;
  onToggleDayExpansion: (dateString: string) => void;
  onEventClick: (event: CalendarTask | CalendarCompliance) => void;
  onShowMoreTasks?: (date: string, events: (CalendarTask | CalendarCompliance)[]) => void;
}

const TaskCalendarGrid: React.FC<TaskCalendarGridProps> = ({
  days,
  currentDate,
  calendarData,
  expandedDays,
  onToggleDayExpansion,
  onEventClick,
  onShowMoreTasks
}) => {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="grid grid-cols-7 gap-0 border">
      {/* Week day headers */}
      {weekDays.map((day) => (
        <div
          key={day}
          className="p-3 text-center font-medium bg-gray-50 border-b border-r"
        >
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {days.map((day, index) => (
        <TaskCalendarDay
          key={index}
          day={day}
          currentDate={currentDate}
          calendarData={calendarData}
          expandedDays={expandedDays}
          onToggleDayExpansion={onToggleDayExpansion}
          onEventClick={onEventClick}
          onShowMoreTasks={onShowMoreTasks}
        />
      ))}
    </div>
  );
};

export default TaskCalendarGrid;
