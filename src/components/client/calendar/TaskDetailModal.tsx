
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ClientCalendarTask } from '@/types/clientCalendar';

interface TaskDetailModalProps {
  task: ClientCalendarTask | null;
  isOpen: boolean;
  onClose: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, isOpen, onClose }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'on_hold':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              Task
            </Badge>
            {task?.title}
          </DialogTitle>
        </DialogHeader>

        {task && (
          <div className="space-y-4">
            {task.description && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">Description</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">Priority</h4>
                <Badge variant={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">Status</h4>
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {task.category_name && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">Category</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{task.category_name}</p>
              </div>
            )}

            {task.assigned_to_name && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">Assigned To</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{task.assigned_to_name}</p>
              </div>
            )}

            {task.client_name && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">Client</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{task.client_name}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {task.start_date && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">Start Date</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(task.start_date).toLocaleDateString()}</p>
                </div>
              )}

              {task.deadline_date && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">Deadline Date</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(task.deadline_date).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
