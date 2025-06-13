
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TasksListHeaderProps {
  filteredCount: number;
  totalCount: number;
  selectedCount: number;
  onBulkAction?: (action: string) => void;
}

const TasksListHeader: React.FC<TasksListHeaderProps> = ({
  filteredCount,
  totalCount,
  selectedCount,
  onBulkAction
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredCount} of {totalCount} tasks
        </span>
        {selectedCount > 0 && (
          <Badge variant="secondary">
            {selectedCount} selected
          </Badge>
        )}
      </div>
      
      {selectedCount > 0 && onBulkAction && (
        <div className="flex gap-2">
          <button 
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={() => onBulkAction('assign')}
          >
            Bulk Assign
          </button>
          <button 
            className="text-sm text-green-600 hover:text-green-800"
            onClick={() => onBulkAction('complete')}
          >
            Mark Complete
          </button>
          <button 
            className="text-sm text-red-600 hover:text-red-800"
            onClick={() => onBulkAction('delete')}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TasksListHeader;
