
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useTasks } from '@/hooks/useTasks';
import { useAdminTasksFilters } from '@/hooks/useAdminTasksFilters';
import AdminTasksHeader from './tasks/AdminTasksHeader';
import AdminTasksFilters from './tasks/AdminTasksFilters';
import AdminTasksGrid from './tasks/AdminTasksGrid';
import AddTaskModal from './AddTaskModal';

const AdminTasksList = () => {
  const { tasks, loading, refetch, deleteTask } = useTasks();
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

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

  const handleViewDetails = (task: any) => {
    alert(`Task Details\nTitle: ${task.title}\nID: ${task.id}`);
  };

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
    </div>
  );
};

export default AdminTasksList;
