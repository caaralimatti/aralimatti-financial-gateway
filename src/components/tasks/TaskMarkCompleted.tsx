
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { taskService } from '@/services/taskService';

interface TaskMarkCompletedProps {
  taskId: string;
  currentStatus: string;
  onTaskUpdated?: () => void;
  size?: 'sm' | 'default';
}

const TaskMarkCompleted: React.FC<TaskMarkCompletedProps> = ({
  taskId,
  currentStatus,
  onTaskUpdated,
  size = 'default'
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleMarkCompleted = async () => {
    if (currentStatus === 'completed') return;

    setIsUpdating(true);
    try {
      await taskService.updateTask(taskId, { status: 'completed' });
      toast({
        title: "Task Updated",
        description: "Task has been marked as completed.",
      });
      onTaskUpdated?.();
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task status.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (currentStatus === 'completed') {
    return (
      <Button
        variant="outline"
        size={size}
        disabled
        className="text-green-600 border-green-200 bg-green-50"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Completed
      </Button>
    );
  }

  return (
    <Button
      onClick={handleMarkCompleted}
      disabled={isUpdating}
      size={size}
      variant="outline"
      className="hover:bg-green-50 hover:border-green-200 hover:text-green-700"
    >
      {isUpdating ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <CheckCircle className="h-4 w-4 mr-2" />
      )}
      Mark Completed
    </Button>
  );
};

export default TaskMarkCompleted;
