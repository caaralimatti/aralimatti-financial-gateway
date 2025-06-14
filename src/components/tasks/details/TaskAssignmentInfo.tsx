
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building2, FileText } from 'lucide-react';
import { Task } from '@/types/task';

interface TaskAssignmentInfoProps {
  task: Task;
}

const TaskAssignmentInfo: React.FC<TaskAssignmentInfoProps> = ({ task }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Assignment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-sm font-medium">Assigned To</p>
            <p className="text-sm text-gray-600">
              {task.assigned_to?.full_name || task.assigned_to?.email || 'Unassigned'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-sm font-medium">Created By</p>
            <p className="text-sm text-gray-600">
              {task.created_by?.full_name || task.created_by?.email || 'Unknown'}
            </p>
          </div>
        </div>

        {task.client && (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Client</p>
              <p className="text-sm text-gray-600">{task.client.name}</p>
            </div>
          </div>
        )}

        {task.task_categories && (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Category</p>
              <p className="text-sm text-gray-600">{task.task_categories.name}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskAssignmentInfo;
