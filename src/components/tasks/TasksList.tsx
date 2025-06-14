
import React, { useState } from 'react';
import { useTasksListFilters } from '@/hooks/useTasksListFilters';
import { getMockTasks } from '@/services/mockTasksService';
import { Task } from '@/types/task';
import TasksListHeader from './TasksListHeader';
import TasksListEmpty from './TasksListEmpty';
import TasksListGrid from './TasksListGrid';
import TasksListView from './TasksListView';
import TaskDetailsModal from './TaskDetailsModal';

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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
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

  const handleViewDetails = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setShowDetailsModal(true);
    }
  };

  // Placeholder for bulk action handler (fixes lint)
  const handleBulkAction = () => {};
  
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
          onViewDetails={handleViewDetails}
        />
      ) : (
        <TasksListView
          tasks={filteredTasks}
          selectedTasks={selectedTasks}
          onSelect={handleSelect}
        />
      )}

      <TaskDetailsModal
        task={selectedTask}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
      />
    </div>
  );
};

export default TasksList;
