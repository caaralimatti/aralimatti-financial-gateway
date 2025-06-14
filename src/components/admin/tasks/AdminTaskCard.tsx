
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  User, 
  Building2, 
  MoreHorizontal,
  Eye
} from 'lucide-react';
import { Task } from '@/types/task';
import { getStatusColor, getPriorityColor, formatDate } from '@/utils/taskUtils';
import TaskMarkCompleted from '@/components/tasks/TaskMarkCompleted';

interface AdminTaskCardProps {
  task: Task;
  onTaskUpdated: () => void;
  onDelete: (taskId: string) => void;
  onViewDetails: (task: Task) => void;
}

const AdminTaskCard: React.FC<AdminTaskCardProps> = ({ task, onTaskUpdated, onDelete, onViewDetails }) => {
  const [showConfirm, setShowConfirm] = React.useState(false);
  const isCompleted = (task.status === 'completed');

  const handleDelete = () => {
    if (isCompleted) {
      setShowConfirm(true);
    } else {
      onDelete(task.id);
    }
  };

  const confirmDelete = () => {
    setShowConfirm(false);
    onDelete(task.id);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold text-lg leading-tight">{task.title}</h3>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(task.status)}>
                {task.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority.toUpperCase()}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {task.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>Assigned to: {task.assigned_to?.full_name || 'Unassigned'}</span>
          </div>

          {task.client && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="h-4 w-4" />
              <span>Client: {task.client.name}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Deadline: {formatDate(task.deadline_date)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <TaskMarkCompleted
            taskId={task.id}
            currentStatus={task.status}
            onTaskUpdated={onTaskUpdated}
            size="sm"
          />
          <Button variant="ghost" size="sm" onClick={() => onViewDetails(task)}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
        {/* Confirmation Modal for completed task deletion */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h3 className="font-bold text-lg mb-2">Delete Completed Task?</h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300">Are you sure you want to delete this completed task? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
                <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminTaskCard;
