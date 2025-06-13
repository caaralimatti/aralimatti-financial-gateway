
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTaskCalendar } from '@/hooks/useTaskCalendar';
import { useTaskCalendarLogic } from '@/hooks/useTaskCalendarLogic';
import TaskCalendarHeader from './calendar/TaskCalendarHeader';
import TaskCalendarGrid from './calendar/TaskCalendarGrid';
import TaskCalendarLegend from './calendar/TaskCalendarLegend';

const TaskCalendar = () => {
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

  // Fetch data when component mounts or month changes
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    fetchCalendarData(startDate, endDate);
  }, [currentDate]);

  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Task Calendar</h2>
          <p className="text-gray-600 dark:text-gray-400">
            View tasks organized by deadline dates
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <TaskCalendarHeader
            currentDate={currentDate}
            loading={loading}
            onNavigateMonth={navigateMonth}
            onToday={goToToday}
          />
        </CardHeader>
        <CardContent>
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
                <p className="text-red-600 dark:text-red-400">Error loading calendar: {error}</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const year = currentDate.getFullYear();
                    const month = currentDate.getMonth();
                    const startDate = new Date(year, month, 1);
                    const endDate = new Date(year, month + 1, 0);
                    fetchCalendarData(startDate, endDate);
                  }}
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : (
            <TaskCalendarGrid
              days={days}
              calendarData={calendarData}
              expandedDays={expandedDays}
              onToggleExpansion={toggleDayExpansion}
              onTaskClick={handleTaskClick}
            />
          )}
        </CardContent>
      </Card>

      <TaskCalendarLegend />
    </div>
  );
};

export default TaskCalendar;
