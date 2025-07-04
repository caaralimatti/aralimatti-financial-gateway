
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useTaskCalendar } from '@/hooks/useTaskCalendar';
import { useTaskCalendarLogic } from '@/hooks/useTaskCalendarLogic';
import { useComplianceTypeFilter } from '@/hooks/useComplianceTypeFilter';
import { CalendarTask, CalendarCompliance } from '@/services/calendarService';
import TaskCalendarGrid from './calendar/TaskCalendarGrid';
import TaskCalendarHeader from './calendar/TaskCalendarHeader';
import TaskEventModal from './calendar/TaskEventModal';
import ComplianceTypeFilter from '../shared/ComplianceTypeFilter';
import DayTasksModal from '../shared/DayTasksModal';

const TaskCalendar: React.FC = () => {
  const { calendarData, loading, error, fetchCalendarData } = useTaskCalendar();
  const {
    currentDate,
    expandedDays,
    getDaysInMonth,
    navigateMonth,
    goToToday,
    toggleDayExpansion,
    handleTaskClick
  } = useTaskCalendarLogic();

  // Compliance type filter
  const { selectedComplianceType, setSelectedComplianceType, complianceTypes, filteredCalendarData } = useComplianceTypeFilter(calendarData);

  const [selectedEvent, setSelectedEvent] = useState<CalendarTask | CalendarCompliance | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Day tasks modal state
  const [dayTasksModal, setDayTasksModal] = useState<{
    isOpen: boolean;
    date: string;
    events: (CalendarTask | CalendarCompliance)[];
  }>({
    isOpen: false,
    date: '',
    events: []
  });

  useEffect(() => {
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    fetchCalendarData(startDate, endDate);
  }, [currentDate, fetchCalendarData]);

  const handleEventClick = (event: CalendarTask | CalendarCompliance) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleShowMoreTasks = (date: string, events: (CalendarTask | CalendarCompliance)[]) => {
    setDayTasksModal({
      isOpen: true,
      date,
      events
    });
  };

  const handleCloseDayTasksModal = () => {
    setDayTasksModal({
      isOpen: false,
      date: '',
      events: []
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error loading calendar: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const days = getDaysInMonth(currentDate);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Task Calendar</h1>
        </div>
        <div className="flex items-center gap-4">
          <ComplianceTypeFilter
            complianceTypes={complianceTypes}
            selectedType={selectedComplianceType}
            onTypeChange={setSelectedComplianceType}
          />
          <Button onClick={goToToday} variant="outline">
            Today
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <TaskCalendarHeader
            currentDate={currentDate}
            onNavigate={navigateMonth}
          />
        </CardHeader>
        <CardContent className="p-0">
          <TaskCalendarGrid
            days={days}
            currentDate={currentDate}
            calendarData={filteredCalendarData}
            expandedDays={expandedDays}
            onToggleDayExpansion={toggleDayExpansion}
            onEventClick={handleEventClick}
            onShowMoreTasks={handleShowMoreTasks}
          />
        </CardContent>
      </Card>

      <TaskEventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <DayTasksModal
        isOpen={dayTasksModal.isOpen}
        onClose={handleCloseDayTasksModal}
        date={dayTasksModal.date}
        events={dayTasksModal.events}
      />
    </div>
  );
};

export default TaskCalendar;
