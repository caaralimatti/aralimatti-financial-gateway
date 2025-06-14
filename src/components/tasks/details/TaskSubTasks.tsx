
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types/task';

interface TaskSubTasksProps {
  task: Task;
}

const TaskSubTasks: React.FC<TaskSubTasksProps> = ({ task }) => {
  if (task.sub_tasks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sub-tasks ({task.sub_tasks.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {task.sub_tasks.map((subTask) => (
            <div key={subTask.id} className="flex items-center gap-2 p-2 border rounded">
              <input
                type="checkbox"
                checked={subTask.is_completed}
                disabled
                className="rounded"
              />
              <div className="flex-1">
                <p className={`text-sm ${subTask.is_completed ? 'line-through text-gray-500' : ''}`}>
                  {subTask.title}
                </p>
                {subTask.description && (
                  <p className="text-xs text-gray-600 mt-1">{subTask.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskSubTasks;
