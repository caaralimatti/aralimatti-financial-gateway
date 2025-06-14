
import { useState, useCallback } from 'react';
import { calendarService, CalendarData } from '@/services/calendarService';

export const useTaskCalendar = () => {
  const [calendarData, setCalendarData] = useState<CalendarData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendarData = useCallback(async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true);
      setError(null);
      
      const start = startDate.toISOString().split('T')[0];
      const end = endDate.toISOString().split('T')[0];
      
      const data = await calendarService.fetchTasksForDateRange(start, end);
      setCalendarData(data);
    } catch (err) {
      console.error('Error fetching calendar data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch calendar data');
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    calendarData,
    loading,
    error,
    fetchCalendarData
  };
};
