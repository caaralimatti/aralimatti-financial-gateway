
import React from 'react';
import { CalendarTask, CalendarCompliance } from '@/services/calendarService';
import TaskCalendarDay from './TaskCalendarDay';

type CalendarEvent = CalendarTask | CalendarCompliance;

interface TaskCalendarGridProps {
  days: (Date | null)[];
  calendarData: { [date: string]: CalendarEvent[] };
  expandedDays: Set<string>;
  onToggleExpansion: (dateString: string) => void;
  onTaskClick: (eventId: string) => void;
}

const TaskCalendarGrid = ({
  days,
  calendarData,
  expandedDays,
  onToggleExpansion,
  onTaskClick
}: TaskCalendarGridProps) => {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDate = (date: Date | null): CalendarEvent[] => {
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
    <div className="grid grid-cols-7 gap-1">
      {/* Week day headers */}
      {weekDays.map(day => (
        <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400 border-b">
          {day}
        </div>
      ))}
      
      {/* Calendar days */}
      {days.map((date, index) => {
        const eventsForDate = getEventsForDate(date);
        const dateString = date?.toISOString().split('T')[0] || '';
        const isExpanded = expandedDays.has(dateString);
        
        return (
          <TaskCalendarDay
            key={index}
            date={date}
            events={eventsForDate}
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
