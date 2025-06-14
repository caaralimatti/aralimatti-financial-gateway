
import React, { useState } from 'react';
import { useTasksListFilters } from '@/hooks/useTasksListFilters';
import { getMockTasks } from '@/services/mockTasksService';
import TasksListHeader from './TasksListHeader';
import TasksListEmpty from './TasksListEmpty';
import TasksListGrid from './TasksListGrid';
import TasksListView from './TasksListView';

interface TasksListProps {
  filters: {
    status: string;
    priority: string;
    category: string;
    assignedTo: string;
    dateRange: string;
  };
  searchQuery: string;
  viewMode: 'grid' | 'list';
}

const TasksList: React.FC<TasksListProps> = ({ filters, searchQuery, viewMode }) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [tasks, setTasks] = useState(getMockTasks());
  const { filteredTasks } = useTasksListFilters(tasks, filters, searchQuery);

  const handleSelect = (taskId: string, selected: boolean) => {
    if (selected) {
      setSelectedTasks([...selectedTasks, taskId]);
    } else {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    }
  };

  const handleDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  if (filteredTasks.length === 0) {
    return <TasksListEmpty />;
  }

  return (
    <div className="space-y-4">
      <TasksListHeader
        filteredCount={filteredTasks.length}
        totalCount={tasks.length}
        selectedCount={selectedTasks.length}
        onBulkAction={handleBulkAction}
      />

      {viewMode === 'grid' ? (
        <TasksListGrid
          tasks={filteredTasks}
          selectedTasks={selectedTasks}
          onSelect={handleSelect}
          onDelete={handleDelete}
        />
      ) : (
        <TasksListView
          tasks={filteredTasks}
          selectedTasks={selectedTasks}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
};

export default TasksList;
