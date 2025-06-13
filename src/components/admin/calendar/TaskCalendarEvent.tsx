
import React from 'react';
import { CalendarTask, CalendarCompliance } from '@/services/calendarService';

interface TaskCalendarEventProps {
  event: CalendarTask | CalendarCompliance;
  onClick: () => void;
}

const TaskCalendarEvent: React.FC<TaskCalendarEventProps> = ({ event, onClick }) => {
  const getEventColor = (priority: string, isCompliance: boolean = false) => {
    if (isCompliance) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
    
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isCompliance = 'compliance_type' in event;
  const colorClass = getEventColor(event.priority, isCompliance);

  return (
    <div
      className={`p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity border ${colorClass}`}
      onClick={onClick}
    >
      <div className="font-medium truncate">
        {isCompliance ? (event as CalendarCompliance).compliance_type : (event as CalendarTask).title}
      </div>
      {(event as CalendarTask).client_name && (
        <div className="text-xs opacity-75 truncate">
          {(event as CalendarTask).client_name}
        </div>
      )}
    </div>
  );
};

export default TaskCalendarEvent;
