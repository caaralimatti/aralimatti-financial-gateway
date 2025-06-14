
import { useState, useMemo } from 'react';
import { CalendarData } from '@/services/calendarService';

export const useComplianceTypeFilter = (calendarData: CalendarData) => {
  const [selectedComplianceType, setSelectedComplianceType] = useState<string>('all');

  // Extract unique compliance types from calendar data
  const complianceTypes = useMemo(() => {
    const types = new Set<string>();
    
    Object.values(calendarData).forEach(events => {
      events.forEach(event => {
        if ('compliance_type' in event) {
          types.add(event.compliance_type);
        } else if ('title' in event && event.category_name) {
          types.add(event.category_name);
        }
      });
    });
    
    return Array.from(types).sort();
  }, [calendarData]);

  // Filter calendar data based on selected compliance type
  const filteredCalendarData = useMemo(() => {
    if (selectedComplianceType === 'all') {
      return calendarData;
    }

    const filtered: CalendarData = {};
    
    Object.entries(calendarData).forEach(([date, events]) => {
      const filteredEvents = events.filter(event => {
        if ('compliance_type' in event) {
          return event.compliance_type === selectedComplianceType;
        } else if ('title' in event && event.category_name) {
          return event.category_name === selectedComplianceType;
        }
        return false;
      });
      
      if (filteredEvents.length > 0) {
        filtered[date] = filteredEvents;
      }
    });
    
    return filtered;
  }, [calendarData, selectedComplianceType]);

  return {
    selectedComplianceType,
    setSelectedComplianceType,
    complianceTypes,
    filteredCalendarData
  };
};
