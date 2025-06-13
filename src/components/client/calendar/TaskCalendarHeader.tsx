
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface TaskCalendarHeaderProps {
  currentDate: Date;
  loading: boolean;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onToday: () => void;
}

const TaskCalendarHeader = ({ 
  currentDate, 
  loading, 
  onNavigateMonth, 
  onToday 
}: TaskCalendarHeaderProps) => {
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5" />
        {formatMonthYear(currentDate)}
      </CardTitle>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigateMonth('prev')}
          disabled={loading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          disabled={loading}
        >
          Today
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigateMonth('next')}
          disabled={loading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskCalendarHeader;
