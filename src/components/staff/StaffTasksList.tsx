
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, User, Calendar } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

const StaffTasksList: React.FC = () => {
  const { tasks, loading, updateTask } = useTasks();
  const { profile } = useAuth();
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  // Filter tasks assigned to current staff member
  const myTasks = tasks.filter(task => task.assigned_to_profile_id === profile?.id);

  const handleMarkAsCompleted = async (taskId: string) => {
    setUpdatingTaskId(taskId);
    try {
      await updateTask(taskId, { status: 'completed' });
      toast.success('Task marked as completed');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending_approval': return 'bg-purple-100 text-purple-800';
      case 'on_hold': return 'bg-orange-100 text-orange-800';
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

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your tasks...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          My Tasks ({myTasks.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {myTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No tasks assigned to you yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myTasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </Badge>
                      {task.client?.name && (
                        <Badge variant="outline" className="text-xs">
                          {task.client.name}
                        </Badge>
                      )}
                    </div>
                    {task.deadline_date && (
                      <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {format(new Date(task.deadline_date), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                  </div>
                  {task.status !== 'completed' && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkAsCompleted(task.id)}
                      disabled={updatingTaskId === task.id}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {updatingTaskId === task.id ? 'Updating...' : 'Mark Complete'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffTasksList;
