
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Task } from '@/types/task';
import AdminTaskCard from './AdminTaskCard';

interface AdminTasksGridProps {
  tasks: Task[];
  onDeleteTask: (taskId: string, taskTitle: string) => void;
  deleteLoading: string | null;
  onCreateTask: () => void;
}

const AdminTasksGrid = ({ 
  tasks, 
  onDeleteTask, 
  deleteLoading,
  onCreateTask 
}: AdminTasksGridProps) => {
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
          onDelete={onDeleteTask}
          deleteLoading={deleteLoading}
        />
      ))}
    </div>
  );
};

export default AdminTasksGrid;
