
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Calendar, Clock, User, Building2, Trash2 } from 'lucide-react';
import { Task } from '@/types/task';

interface AdminTaskCardProps {
  task: Task;
  onDelete: (taskId: string, taskTitle: string) => void;
  deleteLoading: string | null;
}

const AdminTaskCard = ({ task, onDelete, deleteLoading }: AdminTaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending_approval': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'on_hold': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{task.title}</CardTitle>
          <div className="flex flex-col gap-1">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            <Badge variant="outline" className={getStatusColor(task.status)}>
              {formatStatus(task.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {task.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>Assigned to: {task.assigned_to?.full_name || task.assigned_to?.email}</span>
          </div>
          
          {task.client && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="h-4 w-4" />
              <span>Client: {task.client.name}</span>
            </div>
          )}
          
          {task.deadline_date && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Due: {new Date(task.deadline_date).toLocaleDateString()}</span>
            </div>
          )}
          
          {task.estimated_effort_hours && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Estimated: {task.estimated_effort_hours}h</span>
            </div>
          )}
        </div>

        {task.sub_tasks && task.sub_tasks.length > 0 && (
          <div className="pt-2 border-t">
            <div className="text-sm text-gray-600">
              Sub-tasks: {task.sub_tasks.filter(st => st.is_completed).length}/{task.sub_tasks.length} completed
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-primary h-2 rounded-full transition-all" 
                style={{
                  width: `${(task.sub_tasks.filter(st => st.is_completed).length / task.sub_tasks.length) * 100}%`
                }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t">
          <div className="text-xs text-gray-500">
            Created: {new Date(task.created_at).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={deleteLoading === task.id}
                >
                  {deleteLoading === task.id ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete the task "{task.title}"? This action cannot be undone and will also delete all related sub-tasks, comments, and attachments.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(task.id, task.title)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Task
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminTaskCard;
