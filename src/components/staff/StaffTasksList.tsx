
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import { getStatusColor, getPriorityColor, formatDate } from '@/utils/taskUtils';
import { Calendar, Building2, Clock } from 'lucide-react';
import TaskMarkCompleted from '@/components/tasks/TaskMarkCompleted';
import TaskDetailsModal from '@/components/tasks/TaskDetailsModal';
import { Task } from '@/types/task';

const StaffTasksList = () => {
  const { profile } = useAuth();
  const { tasks = [], loading, refetch } = useTasks();

  // State for Task Details Modal
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const assignedTasks = tasks.filter(task =>
    task.assigned_to_profile_id === profile?.id
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Assigned Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-gray-500">Loading tasks...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (assignedTasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Assigned Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-gray-500">No tasks assigned to you</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    setDetailsModalOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          My Assigned Tasks ({assignedTasks.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignedTasks.map((task) => (
            <div
              key={task.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="space-y-1 flex-1">
                  <h3 className="font-medium text-lg">{task.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                {/* View Details Button */}
                <div className="ml-4 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDetails(task)}
                  >
                    View Details
                  </Button>
                </div>
              </div>

              {task.description && (
                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
              )}

              <div className="space-y-2 mb-4">
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

                {task.task_categories && (
                  <div className="text-sm text-gray-600">
                    Category: {task.task_categories.name}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <TaskMarkCompleted
                  taskId={task.id}
                  currentStatus={task.status}
                  onTaskUpdated={refetch}
                  size="sm"
                />

                {task.sub_tasks.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {task.sub_tasks.filter(st => st.is_completed).length}/{task.sub_tasks.length} subtasks completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Task Details Modal */}
      <TaskDetailsModal
        task={selectedTask}
        open={detailsModalOpen}
        onOpenChange={(open) => {
          setDetailsModalOpen(open);
          if (!open) setSelectedTask(null);
        }}
      />
    </Card>
  );
};

export default StaffTasksList;

