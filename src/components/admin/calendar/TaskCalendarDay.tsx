
import React from 'react';
import { CalendarData, CalendarTask, CalendarCompliance } from '@/services/calendarService';
import TaskCalendarEvent from './TaskCalendarEvent';

interface TaskCalendarDayProps {
  day: Date | null;
  currentDate: Date;
  calendarData: CalendarData;
  expandedDays: Set<string>;
  onToggleDayExpansion: (dateString: string) => void;
  onEventClick: (event: CalendarTask | CalendarCompliance) => void;
  onShowMoreTasks?: (date: string, events: (CalendarTask | CalendarCompliance)[]) => void;
}

const TaskCalendarDay: React.FC<TaskCalendarDayProps> = ({
  day,
  currentDate,
  calendarData,
  expandedDays,
  onToggleDayExpansion,
  onEventClick,
  onShowMoreTasks
}) => {
  if (!day) {
    return <div className="min-h-24 bg-gray-50 border-b border-r"></div>;
  }

  const dateString = day.toISOString().split('T')[0];
  const events = calendarData[dateString] || [];
  const isExpanded = expandedDays.has(dateString);
  const isToday = day.toDateString() === new Date().toDateString();
  const isCurrentMonth = day.getMonth() === currentDate.getMonth();

  const maxVisibleEvents = 3;
  const visibleEvents = isExpanded ? events : events.slice(0, maxVisibleEvents);
  const hiddenEventsCount = events.length - maxVisibleEvents;
  const hasMoreEvents = !isExpanded && events.length > maxVisibleEvents;

  const handleShowMore = () => {
    if (onShowMoreTasks) {
      onShowMoreTasks(dateString, events);
    } else {
      onToggleDayExpansion(dateString);
    }
  };

  return (
    <div className={`min-h-24 p-2 border-b border-r ${
      isToday ? 'bg-blue-50' : isCurrentMonth ? 'bg-white' : 'bg-gray-50'
    }`}>
      <div className={`text-sm font-medium mb-1 ${
        isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
      }`}>
        {day.getDate()}
      </div>
      
      <div className="space-y-1">
        {visibleEvents.map((event, index) => (
          <TaskCalendarEvent
            key={`${event.id}-${index}`}
            event={event}
            onClick={() => onEventClick(event)}
          />
        ))}
        
        {hasMoreEvents && (
          <button
            onClick={handleShowMore}
            className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer underline"
          >
            +{hiddenEventsCount} more
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCalendarDay;
