
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { Task } from '@/types/task';
import { formatDate } from '@/utils/taskUtils';

interface TaskTimelineInfoProps {
  task: Task;
}

const TaskTimelineInfo: React.FC<TaskTimelineInfoProps> = ({ task }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {task.start_date && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Start Date</p>
              <p className="text-sm text-gray-600">{formatDate(task.start_date)}</p>
            </div>
          </div>
        )}

        {task.deadline_date && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Deadline</p>
              <p className="text-sm text-gray-600">{formatDate(task.deadline_date)}</p>
            </div>
          </div>
        )}

        {task.estimated_effort_hours && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Estimated Effort</p>
              <p className="text-sm text-gray-600">{task.estimated_effort_hours} hours</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-sm font-medium">Created</p>
            <p className="text-sm text-gray-600">{formatDate(task.created_at)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-sm font-medium">Last Updated</p>
            <p className="text-sm text-gray-600">{formatDate(task.updated_at)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskTimelineInfo;
