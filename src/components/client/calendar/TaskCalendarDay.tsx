
import React from 'react';
import { CalendarTask, CalendarCompliance } from '@/services/calendarService';

type CalendarEvent = CalendarTask | CalendarCompliance;
import TaskCalendarTask from './TaskCalendarTask';

interface TaskCalendarDayProps {
  date: Date | null;
  events: CalendarEvent[];
  isToday: boolean;
  isExpanded: boolean;
  onToggleExpansion: (dateString: string) => void;
  onTaskClick: (eventId: string) => void;
}

const TaskCalendarDay = ({
  date,
  events,
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
  const visibleEvents = isExpanded ? events : events.slice(0, 3);
  const hiddenEventsCount = events.length - 3;

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
        {visibleEvents.map(event => {
          // Distinguish between tasks and compliance deadlines
          if ('title' in event) {
            // Task
            return (
              <div
                key={event.id}
                className={`cursor-pointer px-2 py-1 rounded text-xs mb-1 ${event.priority === 'high' ? 'bg-red-100 text-red-700' : event.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
                onClick={() => onTaskClick(event.id)}
              >
                <span className="font-semibold">Task:</span> {event.title}
              </div>
            );
          } else {
            // Compliance Deadline
            return (
              <div
                key={event.id}
                className="cursor-pointer px-2 py-1 rounded text-xs mb-1 bg-blue-100 text-blue-700"
                onClick={() => onTaskClick(event.id)}
              >
                <span className="font-semibold">Compliance:</span> {event.compliance_type}
              </div>
            );
          }
        })}
        
        {!isExpanded && hiddenEventsCount > 0 && (
          <button
            onClick={() => onToggleExpansion(dateString)}
            className="text-xs text-primary hover:text-primary/80 underline w-full text-left"
          >
            +{hiddenEventsCount} more
          </button>
        )}
        
        {isExpanded && hiddenEventsCount > 0 && (
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
