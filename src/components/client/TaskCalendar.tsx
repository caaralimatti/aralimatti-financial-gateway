
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTaskCalendar } from '@/hooks/useTaskCalendar';
import { useTaskCalendarLogic } from '@/hooks/useTaskCalendarLogic';
import { ClientCalendarData, ClientCalendarTask } from '@/types/clientCalendar';
import TaskCalendarHeader from './calendar/TaskCalendarHeader';
import TaskCalendarGrid from './calendar/TaskCalendarGrid';
import TaskCalendarLegend from './calendar/TaskCalendarLegend';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

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

  const [selectedTask, setSelectedTask] = useState<ClientCalendarTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Convert admin calendar data to client calendar data (tasks only)
  const clientCalendarData: ClientCalendarData = React.useMemo(() => {
    const clientData: ClientCalendarData = {};
    
    Object.entries(calendarData).forEach(([date, events]) => {
      // Filter only task events (not compliance deadlines) for client view
      const taskEvents = events.filter(event => 'title' in event) as ClientCalendarTask[];
      if (taskEvents.length > 0) {
        clientData[date] = taskEvents;
      }
    });
    
    return clientData;
  }, [calendarData]);

  // Fetch data when component mounts or month changes
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    fetchCalendarData(startDate, endDate);
  }, [currentDate, fetchCalendarData]);

  const handleTaskClickInternal = (taskId: string) => {
    // Find the task in the calendar data
    let foundTask: ClientCalendarTask | null = null;
    
    Object.values(clientCalendarData).forEach(tasks => {
      const task = tasks.find(t => t.id === taskId || t.id === taskId.replace('-start', ''));
      if (task) {
        foundTask = task;
      }
    });
    
    if (foundTask) {
      setSelectedTask(foundTask);
      setIsModalOpen(true);
    }
    
    handleTaskClick(taskId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'on_hold':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const days = getDaysInMonth(currentDate);

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

      {/* Task Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                Task
              </Badge>
              {selectedTask?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4">
              {selectedTask.description && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">Description</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTask.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">Priority</h4>
                  <Badge variant={getPriorityColor(selectedTask.priority)}>
                    {selectedTask.priority}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">Status</h4>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {selectedTask.category_name && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">Category</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTask.category_name}</p>
                </div>
              )}

              {selectedTask.assigned_to_name && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">Assigned To</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTask.assigned_to_name}</p>
                </div>
              )}

              {selectedTask.client_name && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">Client</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTask.client_name}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {selectedTask.start_date && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">Start Date</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(selectedTask.start_date).toLocaleDateString()}</p>
                  </div>
                )}

                {selectedTask.deadline_date && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">Deadline Date</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(selectedTask.deadline_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskCalendar;
