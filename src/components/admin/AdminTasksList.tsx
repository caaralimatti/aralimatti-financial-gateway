
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useTasks } from '@/hooks/useTasks';
import { useAdminTasksFilters } from '@/hooks/useAdminTasksFilters';
import { Task } from '@/types/task';
import AdminTasksHeader from './tasks/AdminTasksHeader';
import AdminTasksFilters from './tasks/AdminTasksFilters';
import AdminTasksGrid from './tasks/AdminTasksGrid';
import AddTaskModal from './AddTaskModal';
import TaskDetailsModal from '../tasks/TaskDetailsModal';

const AdminTasksList = () => {
  const { tasks, loading, refetch, deleteTask } = useTasks();
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    filteredTasks
  } = useAdminTasksFilters(tasks);

  const handleDeleteTask = async (taskId: string) => {
    setDeleteLoading(taskId);
    try {
      await deleteTask(taskId);
      toast.success(`Task deleted successfully (ID: ${taskId})`);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleCreateTask = () => {
    setShowAddModal(true);
  };

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminTasksHeader onCreateTask={handleCreateTask} />

      <AdminTasksFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      <AdminTasksGrid
        tasks={filteredTasks}
        onCreateTask={handleCreateTask}
        onDeleteTask={handleDeleteTask}
        onViewDetails={handleViewDetails}
      />

      <AddTaskModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onTaskCreated={refetch}
      />

      <TaskDetailsModal
        task={selectedTask}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
      />
    </div>
  );
};

export default AdminTasksList;
