
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/types/task';

interface TaskCardExpandedProps {
  task: Task;
}

const TaskCardExpanded: React.FC<TaskCardExpandedProps> = ({ task }) => {
  return (
    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
      <p className="text-xs text-gray-600 dark:text-gray-400">
        {task.description || 'No description available'}
      </p>
      
      {task.sub_tasks.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subtasks:
          </p>
          <div className="space-y-1">
            {task.sub_tasks.map(subTask => (
              <div key={subTask.id} className="flex items-center gap-2 text-xs">
                <Checkbox checked={subTask.is_completed} disabled />
                <span className={subTask.is_completed ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400'}>
                  {subTask.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCardExpanded;
