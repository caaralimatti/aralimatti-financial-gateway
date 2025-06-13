
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface TaskCalendarHeaderProps {
  currentDate: Date;
  loading: boolean;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onToday: () => void;
}

const TaskCalendarHeader: React.FC<TaskCalendarHeaderProps> = ({
  currentDate,
  loading,
  onNavigateMonth,
  onToday
}) => {
  const monthYear = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{monthYear}</h2>
        </div>
        <div className="flex items-center space-x-1">
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
            onClick={() => onNavigateMonth('next')}
            disabled={loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button
        variant="outline"
        onClick={onToday}
        disabled={loading}
      >
        Today
      </Button>
    </div>
  );
};

export default TaskCalendarHeader;
