
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Paperclip } from 'lucide-react';
import { Task } from '@/types/task';

interface TaskAttachmentsProps {
  task: Task;
}

const TaskAttachments: React.FC<TaskAttachmentsProps> = ({ task }) => {
  if (task.task_attachments.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Paperclip className="h-5 w-5" />
          Attachments ({task.task_attachments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {task.task_attachments.map((attachment) => (
            <div key={attachment.id} className="flex items-center gap-3 p-2 border rounded hover:bg-gray-50">
              <Paperclip className="h-4 w-4 text-gray-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">{attachment.file_name}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {attachment.file_type && <span>Type: {attachment.file_type}</span>}
                  {attachment.file_size && (
                    <span>Size: {(attachment.file_size / 1024).toFixed(1)} KB</span>
                  )}
                </div>
              </div>
              <a
                href={attachment.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskAttachments;
