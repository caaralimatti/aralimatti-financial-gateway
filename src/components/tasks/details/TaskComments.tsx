
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { Task } from '@/types/task';
import { formatDate } from '@/utils/taskUtils';

interface TaskCommentsProps {
  task: Task;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ task }) => {
  if (task.task_comments.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({task.task_comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {task.task_comments.map((comment) => (
            <div key={comment.id} className="border-l-4 border-blue-200 pl-4 py-2">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium">
                  {comment.commented_by?.full_name || comment.commented_by?.email || 'Unknown'}
                </p>
                <span className="text-xs text-gray-500">
                  {formatDate(comment.created_at)}
                </span>
              </div>
              <p className="text-sm text-gray-700">{comment.comment_text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskComments;
