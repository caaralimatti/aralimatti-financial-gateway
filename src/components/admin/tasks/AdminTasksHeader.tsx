
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AdminTasksHeaderProps {
  onCreateTask: () => void;
}

const AdminTasksHeader = ({ onCreateTask }: AdminTasksHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Tasks</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and monitor all tasks across the organization
        </p>
      </div>
      <Button onClick={onCreateTask} className="bg-primary hover:bg-primary/90">
        <Plus className="h-4 w-4 mr-2" />
        Create Task
      </Button>
    </div>
  );
};

export default AdminTasksHeader;
