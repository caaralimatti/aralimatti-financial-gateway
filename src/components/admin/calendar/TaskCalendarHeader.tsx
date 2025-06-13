
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TaskCalendarHeaderProps {
  currentDate: Date;
  onNavigate: (direction: 'prev' | 'next') => void;
}

const TaskCalendarHeader: React.FC<TaskCalendarHeaderProps> = ({
  currentDate,
  onNavigate
}) => {
  const monthYear = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('prev')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{monthYear}</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('next')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskCalendarHeader;
