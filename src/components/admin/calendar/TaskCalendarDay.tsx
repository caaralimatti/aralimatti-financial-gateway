
import React from 'react';
import { CalendarData, CalendarTask } from '@/services/calendarService';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import TaskCalendarEvent from './TaskCalendarEvent';

interface TaskCalendarDayProps {
  day: Date | null;
  currentDate: Date;
  calendarData: CalendarData;
  expandedDays: Set<string>;
  onToggleDayExpansion: (dateString: string) => void;
  onEventClick: (event: any) => void;
}

const TaskCalendarDay: React.FC<TaskCalendarDayProps> = ({
  day,
  currentDate,
  calendarData,
  expandedDays,
  onToggleDayExpansion,
  onEventClick
}) => {
  if (!day) {
    return <div className="min-h-[120px] border-r border-b bg-gray-50"></div>;
  }

  const dateString = day.toISOString().split('T')[0];
  const dayEvents = calendarData[dateString] || [];
  const isToday = day.toDateString() === new Date().toDateString();
  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
  const isExpanded = expandedDays.has(dateString);

  const visibleEvents = isExpanded ? dayEvents : dayEvents.slice(0, 2);
  const hasMoreEvents = dayEvents.length > 2;

  return (
    <div className={`min-h-[120px] border-r border-b p-2 ${
      !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
    } ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${
          isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''
        }`}>
          {day.getDate()}
        </span>
        {hasMoreEvents && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleDayExpansion(dateString)}
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
        {visibleEvents.map((event, index) => (
          <TaskCalendarEvent
            key={`${event.id}-${index}`}
            event={event}
            onClick={() => onEventClick(event)}
          />
        ))}
        {!isExpanded && hasMoreEvents && (
          <div className="text-xs text-gray-500">
            +{dayEvents.length - 2} more
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCalendarDay;
