
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, User, Building2 } from 'lucide-react';
import { useTaskCalendar } from '@/hooks/useTaskCalendar';
import { CalendarTask } from '@/services/calendarService';

const TaskCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const { calendarData, loading, error, fetchCalendarData } = useTaskCalendar();

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getTasksForDate = (date: Date | null): CalendarTask[] => {
    if (!date) return [];
    
    const dateString = date.toISOString().split('T')[0];
    return calendarData[dateString] || [];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-orange-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityBorderColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-orange-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const handleTaskClick = (taskId: string) => {
    console.log('Task clicked:', taskId);
    // This function can be implemented to open a task detail modal or navigate to task details
  };

  const toggleDayExpansion = (dateString: string) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dateString)) {
        newSet.delete(dateString);
      } else {
        newSet.add(dateString);
      }
      return newSet;
    });
  };

  const renderTaskItem = (task: CalendarTask) => {
    const taskElement = (
      <div
        key={task.id}
        className={`
          text-xs p-2 mb-1 rounded cursor-pointer transition-all hover:shadow-md
          bg-white dark:bg-gray-800 border-l-4 ${getPriorityBorderColor(task.priority)}
          hover:bg-gray-50 dark:hover:bg-gray-700
        `}
        onClick={() => handleTaskClick(task.id)}
      >
        <div className="font-medium truncate text-gray-900 dark:text-white">
          {task.title}
        </div>
        {task.client_name && (
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mt-1">
            <Building2 className="w-3 h-3" />
            <span className="truncate">{task.client_name}</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-1">
          <Badge className={`${getPriorityColor(task.priority)} text-xs px-1 py-0`}>
            {task.priority}
          </Badge>
          {task.assigned_to_name && (
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <User className="w-3 h-3" />
              <span className="truncate max-w-20">{task.assigned_to_name}</span>
            </div>
          )}
        </div>
      </div>
    );

    if (task.description || task.assigned_to_name) {
      return (
        <TooltipProvider key={task.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              {taskElement}
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-3">
              <div className="space-y-2">
                <div className="font-medium">{task.title}</div>
                {task.description && (
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {task.description}
                  </div>
                )}
                {task.assigned_to_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4" />
                    <span>Assigned to: {task.assigned_to_name}</span>
                  </div>
                )}
                {task.client_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4" />
                    <span>Client: {task.client_name}</span>
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return taskElement;
  };

  // Fetch data when component mounts or month changes
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    fetchCalendarData(startDate, endDate);
  }, [currentDate]);

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {formatMonthYear(currentDate)}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
                disabled={loading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
                disabled={loading}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                disabled={loading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
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
            <div className="grid grid-cols-7 gap-1">
              {/* Week day headers */}
              {weekDays.map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400 border-b">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {days.map((date, index) => {
                const tasksForDate = getTasksForDate(date);
                const dateString = date?.toISOString().split('T')[0] || '';
                const isExpanded = expandedDays.has(dateString);
                const visibleTasks = isExpanded ? tasksForDate : tasksForDate.slice(0, 3);
                const hiddenTasksCount = tasksForDate.length - 3;
                
                return (
                  <div
                    key={index}
                    className={`min-h-32 p-2 border border-gray-200 dark:border-gray-700 ${
                      date ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
                    } ${isToday(date) ? 'ring-2 ring-primary bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-medium mb-2 ${
                          isToday(date) ? 'text-primary font-bold' : 'text-gray-900 dark:text-white'
                        }`}>
                          {date.getDate()}
                        </div>
                        
                        <div className="space-y-1">
                          {visibleTasks.map(task => renderTaskItem(task))}
                          
                          {!isExpanded && hiddenTasksCount > 0 && (
                            <button
                              onClick={() => toggleDayExpansion(dateString)}
                              className="text-xs text-primary hover:text-primary/80 underline w-full text-left"
                            >
                              +{hiddenTasksCount} more
                            </button>
                          )}
                          
                          {isExpanded && hiddenTasksCount > 0 && (
                            <button
                              onClick={() => toggleDayExpansion(dateString)}
                              className="text-xs text-gray-500 hover:text-gray-700 underline w-full text-left"
                            >
                              Show less
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Priority Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm">Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Low Priority</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCalendar;
