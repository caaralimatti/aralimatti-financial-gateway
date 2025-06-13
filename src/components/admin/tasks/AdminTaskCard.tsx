
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Trash2, Calendar, User, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task } from '@/types/task';
import { format } from 'date-fns';
import { useTasks } from '@/hooks/useTasks';
import { toast } from 'sonner';

interface AdminTaskCardProps {
  task: Task;
  onDelete: (taskId: string, taskTitle: string) => void;
  deleteLoading: string | null;
}

const AdminTaskCard: React.FC<AdminTaskCardProps> = ({ task, onDelete, deleteLoading }) => {
  const { updateTask } = useTasks();
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending_approval': return 'bg-purple-100 text-purple-800';
      case 'on_hold': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMarkAsCompleted = async () => {
    setUpdatingStatus(true);
    try {
      await updateTask(task.id, { status: 'completed' });
      toast.success('Task marked as completed');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900 line-clamp-2">{task.title}</h3>
            <div className="flex gap-2">
              <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                {task.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                {task.priority.toUpperCase()}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {task.status !== 'completed' && (
                <DropdownMenuItem onClick={handleMarkAsCompleted} disabled={updatingStatus}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {updatingStatus ? 'Updating...' : 'Mark as Completed'}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => onDelete(task.id, task.title)}
                className="text-red-600"
                disabled={deleteLoading === task.id}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleteLoading === task.id ? 'Deleting...' : 'Delete Task'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {task.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
        )}

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Assigned to: {task.assigned_to?.full_name || task.assigned_to?.email || 'Unassigned'}</span>
          </div>
          
          {task.client?.name && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Client:</span>
              <span>{task.client.name}</span>
            </div>
          )}

          {task.deadline_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Due: {format(new Date(task.deadline_date), 'MMM dd, yyyy')}</span>
            </div>
          )}
        </div>

        {task.task_categories?.name && (
          <Badge variant="outline" className="text-xs">
            {task.task_categories.name}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminTaskCard;
