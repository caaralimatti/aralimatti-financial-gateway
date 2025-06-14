
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Task } from '@/types/task';
import AdminTaskCard from './AdminTaskCard';

interface AdminTasksGridProps {
  tasks: Task[];
  onCreateTask: () => void;
  onDeleteTask: (taskId: string) => void;
  onViewDetails: (task: Task) => void;
}

const AdminTasksGrid = ({ 
  tasks, 
  onCreateTask,
  onDeleteTask,
  onViewDetails
}: AdminTasksGridProps) => {
  const handleTaskUpdated = () => {
    // This will be handled by the parent component's refetch
    window.location.reload();
  };

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button onClick={onCreateTask}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Task
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <AdminTaskCard
          key={task.id}
          task={task}
          onTaskUpdated={handleTaskUpdated}
          onDelete={onDeleteTask}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default AdminTasksGrid;
