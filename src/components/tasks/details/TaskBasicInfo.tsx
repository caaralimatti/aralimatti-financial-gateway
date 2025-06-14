
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { Task } from '@/types/task';
import { getStatusColor, getPriorityColor } from '@/utils/taskUtils';

interface TaskBasicInfoProps {
  task: Task;
}

const TaskBasicInfo: React.FC<TaskBasicInfoProps> = ({ task }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{task.title}</h3>
          <p className="text-sm text-gray-600 mt-1">ID: {task.id}</p>
        </div>
        
        {task.description && (
          <div>
            <label className="text-sm font-medium">Description</label>
            <p className="text-sm text-gray-700 mt-1">{task.description}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusColor(task.status)}>
            {task.status.replace('_', ' ').toUpperCase()}
          </Badge>
          <Badge className={getPriorityColor(task.priority)}>
            {task.priority.toUpperCase()} PRIORITY
          </Badge>
          {task.is_billable && (
            <Badge variant="outline" className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Billable
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskBasicInfo;
