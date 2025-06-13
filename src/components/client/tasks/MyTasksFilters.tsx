
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/task';

interface MyTasksFiltersProps {
  filter: string;
  onFilterChange: (filter: string) => void;
  tasks: Task[];
}

const MyTasksFilters: React.FC<MyTasksFiltersProps> = ({ filter, onFilterChange, tasks }) => {
  const filterOptions = [
    { key: 'all', label: 'All Tasks', count: tasks.length },
    { key: 'to_do', label: 'To Do', count: tasks.filter(t => t.status === 'to_do').length },
    { key: 'in_progress', label: 'In Progress', count: tasks.filter(t => t.status === 'in_progress').length },
    { key: 'pending_approval', label: 'Pending Approval', count: tasks.filter(t => t.status === 'pending_approval').length },
    { key: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'completed').length },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {filterOptions.map((filterOption) => (
        <Button
          key={filterOption.key}
          variant={filter === filterOption.key ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(filterOption.key)}
          className="flex items-center gap-2"
        >
          {filterOption.label}
          <Badge variant="secondary" className="text-xs">
            {filterOption.count}
          </Badge>
        </Button>
      ))}
    </div>
  );
};

export default MyTasksFilters;
