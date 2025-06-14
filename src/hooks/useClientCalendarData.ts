
import { useMemo } from 'react';
import { CalendarData } from '@/services/calendarService';
import { ClientCalendarData, ClientCalendarTask } from '@/types/clientCalendar';

export const useClientCalendarData = (calendarData: CalendarData): ClientCalendarData => {
  return useMemo(() => {
    const converted: ClientCalendarData = {};
    
    Object.entries(calendarData).forEach(([date, events]) => {
      converted[date] = events
        .filter((event): event is import('@/services/calendarService').CalendarTask => 
          'title' in event && 'status' in event
        )
        .map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          priority: event.priority,
          status: event.status,
          deadline_date: event.deadline_date,
          start_date: event.start_date,
          client_name: event.client_name,
          assigned_to_name: event.assigned_to_name,
          category_name: event.category_name
        }));
    });
    
    return converted;
  }, [calendarData]);
};
