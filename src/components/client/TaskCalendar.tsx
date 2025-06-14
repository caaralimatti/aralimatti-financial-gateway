
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTaskCalendar } from '@/hooks/useTaskCalendar';
import { useTaskCalendarLogic } from '@/hooks/useTaskCalendarLogic';
import { useClientCalendarData } from '@/hooks/useClientCalendarData';
import { useTaskModal } from '@/hooks/useTaskModal';
import TaskCalendarHeader from './calendar/TaskCalendarHeader';
import TaskCalendarGrid from './calendar/TaskCalendarGrid';
import TaskCalendarLegend from './calendar/TaskCalendarLegend';
import TaskDetailModal from './calendar/TaskDetailModal';

const TaskCalendar = () => {
  const { calendarData, loading, error, fetchCalendarData } = useTaskCalendar();
  const {
    currentDate,
    expandedDays,
    getDaysInMonth,
    navigateMonth,
    goToToday,
    toggleDayExpansion,
    handleTaskClick: baseHandleTaskClick
  } = useTaskCalendarLogic();

  // Convert admin calendar data to client calendar data (tasks only)
  const clientCalendarData = useClientCalendarData(calendarData);

  // Modal state management
  const { selectedTask, isModalOpen, handleTaskClick, handleCloseModal } = useTaskModal(clientCalendarData);

  // Fetch data when component mounts or month changes
  useEffect(() => {
    console.log('DEBUG: useEffect fired with currentDate', currentDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    fetchCalendarData(startDate, endDate);
  }, [currentDate, fetchCalendarData]);

  const handleTaskClickInternal = (taskId: string) => {
    handleTaskClick(taskId);
    baseHandleTaskClick(taskId);
  };

  const days = getDaysInMonth(currentDate);

  console.log('DEBUG: clientCalendarData', clientCalendarData);
  console.log('DEBUG: calendarData', calendarData);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Task Calendar</h2>
          <p className="text-gray-600 dark:text-gray-400">
            View your tasks organized by deadline dates
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="p-0">
          <TaskCalendarHeader
            currentDate={currentDate}
            loading={loading}
            onNavigateMonth={navigateMonth}
            onToday={goToToday}
          />
        </CardHeader>
        <CardContent className="p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading calendar...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400 mb-4">Error loading calendar: {error}</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const year = currentDate.getFullYear();
                    const month = currentDate.getMonth();
                    const startDate = new Date(year, month, 1);
                    const endDate = new Date(year, month + 1, 0);
                    fetchCalendarData(startDate, endDate);
                  }}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : (
            <TaskCalendarGrid
              days={days}
              calendarData={clientCalendarData}
              expandedDays={expandedDays}
              onToggleExpansion={toggleDayExpansion}
              onTaskClick={handleTaskClickInternal}
            />
          )}
        </CardContent>
      </Card>

      <TaskCalendarLegend />

      <TaskDetailModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default TaskCalendar;
